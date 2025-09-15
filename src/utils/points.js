// src/.utils/points.js
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * items에 안정적인 points를 부여해서 반환.
 * - storageKey: localStorage key (ex. 'ottPoints:v1')
 * - range: [min, max]
 * - keyFn: 각 아이템 고유키 생성 함수
 * - seedKey: 선택사항. 동일 작품을 섹션별로 다른 키로 구분하고 싶을 때 prefix
 */
export function attachStablePoints(
    items,
    {
        storageKey = 'ottPoints:v1',
        range = [30, 55],
        keyFn = (it) => `${(it.mediaType || '').toLowerCase()}-${it.id}`,
        seedKey = '',
    } = {}
) {
    if (!Array.isArray(items) || !items.length) return [];

    const map = JSON.parse(localStorage.getItem(storageKey) || '{}');
    let changed = false;

    const out = items.map((it) => {
        const baseKey = keyFn(it);
        const key = seedKey ? `${seedKey}:${baseKey}` : baseKey;
        let p = map[key];
        if (typeof p !== 'number') {
            p = randInt(range[0], range[1]);
            map[key] = p;
            changed = true;
        }
        return { ...it, points: p };
    });

    if (changed) {
        localStorage.setItem(storageKey, JSON.stringify(map));
    }
    return out;
}
