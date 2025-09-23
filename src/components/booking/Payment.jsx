import './style.scss';
import { MdOutlineCalendarMonth } from 'react-icons/md';
import { LuClock3, LuMapPin } from 'react-icons/lu';
import { IoMapOutline } from 'react-icons/io5';
import { BiCoin } from 'react-icons/bi';
import { IoIosArrowForward } from 'react-icons/io';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore, useModalStore } from '../../store';
import { useState } from 'react';
import { FaCheck } from 'react-icons/fa6';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const addBooking = useAuthStore((s) => s.addBooking);
    const { openWishModal } = useModalStore();
    const [payMethod, setPayMethod] = useState(null);
    const user = useAuthStore((s) => s.user);
    const [orderName, setOrderName] = useState('');
    const [orderTel, setOrderTel] = useState({ first: '010', middle: '', last: '' });
    const [sameAsUser, setSameAsUser] = useState(false);
    const [agreeAll, setAgreeAll] = useState(false);

    const bookingData = location.state; // SelectDate에서 전달된 payload
    if (!bookingData) {
        return (
            <section className="payment-page">
                <div className="inner">
                    <p>예약 정보가 없습니다. 다시 시도해 주세요.</p>
                </div>
            </section>
        );
    }

    const {
        item,
        selected,
        peopleCount,
        selectedCoupon,
        originalPrice,
        discountAmount,
        finalPrice,
    } = bookingData;
    const {
        theme,
        time,
        category,
        title = '상품명',
        period = '하루',
        region = '지역 정보',
        place = [],
        price = 0,
    } = item || {};

    const fromDate = selected?.from ? new Date(selected.from) : null;
    const toDate = selected?.to ? new Date(selected.to) : null;

    const fromStr = fromDate ? fromDate.toLocaleDateString() : '-';
    const toStr = toDate ? toDate.toLocaleDateString() : '-';

    const REWARD_UNIT = 2000;
    const originalReward = Math.ceil(originalPrice / REWARD_UNIT);
    const finalReward = Math.ceil(finalPrice / REWARD_UNIT);

    const handleSameAsUser = (e) => {
        const checked = e.target.checked;
        setSameAsUser(checked);

        if (checked && user) {
            setOrderName(user.name || '');
            setOrderTel({
                first: user.tel?.first || '010',
                middle: user.tel?.middle || '',
                last: user.tel?.last || '',
            });
        } else {
            setOrderName('');
            setOrderTel({ first: '010', middle: '', last: '' });
        }
    };

    const handlePay = () => {
        if (!orderName || !orderTel.middle || !orderTel.last) {
            openWishModal('예약자 정보를 모두 입력해 주세요.', { text1: '확인' });
            return;
        }
        if (!payMethod) {
            openWishModal('결제수단을 선택해 주세요.', { text1: '확인' });
            return;
        }
        if (!agreeAll) {
            openWishModal('약관에 동의해 주세요.', { text1: '확인' });
            return;
        }

        const bookingPayload = {
            ...bookingData,
            orderInfo: {
                name: orderName,
                tel: orderTel,
                email: '', // 이메일 입력값 있으면 여기 반영
            },
            payMethod,
        };

        addBooking(bookingPayload);
        openWishModal(
            '예약이 완료되었습니다.',
            { text1: '확인', text2: '예약내역 확인' },
            (btn) => {
                if (btn === '확인') navigate('/');
                else if (btn === '예약내역 확인') navigate('/mypage');
            }
        );
    };

    return (
        <section className="payment-page">
            <div className="inner">
                <article className="left">
                    <ul className="theme">
                        {theme.map((tm, i) => (
                            <li
                                key={i}
                                className={
                                    tm === '역사'
                                        ? 'history'
                                        : tm === '예술'
                                        ? 'art'
                                        : tm === '힐링'
                                        ? 'healing'
                                        : tm === '라이프'
                                        ? 'life'
                                        : tm === '융합'
                                        ? 'fusion'
                                        : tm === '만들기'
                                        ? 'making'
                                        : tm === '요리하기'
                                        ? 'cooking'
                                        : tm === '체험하기'
                                        ? 'experience'
                                        : ''
                                }
                            >
                                {tm}
                            </li>
                        ))}
                    </ul>
                    <div className="basic-info">
                        <h3>{title}</h3>
                        <ul className="details">
                            <li>
                                <i>
                                    <MdOutlineCalendarMonth />
                                </i>
                                {time}
                            </li>
                            <li>
                                <i>
                                    <LuClock3 />
                                </i>
                                {period}
                            </li>
                            <li>
                                <i>
                                    <IoMapOutline />
                                </i>
                                {region}
                            </li>
                            <li>
                                <i>
                                    <LuMapPin />
                                </i>
                                {category === 'tour' ? `${place.length}개 명소` : `${place[0]}`}
                            </li>
                            <li>
                                <i>
                                    <BiCoin />
                                </i>
                                1인 {price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                                <span> (리워드 {originalReward}p 지급)</span>
                            </li>
                        </ul>
                    </div>

                    <div className="charge-info">
                        <span>이용 예정일</span>
                        <p> {period === '하루' ? fromStr : `${fromStr} ~ ${toStr}`}</p>

                        <span>인원·수량</span>
                        <p>
                            {peopleCount}인 (이용권 {peopleCount}장){' '}
                            <em>{originalPrice.toLocaleString()}원</em>
                        </p>
                        <i className="sum">
                            총 상품 금액 <p>{originalPrice.toLocaleString()}원</p>
                        </i>
                    </div>

                    <form className="booking-info">
                        <strong>
                            예약자 정보<span>*</span>
                        </strong>
                        <div className="user">
                            <label>
                                <span>이름 *</span>
                                <input
                                    type="text"
                                    value={orderName}
                                    onChange={(e) => setOrderName(e.target.value)}
                                />
                                {/* <p>필수 입력</p> */}
                            </label>
                            <label>
                                <span>연락처 *</span>
                                <div>
                                    <select
                                        name="first"
                                        value={orderTel.first}
                                        onChange={(e) =>
                                            setOrderTel({ ...orderTel, first: e.target.value })
                                        }
                                    >
                                        <option value="010">010</option>
                                        <option value="011">011</option>
                                        <option value="012">012</option>
                                        <option value="013">013</option>
                                    </select>
                                    -
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={4}
                                        value={orderTel.middle}
                                        onChange={(e) =>
                                            setOrderTel({ ...orderTel, middle: e.target.value })
                                        }
                                    />
                                    -
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={4}
                                        value={orderTel.last}
                                        onChange={(e) =>
                                            setOrderTel({ ...orderTel, last: e.target.value })
                                        }
                                    />
                                </div>
                            </label>
                            <label>
                                <span>이메일</span>
                                <input type="text" />
                            </label>

                            <p className="currentUser">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={sameAsUser}
                                        onChange={handleSameAsUser}
                                    />
                                    주문자 정보와 동일
                                </label>
                            </p>
                        </div>

                        <div className="charge">
                            <strong>
                                결제수단<span>*</span>
                            </strong>
                            <div className="selec">
                                <li>
                                    <label>
                                        <input
                                            type="radio"
                                            name="pay"
                                            value="card"
                                            checked={payMethod === 'card'}
                                            onChange={(e) => setPayMethod(e.target.value)}
                                        />
                                        신용카드
                                    </label>
                                </li>
                                <li>
                                    <label>
                                        <input
                                            type="radio"
                                            name="pay"
                                            value="bank"
                                            checked={payMethod === 'bank'}
                                            onChange={(e) => setPayMethod(e.target.value)}
                                        />
                                        계좌이체
                                    </label>
                                </li>
                                <li>
                                    <label>
                                        <input
                                            type="radio"
                                            name="pay"
                                            value="cash"
                                            checked={payMethod === 'cash'}
                                            onChange={(e) => setPayMethod(e.target.value)}
                                        />
                                        무통장입금
                                    </label>
                                </li>
                            </div>
                        </div>
                    </form>
                </article>
                <section className="right">
                    <div className="pay-info">
                        <strong>결제 정보</strong>
                        <p>
                            판매금액 <em>{originalPrice.toLocaleString()}원</em>
                        </p>
                        <p>
                            할인금액 <em>-{discountAmount.toLocaleString()}원</em>
                        </p>
                        <p>
                            판매수량 X{peopleCount} <em>{originalPrice.toLocaleString()}원</em>
                        </p>
                    </div>
                    <div className="coupon">
                        <strong>할인쿠폰</strong>
                        <span>
                            사용 쿠폰 <p>{selectedCoupon ? '1' : '0'}장</p>
                        </span>
                        {selectedCoupon && (
                            <div className="cpbox">
                                <span>{selectedCoupon.name}</span>
                                <p>{selectedCoupon.discount.toLocaleString()}원 할인</p>
                            </div>
                        )}
                    </div>
                    <div className="total">
                        <strong>
                            최종 결제금액 <p>{finalPrice.toLocaleString()}원</p>
                        </strong>
                        <em>(리워드 {finalReward}p 적립)</em>
                    </div>
                    <div className="check">
                        <div className="all">
                            <input
                                type="checkbox"
                                checked={agreeAll}
                                onChange={(e) => setAgreeAll(e.target.checked)}
                            />{' '}
                            전체동의
                        </div>
                        <li>
                            <i>
                                <FaCheck />
                            </i>{' '}
                            취소규정 동의 (필수)
                            <IoIosArrowForward />
                        </li>
                        <li>
                            <i>
                                <FaCheck />
                            </i>{' '}
                            취소 및 환불 정책 동의 (필수)
                            <IoIosArrowForward />
                        </li>
                        <p>
                            개인정보 3자 제공 동의 안내 <IoIosArrowForward />
                        </p>
                    </div>
                    <button onClick={handlePay}>{finalPrice.toLocaleString()}원 결제하기</button>
                </section>
            </div>
        </section>
    );
};
export default Payment;
