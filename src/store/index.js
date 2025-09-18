import { create } from 'zustand';
import { tourclassData } from '../api/tourclassData';
import { getMovies, getMovieDetails, getMovieCredits, searchMovie } from '../api/tmdbApi';
import { loadAll } from '../tmdb/loadAll';
import { attachStablePoints } from '../utils/points';
import { persist, createJSONStorage } from 'zustand/middleware';

const memberData = [
    {
      id: 1,
      name: '홍길동',
      userId: 'abc1234',
      password: 'abc1234!',
      nickName: '궁으로간닷',
      profile:'/images/mypage/honggildong.png',
      tel: {
        first: '010',
        middle: '0000',
        last: '0000',
      },
      birth: {
        year: '1999',
        month: '01',
        date: '01',
      },
      reward:0,
      coupon:0,
    },
];

// 초기값 로드
const initialMembers = localStorage.getItem('members')
    ? JSON.parse(localStorage.getItem('members'))
    : memberData;

const initialAuthed = localStorage.getItem('authed')
    ? JSON.parse(localStorage.getItem('authed'))
    : false;

const initialUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

let no = initialMembers.length + 1;

export const useAuthStore = create((set, get) => ({
    members: initialMembers,
    authed: initialAuthed,
    user: initialUser,

    // 로그인
    login: ({ userId, password }) => {
      const { members } = get();
      const item = members.find((member) => member.userId === userId);
      if (item && item.password === password) {
        set({ authed: true, user: item });
        localStorage.setItem('authed', JSON.stringify(true));
        localStorage.setItem('user', JSON.stringify(item));
      } else {
        set({ authed: false, user: null });
        localStorage.setItem('authed', JSON.stringify(false));
        localStorage.setItem('user', JSON.stringify(null));
    }
    },

    // 회원가입
    signup: (user) => {
        const { members } = get();
        const newUser = { ...user, id: no++ };
        const updatedMembers = [...members, newUser];
        set({ members: updatedMembers });
        localStorage.setItem('members', JSON.stringify(updatedMembers));
    },
}));

export const useModalStore = create((set) => ({
    loginOpen: false,
    loginComOpen:false,
    logoutComOpen: false,
    joinOpen:false,
    joinInfoOpen:false,
    joinComOpen:false,
    rewardOpen:false,
    stampNoticeOpen:false,
    editInfoOpen:false,

    openEditInfo: () => set({ editInfoOpen: true }),
    closeEditInfo: () => set({ editInfoOpen: false }),
    
    openLoginCom: () => set({ loginComOpen: true }),
    closeLoginCom: () => set({ loginComOpen: false }),
    
    openLogoutCom: () => set({ logoutComOpen: true }),
    closeLogoutCom: () => set({ logoutComOpen: false }),

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
    switchToLogoutCom: () => set({ loginComOpen: false, logoutComOpen: true }),
    switchToLogin: () => set({ logoutComOpen: false, loginOpen: true }),
}));

export const useTourClassStore = create((set, get) => ({
    tourClass: tourclassData,
    category: 'tour',
    regionCategory: '전체',

    setCategory: (category) => set({ category }),
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
