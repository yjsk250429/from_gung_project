import './style.scss';
import { useEffect, useRef, useMemo, useState } from 'react';
import gsap from 'gsap';
import { IoMdStar, IoMdStarOutline } from 'react-icons/io';
import { useAuthStore } from '../../../store';

const DetailReviews = ({ thisitem }) => {
    const { title, category } = thisitem;

    const reviewsItemList = [
        {
            id: 1,
            profile: '/images/profile/profile_1.png',
            reviewComment: '너무 재밌었어요',
        },
        {
            id: 2,
            profile: '/images/profile/profile_2.png',
            reviewComment: '야경이 정말 아름답고 낭만적이에요',
        },
        {
            id: 3,
            profile: '/images/profile/profile_3.png',
            reviewComment: '가족 여행지로 딱이에요',
        },
        {
            id: 4,
            profile: '/images/profile/profile_4.png',
            reviewComment: '전통문화 체험이 인상 깊었어요',
        },
        {
            id: 5,
            profile: '/images/profile/profile_5.png',
            reviewComment: '인생샷 건졌습니다',
        },
        {
            id: 6,
            profile: '/images/profile/profile_6.png',
            reviewComment: '한복 체험이 특히 좋았어요',
        },
        {
            id: 7,
            profile: '/images/profile/profile_7.png',
            reviewComment: '가이드분 설명이 귀에 쏙쏙',
        },
        {
            id: 8,
            profile: '/images/profile/profile_8.png',
            reviewComment: '아이들과 함께해도 전혀 지루하지 않았습니다',
        },
        {
            id: 9,
            profile: '/images/profile/profile_9.png',
            reviewComment: '생각보다 규모가 엄청 크더라고요',
        },
        {
            id: 10,
            profile: '/images/profile/profile_10.png',
            reviewComment: '먹을거리도 많고 볼거리도 풍성해요',
        },
        {
            id: 11,
            profile: '/images/profile/profile_11.png',
            reviewComment: '날씨 좋을 때 가면 정말 최고예요',
        },
        {
            id: 12,
            profile: '/images/profile/profile_12.png',
            reviewComment: '주차 공간도 넉넉해서 편했어요',
        },
        {
            id: 13,
            profile: '/images/profile/profile_13.png',
            reviewComment: '입장료가 전혀 아깝지 않았어요',
        },
        {
            id: 14,
            profile: '/images/profile/profile_14.png',
            reviewComment: '데이트 장소로 강추합니다!',
        },
        {
            id: 15,
            profile: '/images/profile/profile_15.png',
            reviewComment: '찍는 족족 인생샷이에요',
        },
        {
            id: 16,
            profile: '/images/profile/profile_16.png',
            reviewComment: '아이들에게 생생한 역사 교육이 되었습니다',
        },
        {
            id: 17,
            profile: '/images/profile/profile_17.png',
            reviewComment: '시간 가는 줄 모르고 구경했어요',
        },
        {
            id: 18,
            profile: '/images/profile/profile_18.png',
            reviewComment: '기념품 종류가 다양해서 고르기 힘들 정도',
        },
        {
            id: 19,
            profile: '/images/profile/profile_1.png',
            reviewComment: '또 가고 싶어요',
        },
        {
            id: 20,
            profile: '/images/profile/profile_2.png',
            reviewComment: '정말 만족스러운 여행이었습니다. 추천해요!',
        },
    ];

    const user = useAuthStore((state) => state.user);
    const authed = useAuthStore((s) => s.authed);
    const isLoggedIn = authed;
    const addReview = useAuthStore((state) => state.addReview);

    const userNickname = user?.nickName || '익명';
    const userProfile = user?.profile || '/images/profile/default.png';

    // 새로운 리뷰 상태 추가
    const [newReviews, setNewReviews] = useState([]);
    const [reviewInput, setReviewInput] = useState('');

    // useMemo로 랜덤 리스트 고정 - 새로운 리뷰와 함께 처리
    const randomReviews = useMemo(() => {
        const shuffled = [...reviewsItemList].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 16); // 총 16개만 사용
    }, []);

    // 4개씩 나누기 - 첫 번째 행에 새로운 리뷰 추가
    const rows = useMemo(() => {
        const baseRows = Array.from({ length: 4 }, (_, i) => randomReviews.slice(i * 4, i * 4 + 4));

        // 첫 번째 행에 새로운 리뷰들을 맨 앞에 추가
        if (newReviews.length > 0) {
            baseRows[0] = [...newReviews, ...baseRows[0]];
        }

        return baseRows;
    }, [randomReviews, newReviews]);

    const rowRefs = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            rowRefs.current.forEach((row, index) => {
                if (!row) return;

                gsap.set(row, { xPercent: index % 2 === 0 ? -50 : 0 });

                gsap.to(row, {
                    xPercent: index % 2 === 0 ? 0 : -50,
                    repeat: -1,
                    duration: 100,
                    ease: 'linear',
                });
            });
        });

        return () => ctx.revert(); // 클린업
    }, [newReviews.length]);

    // 별점
    const [ratings, setRatings] = useState({});

    const handleStarClick = (reviewId, starIndex) => {
        setRatings((prev) => ({
            ...prev,
            [reviewId]: starIndex + 1, // 별 1~5
        }));
    };

    // 리큐 카테고리 구분
    const getCategoryKor = (cat) => {
        switch (cat) {
            case 'tour':
                return '투어';
            case 'class':
                return '클래스';
            default:
                return cat; // 혹시 다른 값 있으면 그대로 반환
        }
    };

    // 리뷰 추가 함수
    const handleReviewSubmit = () => {
        if (!reviewInput.trim() || !ratings['global']) {
            alert('별점과 리뷰를 모두 입력해주세요!');
            return;
        }

        const newReview = {
            profile: user?.profile || '/images/profile/default.png',
            reviewComment: reviewInput.trim(),
            nickName: user?.nickName || '익명',
            rating: ratings['global'],
            title, // thisitem에서 받은 title 그대로 사용
            category: getCategoryKor(category), // 여기서 영어를 한글로 변환해서 넣음
            isNew: true,
        };

        addReview(newReview);

        // 새로운 리뷰를 맨 앞에 추가
        setNewReviews((prev) => [newReview, ...prev]);

        // 입력 초기화
        setReviewInput('');
        setRatings({});

        // 3초 후 하이라이트 제거
        setTimeout(() => {
            setNewReviews((prev) =>
                prev.map((review) =>
                    review.id === newReview.id ? { ...review, isNew: false } : review
                )
            );
        }, 3000);
    };

    return (
        <div className="detailReviews">
            <div className="reviewsList">
                {rows.map((rowItems, rowIndex) => (
                    <article
                        key={rowIndex}
                        className={`reviewsRow row${rowIndex + 1}`}
                        ref={(el) => (rowRefs.current[rowIndex] = el)}
                    >
                        {/* 루프를 위해 아이템 2배 복제 */}
                        {[...rowItems, ...rowItems].map(
                            ({ id, profile, reviewComment, isNew }, i) => (
                                <div
                                    key={`${id}-${i}`}
                                    className={`reviewItem ${isNew ? 'reviewItem--new' : ''}`}
                                >
                                    <span>
                                        <img src={profile} alt={`리뷰어 ${id}`} />
                                    </span>
                                    <p>{reviewComment}</p>
                                </div>
                            )
                        )}
                    </article>
                ))}
            </div>
            <div className="reviewAdd">
                <article className="starRating" style={{ opacity: isLoggedIn ? 1 : 0.4 }}>
                    {[...Array(5)].map((_, starIndex) => {
                        const isFilled = (ratings['global'] || 0) > starIndex;
                        return (
                            <strong
                                key={starIndex}
                                onClick={() => {
                                    if (isLoggedIn) {
                                        handleStarClick('global', starIndex);
                                    }
                                }}
                                style={{ cursor: isLoggedIn ? 'pointer' : 'not-allowed' }}
                            >
                                {isFilled ? <IoMdStar /> : <IoMdStarOutline />}
                            </strong>
                        );
                    })}
                </article>

                <article className="loginUser">
                    {isLoggedIn ? (
                        <div className="userInfo">
                            <span className="profileImg">
                                <img src={userProfile} alt={userNickname} />
                            </span>
                            <p className="userNickname">{userNickname}</p>
                        </div>
                    ) : (
                        <div className="userInfo"></div>
                    )}

                    <div className="reviewInputArea">
                        <input
                            className="reviewInput"
                            value={reviewInput}
                            onChange={(e) => setReviewInput(e.target.value)}
                            placeholder={
                                isLoggedIn
                                    ? '리뷰를 입력해주세요'
                                    : '로그인 후 이용 가능한 서비스 입니다'
                            }
                            maxLength={30}
                            disabled={!isLoggedIn}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && isLoggedIn) {
                                    handleReviewSubmit();
                                }
                            }}
                        />
                    </div>
                </article>

                <button
                    onClick={handleReviewSubmit}
                    disabled={!isLoggedIn}
                    style={{
                        cursor: isLoggedIn ? 'pointer' : 'not-allowed',
                        opacity: isLoggedIn ? 1 : 0.5,
                    }}
                >
                    리뷰 작성
                </button>
            </div>
        </div>
    );
};

export default DetailReviews;
