// src/components/tmdb/CuratedSageuk.jsx
import { useEffect, useRef, useState } from 'react';
import { seeds } from '../../tmdb/seeds';
import { loadAll } from '../../tmdb/loadAll';
import './style.scss';
import { Link } from 'react-router-dom';

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * items에 points를 붙이고, 없으면 생성해서 localStorage에 저장
 * 옵션:
 *  - seedKey: 같은 작품이라도 섹션별로 키를 분리하고 싶을 때 prefix
 *  - range: [min, max]
 *  - storageKey: localStorage key
 *  - keyFn: 각 아이템의 고유 키 생성 함수
 */
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
            p = randInt(min, max); // 최초 1회만 생성
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
    const did = useRef(false);

    useEffect(() => {
        if (did.current) return;
        did.current = true;

        (async () => {
            try {
                const hasId = seeds.filter((s) => !!s.tmdbId);
                const loaded = await loadAll(hasId); // 순서는 그대로

                const withPoints = attachStablePoints(loaded, {
                    seedKey: 'curated', // 섹션 식별용
                    range: [30, 55], // 네가 쓰던 범위 유지
                    storageKey: 'ottPoints:v1', // 저장소 키
                    keyFn: (it) => `${it.mediaType}-${it.id}`, // 동일 키로 고정
                });

                setItems(withPoints);
                setState({ loading: false, error: null });
            } catch (e) {
                console.error(e);
                setState({ loading: false, error: e?.message || String(e) });
            }
        })();
    }, []);

    if (state.loading) return <p style={{ color: '#fff' }}>불러오는 중…</p>;
    if (state.error) return <p style={{ color: '#f66' }}>에러: {state.error}</p>;
    if (!items.length) return <p style={{ color: '#fff' }}>데이터 없음 (tmdbId 확인 필요)</p>;

    return (
        <ul className="ottlist">
            {items.map((it) => (
                <li key={`${it.mediaType}-${it.id}`}>
                    <Link to={`/ott/${it.id}`}>
                        {it.poster && <img src={it.poster} alt="" />}
                        <span>{it.points}p</span>
                    </Link>
                </li>
            ))}
        </ul>
    );
}
