// src/tmdb/fetchDetail.js
import { tmdb, img } from './tmdb';

// 제공사 이름만 뽑기
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

// 영화 등급(KR 우선 → US → 기타) 추출
function pickCertMovie(d, pref = 'KR') {
    const results = d?.release_dates?.results || [];
    const by = (cc) => results.find((r) => r.iso_3166_1 === cc)?.release_dates || [];
    const firstNonEmpty = (arr) => arr?.map((x) => x.certification).find(Boolean);
    return (
        firstNonEmpty(by(pref)) ||
        firstNonEmpty(by('US')) ||
        firstNonEmpty(results.flatMap((r) => r.release_dates)) ||
        null
    );
}

// TV 등급(KR 우선 → US → 기타) 추출
function pickCertTV(d, pref = 'KR') {
    const list = d?.content_ratings?.results || [];
    return (
        list.find((x) => x.iso_3166_1 === pref)?.rating ||
        list.find((x) => x.iso_3166_1 === 'US')?.rating ||
        list[0]?.rating ||
        null
    );
}

export async function fetchDetail(seed) {
    if (!seed.tmdbId) throw new Error(`tmdbId missing for ${seed.title}`);

    if (seed.type === 'movie') {
        const d = await tmdb(`movie/${seed.tmdbId}`, {
            language: 'ko-KR',
            append_to_response: 'credits,images,release_dates,watch/providers,external_ids',
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
            certification: pickCertMovie(d, 'KR'), // ★ 시청연령
            cast: (d.credits?.cast || []).slice(0, 10).map((c) => ({
                name: c.name,
                character: c.character,
                profile: img(c.profile_path, 'w185'),
            })),
            providers: pickProviders(d['watch/providers'], 'KR'),
            homepage: d.homepage || null,
            socials: {
                instagram: d.external_ids?.instagram_id
                    ? `https://www.instagram.com/${d.external_ids.instagram_id}/`
                    : null,
                facebook: d.external_ids?.facebook_id
                    ? `https://www.facebook.com/${d.external_ids.facebook_id}`
                    : null,
            },
            subtitlesAvailable: null, // TMDB로는 판단 불가
        };
    }

    // TV
    const d = await tmdb(`tv/${seed.tmdbId}`, {
        language: 'ko-KR',
        append_to_response: 'aggregate_credits,images,content_ratings,watch/providers,external_ids',
    });

    let episodes;
    if (seed.season) {
        const s = await tmdb(`tv/${seed.tmdbId}/season/${seed.season}`, { language: 'ko-KR' });
        episodes = (s.episodes || []).map((e) => ({
            ep: e.episode_number,
            name: e.name,
            date: e.air_date,
            thumb: img(e.still_path, 'w300'),
            runtime: e.runtime ?? e.episode_runtime ?? null,
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
        seasonsCount: d.number_of_seasons ?? null,
        certification: pickCertTV(d, 'KR'), // ★ 시청연령
        cast: (d.aggregate_credits?.cast || []).slice(0, 10).map((c) => ({
            name: c.name,
            character: c.roles?.[0]?.character,
            profile: img(c.profile_path, 'w185'),
        })),
        episodes,
        providers: pickProviders(d['watch/providers'], 'KR'),
        homepage: d.homepage || null,
        socials: {
            instagram: d.external_ids?.instagram_id
                ? `https://www.instagram.com/${d.external_ids.instagram_id}/`
                : null,
            facebook: d.external_ids?.facebook_id
                ? `https://www.facebook.com/${d.external_ids.facebook_id}`
                : null,
        },
    };
}
