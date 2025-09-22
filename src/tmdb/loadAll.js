// src/tmdb/loadAll.js
import { fetchDetailSmart } from "./fetchDetail";
import { tmdbSearch, is404 } from "./tmdb";
import { seeds } from "./seeds";

// ---- helpers -------------------------------------------------
const normType = (t) => {
  const v = String(t || "").toLowerCase();
  return v === "movie" || v === "tv" ? v : undefined;
};

const pickQuery = (s) =>
  s.title ||
  s.name ||
  s.koTitle ||
  s.korTitle ||
  s.originalTitle ||
  s.query ||
  "";

const pickYear = (s) =>
  s.year || s.first_air_date?.slice?.(0, 4) || s.release_date?.slice?.(0, 4);

const norm = (x) =>
  String(x || "")
    .trim()
    .toLowerCase();

const pickBest = (hits, q) => {
  if (!Array.isArray(hits) || !hits.length) return null;
  const nq = norm(q);
  return (
    hits.find((r) => norm(r.name || r.title) === nq) ||
    hits.find((r) => norm(r.original_name || r.original_title) === nq) ||
    hits[0]
  );
};

// 검색 캐시 (같은 제목 반복 호출 방지)
const searchCache = new Map(); // key: `${type}:${query}:${year}` -> {id,type}
async function searchBothTypesPrefer(typeHint, { query, year }) {
  const order = typeHint
    ? [typeHint, typeHint === "tv" ? "movie" : "tv"]
    : ["tv", "movie"];

  for (const t of order) {
    const key = `${t}:${query}:${year || ""}`;
    if (searchCache.has(key)) {
      const v = searchCache.get(key);
      if (v) return v;
      continue;
    }
    try {
      const hits = await tmdbSearch({ type: t, query, year });
      const best = pickBest(hits, query);
      const found = best?.id ? { id: best.id, type: t } : null;
      searchCache.set(key, found);
      if (found) return found;
    } catch {
      // 네트워크/레이트리밋 등은 다음 타입으로 넘김
    }
  }
  return null;
}

// 404/미발견은 조용히 무시하고, 진짜 에러만 로그
function logNon404(label, err) {
  const msg = String(err?.message || err || "");
  if (is404(err) || msg.includes("404")) return; // silent
  console.warn(`❌ ${label}`, msg);
}

// ---- main ----------------------------------------------------
export async function loadAll() {
  const tasks = seeds.map(async (s) => {
    const typeHint = normType(s.mediaType || s.type);
    const query = pickQuery(s);
    const year = pickYear(s);

    // ✅ 1) 먼저 검색으로 정확한 id/type을 확보 (잘못된 seed id로 404 발생 방지)
    let resolved = null;
    if (query) {
      try {
        resolved = await searchBothTypesPrefer(typeHint, { query, year });
      } catch (e) {
        logNon404(`search failed: ${query}`, e);
      }
    }

    // ✅ 2) 검색이 안되면, seed의 tmdbId가 “정수”인 경우에만 최후의 수단으로 상세 시도
    //     (NaN이나 잘못된 식 방지: 예 "71748 - 7" 같은 케이스)
    let item = null;
    const seedId = Number(s.tmdbId ?? s.id);
    const safeSeedId = Number.isFinite(seedId) ? seedId : undefined;

    try {
      if (resolved?.id && resolved.type === typeHint) {
        // 검색 결과가 typeHint와 일치할 때만 신뢰
        item = await fetchDetailSmart({
          tmdbId: resolved.id,
          type: resolved.type,
          season: s.season,
        });
      } else if (safeSeedId && typeHint) {
        // typeHint가 있는 경우에만 tmdbId로 조회 시도
        item = await fetchDetailSmart({
          tmdbId: safeSeedId,
          type: typeHint,
          season: s.season,
        });
      } else {
        // 검색도 실패했고 type도 없으면 skip
        return null;
      }
    } catch (e) {
      logNon404(`detail failed: ${query || s.title || s.id}`, e);
      return null;
    }

    // ✅ 최종 타입 신뢰 + 로컬 에셋 우선 병합
    const finalizedType = String(item.mediaType || "").toLowerCase();
    return {
      ...item,
      mediaType: finalizedType,
      poster: s.poster ?? s.listPoster ?? item.poster,
      backdrop: s.backdrop ?? item.backdrop,
      titleLogo: s.titleLogo ?? s.logo ?? item.titleLogo,
      _seed: { ...s, id: item.id },
    };
  });

  const results = await Promise.allSettled(tasks);
  return results
    .filter((r) => r.status === "fulfilled" && r.value)
    .map((r) => r.value);
}
