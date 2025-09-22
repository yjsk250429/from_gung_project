// components/ottSub/OttTop.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbSearch } from "react-icons/tb";
import RoundTap from "../ui/roundTap/RoundTap";
import { useMovieStore } from "../../store"; // 추가: 전역 store import
import "./style.scss";

const tvRecommend = [
  { id: 132925, img: "/images/ott/tvtop_1.png", link: "/ott/tv/132925" },
  { id: 206693, img: "/images/ott/tvtop_2.png", link: "/ott/tv/206693" },
];
const movieRecommend = [
  { id: 544089, img: "/images/ott/movietop_1.png", link: "/ott/movie/544089" },
  { id: 220176, img: "/images/ott/movietop_2.png", link: "/ott/movie/220176" },
];

export default function OttTop({ activeTop, onTopChange }) {
  const mediaCategory = useMovieStore((s) => s.mediaCategory);
  const setMediaCategory = useMovieStore((s) => s.setMediaCategory);

  const selected = activeTop ?? mediaCategory;
  const setSelected = onTopChange ?? setMediaCategory;

  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const list = selected === "tv" ? tvRecommend : movieRecommend;
  const label = selected === "tv" ? "드라마" : "영화";

  const openDetail = (id) => {
    sessionStorage.setItem("ott:lastMediaType", selected);
    navigate(`/ott/${selected}/${id}`, { state: { mediaType: selected } });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    navigate(`/ottresults?q=${encodeURIComponent(query)}&type=${selected}`);
  };

  const handleTabChange = (next) => {
    setSelected(next);
    setMediaCategory(next);
    sessionStorage.setItem("ott:lastMediaType", next);
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
          onChange={handleTabChange}
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
          </li>
        ))}
      </ul>
      {/* 검색창 */}
      <form
        className="ott-search"
        onSubmit={onSubmit}
        role="search"
        aria-label="OTT 검색"
      >
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
