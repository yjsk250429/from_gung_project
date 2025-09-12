// src/tmdb/fetchDetail.js
import { tmdb, img } from './tmdb';

function pickProviders(wp, country = 'KR') {
    const r = wp?.results?.[country];
    if (!r) return;
    const names = (arr) => arr?.map((v) => v.provider_name);
    return {
        flatrate: names(r.flatrate),
        rent: names(r.rent),
        buy: names(r.buy),
    };
}

export async function fetchDetail(seed) {
    if (!seed.tmdbId) throw new Error(`tmdbId missing for ${seed.title}`);

    if (seed.type === 'movie') {
        const d = await tmdb(`movie/${seed.tmdbId}`, {
            language: 'ko-KR',
            append_to_response: 'credits,images,release_dates,watch/providers',
            region: 'KR',
        });
        return {
            mediaType: 'movie',
            id: d.id,
            title: d.title,
            overview: d.overview,
            year: d.release_date?.slice(0, 4),
            rating: d.vote_average,
            genres: (d.genres || []).map((g) => g.name),
            poster: img(d.poster_path),
            backdrop: img(d.backdrop_path, 'w780'),
            runtime: d.runtime ?? null,
            cast: (d.credits?.cast || []).slice(0, 10).map((c) => ({
                name: c.name,
                character: c.character,
                profile: img(c.profile_path, 'w185'),
            })),
            providers: pickProviders(d['watch/providers'], 'KR'),
            subtitlesAvailable: null, // TMDB로는 판단 불가
        };
    }

    // TV
    const d = await tmdb(`tv/${seed.tmdbId}`, {
        language: 'ko-KR',
        append_to_response: 'aggregate_credits,images,content_ratings,watch/providers',
    });

    let episodes;
    if (seed.season) {
        const s = await tmdb(`tv/${seed.tmdbId}/season/${seed.season}`, { language: 'ko-KR' });
        episodes = (s.episodes || []).map((e) => ({
            ep: e.episode_number,
            name: e.name,
            date: e.air_date,
            thumb: img(e.still_path, 'w300'),
            runtime: e.runtime ?? null,
        }));
    }

    return {
        mediaType: 'tv',
        id: d.id,
        title: d.name,
        overview: d.overview,
        year: d.first_air_date?.slice(0, 4),
        rating: d.vote_average,
        genres: (d.genres || []).map((g) => g.name),
        poster: img(d.poster_path),
        backdrop: img(d.backdrop_path, 'w780'),
        cast: (d.aggregate_credits?.cast || []).slice(0, 10).map((c) => ({
            name: c.name,
            character: c.roles?.[0]?.character,
            profile: img(c.profile_path, 'w185'),
        })),
        episodes,
        providers: pickProviders(d['watch/providers'], 'KR'),
        subtitlesAvailable: null,
    };
}
