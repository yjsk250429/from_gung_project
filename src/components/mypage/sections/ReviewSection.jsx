import React from 'react';

const ReviewSection = () => {
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
                </div>
                <div className="tbody empty">작성한 리뷰 내역이 없습니다.</div>
            </div>
        </div>
    );
};

export default ReviewSection;
