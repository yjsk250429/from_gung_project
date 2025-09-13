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

// 테스트용 하드코딩 데이터 (컴포넌트 밖에 선언)
const TEST_RELATED_DATA = [
    {
        id: 550,
        title: '파이트 클럽',
        poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
        backdrop_path: '/52AfXWuXCHn3UjD17rBruA9f5qb.jpg',
        vote_average: 8.4,
    },
    {
        id: 680,
        title: '펄프 픽션',
        poster_path: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
        backdrop_path: '/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg',
        vote_average: 8.9,
    },
    {
        id: 13,
        title: '포레스트 검프',
        poster_path: '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
        backdrop_path: '/7c9UVPPiTPltouxNVVlq6uO5a9.jpg',
        vote_average: 8.5,
    },
    {
        id: 155,
        title: '다크 나이트',
        poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        backdrop_path: '/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg',
        vote_average: 9.0,
    },
    {
        id: 497,
        title: '그린 마일',
        poster_path: '/velWPhVMQeQKcxggNEU8YmIo52R.jpg',
        backdrop_path: '/l6hQWH9eDksNJNiXWYRkWqikOdu.jpg',
        vote_average: 8.6,
    },
];

const OttDetail = () => {
    const { mediaType, ottID } = useParams();
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

    const social = useMemo(() => {
        const m = getSocialLinks(mediaType, ottID);
        return {
            homepage: m.homepage || data?.homepage || '',
            instagram: m.instagram || '',
            facebook: m.facebook || '',
        };
    }, [mediaType, ottID, data]);

    // 🚨 임시로 하드코딩된 테스트 데이터 사용
    const relatedList = useMemo(() => {
        console.log('🔍 Using TEST DATA for relatedList');
        return TEST_RELATED_DATA;

        // 원래 로직은 주석 처리
        /*
        if (!data) return [];
        const bucket = [];
        const add = (arr) => Array.isArray(arr) && bucket.push(...arr);
        add(data.related);
        add(data.recommendations);
        add(data.similar);
        add(data.recommendations?.results);
        add(data.similar?.results);
        
        const norm = bucket.map((it, idx) => ({
            id: it?.id ?? it?.tmdbId ?? it?.tmdb_id ?? `${idx}`,
            title: it?.title ?? it?.name ?? it?.original_title ?? it?.original_name ?? '',
            poster_path: it?.poster_path ?? it?.poster ?? it?.image ?? it?.media?.poster_path ?? '',
            backdrop_path: it?.backdrop_path ?? it?.backdrop ?? it?.media?.backdrop_path ?? '',
            profile_path: it?.profile_path ?? it?.profile ?? '',
            vote_average: it?.vote_average ?? it?.rating ?? it?.media?.vote_average,
            popularity: it?.popularity ?? it?.media?.popularity,
            logo: it?.logo ?? it?.logo_path ?? it?.media?.logo_path ?? '',
        }));

        const map = new Map();
        for (const x of norm) {
            const key = String(x.id);
            if (!map.has(key)) map.set(key, x);
        }
        return Array.from(map.values());
        */
    }, [data]);

    console.log('🎬 Rendering with relatedList:', relatedList);

    if (state.loading) return <div style={{ color: '#fff', padding: 24 }}>불러오는 중…</div>;
    if (state.error) return <div style={{ color: '#f66', padding: 24 }}>에러: {state.error}</div>;
    if (!data) return <div style={{ color: '#fff', padding: 24 }}>데이터 없음</div>;

    return (
        <div>
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
                social={social}
            />

            {/* 테스트 정보 표시 */}
            <div
                style={{
                    background: '#333',
                    color: '#fff',
                    padding: '15px',
                    margin: '20px',
                    fontSize: '14px',
                }}
            >
                <h3>🧪 TEST MODE</h3>
                <div>Using hardcoded test data: {relatedList.length} items</div>
            </div>

            <OttDetailCast cast={(data.cast || []).slice(0, 8)} />
            <OttDetailReview reviews={reviews} />
            <OttDetailContents
                items={relatedList} // 🧪 테스트 데이터 전달
                max={8}
                seedKey={`${mediaType}:${ottID}`}
            />
        </div>
    );
};

export default OttDetail;
