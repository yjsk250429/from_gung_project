// src/pages/ottSearch/index.jsx
import './style.scss';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMovieStore } from '../../store';
import { isMovieEntity, isDramaEntity } from '../../store';
import Button from '../../components/ui/button/Button';
import { TbSearch, TbChevronLeft } from 'react-icons/tb';
// RoundTap은 안쓰면 제거해도 됩니다.

const PAGE_CHUNK = 10;
const normalize = (v) => (typeof v === 'string' ? v.toLowerCase() : '');

export default function OttSearch() {
  const location = useLocation();
  const navigate = useNavigate();

  // URL 기준의 확정된 쿼리/타입 (제출 후에만 바뀜)
  const params = new URLSearchParams(location.search);
  const qFromUrl = params.get('q') || '';
  const typeFromUrl = (params.get('type') || 'tv').toLowerCase();

  // 입력창 상태(타이핑용) - 결과엔 영향 X
  const [q, setQ] = useState(qFromUrl);
  const [mediaType] = useState(typeFromUrl);
  const [visibleCount, setVisibleCount] = useState(PAGE_CHUNK);

  const curatedLoading = useMovieStore((s) => s.curatedLoading);
  const curatedError = useMovieStore((s) => s.curatedError);
  const curated = useMovieStore((s) => s.curated);

  useEffect(() => { useMovieStore.getState().initCurated(); }, []);

  // URL이 바뀌면(제출됨) 보이는 개수 리셋 + 입력창 동기화
  useEffect(() => {
    setQ(qFromUrl);
    setVisibleCount(PAGE_CHUNK);
  }, [qFromUrl, typeFromUrl]);

  // 타입 필터
  const typed = useMemo(() => {
    const list = Array.isArray(curated) ? curated : [];
    return mediaType === 'movie' ? list.filter(isMovieEntity) : list.filter(isDramaEntity);
  }, [curated, mediaType]);

  // 🔒 검색은 URL의 qFromUrl만 사용! (타이핑 중엔 결과 안 바뀜)
  const filtered = useMemo(() => {
    const key = normalize(qFromUrl);
    if (!key) return typed;
    return typed.filter((it) => {
      const t = normalize(it.title || it.name || '');
      const o = normalize(it.originalTitle || it.original_name || '');
      const ov = normalize(it.overview || '');
      return t.includes(key) || o.includes(key) || ov.includes(key);
    });
  }, [typed, qFromUrl]);

  const total = filtered.length;
  const visible = Math.min(visibleCount, total);
  const allShown = visible >= total && total > 0;

  const handleMore = () => {
    setVisibleCount((v) => (allShown ? PAGE_CHUNK : Math.min(v + PAGE_CHUNK, total)));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const query = q.trim();
    // 엔터/돋보기를 눌렀을 때만 URL을 바꿔서 검색 결과 반영
    navigate(`/ottresults?q=${encodeURIComponent(query)}&type=${mediaType}`);
  };

  return (
    <div className="ott-search-page">
      {/* 상단: 검색창만 오른쪽 */}
      <div className="search-head">
      {/* 뒤로가기 */}
       <button
         type="button"
         className="back-btn"
         aria-label="뒤로가기"
         onClick={() => navigate('/ottsub')}
       >
        <TbChevronLeft />
       </button>
        <form className="ott-search wide" onSubmit={onSubmit} role="search" aria-label="OTT 검색">
          <input
            type="text"
            placeholder="검색…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button type="submit" aria-label="검색">
            <i>
              <TbSearch />
            </i>
          </button>
        </form>
      </div>

      <div className="container">
        {/* 결과 타이틀: 결과가 있을 때만 보여줌 */}
        {total > 0 && (
          <h2 className="result-title">
            <span className="q">' {qFromUrl || (mediaType === 'tv' ? '드라마' : '영화')} '</span> 에 대한 검색결과 입니다.
          </h2>
        )}

        {/* 상태 */}
        {curatedLoading && <p className="status">불러오는 중…</p>}
        {curatedError && <p className="status error">에러: {curatedError}</p>}

        {/* 결과 없음 */}
        {!curatedLoading && !curatedError && total === 0 && (
          <div className="no-results">
            검색 결과가 없습니다.
          </div>
        )}

        {/* 결과 리스트 */}
        {!curatedLoading && !curatedError && total > 0 && (
          <>
            <ul className="ottlist">
              {filtered.slice(0, visible).map((it) => {
                const type = String(it.mediaType || mediaType).toLowerCase();
                return (
                  <li key={`${type}-${it.id}`}>
                    <Link to={`/ott/${type}/${it.id}`}>
                      {it.poster ? (
                        <img src={it.poster} alt={it.title || it.name} />
                      ) : (
                        <div className="img-fallback">No Image</div>
                      )}
                      {it.points != null && <span className="points-badge">{it.points}p</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {total > PAGE_CHUNK && (
              <div className="more-wrap">
                <Button
                  text={allShown ? '접기' : '더보기'}
                  className="default white"
                  onClick={handleMore}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
