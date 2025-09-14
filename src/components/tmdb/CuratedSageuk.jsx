// src/components/tmdb/CuratedSageuk.jsx
import { useEffect, useRef, useState, useMemo } from 'react';
import { loadAll } from '../../tmdb/loadAll';
import './style.scss';
import { Link } from 'react-router-dom';

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function attachStablePoints(
    items,
    {
        seedKey = 'curated',
        range = [30, 55],
        storageKey = 'ottPoints:v1',
        keyFn = (it) => `${it.mediaType}-${it.id}`,
    } = {}
) {
    const [min, max] = range;
    const map = JSON.parse(localStorage.getItem(storageKey) || '{}');
    let changed = false;

    const out = items.map((it) => {
        const key = `${seedKey}:${keyFn(it)}`;
        let p = map[key];
        if (typeof p !== 'number') {
            p = randInt(min, max);
            map[key] = p;
            changed = true;
        }
        return { ...it, points: p };
    });

    if (changed) localStorage.setItem(storageKey, JSON.stringify(map));
    return out;
}

export default function CuratedSageuk() {
    const [items, setItems] = useState([]);
    const [state, setState] = useState({ loading: true, error: null });

    // ⬇ 탭 상태를 세션에서 복원 (0=tv, 1=movie)
    const initialTop = useMemo(() => (sessionStorage.getItem('ott:lastTop') === '1' ? 1 : 0), []);
    const [top, setTop] = useState(initialTop);
    const did = useRef(false);

    useEffect(() => {
        if (did.current) return;
        did.current = true;
        (async () => {
            try {
                const loaded = await loadAll(); // seed 기반
                const withPoints = attachStablePoints(loaded, {
                    seedKey: 'curated',
                    range: [30, 55],
                    storageKey: 'ottPoints:v1',
                    keyFn: (it) => `${(it.mediaType || '').toLowerCase()}-${it.id}`,
                });
                setItems(withPoints);
                setState({ loading: false, error: null });
            } catch (e) {
                console.error(e);
                setState({ loading: false, error: e?.message || String(e) });
            }
        })();
    }, []);

    // ⬇ 탭 바뀌면 세션에 저장
    useEffect(() => {
        sessionStorage.setItem('ott:lastTop', String(top));
    }, [top]);

    if (state.loading) return <p style={{ color: '#fff' }}>불러오는 중…</p>;
    if (state.error) return <p style={{ color: '#f66' }}>에러: {state.error}</p>;
    if (!items.length) return <p style={{ color: '#fff' }}>데이터 없음 (seed 확인 필요)</p>;

    const mediaType = top === 0 ? 'tv' : 'movie';
    const filtered = items.filter((it) => (it.mediaType || '').toLowerCase() === mediaType);

    return (
        <>
            {/* 간단 탭 (원하는 UI로 바꿔도 됨) */}
            <div className="mini-tabs" style={{ display: 'flex', gap: 8, margin: '0 0 12px' }}>
                <button onClick={() => setTop(0)} className={top === 0 ? 'on' : ''}>
                    드라마
                </button>
                <button onClick={() => setTop(1)} className={top === 1 ? 'on' : ''}>
                    영화
                </button>
            </div>

            <ul className="ottlist">
                {filtered.map((it) => (
                    <li key={`${it.mediaType}-${it.id}`}>
                        {/* ⬇ 상세로 갈 때 mediaType 같이 넘겨서 /ott/:ottID에서 정확히 처리 */}
                        <Link to={`/ott/${it.id}`} state={{ mediaType }}>
                            {it.poster ? (
                                <img src={it.poster} alt="" />
                            ) : (
                                <div className="img-fallback">No Image</div>
                            )}
                            {typeof it.points === 'number' && (
                                <span className="points-badge">{it.points}p</span>
                            )}
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    );
}
