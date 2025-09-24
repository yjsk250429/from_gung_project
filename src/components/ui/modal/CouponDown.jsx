import { LuDownload } from 'react-icons/lu';
import { IoClose } from 'react-icons/io5';
import './style.scss';
import { useAuthStore, useModalStore } from '../../../store';

const CouponDown = () => {
    const { couponOpen, closeCoupon } = useModalStore();
    const addCoupon = useAuthStore((s) => s.addCoupon);
    const user = useAuthStore((s) => s.user);

    if (!couponOpen) return null;

    const couponInfo = {
        id: 'review1000',
        name: '리뷰 1,000개 돌파 기념 할인',
        discount: 1000,
    };

    const coupons = Array.isArray(user?.coupon) ? user.coupon : [];
    const alreadyHas = coupons.some((c) => c.id === couponInfo.id);

    const handleGetCoupon = () => {
        if (alreadyHas) return;
        addCoupon(couponInfo);
        // closeCoupon();
    };

    return (
        <div className="modal-overlay">
            <div className="modal coupon">
                <i className="close" onClick={closeCoupon}>
                    <IoClose />
                </i>
                <div className="box">
                    <div className="left">
                        <em>1,000원 할인</em>
                        <strong style={{ textDecoration: alreadyHas ? 'line-through' : '' }}>
                            리뷰 1,000개 돌파 기념 할인
                        </strong>
                        {alreadyHas && <p className="alreadyHas">쿠폰 다운 완료!</p>}
                        <span>2025.10.31 23:58까지 다운로드 가능</span>
                        <span>경복궁 달빛기행 투어 한정, 동반 3인까지 적용 가능</span>
                    </div>
                    <div
                        className={`right ${alreadyHas ? 'disabled' : ''}`}
                        onClick={handleGetCoupon}
                    >
                        <i>
                            <LuDownload />
                        </i>
                    </div>
                </div>
                <ul>
                    <li>일부 쿠폰은 정해진 수량에 따라 조기 소진될 수 있습니다.</li>
                    <li>일부 상품의 경우 쿠폰 사용이 어려울 수 있습니다.</li>
                </ul>
                {/* <p className="btns">
                <Button text="쿠폰 전체 받기" className='default main1' onClick={handleGetCoupon}/>
            </p> */}
            </div>
        </div>
    );
};

export default CouponDown;
