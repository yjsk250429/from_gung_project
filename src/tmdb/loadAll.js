// src/tmdb/loadAll.js
import { fetchDetail } from './fetchDetail';

export async function loadAll(seeds, concurrency = 6) {
    const out = [];
    let i = 0;

    async function worker() {
        while (i < seeds.length) {
            const idx = i++;
            const s = seeds[idx];
            try {
                const item = await fetchDetail(s);
                out[idx] = item;
            } catch (e) {
                console.warn('Fail:', s.title, e);
            }
        }
    }

    await Promise.all(Array.from({ length: concurrency }).map(worker));
    return out.filter(Boolean);
}
