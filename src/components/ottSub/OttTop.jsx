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

export default function OttTop({ activeTop, onTopChange }) {
    // 내부 상태: 'tv' or 'movie'
    const [internal, setInternal] = useState('tv');
    const navigate = useNavigate();

    // 현재 상태: props로 제어 가능하거나 내부 상태 사용
    const selected = typeof activeTop === 'string' ? activeTop : internal;
    const setSelected = onTopChange ?? setInternal;

    const list = selected === 'tv' ? tvRecommend : movieRecommend;
    const label = selected === 'tv' ? '드라마' : '영화';

    const openDetail = (id) => {
        sessionStorage.setItem('ott:lastMediaType', selected);
        navigate(`/ott/${selected}/${id}`, { state: { mediaType: selected } });
    };

    return (
        <article className="top">
            <RoundTap
                text1="드라마"
                value1="tv"
                text2="영화"
                value2="movie"
                bgColor="#353535"
                selected={selected}
                onChange={setSelected}
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
