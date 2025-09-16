const InquirySection = () => {
    return (
        <div className="inquiry">
            <h2>1:1 문의 내역</h2>
            <div className="table">
                <div className="thead">
                    <span>번호</span>
                    <span>날짜</span>
                    <span>내용</span>
                    <span>답변상태</span>
                </div>
                <div className="tbody empty">1:1 문의 내역이 없습니다.</div>
            </div>
        </div>
    );
};

export default InquirySection;
