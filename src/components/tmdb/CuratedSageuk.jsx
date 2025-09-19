import './style.scss';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMovieStore } from '../../store';
import { isMovieEntity, isDramaEntity } from '../../store';
import Button from '../ui/button/Button';

const PAGE_CHUNK = 10; // 클릭할 때마다 추가할 개수(= 5개씩 2줄)

const CuratedSageuk = () => {
    const curatedLoading = useMovieStore((s) => s.curatedLoading);
    const curatedError = useMovieStore((s) => s.curatedError);
    const curated = useMovieStore((s) => s.curated);
    const mediaCategory = useMovieStore((s) => s.mediaCategory);

    // ✅ 처음엔 10개(5x2)만
    const [visibleCount, setVisibleCount] = useState(PAGE_CHUNK);

    useEffect(() => {
        useMovieStore.getState().initCurated();
    }, []);

    const filtered = useMemo(() => {
        const list = Array.isArray(curated) ? curated : [];
        return mediaCategory === 'movie' ? list.filter(isMovieEntity) : list.filter(isDramaEntity);
    }, [curated, mediaCategory]);

    if (curatedLoading) return <p style={{ color: '#fff' }}>불러오는 중…</p>;
    if (curatedError) return <p style={{ color: '#f66' }}>에러: {curatedError}</p>;
    if (!filtered.length) return <p style={{ color: '#fff' }}>데이터 없음 (seed 확인 필요)</p>;

    const total = filtered.length;
    const visible = Math.min(visibleCount, total);
    const allShown = visible >= total && total > 0;

    // ✅ 버튼 클릭 시: 10개 더 → 전부 보이면 "접기"(다시 10개)
    const handleMore = () => {
        if (allShown) setVisibleCount(PAGE_CHUNK); // 접기
        else setVisibleCount((v) => Math.min(v + PAGE_CHUNK, total));
    };

    return (
        <div className="ottlist-container">
            <ul className="ottlist">
                {filtered.slice(0, visible).map((it) => {
                    const mediaType = String(it.mediaType || '').toLowerCase(); // 'tv' | 'movie'
                    return (
                        <li key={`${mediaType}-${it.id}`}>
                            <Link to={`/ott/${mediaType}/${it.id}`}>
                                {it.poster ? (
                                    <img src={it.poster} alt={it.title} />
                                ) : (
                                    <div className="img-fallback">No Image</div>
                                )}
                                {it.points != null && (
                                    <span className="points-badge">{it.points}p</span>
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>

            {total > PAGE_CHUNK && (
                <Button
                    text={allShown ? '접기' : '더보기'}
                    className="default white"
                    onClick={handleMore}
                />
            )}
        </div>
    );
};

export default CuratedSageuk;
