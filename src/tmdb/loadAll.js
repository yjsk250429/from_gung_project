// src/tmdb/loadAll.js
import { fetchDetail } from './fetchDetail';
import { tmdbSearch, is404 } from './tmdb';
import { seeds } from './seeds';

const normType = (t) => (String(t || 'tv').toLowerCase() === 'movie' ? 'movie' : 'tv');
const pickQuery = (s) =>
    s.title || s.name || s.koTitle || s.korTitle || s.originalTitle || s.query || '';
const pickYear = (s) => s.year || s.first_air_date?.slice?.(0, 4) || s.release_date?.slice?.(0, 4);

function pickBest(hits, q) {
    if (!Array.isArray(hits) || !hits.length) return null;
    const norm = (x) =>
        String(x || '')
            .trim()
            .toLowerCase();
    const nq = norm(q);
    return (
        hits.find((r) => norm(r.name || r.title) === nq) ||
        hits.find((r) => norm(r.original_name || r.original_title) === nq) ||
        hits[0]
    );
}

export async function loadAll() {
    const out = [];
    for (const s of seeds) {
        const type = normType(s.mediaType);
        const query = pickQuery(s);
        const year = pickYear(s);
        let id = Number(s.tmdbId ?? s.id);
        if (!Number.isFinite(id)) id = undefined;

        try {
            let item;

            if (id) {
                try {
                    item = await fetchDetail({ type, tmdbId: id, season: s.season });
                } catch (e) {
                    if (!(is404(e) || String(e?.message || '').includes('404')) || !query) throw e;
                    const hits = await tmdbSearch({ type, query, year });
                    const best = pickBest(hits, query);
                    if (!best?.id) throw e;
                    item = await fetchDetail({ type, tmdbId: best.id, season: s.season });
                }
            } else {
                if (!query) continue;
                const hits = await tmdbSearch({ type, query, year });
                const best = pickBest(hits, query);
                if (!best?.id) continue;
                item = await fetchDetail({ type, tmdbId: best.id, season: s.season });
            }

            // ✅ 씨드(로컬) 이미지/타입 최우선 적용
            const merged = {
                ...item,
                mediaType: type, // 씨드 타입 고정
                poster: s.poster ?? s.listPoster ?? item.poster,
                backdrop: s.backdrop ?? item.backdrop,
                titleLogo: s.titleLogo ?? s.logo ?? item.titleLogo,
            };

            out.push({ ...merged, _seed: { ...s, id: id ?? item.id } });
        } catch (e) {
            console.warn('Fail:', query || s.id, e?.message || e);
        }
    }
    return out;
}
