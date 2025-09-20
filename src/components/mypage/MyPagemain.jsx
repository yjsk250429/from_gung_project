import { useState } from 'react';
import './style.scss';
import ReservationSection from './sections/ReservationSection.jsx';
import WishlistSection from './sections/WishlistSection.jsx';
import ReviewSection from './sections/ReviewSection.jsx';
import InquirySection from './sections/InquirySection.jsx';
import { useAuthStore, useModalStore } from '../../store/index.js';
import WithdrawComplete from '../ui/modal/WithdrawComplete.jsx';
import WithdrawConfirm from '../ui/modal/WithdrawConfirm.jsx';

const MyPagemain = () => {
    const { openEditInfo, openWithdrawConfirm } = useModalStore();
    const [activeMenu, setActiveMenu] = useState('reservation');
    const isWishlistOpen = activeMenu === 'wishlist';
    const user = useAuthStore((s) => s.user);
    return (
        <div className="MyPagemain_main">
            <div className="inner">
                <aside className="mypage_sidebar">
                    <div className="profile">
                        <div className="profile_img">
                            <img
                                src={user?.profile || '/images/common/profile_placeholder.png'}
                                alt="프로필 이미지"
                            />
                        </div>
                        <div className="profile_info">
                            <p className="nickname">{user?.nickName || '닉네임'}</p>
                            <p className="username">({user?.name || '이름'})</p>
                            <button className="btn_edit" type="button" onClick={openEditInfo}>
                                <span>회원정보 수정</span>
                                <img src="/images/mypage/pen.png" alt="" />
                            </button>
                        </div>
                    </div>

                    <nav className="mypage_menu">
                        <button
                            type="button"
                            className={activeMenu === 'reservation' ? 'active' : ''}
                            onClick={() => setActiveMenu('reservation')}
                        >
                            나의 예약 내역
                        </button>

                        {/* 찜 목록 (서브메뉴 토글 트리거) */}
                        <button
                            type="button"
                            className={isWishlistOpen ? 'active' : ''}
                            onClick={() => setActiveMenu('wishlist')}
                            aria-expanded={isWishlistOpen}
                            aria-controls="wishlist-submenu"
                        >
                            찜 목록
                        </button>

                        {/* 찜 목록 클릭 시에만 나타나는 서브 메뉴 */}
                        {isWishlistOpen && (
                            <div id="wishlist-submenu" className="submenu">
                                <button type="button" className="sub">
                                    투어 / 클래스
                                </button>
                                <button type="button" className="sub">
                                    OTT
                                </button>
                            </div>
                        )}

                        <button
                            type="button"
                            className={activeMenu === 'review' ? 'active' : ''}
                            onClick={() => setActiveMenu('review')}
                        >
                            내가 쓴 리뷰
                        </button>

                        <button
                            type="button"
                            className={activeMenu === 'inquiry' ? 'active' : ''}
                            onClick={() => setActiveMenu('inquiry')}
                        >
                            1:1 문의사항
                        </button>
                    </nav>
                    <p className="deleteAccount" onClick={openWithdrawConfirm}>
                        회원탈퇴
                    </p>
                </aside>

                {/* 우측 컨텐츠 */}
                <section className="mypage_content">
                    <div className="status_cards">
                        <div className="reward">
                            <p className="reward_title">리워드 현황</p>
                            <p className="reward_value">
                                <span>{user?.reward ?? 0}</span> 전
                            </p>
                            <img className="reward_bg1" src="/images/mypage/reward1.png" alt="" />
                            <img className="reward_bg2" src="/images/mypage/reward2.png" alt="" />
                        </div>
                        <div className="coupon">
                            <p className="coupon_title">보유 쿠폰</p>
                            <p className="coupon_value">
                                <span>{user?.coupon ?? 0}</span> 장
                            </p>
                            <img className="reward_bg2" src="/images/mypage/reward2.png" alt="" />
                        </div>
                    </div>

                    {activeMenu === 'reservation' && <ReservationSection />}
                    {activeMenu === 'wishlist' && <WishlistSection />}
                    {activeMenu === 'review' && <ReviewSection />}
                    {activeMenu === 'inquiry' && <InquirySection />}
                </section>
            </div>
            <WithdrawConfirm />
            <WithdrawComplete />
        </div>
    );
};

export default MyPagemain;
