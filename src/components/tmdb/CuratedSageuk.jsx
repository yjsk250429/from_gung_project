// components/ottSub/CuratedSageuk.jsx
import './style.scss';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMovieStore } from '../../store';
import Button from '../ui/button/Button';

const PAGE_CHUNK = 10;

// ✅ mediaType만 사용해서 타입 판정(백업 경로는 최소화)
const kindOf = (it) => {
    const t = (it && it.mediaType) || (it && it.media_type) || '';
    const k = String(t).toLowerCase();
    if (k === 'tv' || k === 'movie') return k;
    // 최후의 보루(정말 없는 경우에만)
    if (it?.title) return 'movie';
    if (it?.name) return 'tv';
    return '';
};

export default function CuratedSageuk() {
    const curatedLoading = useMovieStore((s) => s.curatedLoading);
    const curatedError = useMovieStore((s) => s.curatedError);
    const curated = useMovieStore((s) => s.curated);
    const mediaCategory = useMovieStore((s) => s.mediaCategory); // 'tv' | 'movie'

    useEffect(() => {
        useMovieStore.getState().initCurated();
    }, []);

    const [visibleCount, setVisibleCount] = useState(PAGE_CHUNK);
    useEffect(() => {
        setVisibleCount(PAGE_CHUNK); // 탭 바뀔 때 10개로 리셋
    }, [mediaCategory]);

    // ✅ “먼저 필터, 그다음 slice” (혼합 방지)
    const filtered = useMemo(() => {
        const list = Array.isArray(curated) ? curated : [];
        const out = list.filter((it) => kindOf(it) === mediaCategory);
        return out;
    }, [curated, mediaCategory]);

    if (curatedLoading) return <p style={{ color: '#fff' }}>불러오는 중…</p>;
    if (curatedError) return <p style={{ color: '#f66' }}>에러: {curatedError}</p>;

    const total = filtered.length;
    if (!total) return <p style={{ color: '#fff' }}>표시할 항목이 없습니다.</p>;

    const visible = Math.min(visibleCount, total);
    const allShown = visible >= total;

    const handleMore = () => {
        if (allShown) setVisibleCount(PAGE_CHUNK);
        else setVisibleCount((v) => Math.min(v + PAGE_CHUNK, total));
    };

    return (
        <div className="ottlist-container">
            <ul className="ottlist">
                {filtered.slice(0, visible).map((it) => {
                    const type = kindOf(it); // 'tv' | 'movie'
                    const poster = it.poster || it.backdrop;
                    const title = it.title || it.name || '콘텐츠';
                    return (
                        <li key={`${type}-${it.id}`}>
                            <Link to={`/ott/${type}/${it.id}`}>
                                {poster ? (
                                    <img src={poster} alt={title} />
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
}
