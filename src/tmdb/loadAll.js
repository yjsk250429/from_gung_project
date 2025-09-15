// src/tmdb/loadAll.js
import { fetchDetailSmart } from './fetchDetail';
import { tmdbSearch, is404 } from './tmdb';
import { seeds } from './seeds';

const normType = (t) => {
    const v = String(t || '').toLowerCase();
    if (v === 'movie' || v === 'tv') return v;
    return undefined; // 미지정이면 스마트 페치가 알아서 처리
};

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

async function searchBothTypesPrefer(typeHint, { query, year }) {
    // type 힌트가 있으면 우선 그 타입으로 검색 → 없으면 tv → movie 순
    const order = typeHint ? [typeHint, typeHint === 'tv' ? 'movie' : 'tv'] : ['tv', 'movie'];

    for (const t of order) {
        const hits = await tmdbSearch({ type: t, query, year });
        const best = pickBest(hits, query);
        if (best?.id) return { id: best.id, type: t };
    }
    return null;
}

export async function loadAll() {
    const out = [];

    for (const s of seeds) {
        const typeHint = normType(s.mediaType);
        const query = pickQuery(s);
        const year = pickYear(s);
        let id = Number(s.tmdbId ?? s.id);
        if (!Number.isFinite(id)) id = undefined;

        try {
            let item;

            if (id) {
                // 🔀 ID가 있어도 타입이 틀릴 수 있으므로 스마트 상세 사용
                try {
                    item = await fetchDetailSmart({ tmdbId: id, type: typeHint, season: s.season });
                } catch (e) {
                    // 404류면 검색으로 복구 시도(양 타입 모두)
                    if (!(is404(e) || String(e?.message || '').includes('404')) || !query) {
                        throw e;
                    }
                    const found = await searchBothTypesPrefer(typeHint, { query, year });
                    if (!found) throw e;
                    item = await fetchDetailSmart({
                        tmdbId: found.id,
                        type: found.type,
                        season: s.season,
                    });
                }
            } else {
                // 🔎 ID가 없으면 검색으로 식별(양 타입 모두)
                if (!query) continue;
                const found = await searchBothTypesPrefer(typeHint, { query, year });
                if (!found) continue;
                item = await fetchDetailSmart({
                    tmdbId: found.id,
                    type: found.type,
                    season: s.season,
                });
            }

            // ✅ 최종 mediaType은 실제 상세 응답의 것을 신뢰
            const finalizedType = String(item.mediaType || '').toLowerCase();

            // ✅ 씨드(로컬) 이미지가 있으면 우선, 없으면 TMDB 값 사용
            const merged = {
                ...item,
                mediaType: finalizedType, // 'tv' | 'movie' 확정
                poster: s.poster ?? s.listPoster ?? item.poster,
                backdrop: s.backdrop ?? item.backdrop,
                titleLogo: s.titleLogo ?? s.logo ?? item.titleLogo,
            };

            out.push({ ...merged, _seed: { ...s, id: item.id } });
        } catch (e) {
            console.warn('Fail:', query || s.id, e?.message || e);
        }
    }

    return out;
}
