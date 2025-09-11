import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const tmdbApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        accept: 'application/json', // response데이터를 json객체로 달라고 서버에게 요청
        Authorization: `Bearer ${API_KEY}`,
    },
});

// 공통 에러
const onError = (error) => {
    // TMDB는 status_message를 주는 경우가 많음
    const msg = error?.response?.data?.status_message || error.message || '요청 실패';
    return { error: true, message: msg };
};

// 인기/개봉예정/상영중 등 목록
export const getMovies = async (category = 'popular', page = 1) => {
    const url = `${BASE_URL}/tv/${category}`;
    try {
        const res = await axios.get(url, {
            params: {
                api_key: API_KEY,
                language: 'ko-KR',
                page,
                region: 'KR',
            },
            headers: { accept: 'application/json' },
        });
        return res.data; // { page, results: [...], total_pages, ... }
    } catch (error) {
        return onError(error);
    }
};

// 상세
export const getMovieDetails = async (movieId) => {
    const url = `${BASE_URL}/tv/${movieId}`;
    try {
        const res = await axios.get(url, {
            params: {
                api_key: API_KEY,
                language: 'ko-KR',
            },
            headers: { accept: 'application/json' },
        });
        return res.data; // 단일 영화 객체
    } catch (error) {
        return onError(error);
    }
};

// 출연/제작진
export const getMovieCredits = async (movieId) => {
    const url = `${BASE_URL}/tv/${movieId}/credits`;
    try {
        const res = await axios.get(url, {
            params: {
                api_key: API_KEY,
                language: 'ko-KR',
            },
            headers: { accept: 'application/json' },
        });
        return res.data;
    } catch (error) {
        return onError(error);
    }
};

// 검색
export const searchMovie = async (query, page = 1) => {
    const url = `${BASE_URL}/search/tv`;
    try {
        const res = await axios.get(url, {
            params: {
                api_key: API_KEY,
                language: 'ko-KR',
                query,
                page,
                include_adult: false,
                region: 'KR',
            },
            headers: { accept: 'application/json' },
        });
        return res.data;
    } catch (error) {
        return onError(error);
    }
};
export default tmdbApi;
