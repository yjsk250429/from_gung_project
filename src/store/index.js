import { create } from 'zustand';
import { tourclassData } from '../api/tourclassData';
import { getMovies, getMovieDetails, getMovieCredits, searchMovie } from '../api/tmdbApi';
import { loadAll } from '../tmdb/loadAll';
import { attachStablePoints  } from '../utils/points';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useModalStore = create((set) => ({
    loginOpen: false,
    joinOpen:false,
    joinInfoOpen:false,
    joinComOpen:false,
    rewardOpen:false,
    stampNoticeOpen:false,

    openJoinCom: () => set({ joinComOpen: true }),
    closeJoinCom: () => set({ joinComOpen: false }),
    
    openJoinInfo: () => set({ joinInfoOpen: true }),
    closeJoinInfo: () => set({ joinInfoOpen: false }),
    
    openStampNotice: () => set({ stampNoticeOpen: true }),
    closeStampNotice: () => set({ stampNoticeOpen: false }),
    
    openReward: () => set({ rewardOpen: true }),
    closeReward: () => set({ rewardOpen: false }),
    
    openLogin: () => set({ loginOpen: true }),
    closeLogin: () => set({ loginOpen: false }),

    openJoin: () => set({ joinOpen: true }),
    closeJoin: () => set({ joinOpen: false }),

    switchToJoin: () => set({ loginOpen: false, joinOpen: true }),
    switchToJoinInfo: () => set({ joinOpen: false, joinInfoOpen: true }),
    switchToJoinCom: () => set({ joinInfoOpen: false, joinComOpen: true }),
}));

export const useTourClassStore = create((set, get) => ({
    tourClass: tourclassData,
    category: 'tour',
    regionCategory: '전체',

    setCategory: (category) =>
        set(() => ({
            category,
        })),
    setRegionCategory: (regionCategory) => set({ regionCategory }),

}));

// export const usexxStore = create((set, get) => ({
//     // state
//     data: [],

//     // actions
//     onReset: () => set({ data: [] }),
// }));

// 드라마/영화 판별 헬퍼
export const isMovieEntity = (it) =>
    (it?.media_type ?? (it?.title ? 'movie' : it?.name ? 'tv' : '')) === 'movie' ||
    String(it?.mediaType).toLowerCase() === 'movie';

export const isDramaEntity = (it) =>
    (it?.media_type ?? (it?.name ? 'tv' : it?.title ? 'movie' : '')) === 'tv' ||
    String(it?.mediaType).toLowerCase() === 'tv';

export const useMovieStore = create(
    persist(
        (set, get) => ({
            // ----- 기존 목록/상세/검색 상태 -----
            movies: [],
            movieDetails: null,
            movieCredits: null,
            searchResults: [],
            loading: false,
            error: null,

            // ----- Curated & 전역 탭 -----
            curated: [],
            curatedLoading: false,
            curatedError: null,

            // 전역 카테고리(탭): 'tv' | 'movie'
            mediaCategory: 'tv',

            // ----- actions (모두 화살표 함수) -----
            resetMovies: () => set({ movies: [] }),
            resetSearch: () => set({ searchResults: [] }),
            clearError: () => set({ error: null }),

            setMediaCategory: (mediaCategory) => set({ mediaCategory }),

            getFiltered: (source = 'movies') => {
                const { mediaCategory } = get();
                const list = get()[source] || [];
                if (!Array.isArray(list)) return [];
                if (mediaCategory === 'movie') return list.filter(isMovieEntity);
                // default: tv
                return list.filter(isDramaEntity);
            },

            initCurated: async () => {
                if (get().curated?.length) return;
                set({ curatedLoading: true, curatedError: null });
                try {
                    const loaded = await loadAll(); // seed 기반 수집
                    const withPoints = attachStablePoints(loaded, {
                        seedKey: 'curated',
                        range: [30, 55],
                        storageKey: 'ottPoints:v1',
                        keyFn: (it) => `${(it.mediaType || '').toLowerCase()}-${it.id}`,
                    });
                    set({ curated: withPoints, curatedLoading: false });
                } catch (e) {
                    set({ curatedLoading: false, curatedError: e?.message || String(e) });
                }
            },

            fetchMovies: async ({ category = 'popular', page = 1 }) => {
                set({ loading: true, error: null });
                try {
                    const data = await getMovies(category, page);
                    const { results = [] } = data || {};
                    set((state) => ({
                        loading: false,
                        movies: page === 1 ? results : [...state.movies, ...results],
                    }));
                } catch (err) {
                    set({ loading: false, error: err?.message ?? '영화 목록 요청 실패' });
                }
            },

            fetchMovieDetails: async (movieId) => {
                set({ loading: true, error: null, movieDetails: null });
                try {
                    const data = await getMovieDetails(movieId);
                    set({ loading: false, movieDetails: data });
                } catch (err) {
                    set({ loading: false, error: err?.message ?? '영화 상세 요청 실패' });
                }
            },

            fetchMovieCredits: async (movieId) => {
                set({ loading: true, error: null, movieCredits: null });
                try {
                    const data = await getMovieCredits(movieId);
                    set({ loading: false, movieCredits: data });
                } catch (err) {
                    set({ loading: false, error: err?.message ?? '출연/제작진 요청 실패' });
                }
            },

            fetchSearchResults: async ({ query, page = 1 }) => {
                set({ loading: true, error: null });
                try {
                    const data = await searchMovie(query, page);
                    const { results = [] } = data || {};
                    set((state) => ({
                        loading: false,
                        searchResults: page === 1 ? results : [...state.searchResults, ...results],
                    }));
                } catch (err) {
                    set({ loading: false, error: err?.message ?? '검색 요청 실패' });
                }
            },
        }),
        {
            name: 'ott:UI:v1',
            storage: createJSONStorage(() => sessionStorage), // 탭 상태만 세션에 저장
            partialize: (s) => ({ mediaCategory: s.mediaCategory }),
        }
    )
);
