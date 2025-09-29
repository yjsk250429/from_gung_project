import { IoMdStar, IoMdStarHalf, IoMdStarOutline } from "react-icons/io";
import { useAuthStore, useModalStore } from "../../../store";
import Button from "../button/Button";
import './style.scss';
import { useEffect, useState } from "react";

const TourReviewDetail = () => {
    const { 
        tourReviewOpen, 
        closeTourReview, 
        openTourReview, 
        selectedReview,
        openWishModal
      } = useModalStore();
    const deleteReview = useAuthStore((state) => state.deleteReview);
    const updateReview = useAuthStore((state) => state.updateReview);

    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState("");

    useEffect(() => {
        if (!tourReviewOpen) {
          setIsEditing(false);
          setEditContent("");
        }
      }, [tourReviewOpen]);

      const onDel = () => {
        const reviewBackup = selectedReview;
        closeTourReview();
    
        openWishModal(
          "리뷰를 삭제하시겠습니까?",
          { text1: "취소", text2: "확인" },
          (btnText) => {
            if (btnText === "확인") {
              deleteReview(reviewBackup.id);
            } else if (btnText === "취소") {
              openTourReview(reviewBackup); // 취소 시 다시 열기
            }
          },
          { special: true }
        );
      };

      const onEdit = () => {
        if (!isEditing) {
          // 수정 모드로 진입
          setEditContent(selectedReview.reviewComment || "");
          setIsEditing(true);
        } else {
          // 저장 → 리뷰 업데이트 & 최신 데이터 반영
          updateReview(selectedReview.id, { reviewComment: editContent });
    
          // ✅ 업데이트된 리뷰를 다시 열어주기
          openTourReview({
            ...selectedReview,
            reviewComment: editContent,
          });
    
          setIsEditing(false);
        }
      };

    if (!tourReviewOpen || !selectedReview) return null;

    return (
        <div className="modal-overlay">
          <div className="modal tourReviewDetail">
            <div className="top">
              <div className="profile-wrap">
                <img src={selectedReview.profile} alt={selectedReview.nickName} />
              </div>
              <div className="name-wrap">
                <strong>{selectedReview.nickName || "닉네임"}</strong>
                <span className="date">{selectedReview.date}</span>
                <p className="stars">
                  <span>
                    {[...Array(5)].map((_, starIndex) => {
                      if (selectedReview.rate >= starIndex + 1) {
                        return <IoMdStar key={starIndex} />;
                      } else if (selectedReview.rate >= starIndex + 0.5) {
                        return <IoMdStarHalf key={starIndex} />;
                      } else {
                        return <IoMdStarOutline key={starIndex} />;
                      }
                    })}
                  </span>
                </p>
              </div>
            </div>
            <div className="bottom">
              <ul className="edit">
                <li onClick={onDel}>삭제</li>
                <li onClick={onEdit}>{isEditing ? "저장" : "수정"}</li>
              </ul>
              {isEditing ? (
                <div className="textarea-wrap">
                  <textarea
                    className="content-edit"
                    value={editContent}
                    maxLength={150}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                  <p className="char-count">{editContent.length} / 150</p>
                </div>
              ) : (
                <p className="content">{selectedReview.reviewComment}</p>
              )}
            </div>
            <p className="btns">
              <Button
                text="닫기"
                className="small gray"
                onClick={() => {
                  setIsEditing(false); // ✅ 닫을 때도 초기화
                  closeTourReview();
                }}
              />
            </p>
          </div>
        </div>
      );
};

export default TourReviewDetail;