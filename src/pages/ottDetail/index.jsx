// src/pages/ottDetail/index.jsx
import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import OttDetailCast from '../../components/ottDetail/Con1Cast/OttDetailCast';
import OttDetailReview from '../../components/ottDetail/con2Review/OttDetailReview';
import OttDetailContents from '../../components/ottDetail/con3Contents/OttDetailContents';
import OttDetailVisual from '../../components/ottDetail/ottDetailVisual/OttDetailVisual';

import { fetchDetail } from '../../tmdb/fetchDetail';
import { seeds } from '../../tmdb/seeds';
import './style.scss';

const OttDetail = () => {
    const { mediaType, id } = useParams(); // /vod/:mediaType/:id
    const [sp, setSp] = useSearchParams();

    const [data, setData] = useState(null);
    const [state, setState] = useState({ loading: true, error: null });

    // seed에서 기본 시즌 등 보조정보 찾기
    const seed = useMemo(
        () => seeds.find((s) => String(s.tmdbId) === String(id) && s.type === mediaType),
        [id, mediaType]
    );
    const season = Number(sp.get('season')) || seed?.season || 1;

    useEffect(() => {
        (async () => {
            try {
                setState({ loading: true, error: null });
                const item = await fetchDetail({
                    type: mediaType,
                    tmdbId: Number(id),
                    season,
                    title: seed?.title,
                    year: seed?.year,
                });
                setData(item);
                setState({ loading: false, error: null });
            } catch (e) {
                setState({ loading: false, error: e?.message || String(e) });
            }
        })();
    }, [mediaType, id, season]);

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
                genres={data.genres}
                seasonCount={data.seasonsCount || 1}
                hasSubtitle={!!data.subtitlesAvailable}
                cert={data.certification} // '15' 같은 등급(있으면)
                episodes={(data.episodes || []).map((ep) => ({
                    ep: ep.ep,
                    name: ep.name,
                    runtime: ep.runtime,
                    date: ep.date,
                    thumb: ep.thumb,
                }))}
                cast={(data.cast || []).map((c) => ({ name: c.name, profile: c.profile }))}
                homepage={data.homepage}
                instagram={data.socials?.instagram}
                facebook={data.socials?.facebook}
            />

            {/* 출연진/리뷰/관련콘텐츠 – 네 컴포넌트가 props 받도록 되어있다면 그대로 전달 */}
            <OttDetailCast cast={(data.cast || []).slice(0, 12)} />
            <OttDetailReview reviews={data.reviews || []} />
            <OttDetailContents items={data.related || []} />
        </div>
    );
};

export default OttDetail;

// import OttDetailCast from '../../components/ottDetail/Con1Cast/OttDetailCast';
// import OttDetailReview from '../../components/ottDetail/con2Review/OttDetailReview';
// import OttDetailContents from '../../components/ottDetail/con3Contents/OttDetailContents';
// import OttDetailVisual from '../../components/ottDetail/ottDetailVisual/OttDetailVisual';

// const OttDetail = () => {
//     return (
//         <div>
//             <OttDetailVisual />
//             <OttDetailCast />
//             <OttDetailReview />
//             <OttDetailContents />
//         </div>
//     );
// };

// export default OttDetail;
