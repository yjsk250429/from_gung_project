// src/tmdb/tmdb.js
const V4 = import.meta.env.VITE_TMDB_TOKEN?.trim(); // v4 Read Token (긴 JWT, eyJ...)
const V3 = import.meta.env.VITE_TMDB_API_KEY?.trim(); // v3 API Key (32자)

const qs = (o = {}) =>
  new URLSearchParams(
    Object.entries(o).filter(
      ([, v]) => v !== undefined && v !== null && v !== ""
    )
  ).toString();

/**
 * TMDB 호출 (v4 Bearer 또는 v3 api_key 자동 선택)
 * - 에러 시 Error 객체에 status / statusText / data(JSON) / body(문자열) 붙여서 throw
 */
export async function tmdb(path, params = {}, init = {}) {
  const base = "https://api.themoviedb.org/3";
  const cleanPath = String(path || "").replace(/^\/+/, ""); // //tv/... 방지
  let url = `${base}/${cleanPath}`;
  const headers = { accept: "application/json" };

  if (V4 && V4.startsWith("eyJ")) {
    url += `?${qs(params)}`;
    headers.Authorization = `Bearer ${V4}`;
  } else if (V3) {
    url += `?${qs({ api_key: V3, ...params })}`;
  } else {
    console.error(
      "TMDB key missing: set VITE_TMDB_TOKEN (v4) or VITE_TMDB_API_KEY (v3)."
    );
    throw new Error("TMDB key missing");
  }

  const res = await fetch(url, { headers, ...init });

  // 가능한 경우 JSON 먼저 시도
  const contentType = res.headers.get("content-type") || "";
  let data = null;
  let bodyText = "";

  if (contentType.includes("application/json")) {
    try {
      data = await res.json();
    } catch {
      // json 파싱 실패시 텍스트로
      bodyText = await res.text().catch(() => "");
    }
  } else {
    bodyText = await res.text().catch(() => "");
  }

  if (!res.ok) {
    const err = new Error(
      data?.status_message ||
        data?.status?.message ||
        `${res.status} ${res.statusText}`.trim()
    );
    err.status = res.status;
    err.statusText = res.statusText;
    err.data = data || null; // TMDB JSON (status_code, status_message 등)
    err.body = bodyText || null; // 원문 텍스트
    err.tmdb_status_code = data?.status_code;
    throw err;
  }

  // data가 null이면 텍스트만 있었던 케이스 → 가능한 한 JSON으로 반환 일관성 유지
  return data ?? (bodyText ? JSON.parse(bodyText) : null);
}

/** 이미지 URL 헬퍼 */
export const img = (filePath, size = "w500") =>
  filePath ? `https://image.tmdb.org/t/p/${size}${filePath}` : null;

/**
 * TMDB 404 감지 헬퍼
 * - HTTP 404
 * - TMDB status_code === 34
 * - 바디/메시지 문자열에 "status_code: 34" 흔적
 */
export const is404 = (e) => {
  if (!e) return false;
  if (Number(e.status) === 404) return true;
  if (Number(e.tmdb_status_code) === 34) return true;

  const hay =
    (typeof e.body === "string" ? e.body : "") +
    " " +
    (typeof e.message === "string" ? e.message : "") +
    " " +
    (e.data ? JSON.stringify(e.data) : "");
  return /"status_code"\s*:\s*34/.test(hay);
};

/**
 * 간단 검색 유틸
 * @param {'tv'|'movie'} type
 * @param {string} query  - 한글 OK
 * @param {number} [year] - 정확도 향상용 (tv: first_air_date_year, movie: primary_release_year)
 * @param {string} [language='ko-KR']
 */
export async function tmdbSearch({
  type = "tv",
  query,
  year,
  language = "ko-KR",
}) {
  const cleanType = type === "movie" ? "movie" : "tv";
  const endpoint = cleanType === "movie" ? "search/movie" : "search/tv";

  const yearParam =
    cleanType === "movie"
      ? { primary_release_year: year }
      : { first_air_date_year: year };

  const result = await tmdb(endpoint, {
    query,
    include_adult: false,
    language,
    ...yearParam,
  });

  return Array.isArray(result?.results) ? result.results : [];
}
