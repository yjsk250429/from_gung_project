import './style.scss';

const SelectDate = () => {
    return (
        <div className="selectDate">
            <div className="selectTop">
                <article className="date-picker">
                    <h3>1. 날짜 선택</h3>
                </article>
                <div className="selectRight">
                    <article className="people-selector">
                        <h3>2. 인원 선택</h3>
                    </article>
                    <article className="coupon-apply">
                        <h3>3. 쿠폰 적용</h3>
                    </article>
                </div>
            </div>
            <div className="selectBottom">
                <p>정가 54,000원</p>
                <strong>53,000 원</strong>
                <button>예약하기</button>
            </div>
        </div>
    );
};

export default SelectDate;
