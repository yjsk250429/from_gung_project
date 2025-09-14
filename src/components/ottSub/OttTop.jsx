// components/ottSub/OttTop.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoundTap from '../ui/roundTap/RoundTap';
import './style.scss';

const tvRecommend = [
    { id: 132925, img: '/images/ott/otttop_1.png' },
    { id: 206693, img: '/images/ott/otttop_2.png' },
];

const movieRecommend = [
    { id: 315162, img: '/images/ott/movie_2.png' },
    { id: 634649, img: '/images/ott/movie_1.png' },
];

// ⬇️ 부모가 넘겨주면 제어모드, 안 넘기면 내부 상태로 동작
export default function OttTop({ activeTop, onTopChange }) {
    const [internal, setInternal] = useState(0); // 0=TV, 1=MOVIE
    const navigate = useNavigate();

    const top = typeof activeTop === 'number' ? activeTop : internal;
    const setTop = onTopChange ?? setInternal;

    const isTv = top === 0;
    const mediaType = isTv ? 'tv' : 'movie';
    const label = isTv ? '드라마' : '영화';
    const list = isTv ? tvRecommend : movieRecommend;

    const openDetail = (id) => {
        sessionStorage.setItem('ott:lastMediaType', mediaType);
        navigate(`/ott/${id}`, { state: { mediaType } });
    };
    return (
        <article className="top">
            <RoundTap
                mode="media"
                text1="드라마"
                text2="영화"
                bgColor="#d9d9d9"
                onSelect={({ type }) => setTop(type === 'tv' ? 0 : 1)}
            />
            <span># 지금 주목받는 {label}</span>

            <ul className="recommend">
                {list.map((item) => (
                    <li key={item.id} onClick={() => openDetail(item.id)}>
                        {item.img ? (
                            <img src={item.img} alt={`${label} 포스터`} />
                        ) : (
                            <div className="img-fallback">No Image</div>
                        )}
                        <div className="grad" />
                        <div className="text">
                            <strong>{item.title ?? ''}</strong>
                        </div>
                    </li>
                ))}
            </ul>
        </article>
    );
}
