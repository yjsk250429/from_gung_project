// components/ottSub/OttTop.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TbSearch } from 'react-icons/tb';
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
  // 탭 상태
  const [internal, setInternal] = useState('tv');
  const selected = typeof activeTop === 'string' ? activeTop : internal;
  const setSelected = onTopChange ?? setInternal;

  // 검색어 상태
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const list = selected === 'tv' ? tvRecommend : movieRecommend;
  const label = selected === 'tv' ? '드라마' : '영화';

  const openDetail = (id) => {
    sessionStorage.setItem('ott:lastMediaType', selected);
    navigate(`/ott/${selected}/${id}`, { state: { mediaType: selected } });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    // type(=selected)와 함께 검색 페이지로 이동
    navigate(`/ottresults?q=${encodeURIComponent(query)}&type=${selected}`);
  };

  return (
    <article className="top">
      {/* 상단 탭 + 검색 */}
      <div className="top-head">
        <RoundTap
          text1="드라마"
          value1="tv"
          text2="영화"
          value2="movie"
          bgColor="#353535"
          selected={selected}
          onChange={setSelected}
        />
      </div>

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
      {/* 검색창 */}
        <form className="ott-search" onSubmit={onSubmit} role="search" aria-label="OTT 검색">
          <input
            type="text"
            placeholder={`제목을 검색하세요`}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label={`${label} 검색어 입력`}
          />
          <button type="submit" aria-label="검색">
            <TbSearch />
          </button>
        </form>
    </article>
  );
}
