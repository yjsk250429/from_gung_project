import { create } from 'zustand';
import { tourclassData } from '../api/tourclassData';
import { getMovies, getMovieDetails, getMovieCredits, searchMovie } from '../api/tmdbApi';
import { loadAll } from '../tmdb/loadAll';
import { attachStablePoints } from '../utils/points';
import { persist, createJSONStorage } from 'zustand/middleware';
const seedDays = (n) => {
    const out = [];
    for (let i = 0; i < n; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i - 1); // 오늘은 로그인으로 찍히게 하고, 과거 n일만 채움
        out.push(d.toISOString().slice(0, 10));
    }
    return out;
};

const memberData = [
    {
        id: 1,
        name: '홍길동',
        userId: 'abc1234',
        password: 'abc1234!',
        nickName: '궁으로간닷',
        profile: '/images/profile/profile_13.png',
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
        reward: 0,
        coupon: [],
        marketing: false, // 선택항목 (이벤트/혜택 수신 여부)
        marketingDate: null, // 마지막 동의/거부 날짜
        wishlist: [],
        ottWishList: [],
        bookings: [],
        attandance: seedDays(9),
        inquiries: [],
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
    tempMarketing: { status: false, date: null },

    setTempMarketing: (status) => {
        set({
            tempMarketing: {
                status,
                date: status ? new Date().toISOString() : null,
            },
        });
    },

    // ✅ 문의 추가 (현재 로그인한 계정의 inquiries에 저장)
    addInquiry: (item) => {
        const { user, members } = get();
        if (!user) return;
    
        const target = members.find((m) => m.id === user.id);
        if (!target) return;
    
        const prev = target.inquiries || [];
    
        // ✅ 작성일은 ISO + 시간
        const now = new Date();
        const formatDateTime = (date) => {
            const pad = (n) => String(n).padStart(2, '0');
            return (
                date.getFullYear() +
                '-' +
                pad(date.getMonth() + 1) +
                '-' +
                pad(date.getDate()) +
                ' ' +
                pad(date.getHours()) +
                ':' +
                pad(date.getMinutes()) +
                ':' +
                pad(date.getSeconds())
            );
        };
    
        const newItem = {
            id: prev.length + 1,
            title: item.title,
            content: item.content,
            date: formatDateTime(now),   // 최초 작성일
            updatedAt: null,             // 수정일은 없음
            status: '대기중',
        };
    
        const updatedUser = { ...target, inquiries: [newItem, ...prev] };
        const updatedMembers = members.map((m) => (m.id === target.id ? updatedUser : m));
    
        set({ user: updatedUser, members: updatedMembers });
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('members', JSON.stringify(updatedMembers));
    },
    
    // ✅ 내 문의 목록 가져오기
    getMyInquiries: () => {
        const { user } = get();
        return user?.inquiries || [];
    },

    // ✅ 문의 삭제
    removeInquiry: (ids) => {
        const { user, members } = get();
        if (!user) return;

        // ✅ 단일 ID를 배열로 감싸기
        if (!Array.isArray(ids)) {
            ids = [ids];
        }

        const prev = user.inquiries || [];
        const updatedInquiries = prev.filter((q) => !ids.includes(q.id));

        const updatedUser = { ...user, inquiries: updatedInquiries };
        const updatedMembers = members.map((m) => (m.id === user.id ? updatedUser : m));

        set({ user: updatedUser, members: updatedMembers });
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('members', JSON.stringify(updatedMembers));
    },

    // ✅ 전체 문의 삭제
    clearMyInquiries: () => {
        const { user, members } = get();
        if (!user) return;

        const updatedUser = { ...user, inquiries: [] };
        const updatedMembers = members.map((m) => (m.id === user.id ? updatedUser : m));

        set({ user: updatedUser, members: updatedMembers });
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('members', JSON.stringify(updatedMembers));
    },

    updateInquiry: (id, updates) => {
        const { user, members } = get();
        if (!user) return;
    
        const formatDateTime = (date) => {
            const pad = (n) => String(n).padStart(2, '0');
            return (
                date.getFullYear() +
                '-' +
                pad(date.getMonth() + 1) +
                '-' +
                pad(date.getDate()) +
                ' ' +
                pad(date.getHours()) +
                ':' +
                pad(date.getMinutes()) +
                ':' +
                pad(date.getSeconds())
            );
        };
    
        const updatedInquiries = (user.inquiries || []).map((q) =>
            q.id === id
                ? {
                      ...q,
                      ...updates,
                      updatedAt: formatDateTime(new Date()), // ✅ 수정일 기록
                  }
                : q
        );
    
        const updatedUser = { ...user, inquiries: updatedInquiries };
        const updatedMembers = members.map((m) => (m.id === user.id ? updatedUser : m));
    
        set({ user: updatedUser, members: updatedMembers });
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('members', JSON.stringify(updatedMembers));
    },

    // ----- 기존 로그인/로그아웃/회원가입/탈퇴 등 나머지 메서드는 그대로 유지 -----
    login: ({ userId, password, isExternal = false, profile, nickName }) => {
        const { members } = get();

        if (isExternal) {
            const externalUser = { userId, nickName, profile, inquiries: [], attandance: [] };
            set({ authed: true, user: externalUser });
            localStorage.setItem('authed', JSON.stringify(true));
            localStorage.setItem('user', JSON.stringify(externalUser));
            return;
        }

        const item = members.find((member) => member.userId === userId);
        if (item && item.password === password) {
            // ✅ 출석 기록 추가 (하루에 한 번만, 최대 10개)
            const today = new Date().toISOString().slice(0, 10);
            let prev = [];
            if (Array.isArray(item.attandance)) {
                prev = item.attandance;
            } else if (typeof item.attandance === 'number') {
                const n = Math.max(0, Math.min(10, item.attandance)); // 0~10로 클램프
                prev = Array.from({ length: n }, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - i - 1);
                    return d.toISOString().slice(0, 10);
                });
            } else {
                prev = [];
            }
            // ✅ 오늘 기록 1회만, 중복 제거 + 최대 10개 유지
            const updatedAtt = [today, ...prev.filter((d) => d !== today)].slice(0, 10);

            const updatedUser = { ...item, attandance: updatedAtt };
            const updatedMembers = members.map((m) => (m.id === item.id ? updatedUser : m));

            set({ authed: true, user: updatedUser, members: updatedMembers });
            localStorage.setItem('authed', JSON.stringify(true));
            // localStorage.setItem('user', JSON.stringify(item));
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } else {
            set({ authed: false, user: null });
            localStorage.setItem('authed', JSON.stringify(false));
            localStorage.setItem('user', JSON.stringify(null));
        }
    },

    logout: () => {
        set({ authed: false, user: null });
        localStorage.setItem('authed', JSON.stringify(false));
        localStorage.setItem('user', JSON.stringify(null));

        if (window.Kakao && window.Kakao.Auth.getAccessToken()) {
            window.Kakao.Auth.logout(() => {
                console.log('카카오 로그아웃 완료');
            });
        }
    },

    signup: (user) => {
        const { members, tempMarketing } = get();
        const newUser = {
            ...user,
            id: no++,
            profile: '/images/profile/profile_1.png',
            marketing: tempMarketing.status,
            marketingDate: tempMarketing.date,
            wishlist: [],
            ottWishList: [],
            attandance: [],
            inquiries: [], // ✅ 새 회원은 빈 문의 배열로 시작
            coupon: [
                {
                    id: 'signup',
                    name: '신규 회원 가입 쿠폰',
                    discount: 1500,
                    used: false,
                },
                {
                    id: 'firstbuy',
                    name: '첫 구매 고객 특별 할인',
                    discount: 2000,
                    used: false,
                },
            ],
        };
        const updatedMembers = [...members, newUser];
        set({ members: updatedMembers, tempMarketing: { status: false, date: null } });
        localStorage.setItem('members', JSON.stringify(updatedMembers));
    },

    // 쿠폰 사용
    useCoupon: (couponId) => {
        const { user, members } = get();
        if (!user) return;

        const updatedCoupons = (user.coupon || []).map((c) =>
            c.id === couponId ? { ...c, used: true } : c
        );

        const updatedUser = { ...user, coupon: updatedCoupons };
        const updatedMembers = members.map((m) => (m.id === user.id ? updatedUser : m));

        set({ user: updatedUser, members: updatedMembers });
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('members', JSON.stringify(updatedMembers));
    },

    // 쿠폰 발급
    addCoupon: (newCoupon) => {
        const { user, members } = get();
        if (!user) return;

        const updatedUser = {
            ...user,
            coupon: [...(user.coupon || []), { ...newCoupon, used: false }],
        };

        const updatedMembers = members.map((m) => (m.id === user.id ? updatedUser : m));

        set({ user: updatedUser, members: updatedMembers });
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('members', JSON.stringify(updatedMembers));
    },

    withdraw: () => {
        const { user, members } = get();
        if (!user) return;

        const updatedMembers = members.filter((m) => m.id !== user.id);

        set({ members: updatedMembers, authed: false, user: null });

        localStorage.setItem('members', JSON.stringify(updatedMembers));
        localStorage.setItem('authed', JSON.stringify(false));
        localStorage.setItem('user', JSON.stringify(null));

        if (window.Kakao && window.Kakao.Auth.getAccessToken()) {
            window.Kakao.API.request({
                url: '/v1/user/unlink',
                success: function (res) {
                    console.log('카카오 연결 해제 완료:', res);
                },
                fail: function (err) {
                    console.error('카카오 연결 해제 실패:', err);
                },
            });
        }
    },

    updateUser: (updates) => {
        const { user, members } = get();
        if (!user) return;

        const updatedUser = {
            ...user,
            ...updates,
            marketingDate:
                updates.marketing !== undefined && updates.marketing !== user.marketing
                    ? new Date().toISOString()
                    : user.marketingDate,
        };

        const updatedMembers = members.map((m) => (m.id === user.id ? updatedUser : m));

        set({ user: updatedUser, members: updatedMembers });
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('members', JSON.stringify(updatedMembers));
    },

    kakaoLogin: (kakaoUser) => {
        set({ authed: true, user: { ...kakaoUser, inquiries: [], attandance: [] } });
        localStorage.setItem('authed', JSON.stringify(true));
        localStorage.setItem('user', JSON.stringify(kakaoUser));
    },

    toggleWishlist: (item) => {
        const { user, members } = get();
        if (!user) return;

        const exists = user.wishlist?.some((w) => w.id === item.id);
        const updatedWishlist = exists
            ? user.wishlist.filter((w) => w.id !== item.id)
            : [...(Array.isArray(user.wishlist) ? [...user.wishlist] : []), item];

        const updatedUser = { ...user, wishlist: updatedWishlist };
        const updatedMembers = members.map((m) => (m.id === user.id ? updatedUser : m));

        set({ user: updatedUser, members: updatedMembers });
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('members', JSON.stringify(updatedMembers));
    },

    clearWishlist: () => {
        const { user, members } = get();
        if (!user) return;

        const updatedUser = { ...user, wishlist: [] };
        const updatedMembers = members.map((m) => (m.id === user.id ? updatedUser : m));

        set({ user: updatedUser, members: updatedMembers });
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('members', JSON.stringify(updatedMembers));
    },

    removeFromWishlist: (ids) => {
        const { user, members } = get();
        if (!user) return;

        const updatedWishlist = user.wishlist.filter((w) => !ids.includes(w.id));
        const updatedUser = { ...user, wishlist: updatedWishlist };
        const updatedMembers = members.map((m) => (m.id === user.id ? updatedUser : m));

        set({ user: updatedUser, members: updatedMembers });
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('members', JSON.stringify(updatedMembers));
    },

    addBooking: (bookingData) => {
        const { user, members } = get();
        if (!user) return;

        // 예약번호 생성
        const now = new Date();
        const yy = String(now.getFullYear()).slice(-2);
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        const bookingNumber = `${yy}${mm}${dd}-${random}`;

        const newBooking = {
            id: Date.now(),
            bookingNumber,
            ...bookingData,
            status: 'confirmed',
            createdAt: new Date().toISOString(),
        };

        // ✅ reward 적립
        const REWARD_UNIT = 2000;
        const rewardEarned = Math.ceil(bookingData.finalPrice / REWARD_UNIT);

        // ✅ 사용한 쿠폰은 used:true 처리
        let updatedCoupons = user.coupon || [];
        if (bookingData.selectedCoupon) {
            updatedCoupons = updatedCoupons.map((c) =>
                c.id === bookingData.selectedCoupon.id ? { ...c, used: true } : c
            );
        }

        const updatedUser = {
            ...user,
            reward: (user.reward || 0) + rewardEarned,
            coupon: updatedCoupons,
            bookings: [...(user.bookings || []), newBooking],
        };

        const updatedMembers = user.id
            ? members.map((m) => (m.id === user.id ? updatedUser : m))
            : members;

        set({ user: updatedUser, members: updatedMembers });
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('members', JSON.stringify(updatedMembers));
    },

    cancelBooking: (bookingId) => {
        const { user, members } = get();
        if (!user) return;
    
        let rewardToRefund = 0;
    
        const updatedBookings = (Array.isArray(user.bookings) ? [...user.bookings] : []).map((b) => {
            if (b.id === bookingId && b.status === 'confirmed') {
                // ✅ 취소되는 예약에서 환불할 리워드 계산
                const REWARD_UNIT = 2000;
                rewardToRefund = Math.ceil((b.finalPrice || 0) / REWARD_UNIT);
                return { ...b, status: 'cancelled', cancelledAt: new Date().toISOString() };
            }
            return b;
        });
    
        // 리워드 차감 (최소 0 이상 유지)
        const updatedUser = {
            ...user,
            bookings: updatedBookings,
            reward: Math.max(0, (user.reward || 0) - rewardToRefund),
        };
    
        if (!user.id) {
            set({ user: updatedUser });
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return;
        }
    
        const updatedMembers = members.map((m) => (m.id === user.id ? updatedUser : m));
        set({ user: updatedUser, members: updatedMembers });
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('members', JSON.stringify(updatedMembers));
    },

    addReview: (review) => {
        const { user, members } = get();
        if (!user) return;

        const newReview = {
            id: Date.now(),
            ...review,
            date: new Date().toISOString(),
        };

        const updatedUser = {
            ...user,
            reviews: [...(Array.isArray(user.reviews) ? user.reviews : []), newReview],
        };

        const updatedMembers = members.map((m) => (m.id === user.id ? updatedUser : m));

        set({ user: updatedUser, members: updatedMembers });
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('members', JSON.stringify(updatedMembers));
    },

    deleteReview: (reviewId) => {
        const { user, members } = get();
        if (!user) return;

        const updatedUser = {
            ...user,
            reviews: (Array.isArray(user.reviews) ? user.reviews : []).filter(
                (review) => review.id !== reviewId
            ),
        };

        const updatedMembers = members.map((m) => (m.id === user.id ? updatedUser : m));

        set({ user: updatedUser, members: updatedMembers });
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('members', JSON.stringify(updatedMembers));
    },
}));

export const useModalStore = create((set) => ({
    loginOpen: false,
    loginComOpen: false,
    logoutComOpen: false,
    joinOpen: false,
    joinInfoOpen: false,
    joinComOpen: false,
    withdrawConfirmOpen: false,
    withdrawComOpen: false,
    rewardOpen: false,
    stampNoticeOpen: false,
    editInfoOpen: false,
    editPasswordOpen: false,
    editCompleteOpen: false,
    couponOpen: false,
    needLoginOpen: false,
    wishModalOpen: false,

    wishMessage: '',
    wishButtons: { text1: '', text2: '' },
    wishAction: null,
    wishOptions: {},
    openWishModal: (message, buttons = { text1: '', text2: '' }, action = null, options = {}) =>
        set({
            wishModalOpen: true,
            wishMessage: message,
            wishButtons: buttons,
            wishAction: action,
            wishOptions: options,
        }),
    closeWishModal: () =>
        set({
            wishModalOpen: false,
            wishMessage: '',
            wishButtons: { text1: '', text2: '' },
            wishAction: null,
            wishOptions: {},
        }),

    selectProfileOpen: false,
    selectedProfileImage: null,

    openSelectProfile: (image = '') =>
        set({ selectProfileOpen: true, selectedProfileImage: image }),
    closeSelectProfile: () => set({ selectProfileOpen: false, selectedProfileImage: '' }),

    openNeedLogin: () => set({ needLoginOpen: true }),
    closeNeedLogin: () => set({ needLoginOpen: false }),

    openCoupon: () => set({ couponOpen: true }),
    closeCoupon: () => set({ couponOpen: false }),

    openEditComplete: () => set({ editCompleteOpen: true }),
    closeEditComplete: () => set({ editCompleteOpen: false }),

    openEditPassword: () => set({ editPasswordOpen: true }),
    closeEditPassword: () => set({ editPasswordOpen: false }),

    openEditInfo: () => set({ editInfoOpen: true }),
    closeEditInfo: () => set({ editInfoOpen: false }),

    openWithdrawConfirm: () => set({ withdrawConfirmOpen: true }),
    closeWithdrawConfirm: () => set({ withdrawConfirmOpen: false }),

    openWithdrawCom: () => set({ withdrawComOpen: true }),
    closeWithdrawCom: () => set({ withdrawComOpen: false }),

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
    switchToWithdrawCom: () => set({ withdrawConfirmOpen: false, withdrawComOpen: true }),
    switchToEditPassword: () => set({ editPasswordOpen: false, editInfoOpen: true }),
    switchToEditComplete: () => set({ editInfoOpen: false, editCompleteOpen: true }),
}));

export const useTourClassStore = create((set, get) => ({
    tourClass: tourclassData,
    category: 'tour',
    regionCategory: '전체',

    setCategory: (category) => set({ category }),
    setRegionCategory: (regionCategory) => set({ regionCategory }),
}));

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

// 🔽 store/index.jsx 제일 아래에 추가

// export const useInquiryStore = create(
//     persist(
//         (set, get) => ({
//             inquiries: [],
//             addInquiry: (item) => {
//                 const prev = get().inquiries;
//                 const newItem = {
//                     id: prev.length + 1, // 순차 번호
//                     title: item.title,
//                     content: item.content,
//                     date: new Date().toISOString().slice(0, 10),
//                     status: '대기중',
//                 };
//                 set({ inquiries: [newItem, ...prev] });
//             },
//             removeInquiry: (id) => {
//                 const filtered = get().inquiries.filter((q) => q.id !== id);
//                 set({ inquiries: filtered });
//             },
//         }),
//         {
//             name: 'inquiries:v1',
//             storage: createJSONStorage(() => localStorage),
//         }
//     )
// );
