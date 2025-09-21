import { LuDownload } from 'react-icons/lu';
import Button from '../button/Button';
import { IoClose } from 'react-icons/io5';
import './style.scss';

const CouponDown = () => {
    return (
        <div className="modal-overlay">
            <div className="modal coupon">
                <i>
                    <IoClose />
                </i>
                <div className="left">
                    <em>1,000원 할인</em>
                    <strong>리뷰 1,000개 돌파 기념 할인</strong>
                    <span>2025.10.31 23:58까지 다운로드 가능</span>
                    <span>경복궁 달빛기행 투어 한정, 동반 3인까지 적용 가능</span>
                </div>
                <div className="right">
                    <i>
                        <LuDownload />
                    </i>
                </div>
            </div>
            <ul>
                <li>일부 쿠폰은 정해진 수량에 따라 조기 소진될 수 있습니다.</li>
                <li>일부 상품의 경우 쿠폰 사용이 어려울 수 있습니다.</li>
            </ul>
            <p className="btn">
                <Button text="쿠폰 받기" />
            </p>
        </div>
    );
};

export default CouponDown;
