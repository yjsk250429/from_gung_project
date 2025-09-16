import React from 'react';

const ReservationSection = () => {
    return (
        <div className="reservation">
            <h2>나의 예약 내역</h2>
            <div className="reservation_list">
                <div className="reservation_item">
                    <div className="thumb" />
                    <div className="info">
                        <p className="title">조선왕조 이야기, 궁궐을 걷다</p>
                        <p className="date">
                            예약일: 2025.09.08 관람일: 2025.09.04(수) ~ 2025.09.28(일)
                        </p>
                        <p className="num">예약번호: 2025090801057</p>
                    </div>
                    <button className="btn_cancel" type="button">
                        예약 취소
                    </button>
                </div>

                <div className="reservation_item">
                    <div className="thumb" />
                    <div className="info">
                        <p className="title">조선왕조 이야기, 궁궐을 걷다</p>
                        <p className="date">
                            예약일: 2025.09.08 관람일: 2025.09.04(수) ~ 2025.09.28(일)
                        </p>
                        <p className="num">예약번호: 2025090801057</p>
                    </div>
                    <button className="btn_cancel" type="button">
                        예약 취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReservationSection;
