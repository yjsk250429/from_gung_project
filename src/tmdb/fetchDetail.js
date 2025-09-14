// src/tmdb/fetchDetail.js
import { tmdb, img } from './tmdb';

const APPEND_TV = 'aggregate_credits,images,content_ratings,watch/providers,external_ids';
const APPEND_MOVIE = 'credits,images,releases,watch/providers,external_ids';

const pickByLang = (arr, key = 'file_path', order = ['ko', null, 'en']) => {
    if (!Array.isArray(arr) || !arr.length) return null;
    for (const lang of order) {
        const hit = arr.find((p) => (p.iso_639_1 ?? null) === lang);
        if (hit?.[key]) return hit[key];
    }
    return arr[0]?.[key] ?? null;
};

export async function fetchDetail({ type, tmdbId, season }) {
    const t = type === 'movie' ? 'movie' : 'tv';
    const append = t === 'tv' ? APPEND_TV : APPEND_MOVIE;

    const base = await tmdb(`${t}/${tmdbId}`, {
        language: 'ko-KR',
        append_to_response: append,
        include_image_language: 'ko,null,en',
    });

    const images = base.images || {};
    const posterPref = pickByLang(images.posters, 'file_path') || base.poster_path || null;
    const backdropPref = pickByLang(images.backdrops, 'file_path') || base.backdrop_path || null;
    const logoPref = pickByLang(images.logos, 'logo_path');

    // cast
    const credits = t === 'tv' ? base.aggregate_credits : base.credits;
    const cast = Array.isArray(credits?.cast)
        ? credits.cast.slice(0, 20).map((c) => ({
              name: c.name ?? c.original_name ?? '',
              profile: img(c.profile_path, 'w185'),
              character: c.character ?? c.roles?.[0]?.character ?? '',
          }))
        : [];

    // episodes (간단 매핑)
    let episodes = [];
    if (t === 'tv' && season) {
        try {
            const seasonData = await tmdb(`tv/${tmdbId}/season/${season}`, {
                language: 'ko-KR',
                include_image_language: 'ko,null,en',
            });
            episodes = Array.isArray(seasonData?.episodes)
                ? seasonData.episodes.map((ep) => ({
                      ep: ep.episode_number,
                      name: ep.name,
                      runtime: ep.runtime ?? ep.episode_run_time ?? null,
                      date: ep.air_date,
                      thumb: img(
                          pickByLang(ep.images?.stills, 'file_path') || ep.still_path,
                          'w300'
                      ),
                  }))
                : [];
        } catch {
            episodes = [];
        }
    }

    return {
        id: base.id,
        mediaType: t,
        title: base.title ?? base.name ?? base.original_title ?? base.original_name ?? '',
        year: (base.release_date || base.first_air_date || '').slice(0, 4) || null,
        overview: base.overview ?? '',
        genres: base.genres ?? [],
        rating: base.vote_average ?? null,
        certification: null, // 필요시 releases/content_ratings에서 추가
        poster: posterPref ? img(posterPref, 'w500') : null,
        backdrop: backdropPref ? img(backdropPref, 'w1280') : null,
        titleLogo: logoPref ? img(logoPref, 'w500') : null,
        cast,
        episodes,
        // 추천/유사 원하면 여기서도 합쳐서 반환 가능
        recommendations: base.recommendations,
        similar: base.similar,
    };
}
