
import { useAuthStore, useModalStore } from '../../../store';

const ReviewSection = () => {
    const user = useAuthStore((state) => state.user);
    const reviews = user?.reviews || [];
    const deleteReview = useAuthStore((state) => state.deleteReview);
    const {openWishModal} = useModalStore();

    const onDel = (id) => {
        openWishModal(
          '리뷰를 삭제하시겠습니까?',
          { text1: "취소", text2: "확인" },
          (btnText) => {
            if (btnText === "확인") {
              deleteReview(id);
            }
          }
        );
      };

    return (
        <div className="reviews">
            <h2>내가 쓴 리뷰</h2>
            <div className="table">
                <div className="thead">
                    <span>번호</span>
                    <span>날짜</span>
                    <span>내용</span>
                    <span>제목</span>
                    <span>카테고리</span>
                    <span>-</span>
                </div>

                {reviews.length > 0 ? (
                    reviews.map((review, idx) => (
                        <div key={review.id} className="tbody reviewList">
                            <span>{idx + 1}</span>
                            <span>{new Date(review.date).toLocaleDateString()}</span>
                            <span>{review.reviewComment}</span>
                            <span>{review.title || '-'}</span>
                            <span>{review.category || '-'}</span>
                            <span>
                                <button onClick={() => onDel(review.id)}>삭제</button>
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="tbody reviewEmpty">작성한 리뷰 내역이 없습니다.</div>
                )}
            </div>
        </div>
    );
};

export default ReviewSection;
