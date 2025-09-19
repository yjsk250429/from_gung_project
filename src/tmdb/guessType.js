// src/tmdb/guessType.js
export const guessMediaType = (it) => it?.media_type ?? (it?.title ? 'movie' : 'tv'); // title 있으면 movie, name 있으면 tv
