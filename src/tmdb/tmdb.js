// src/tmdb/tmdb.js
const V4 = import.meta.env.VITE_TMDB_TOKEN?.trim(); // v4 Read Token (긴 JWT, eyJ...)
const V3 = import.meta.env.VITE_TMDB_API_KEY?.trim(); // v3 API Key (32자)

const qs = (o = {}) =>
    new URLSearchParams(
        Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString();

export async function tmdb(path, params = {}) {
    const base = 'https://api.themoviedb.org/3';
    let url = `${base}/${path}`;
    const headers = { accept: 'application/json' };

    if (V4 && V4.startsWith('eyJ')) {
        // v4 방식
        url += `?${qs(params)}`;
        headers.Authorization = `Bearer ${V4}`;
    } else if (V3) {
        // v3 방식
        const q = qs({ api_key: V3, ...params });
        url += `?${q}`;
    } else {
        console.error('TMDB key missing: set VITE_TMDB_TOKEN (v4) or VITE_TMDB_API_KEY (v3).');
        throw new Error('TMDB key missing');
    }

    const res = await fetch(url, { headers });
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`${res.status} ${res.statusText} ${text}`);
    }
    return res.json();
}

export const img = (filePath, size = 'w500') =>
    filePath ? `https://image.tmdb.org/t/p/${size}${filePath}` : null;
