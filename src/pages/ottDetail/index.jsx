// src/pages/ottDetail/index.jsx
import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, useLocation } from 'react-router-dom';

import OttDetailCast from '../../components/ottDetail/con1Cast/OttDetailCast';
import OttDetailReview from '../../components/ottDetail/con2Review/OttDetailReview';
import OttDetailContents from '../../components/ottDetail/con3Contents/OttDetailContents';
import OttDetailVisual from '../../components/ottDetail/ottDetailVisual/OttDetailVisual';
import reviewsDefault from '../../api/ottReview';
import { fetchDetail } from '../../tmdb/fetchDetail';
import './style.scss';

export default function OttDetail() {
    // /ott/:id 또는 /ott/:ottID 모두 커버
    const { id: idParam, ottID } = useParams();
    const id = idParam ?? ottID;

    const location = useLocation();
    const routeState = location.state; // 리스트에서 넘긴 { mediaType }
    const [sp] = useSearchParams();

    const [data, setData] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [ui, setUi] = useState({ loading: true, error: null });

    if (!id) {
        return <div style={{ color: '#f66', padding: 24 }}>잘못된 경로입니다. (id/ottID 없음)</div>;
    }

    // 탭에서 전달한 타입만 사용 (없으면 'tv')
    const mediaType = routeState?.mediaType === 'movie' ? 'movie' : 'tv';
    const season = mediaType === 'tv' ? Number(sp.get('season')) || 1 : undefined;

    // 디버그용 (필요없으면 지워도 됨)
    useEffect(() => {
        // eslint-disable-next-line no-console
        console.log('[DETAIL] load', { id, mediaType, season });
    }, [id, mediaType, season]);

    // 상세 데이터 로드 (가장 단순한 형태)
    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setUi({ loading: true, error: null });
                const item = await fetchDetail({
                    type: mediaType,
                    tmdbId: Number(id),
                    season,
                });
                if (!alive) return;
                setData(item || null);
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
    }, [mediaType, id, season]);

    // 관련/추천/유사 합치기 (필터 없음, 최소화)
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
                // media_type은 참고만, 여기선 필터 안 함
                media_type: (it?.media_type || it?.media?.media_type || '').toLowerCase() || null,
            });
        }
        return out;
    }, [data]);

    if (ui.loading) return <div style={{ color: '#fff', padding: 24 }}>불러오는 중…</div>;
    if (ui.error) return <div style={{ color: '#f66', padding: 24 }}>에러: {ui.error}</div>;
    if (!data) return <div style={{ color: '#fff', padding: 24 }}>데이터 없음</div>;

    return (
        <div className="ott-detail-page">
            <OttDetailVisual
                backdrop={data.backdrop}
                titleLogo={data.poster}
                rating={data.rating ?? data.vote_average}
                year={data.year}
                overview={data.overview}
                genres={data.genres}
                seasonCount={data.seasonsCount || 1}
                hasSubtitle={!!data.subtitlesAvailable}
                cert={data.certification}
                episodes={(data.episodes || []).map((ep) => ({
                    ep: ep.ep,
                    name: ep.name,
                    runtime: ep.runtime,
                    date: ep.date,
                    thumb: ep.thumb,
                }))}
                cast={(data.cast || []).map((c) => ({ name: c.name, profile: c.profile }))}
                social={{ homepage: data?.homepage || '', instagram: '', facebook: '' }}
            />

            <OttDetailCast cast={(data.cast || []).slice(0, 8)} />
            <OttDetailReview reviews={reviews} />
            <OttDetailContents items={relatedList} max={8} seedKey={`${mediaType}:${id}`} />
        </div>
    );
}
