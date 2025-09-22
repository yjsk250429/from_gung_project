import './style.scss';
import { MdOutlineCalendarMonth } from 'react-icons/md';
import { LuClock3, LuMapPin } from 'react-icons/lu';
import { IoMapOutline } from 'react-icons/io5';
import { BiCoin } from 'react-icons/bi';

const Payment = () => {
    return (
        <section className="payment-page">
            <div className="inner">
                <article className="left">
                    <ul className="theme">
                        {/* {theme.map((tm, i) => (
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
                        ))} */}
                    </ul>
                    <div className="basic-info">
                        <h3>경복궁 달빛기행</h3>
                        <ul className="details">
                            <li>
                                <i>
                                    <MdOutlineCalendarMonth />
                                </i>
                                상시예약
                            </li>
                            <li>
                                <i>
                                    <LuClock3 />
                                </i>
                                1박2일
                            </li>
                            <li>
                                <i>
                                    <IoMapOutline />
                                </i>
                                서울시 종로구
                            </li>
                            <li>
                                <i>
                                    <LuMapPin />
                                </i>
                                {/* {category === 'tour' ? `${place.length}개 명소` : `${place[0]}`} */}
                                6개명소
                            </li>
                            <li>
                                <i>
                                    <BiCoin />
                                </i>
                                1인
                                {/* {price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} */}
                                10,000원
                                <span>(리워드 10p 지급)</span>
                            </li>
                        </ul>
                    </div>

                    <div className="charge-info">
                        <span>이용 예정일</span>
                        <p>2025.09.08(월)</p>

                        <span>인원·수량</span>
                        <p>
                            1인 (이용권 1장) <em>54,000원</em>
                        </p>
                        <i className="sum">
                            총 상품 금액 <p>54,000원</p>
                        </i>
                    </div>

                    <div className="booking-info">
                        <strong>
                            예약자 정보<span>*</span>
                        </strong>
                        <div className="txtbox tb1">
                            <p>이름</p>
                            <input type="textbox" />
                            <i>이름을 입력해주세요.</i>
                        </div>
                        <div className="txtbox tb2">
                            <p>전화번호 </p>
                            <input type="textbox" />
                            <i>전화번호를 입력해주세요.</i>
                        </div>
                        <div className="txtbox tb3">
                            <p>이메일 </p>
                            <input type="textbox" />
                            <i>이메일을 입력해주세요.</i>
                        </div>

                        <div className="charge">
                            <strong>
                                결제수단<span>*</span>
                            </strong>
                            <div className="selec">
                                <li>
                                    <input type="radio" />
                                    신용카드
                                </li>
                                <li>
                                    <input type="radio" />
                                    계좌이체
                                </li>
                                <li>
                                    <input type="radio" />
                                    무통장입금
                                </li>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </section>
    );
};
export default Payment;
