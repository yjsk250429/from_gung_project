import './style.scss';

const MyPagemain = () => {
    return (
        <div className="MyPagemain_main">
            {/* 좌측 사이드바 */}
            <aside className="mypage_sidebar">
                <div className="profile">
                    <div className="profile_img">
                        <img src="/images/common/profile_placeholder.png" alt="프로필 이미지" />
                    </div>
                    <div className="profile_info">
                        <p className="nickname">닉네임</p>
                        <p className="username">(이름)</p>
                        <button className="btn_edit">회원정보 수정 ✎</button>
                    </div>
                </div>

                <nav className="mypage_menu">
                    <button className="active">나의 예약 내역</button>
                    <button>찜 목록</button>
                    <button>투어 / 클래스</button>
                    <button>OTT</button>
                    <button>내가 쓴 리뷰</button>
                    <button>1:1 문의사항</button>
                </nav>
            </aside>

            {/* 우측 컨텐츠 */}
            <section className="mypage_content">
                {/* 상단 현황 카드 */}
                <div className="status_cards">
                    <div className="reward">
                        <p className="reward_title">리워드 현황</p>
                        <p className="reward_value">
                            <span>10</span> 전
                        </p>
                        <img className="reward_bg1" src="/images/mypage/reward1.png" alt="" />
                        <img className="reward_bg2" src="/images/mypage/reward2.png" alt="" />
                    </div>
                    <div className="coupon">
                        <p className="coupon_title">보유 쿠폰</p>
                        <p className="coupon_value">
                            <span>5</span> 장
                        </p>
                        <img className="reward_bg2" src="/images/mypage/reward2.png" alt="" />
                    </div>
                </div>

                {/* 예약 내역 */}
                <div className="reservation">
                    <h2>나의 예약 내역</h2>
                    <div className="reservation_list">
                        <div className="reservation_item">
                            <div className="thumb"></div>
                            <div className="info">
                                <p className="title">조선왕조 이야기, 궁궐을 걷다</p>
                                <p className="date">
                                    예약일: 2025.09.08 관람일: 2025.09.04(수)~2025.09.28(일)
                                </p>
                                <p className="num">예약번호: 2025090801057</p>
                            </div>
                            <button className="btn_cancel">예약 취소</button>
                        </div>

                        <div className="reservation_item">
                            <div className="thumb"></div>
                            <div className="info">
                                <p className="title">조선왕조 이야기, 궁궐을 걷다</p>
                                <p className="date">
                                    예약일: 2025.09.08 관람일: 2025.09.04(수)~2025.09.28(일)
                                </p>
                                <p className="num">예약번호: 2025090801057</p>
                            </div>
                            <button className="btn_cancel">예약 취소</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MyPagemain;
