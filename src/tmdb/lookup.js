// src/tmdb/lookup.js
import { seeds } from './seeds';

export function normalizeType(t) {
    const v = String(t || '')
        .trim()
        .toLowerCase();
    if (v === 'tv' || ['television', 'series', 'drama', 'tvshow', 'tv show'].includes(v))
        return 'tv';
    if (v === 'movie' || ['film', 'cinema'].includes(v)) return 'movie';
    return 'tv';
}

// seeds가 id 또는 tmdbId를 쓸 수 있으니 둘 다 커버
export function getSeedById(id) {
    const sid = String(id);
    return seeds.find((s) => String(s.id) === sid || String(s.tmdbId) === sid) || null;
}

export function getMediaTypeById(id) {
    const it = getSeedById(id);
    return it ? normalizeType(it.type) : null;
}
