// src/pages/ottDetail/index.jsx
import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import OttDetailCast from '../../components/ottDetail/con1Cast/OttDetailCast';
import OttDetailReview from '../../components/ottDetail/con2Review/OttDetailReview';
import OttDetailContents from '../../components/ottDetail/con3Contents/OttDetailContents';
import OttDetailVisual from '../../components/ottDetail/ottDetailVisual/OttDetailVisual';
import reviewsDefault from '../../api/ottReview';

import { fetchDetail } from '../../tmdb/fetchDetail';
import { seeds } from '../../tmdb/seeds';
import { getSocialLinks } from '../../api/socialLinks';
import './style.scss';

const OttDetail = () => {
    const { mediaType, ottID } = useParams(); // /vod/:mediaType/:id
    const [sp] = useSearchParams();

    const [data, setData] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [state, setState] = useState({ loading: true, error: null });

    // seed에서 기본 시즌 등 보조정보 찾기
    const seed = useMemo(
        () => seeds.find((s) => String(s.tmdbId) === String(ottID) && s.type === mediaType),
        [ottID, mediaType]
    );
    const season = Number(sp.get('season')) || seed?.season || 1;

    useEffect(() => {
        (async () => {
            try {
                setState({ loading: true, error: null });
                const item = await fetchDetail({
                    type: mediaType,
                    tmdbId: Number(ottID),
                    season,
                    title: seed?.title,
                    year: seed?.year,
                });
                setData(item);
                setReviews(Array.isArray(reviewsDefault) ? reviewsDefault : []);
                setState({ loading: false, error: null });
            } catch (e) {
                setState({ loading: false, error: e?.message || String(e) });
            }
        })();
    }, [mediaType, ottID, season, seed?.title, seed?.year]);

    /** ⬇ 훅은 조기 리턴 위에서만 호출 */
    const social = useMemo(() => {
        const m = getSocialLinks(mediaType, ottID);
        return {
            homepage: m.homepage || data?.homepage || '',
            instagram: m.instagram || '',
            facebook: m.facebook || '',
        };
    }, [mediaType, ottID, data]);

    // TMDB 관련/유사/추천을 모두 합쳐 정규화 (⚠ 이 페이지에서는 'points' 만들지 않음)
    const relatedList = useMemo(() => {
        if (!data) return [];
        const bucket = [];

        const add = (arr) => Array.isArray(arr) && bucket.push(...arr);

        // 다양한 위치의 배열 모아서 한 바구니에
        add(data.related);
        add(data.recommendations);
        add(data.similar);
        add(data.recommendations?.results);
        add(data.similar?.results);

        // 정규화
        const norm = bucket.map((it, idx) => ({
            id: it?.id ?? it?.tmdbId ?? it?.tmdb_id ?? `${idx}`,
            title: it?.title ?? it?.name ?? it?.original_title ?? it?.original_name ?? '',
            poster_path: it?.poster_path ?? it?.poster ?? it?.image ?? it?.media?.poster_path ?? '', // OttDetailContents.pickPosterPath가 알아서 고름
            backdrop_path: it?.backdrop_path ?? it?.backdrop ?? it?.media?.backdrop_path ?? '',
            profile_path: it?.profile_path ?? it?.profile ?? '',
            vote_average: it?.vote_average ?? it?.rating ?? it?.media?.vote_average,
            popularity: it?.popularity ?? it?.media?.popularity,
            // 로고 키가 있으면 같이 넣어두면 더 좋다 (OttDetailContents에서 pickPosterPath가 logo도 인식하도록 수정했음)
            logo: it?.logo ?? it?.logo_path ?? it?.media?.logo_path ?? '',
        }));

        // id 기준 중복 제거
        const map = new Map();
        for (const x of norm) {
            const key = String(x.id);
            if (!map.has(key)) map.set(key, x);
        }
        return Array.from(map.values());
    }, [data]);
    /** ⬆ 훅 끝 */

    if (state.loading) return <div style={{ color: '#fff', padding: 24 }}>불러오는 중…</div>;
    if (state.error) return <div style={{ color: '#f66', padding: 24 }}>에러: {state.error}</div>;
    if (!data) return <div style={{ color: '#fff', padding: 24 }}>데이터 없음</div>;

    return (
        <div>
            <OttDetailVisual
                // 비주얼 영역
                backdrop={data.backdrop}
                titleLogo={data.poster} // 로고 없으면 포스터 사용
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
                social={social}
            />

            {/* 출연진/리뷰/관련콘텐츠 */}
            <OttDetailCast cast={(data.cast || []).slice(0, 8)} />
            <OttDetailReview reviews={reviews} />
            <OttDetailContents
                items={relatedList} // ✅ 이 페이지에선 배열만 넘김 (포인트는 내부에서 'ottPoints:v1'로 생성/고정)
                max={8}
                seedKey={`${mediaType}:${ottID}`} // ✅ 셔플 고정용
            />
        </div>
    );
};

export default OttDetail;
