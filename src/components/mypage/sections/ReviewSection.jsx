// components/mypage/ReviewSection.jsx
import { useAuthStore, useModalStore } from '../../../store';
import { useMemo, useState } from 'react';

const ReviewSection = () => {
  const user = useAuthStore((s) => s.user);
  const reviews = user?.reviews || [];
  const deleteReview = useAuthStore((s) => s.deleteReview);
  const updateReview = useAuthStore((s) => s.updateReview);
  const { openWishModal } = useModalStore();

  const [mode, setMode] = useState('list'); // "list" | "detail" | "form"
  const [selectedId, setSelectedId] = useState(null); // ✅ 객체 대신 ID만 보관
  const [form, setForm] = useState({ reviewComment: '' });

  // ✅ 항상 store의 최신 reviews에서 선택된 리뷰를 가져옴
  const selectedReview = useMemo(
    () => reviews.find((r) => r.id === selectedId) || null,
    [reviews, selectedId]
  );

  const onSave = () => {
    if (!form.reviewComment.trim()) {
      openWishModal('내용을 입력하세요', { text1: '확인' });
      return;
    }
    if (!selectedId) {
      // 신규 작성이 없다면, 수정만 허용하는 UX라면 그냥 return
      return;
    }
    // ✅ store 업데이트만 하면 됨. selectedReview는 자동 최신값 반영
    updateReview(selectedId, { reviewComment: form.reviewComment });
    setForm({ reviewComment: '' });
    setMode('detail');
  };

  const onCancel = () => {
    setForm({ reviewComment: '' });
    setMode('list');
  };

  const onDel = (id) => {
    openWishModal(
      '리뷰를 삭제하시겠습니까?',
      { text1: '취소', text2: '확인' },
      (btnText) => {
        if (btnText === '확인') {
          deleteReview(id);
          if (selectedId === id) {
            setSelectedId(null);
            setMode('list');
          }
        }
      }
    );
  };

  if (!user) return <div className="reviews">로그인 후 이용 가능합니다.</div>;

  return (
    <div className="reviews">
      <h2>내가 쓴 리뷰</h2>

      {mode === 'list' && (
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
                <span>{new Date(review.date).toISOString().split('T')[0]}</span>
                <span
                  className="detailBtn"
                  onClick={() => {
                    setSelectedId(review.id); // ✅ 객체 대신 id만 저장
                    setMode('detail');
                  }}
                >
                  {review.reviewComment}
                </span>
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
      )}

      {mode === 'detail' && selectedReview && (
        <div className="detail">
          <h3>리뷰 상세</h3>
          <p><strong>번호:</strong> {selectedReview.id}</p>
          <p><strong>작성일:</strong> {selectedReview.date}</p>
          {selectedReview.updatedAt && (
            <p><strong>수정일:</strong> {selectedReview.updatedAt}</p>
          )}
          <p><strong>카테고리:</strong> {selectedReview.category}</p>
          <p><strong>제목:</strong> {selectedReview.title}</p>
          <p><strong>내용:</strong> {selectedReview.reviewComment}</p>

          <div className="detail-buttons">
            <button
              onClick={() => {
                setForm({ reviewComment: selectedReview.reviewComment });
                setMode('form');
              }}
            >
              수정
            </button>
            <button onClick={() => onDel(selectedReview.id)}>삭제</button>
            <button onClick={() => setMode('list')}>목록으로</button>
          </div>
        </div>
      )}

      {mode === 'form' && (
        <div className="form">
          <div className="form-group">
            <label>내용</label>
            <textarea
              rows="5"
              value={form.reviewComment}
              onChange={(e) => setForm({ ...form, reviewComment: e.target.value })}
            />
          </div>
          <div className="form-buttons">
            <button onClick={onSave}>저장</button>
            <button onClick={onCancel}>취소</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
