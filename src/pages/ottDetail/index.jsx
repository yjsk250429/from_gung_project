// src/pages/ottDetail/index.jsx
import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import OttDetailCast from '../../components/ottDetail/con1Cast/OttDetailCast';
import OttDetailReview from '../../components/ottDetail/con2Review/OttDetailReview';
import OttDetailContents from '../../components/ottDetail/con3Contents/OttDetailContents';
import OttDetailVisual from '../../components/ottDetail/ottDetailVisual/OttDetailVisual';
import reviewsDefault from '../../api/ottReview';
import { fetchDetail } from '../../tmdb/fetchDetail';
import { is404 } from '../../tmdb/tmdb';

import { seeds } from '../../tmdb/seeds';

import './style.scss';

// ---- 시청연령 계산 헬퍼(훅 아님) ---------------------------------
function computeCertString(data, mediaType) {
    const S = (v) => (v == null ? '' : String(v).trim());
    if (!data) return '-';

    // 이미 가공값이 있으면 우선
    if (S(data.certification)) return S(data.certification);
    if (S(data.cert)) return S(data.cert);

    if (mediaType === 'tv') {
        // TMDB TV: content_ratings.results = [{ iso_3166_1, rating }]
        const arr =
            data?.content_ratings?.results ??
            (Array.isArray(data?.results) ? data.results : []) ??
            [];
        if (Array.isArray(arr)) {
            const pick = (cc) =>
                arr.find((n) => (n?.iso_3166_1 ?? n?.country ?? n?.iso) === cc && S(n?.rating));
            return (
                S(pick('KR')?.rating) ||
                S(pick('US')?.rating) ||
                S(arr.find((n) => S(n?.rating))?.rating) ||
                '-'
            );
        }
    } else {
        // TMDB Movie: release_dates.results[].release_dates[].certification
        const nodes =
            data?.release_dates?.results ??
            (Array.isArray(data?.results) ? data.results : []) ??
            [];
        if (Array.isArray(nodes) && nodes.length) {
            const pick = (cc) => nodes.find((n) => (n?.iso_3166_1 ?? n?.country ?? n?.iso) === cc);
            const node = pick('KR') || pick('US') || nodes[0];
            const rds = node?.release_dates ?? node?.dates ?? [];
            if (Array.isArray(rds)) {
                const hit = rds.find((e) => S(e?.certification));
                if (hit) return S(hit.certification);
            }
        }
    }
    return '-';
}
// -----------------------------------------------------------------

export default function OttDetail() {
    // /ott/:ottID
    const { id: idParam, ottID } = useParams();
    const rawId = idParam ?? ottID;
    const id = Number(rawId);

    const [sp] = useSearchParams();
    const season = Number(sp.get('season')) || 1; // 영화면 무시됨

    const [data, setData] = useState(null);
    const [mediaType, setMediaType] = useState(null); // 'tv' | 'movie'
    const [reviews, setReviews] = useState([]);
    const [ui, setUi] = useState({ loading: true, error: null });

    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                // 🔒 여기서 잘못된 id 처리(조기 return으로 컴포넌트 상단에서 훅을 끊지 않게!)
                if (!rawId || !Number.isFinite(id)) {
                    setUi({
                        loading: false,
                        error: !rawId
                            ? '잘못된 경로입니다. (id/ottID 없음)'
                            : `잘못된 ID 형식입니다. (${String(rawId)})`,
                    });
                    return;
                }

                setUi({ loading: true, error: null });

                // 1) TV로 시도
                try {
                    const tvItem = await fetchDetail({ type: 'tv', tmdbId: id, season });
                    if (!alive) return;
                    setData(tvItem || null);
                    setMediaType('tv');
                    setReviews(Array.isArray(reviewsDefault) ? reviewsDefault : []);
                    setUi({ loading: false, error: null });
                    return;
                } catch (e1) {
                    if (!is404(e1)) throw e1; // TV가 404가 아니면 그게 진짜 에러
                }

                // 2) 404였다면 MOVIE 재시도
                const movieItem = await fetchDetail({ type: 'movie', tmdbId: id });
                if (!alive) return;
                setData(movieItem || null);
                setMediaType('movie');
                setReviews(Array.isArray(reviewsDefault) ? reviewsDefault : []);
                setUi({ loading: false, error: null });
            } catch (e) {
                if (!alive) return;
                setUi({ loading: false, error: e?.message || String(e) });
            }
        })();

        return () => {
            alive = false;
        };
    }, [id, season, rawId]);

    // ---- 훅들: 반드시 조기 return 위에! --------------------------------

    // 관련/추천/유사 합치기(있으면)
    const relatedList = useMemo(() => {
        if (!data) return [];
        const bucket = [];
        const add = (arr) => Array.isArray(arr) && bucket.push(...arr);
        add(data.related);
        add(data.recommendations);
        add(data.similar);
        add(data.recommendations?.results);
        add(data.similar?.results);

        const seen = new Set();
        const out = [];
        for (const it of bucket) {
            const rid = it?.id ?? it?.tmdbId ?? it?.tmdb_id;
            if (rid == null) continue;
            const key = String(rid);
            if (seen.has(key)) continue;
            seen.add(key);
            out.push({
                id: rid,
                title: it?.title ?? it?.name ?? it?.original_title ?? it?.original_name ?? '',
                poster_path:
                    it?.poster_path ?? it?.poster ?? it?.image ?? it?.media?.poster_path ?? '',
                backdrop_path: it?.backdrop_path ?? it?.backdrop ?? it?.media?.backdrop_path ?? '',
                profile_path: it?.profile_path ?? it?.profile ?? '',
                vote_average: it?.vote_average ?? it?.rating ?? it?.media?.vote_average,
                media_type: (it?.media_type || it?.media?.media_type || '').toLowerCase() || null,
            });
        }
        return out;
    }, [data]);

    // 장르 문자열(드라마 · 사극)
    const genreText = useMemo(() => {
        const g = data?.genres;
        if (!g) return '';
        if (Array.isArray(g)) {
            return g
                .map((x) => (typeof x === 'string' ? x : x?.name))
                .filter(Boolean)
                .join(' · ');
        }
        if (typeof g === 'object') return g?.name ?? '';
        return String(g);
    }, [data]);

    // 에피소드 안전 변환
    const episodesSafe = useMemo(() => {
        const list = Array.isArray(data?.episodes) ? data.episodes : [];
        return list.map((ep, idx) => ({
            ep: ep?.ep ?? ep?.episode_number ?? idx + 1,
            name: ep?.name ?? '',
            runtime: ep?.runtime ?? ep?.run_time ?? null,
            date: ep?.date ?? ep?.air_date ?? '',
            thumb:
                ep?.thumb ??
                (ep?.still_path ? `https://image.tmdb.org/t/p/w300${ep.still_path}` : ''),
        }));
    }, [data]);

    // ✅ seed 매칭(현재 상세 id)
    const seed = useMemo(() => {
        if (!Number.isFinite(id)) return null;
        return seeds.find((s) => Number(s.tmdbId ?? s.id) === id) || null;
    }, [id]);

    // ✅ 시드 우선으로 대표 이미지 오버라이드
    const visualOverrides = useMemo(() => {
        return {
            backdrop: seed?.backdrop || data?.backdrop || null,
            titleLogo: seed?.titleLogo || data?.titleLogo || data?.poster || null,
        };
    }, [seed, data]);

    // ---- 여기까지가 모든 훅. 이 아래에서만 조기 return ----

    if (ui.loading) return <div style={{ color: '#fff', padding: 24 }}>불러오는 중…</div>;
    if (ui.error) return <div style={{ color: '#f66', padding: 24 }}>에러: {ui.error}</div>;
    if (!data) return <div style={{ color: '#fff', padding: 24 }}>데이터 없음</div>;

    // 안전 파생(훅 아님)
    const rating = data.rating ?? data.vote_average ?? null;
    const seasonCount =
        data.seasonsCount ??
        data.season_count ??
        (Array.isArray(data.seasons) ? data.seasons.length : 1);
    const year =
        data.year ??
        (data.release_date ? String(data.release_date).slice(0, 4) : null) ??
        (data.first_air_date ? String(data.first_air_date).slice(0, 4) : null);

    const castSafe = (data.cast || []).map((c) => ({
        name: c.name ?? c.original_name ?? '',
        profile: c.profile ?? c.profile_path ?? '',
    }));

    // ✅ 시청연령 문자열(훅 아님)
    const certStr = computeCertString(data, mediaType);

    return (
        <div className={`ott-detail ${mediaType || data.mediaType || ''}`}>
            <OttDetailVisual
                // ✅ seed 우선 적용
                backdrop={visualOverrides.backdrop}
                titleLogo={visualOverrides.titleLogo}
                images={data.images}
                backdrops={data.backdrops}
                logos={data.logos}
                rating={rating}
                year={year}
                overview={data.overview}
                genres={genreText}
                seasonCount={mediaType === 'tv' ? seasonCount || 1 : undefined}
                hasSubtitle={!!data.subtitlesAvailable}
                // ✅ 통합 가공된 시청연령 문자열
                cert={certStr}
                episodes={episodesSafe}
                cast={castSafe}
                social={{ homepage: data?.homepage || '', instagram: '', facebook: '' }}
            />

            <OttDetailCast cast={castSafe.slice(0, 8)} />
            <OttDetailReview reviews={reviews} />
            <OttDetailContents items={relatedList} max={8} seedKey={`${mediaType}:${id}`} />
        </div>
    );
}
