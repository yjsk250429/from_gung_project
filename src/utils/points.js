// src/utils/points.js
function xmur3(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
        h = (h << 13) | (h >>> 19);
    }
    return function () {
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        return (h ^= h >>> 16) >>> 0;
    };
}
function sfc32(a, b, c, d) {
    return function () {
        a >>>= 0;
        b >>>= 0;
        c >>>= 0;
        d >>>= 0;
        let t = (a + b) | 0;
        a = b ^ (b >>> 9);
        b = (c + (c << 3)) | 0;
        c = (c << 21) | (c >>> 11);
        d = (d + 1) | 0;
        t = (t + d) | 0;
        c = (c + t) | 0;
        return (t >>> 0) / 4294967296;
    };
}

export function seededInt(key, seedKey = '', min = 1, max = 99) {
    const seed = xmur3(`${seedKey}:${key}`);
    const rand = sfc32(seed(), seed(), seed(), seed());
    return Math.floor(rand() * (max - min + 1)) + min;
}

function readMap(k) {
    try {
        return JSON.parse(localStorage.getItem(k) || '{}');
    } catch {
        return {};
    }
}
function writeMap(k, v) {
    try {
        localStorage.setItem(k, JSON.stringify(v));
    } catch {}
}

/** items에 points(number) 붙이기 (스토리지 우선 + 씨드 폴백) */
export function attachStablePoints(
    items,
    {
        seedKey = 'default',
        range = [1, 99],
        storageKey = 'ottPoints:v1',
        keyFn, // (it, idx) => string
    } = {}
) {
    const [min, max] = range;
    const map = readMap(storageKey);
    let changed = false;

    const out = (items || []).map((it, idx) => {
        const k = keyFn
            ? keyFn(it, idx)
            : `${it.mediaType ?? it.type ?? 'item'}-${it.id ?? it.tmdbId ?? idx}`;
        let p = map[k];
        if (typeof p !== 'number') {
            p = seededInt(k, seedKey, min, max);
            map[k] = p;
            changed = true;
        }
        return { ...it, points: p };
    });

    if (changed) writeMap(storageKey, map);
    return out;
}

export function tierFromNumber(n) {
    if (n >= 80) return 'gold';
    if (n >= 60) return 'silver';
    return 'bronze';
}
