export const guessMediaType = (it) => {
  if (it?.media_type === "movie" || it?.media_type === "tv") {
    return it.media_type;
  }

  // title + no name → movie
  if (it?.title && !it?.name) return "movie";

  // name + no title → tv
  if (it?.name && !it?.title) return "tv";

  // 둘 다 있는 경우 → fallback to null (ambiguity)
  return null;
};
