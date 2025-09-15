import './style.scss';
import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useMovieStore } from '../../store';
import { isMovieEntity, isDramaEntity } from '../../store';

const CuratedSageuk = () => {
    const curatedLoading = useMovieStore((s) => s.curatedLoading);
    const curatedError = useMovieStore((s) => s.curatedError);
    const curated = useMovieStore((s) => s.curated);
    const mediaCategory = useMovieStore((s) => s.mediaCategory);

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

    return (
        <ul className="ottlist">
            {filtered.map((it) => {
                const mediaType = String(it.mediaType || '').toLowerCase(); // 'tv' | 'movie'
                return (
                    <li key={`${mediaType}-${it.id}`}>
                        <Link to={`/ott/${mediaType}/${it.id}`}>
                            {it.poster ? (
                                <img src={it.poster} alt={it.title} />
                            ) : (
                                <div className="img-fallback">No Image</div>
                            )}

                            <span className="points-badge">{it.points}p</span>
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
};

export default CuratedSageuk;
