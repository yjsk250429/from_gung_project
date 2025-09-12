import { useEffect, useState } from 'react';
import { seeds } from '../../tmdb/seeds';
import { loadAll } from '../../tmdb/loadAll';
import './style.scss';

export default function CuratedSageuk() {
    const [items, setItems] = useState([]);
    const [state, setState] = useState({ loading: true, error: null });

    useEffect(() => {
        (async () => {
            try {
                const hasId = seeds.filter((s) => !!s.tmdbId);
                console.log('[seeds with id]', hasId.length, hasId);
                const data = await loadAll(hasId);
                console.log('[loaded items]', data.length, data);
                setItems(data);
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
        <ul className='ottlist'>
            {items.map((it) => (
                <li
                    key={`${it.mediaType}-${it.id}`}
                >
                    {it.poster && (
                        <img
                            src={it.poster}
                            alt=""
                            width={200}
                            height={300}
                            style={{ borderRadius: 8 }}
                        />
                    )}
                    <h3 style={{ margin: '8px 0 4px' }}>
                        {it.title} {it.year ? `(${it.year})` : ''}
                    </h3>
                    <p style={{ margin: 0 }}>⭐ {it.rating?.toFixed?.(1) ?? '-'}</p>
                    <p style={{ opacity: 0.8 }}>{(it.genres || []).join(' / ')}</p>
                    <p style={{ opacity: 0.8, fontSize: 14, lineHeight: 1.4 }}>{it.overview}</p>

                    {it.mediaType === 'tv' && it.episodes?.length ? (
                        <ul style={{ marginTop: 8 }}>
                            {it.episodes.slice(0, 5).map((ep) => (
                                <li key={ep.ep} style={{ fontSize: 14 }}>
                                    EP.{ep.ep} {ep.name} — {ep.date}
                                </li>
                            ))}
                        </ul>
                    ) : null}

                    {it.providers &&
                        (it.providers.flatrate || it.providers.rent || it.providers.buy) && (
                            <p style={{ marginTop: 8, fontSize: 13, opacity: 0.8 }}>
                                제공:{' '}
                                {[
                                    ...(it.providers.flatrate || []),
                                    ...(it.providers.rent || []),
                                    ...(it.providers.buy || []),
                                ]
                                    .filter(Boolean)
                                    .join(', ')}
                            </p>
                        )}
                </li>
            ))}
        </ul>
    );
}
