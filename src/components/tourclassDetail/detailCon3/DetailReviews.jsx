import "./style.scss";
import { useEffect, useRef, useMemo, useState } from "react";
import gsap from "gsap";
import { IoMdStar, IoMdStarOutline } from "react-icons/io";

const DetailReviews = () => {
  const reviewsItemList = [
    {
      id: 1,
      profile: "/images/profile/test.png",
      reviewComment: "너무 재밌었어요",
    },
    {
      id: 2,
      profile: "/images/profile/test.png",
      reviewComment: "야경이 정말 아름답고 낭만적이에요",
    },
    {
      id: 3,
      profile: "/images/profile/test.png",
      reviewComment: "가족 여행지로 딱이에요",
    },
    {
      id: 4,
      profile: "/images/profile/test.png",
      reviewComment: "전통문화 체험이 인상 깊었어요",
    },
    {
      id: 5,
      profile: "/images/profile/test.png",
      reviewComment: "인생샷 건졌습니다",
    },
    {
      id: 6,
      profile: "/images/profile/test.png",
      reviewComment: "한복 체험이 특히 좋았어요",
    },
    {
      id: 7,
      profile: "/images/profile/test.png",
      reviewComment: "가이드분 설명이 귀에 쏙쏙",
    },
    {
      id: 8,
      profile: "/images/profile/test.png",
      reviewComment: "아이들과 함께해도 전혀 지루하지 않았습니다",
    },
    {
      id: 9,
      profile: "/images/profile/test.png",
      reviewComment: "생각보다 규모가 엄청 크더라고요",
    },
    {
      id: 10,
      profile: "/images/profile/test.png",
      reviewComment: "먹을거리도 많고 볼거리도 풍성해요",
    },
    {
      id: 11,
      profile: "/images/profile/test.png",
      reviewComment: "날씨 좋을 때 가면 정말 최고예요",
    },
    {
      id: 12,
      profile: "/images/profile/test.png",
      reviewComment: "주차 공간도 넉넉해서 편했어요",
    },
    {
      id: 13,
      profile: "/images/profile/test.png",
      reviewComment: "입장료가 전혀 아깝지 않았어요",
    },
    {
      id: 14,
      profile: "/images/profile/test.png",
      reviewComment: "데이트 장소로 강추합니다!",
    },
    {
      id: 15,
      profile: "/images/profile/test.png",
      reviewComment: "찍는 족족 인생샷이에요",
    },
    {
      id: 16,
      profile: "/images/profile/test.png",
      reviewComment: "아이들에게 생생한 역사 교육이 되었습니다",
    },
    {
      id: 17,
      profile: "/images/profile/test.png",
      reviewComment: "시간 가는 줄 모르고 구경했어요",
    },
    {
      id: 18,
      profile: "/images/profile/test.png",
      reviewComment: "기념품 종류가 다양해서 고르기 힘들 정도",
    },
    {
      id: 19,
      profile: "/images/profile/test.png",
      reviewComment: "또 가고 싶어요",
    },
    {
      id: 20,
      profile: "/images/profile/test.png",
      reviewComment: "정말 만족스러운 여행이었습니다. 추천해요!",
    },
  ];

  // 새로운 리뷰 상태 추가
  const [newReviews, setNewReviews] = useState([]);
  const [reviewInput, setReviewInput] = useState("");

  // useMemo로 랜덤 리스트 고정 - 새로운 리뷰와 함께 처리
  const randomReviews = useMemo(() => {
    const shuffled = [...reviewsItemList].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 16); // 총 16개만 사용
  }, []);

  // 4개씩 나누기 - 첫 번째 행에 새로운 리뷰 추가
  const rows = useMemo(() => {
    const baseRows = Array.from({ length: 4 }, (_, i) =>
      randomReviews.slice(i * 4, i * 4 + 4)
    );

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
          ease: "linear",
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

  // 리뷰 추가 함수
  const handleReviewSubmit = () => {
    if (!reviewInput.trim() || !ratings["global"]) {
      alert("별점과 리뷰를 모두 입력해주세요!");
      return;
    }

    const newReview = {
      id: Date.now(),
      profile: "/images/profile/test.png",
      reviewComment: reviewInput.trim(),
      isNew: true,
    };

    // 새로운 리뷰를 맨 앞에 추가
    setNewReviews((prev) => [newReview, ...prev]);

    // 입력 초기화
    setReviewInput("");
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
                  className={`reviewItem ${isNew ? "reviewItem--new" : ""}`}
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
        <article className="starRating">
          {[...Array(5)].map((_, starIndex) => {
            const isFilled = (ratings["global"] || 0) > starIndex;
            return (
              <strong
                key={starIndex}
                onClick={() => handleStarClick("global", starIndex)}
                style={{ cursor: "pointer" }}
              >
                {isFilled ? <IoMdStar /> : <IoMdStarOutline />}
              </strong>
            );
          })}
        </article>

        <article className="loginUser">
          <div className="userInfo">
            <span className="profileImg">
              <img src="/images/profile/test.png" alt="user" />
            </span>
            <p className="userNickname">User닉네임</p>
          </div>
          <div className="reviewInputArea">
            <input
              className="reviewInput"
              value={reviewInput}
              onChange={(e) => setReviewInput(e.target.value)}
              placeholder="리뷰를 입력해주세요"
              maxLength={30}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleReviewSubmit();
                }
              }}
            />
          </div>
        </article>

        <button onClick={handleReviewSubmit}>리뷰 작성</button>
      </div>
    </div>
  );
};

export default DetailReviews;
