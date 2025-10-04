import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import OttDetailCast from '../../components/ottDetail/con1Cast/OttDetailCast';
import OttDetailReview from '../../components/ottDetail/con2Review/OttDetailReview';
import OttDetailContents from '../../components/ottDetail/con3Contents/OttDetailContents';
import OttDetailVisual from '../../components/ottDetail/ottDetailVisual/OttDetailVisual';

import reviewsDefault from '../../api/ottReview';
import { fetchDetail } from '../../tmdb/fetchDetail';
import { is404, tmdb } from '../../tmdb/tmdb';
import { seeds as seedList } from '../../tmdb/seeds';

import './style.scss';
import OttReviewDetail from '../../components/ui/modal/OttReviewDetail';

/* ----------------- helpers (훅 아님) ----------------- */
const TMDB_IMG_BASE = 'https://image.tmdb.org/t/p';

/** 언어 우선순위로 이미지 경로 선택 */
function pickByLang(arr, key = 'file_path', order = ['ko', null, 'en']) {
    if (!Array.isArray(arr) || !arr.length) return null;
    for (const lang of order) {
        const hit = arr.find((p) => (p.iso_639_1 ?? null) === lang);
        if (hit?.[key]) return hit[key];
    }
    return arr[0]?.[key] ?? null;
}

/** 문자열 경로를 앱에서 쓸 수 있게 보정 */
const fixImg = (p, w = 500) => {
    if (!p) return null;
    const s = String(p).trim();
    if (!s) return null;
    if (/^https?:/i.test(s)) return s; // 절대 URL
    if (s.startsWith('/images/')) return s; // 프로젝트 정적 자산
    const path = s.startsWith('/') ? s : `/${s}`;
    return `${TMDB_IMG_BASE}/w${w}${path}`; // TMDB 상대경로
};

/** 시청연령 계산 */
function computeCertString(data, mediaType) {
    const S = (v) => (v == null ? '' : String(v).trim());
    const normalize = (v) => {
        const s = S(v);
        if (!s) return '';
        const up = s.toUpperCase();
        if (/^\d+\.\d+$/.test(s)) return '';
        if (/^(10|[0-9])(\.\d+)?$/.test(s)) return '';
        if (['ALL', '0', '전체이용가', 'G', 'TV-G', 'TV-Y'].includes(up)) return '-';
        if (/^(7|12|15|18|19)$/.test(s)) return s;
        if (/^PG-?13$/.test(up)) return '13';
        if (up === 'R' || up === 'NC-17') return '17';
        if (up === 'TV-14') return '14';
        if (up === 'TV-MA') return '19';
        return s;
    };

    if (!data) return '-';
    const pre = normalize(data.certification) || normalize(data.cert);
    if (pre) return pre;

    if (mediaType === 'tv') {
        const arr =
            data?.content_ratings?.results ??
            (Array.isArray(data?.results) ? data.results : []) ??
            [];
        if (arr.length) {
            const pick = (cc) =>
                arr.find(
                    (n) => (n?.iso_3166_1 ?? n?.country ?? n?.iso) === cc && normalize(n?.rating)
                );
            return (
                normalize(pick('KR')?.rating) ||
                normalize(pick('US')?.rating) ||
                normalize((arr.find((n) => normalize(n?.rating)) || {}).rating) ||
                '-'
            );
        }
    } else {
        const nodes =
            data?.release_dates?.results ??
            (Array.isArray(data?.results) ? data.results : []) ??
            [];
        if (nodes.length) {
            const pick = (cc) => nodes.find((n) => (n?.iso_3166_1 ?? n?.country ?? n?.iso) === cc);
            const node = pick('KR') || pick('US') || nodes[0];
            const rds = node?.release_dates ?? node?.dates ?? [];
            if (rds.length) {
                const hit = rds.find((e) => normalize(e?.certification));
                const val = normalize(hit?.certification);
                if (val) return val;
            }
        }
    }
    return '-';
}
/* ---------------------------------------------------- */

export default function OttDetail() {
    // 라우트: /ott/:mediaType/:id
    const { mediaType, id: idParam } = useParams();
    const [sp] = useSearchParams();

    const rawId = idParam;
    const id = Number(rawId);
    const season = Number(sp.get('season')) || 1; // 영화면 무시

    const [data, setData] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [ui, setUi] = useState({ loading: true, error: null });

    // seeds 기반 관련콘텐츠(원천 후보 5개)
    const seedCandidates = useMemo(() => {
        // 1) 상세와 동일 타입만 추출(tv | movie)
        const sameType = (seedList || []).filter((s) => (s.mediaType || s.type) === mediaType);

        // 2) 현재 항목과 매칭되는 seed
        const currentSeed = sameType.find((s) => Number(s.tmdbId) === id) || null;

        // 3) 자신 제외
        let candidates = sameType.filter((s) => Number(s.tmdbId) !== id);

        // 4) 현재 seed의 genre가 있으면 같은 genre 먼저
        if (currentSeed?.genre) {
            const g = currentSeed.genre;
            const head = candidates.filter((s) => s.genre === g);
            const tail = candidates.filter((s) => s.genre !== g);
            candidates = [...head, ...tail];
        }

        // 5) 상위 5개만
        return candidates.slice(0, 5);
    }, [mediaType, id]);

    // seeds 후보를 "포스터 보장" 리스트로 확정
    const [relatedList, setRelatedList] = useState([]);
    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const out = [];
                for (const s of seedCandidates) {
                    // 1) seeds.poster 우선
                    let posterUrl = fixImg(s.poster, 500);

                    // 2) 없으면 TMDB에서 포스터만 받아오기(가벼움)
                    if (!posterUrl) {
                        try {
                            const base = await tmdb(`${mediaType}/${s.tmdbId}`, {
                                language: 'ko-KR',
                                append_to_response: 'images',
                                include_image_language: 'ko,null,en',
                            });
                            const picked =
                                base?.poster_path || pickByLang(base?.images?.posters, 'file_path');
                            if (picked) posterUrl = fixImg(picked, 500);
                        } catch {
                            // ignore per item
                        }
                    }

                    // 3) 그래도 없으면 seeds.backdrop을 임시 사용
                    if (!posterUrl) {
                        posterUrl = fixImg(s.backdrop, 500);
                    }

                    out.push({
                        id: s.tmdbId,
                        tmdbId: s.tmdbId,
                        title: s.title,
                        poster: posterUrl, // ✅ 포스터 최우선
                        backdrop: fixImg(s.backdrop, 780), // 참고용
                        media_type: s.mediaType || s.type,
                        genre: s.genre,
                    });
                }
                if (alive) setRelatedList(out);
            } catch (e) {
                if (alive) setRelatedList([]);
            }
        })();
        return () => {
            alive = false;
        };
    }, [seedCandidates, mediaType]);

    // ====== 상세 fetch (모든 훅은 조건부 반환보다 위) ======
    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                if (!rawId || !Number.isFinite(id)) {
                    setUi({
                        loading: false,
                        error: !rawId
                            ? '잘못된 경로입니다. (id 없음)'
                            : `잘못된 ID 형식입니다. (${String(rawId)})`,
                    });
                    return;
                }

                setUi({ loading: true, error: null });

                if (mediaType === 'tv') {
                    try {
                        const tvItem = await fetchDetail({ type: 'tv', tmdbId: id, season });
                        if (!alive) return;
                        setData(tvItem || null);
                        setReviews(Array.isArray(reviewsDefault) ? reviewsDefault : []);
                        setUi({ loading: false, error: null });
                        return;
                    } catch (e1) {
                        if (!is404(e1)) throw e1;
                    }
                }

                if (mediaType === 'movie') {
                    const movieItem = await fetchDetail({ type: 'movie', tmdbId: id });
                    if (!alive) return;
                    setData(movieItem || null);
                    setReviews(Array.isArray(reviewsDefault) ? reviewsDefault : []);
                    setUi({ loading: false, error: null });
                }
            } catch (e) {
                if (!alive) return;
                setUi({ loading: false, error: e?.message || String(e) });
            }
        })();

        return () => {
            alive = false;
        };
    }, [id, season, rawId, mediaType]);

    // ====== 파생값 (비주얼/에피소드 등) ======
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

    const episodesSafe = useMemo(() => {
        const list = Array.isArray(data?.episodes) ? data.episodes : [];
        return list.map((ep, idx) => ({
            ep: ep?.ep ?? ep?.episode_number ?? idx + 1,
            name: ep?.name ?? '',
            runtime: ep?.runtime ?? ep?.run_time ?? null,
            date: ep?.date ?? ep?.air_date ?? '',
            thumb: ep?.thumb ?? (ep?.still_path ? `${TMDB_IMG_BASE}/w300${ep.still_path}` : ''),
        }));
    }, [data]);

    // 비주얼 오버라이드: seeds에 동일 id가 있으면 우선 사용
    const seedMatch = useMemo(() => {
        return seedList.find((s) => Number(s.tmdbId) === id) || null;
    }, [id]);

    const visualOverrides = useMemo(
        () => ({
            backdrop: fixImg(seedMatch?.backdrop, 1280) || data?.backdrop || null,
            titleLogo: seedMatch?.titleLogo || data?.titleLogo || data?.poster || null,
        }),
        [seedMatch, data]
    );

    const rating = data?.rating ?? data?.vote_average ?? null;
    const seasonCount =
        data?.seasonsCount ??
        data?.season_count ??
        (Array.isArray(data?.seasons) ? data.seasons.length : 1);
    const year =
        data?.year ??
        (data?.release_date ? String(data.release_date).slice(0, 4) : null) ??
        (data?.first_air_date ? String(data.first_air_date).slice(0, 4) : null);

    const castSafe = (data?.cast || []).map((c) => ({
        name: c.name ?? c.original_name ?? '',
        profile: c.profile ?? c.profile_path ?? '',
    }));

    const safeCert = computeCertString(data, mediaType);

    // ====== 조건부 반환 시작 ======
    if (ui.loading) return <div style={{ color: '#fff', padding: 24 }}>불러오는 중…</div>;
    if (ui.error) return <div style={{ color: '#f66', padding: 24 }}>에러: {ui.error}</div>;
    if (!data) return <div style={{ color: '#fff', padding: 24 }}>데이터 없음</div>;

    return (
        <div className={`ott-detail ${mediaType || data.mediaType || ''}`}>
            <OttDetailVisual
                mediaType={mediaType}
                backdrop={visualOverrides.backdrop}
                titleLogo={visualOverrides.titleLogo}
                images={data.images || {}}
                backdrops={data.backdrops || []}
                logos={data.logos || []}
                rating={rating}
                year={year}
                overview={data.overview || ''}
                genres={genreText}
                seasonCount={mediaType === 'tv' ? seasonCount || 1 : undefined}
                hasSubtitle={!!data.subtitlesAvailable}
                cert={safeCert}
                episodes={episodesSafe}
                cast={castSafe}
                social={{ homepage: data?.homepage || '', instagram: '', facebook: '' }}
            />

            <OttDetailCast cast={castSafe.slice(0, 8)} />
            <OttDetailReview reviews={reviews} />

            {/* ✅ seeds만 사용 + 항상 5개, 포스터 우선(없으면 TMDB에서 보충) */}
            <OttDetailContents items={relatedList} parentMediaType={mediaType} max={5} />
            <OttReviewDetail />
        </div>
    );
}
