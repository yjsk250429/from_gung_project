import { create } from 'zustand';
import { tourclassData } from '../api/tourclassData';
import { getMovies, getMovieDetails, getMovieCredits, searchMovie } from '../api/tmdbApi';

export const useModalStore = create((set) => ({
    loginOpen: false,
    openLogin: () => set({ loginOpen: true }),
    closeLogin: () => set({ loginOpen: false }),
  }));

export const useTourClassStore = create((set, get) => ({
    tourClass: tourclassData,
    category: 'tour',
  
    setCategory: (category) =>
      set(() => ({
        category,
      })),
  
    getFiltered: () =>{
        const { tourClass, category } = get();
    return tourClass.filter((item) => item.category === category);
    },
  }));
        // setTour:()=>set((state)=>({
        //     tourClass:state.tourClass.filter((t)=>t.category === 'tour')
        // })),
        // setClass:()=>set((state)=>({
        //     tourClass:state.tourClass.filter((c)=>c.category === 'class')
        // }))
    // }));

export const usexxStore = create((set, get) => ({
    // state
    data: [],

    // actions
    onReset: () => set({ data: [] }),
}));


export const useMovieStore = create((set, get) => ({
    // state
    movies: [], // 목록(인기/상영중/개봉예정)
    movieDetails: null, // 상세
    movieCredits: null, // 출연/제작진
    searchResults: [], // 검색 결과
    loading: false,
    error: null,

    // actions
    resetMovies: () => set({ movies: [] }),
    resetSearch: () => set({ searchResults: [] }),
    clearError: () => set({ error: null }),

    fetchMovies: async ({ category = 'popular', page = 1 }) => {
        set({ loading: true, error: null });
        try {
            const data = await getMovies(category, page); // { page, results, total_pages, ... }
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
            const data = await getMovieDetails(movieId); // 단일 객체
            set({ loading: false, movieDetails: data });
        } catch (err) {
            set({ loading: false, error: err?.message ?? '영화 상세 요청 실패' });
        }
    },

    fetchMovieCredits: async (movieId) => {
        set({ loading: true, error: null, movieCredits: null });
        try {
            const data = await getMovieCredits(movieId); // { cast, crew }
            set({ loading: false, movieCredits: data });
        } catch (err) {
            set({ loading: false, error: err?.message ?? '출연/제작진 요청 실패' });
        }
    },

    fetchSearchResults: async ({ query, page = 1 }) => {
        set({ loading: true, error: null });
        try {
            const data = await searchMovie(query, page); // { results, ... }
            const { results = [] } = data || {};

            set((state) => ({
                loading: false,
                searchResults: page === 1 ? results : [...state.searchResults, ...results],
            }));
        } catch (err) {
            set({ loading: false, error: err?.message ?? '검색 요청 실패' });
        }
    },
}));

