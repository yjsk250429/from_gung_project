import "./style.scss";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/style.css";
import { ko } from "react-day-picker/locale";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

const SelectDate = ({ thisitem }) => {
  const { id, category, period, price, quantity } = thisitem;
  const [selected, setSelected] = useState(null);

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const getPeriodDays = (period) => {
    if (period === "하루") return 0; // 당일만
    if (period === "1박 2일") return 1; // +1일
    if (period === "2박 3일") return 2; // +2일
    return 0;
  };

  const handleSelect = (date) => {
    if (!date) {
      setSelected(null);
      return;
    }

    if (
      selected &&
      selected.from &&
      date.getTime() === selected.from.getTime()
    ) {
      setSelected(null);
      return;
    }

    const daysToAdd = getPeriodDays(period);
    const from = date;
    const to = daysToAdd > 0 ? addDays(from, daysToAdd) : from;

    setSelected({ from, to });
  };

  // 인원
  const [peopleCount, setPeopleCount] = useState(quantity || 1);

  // 쿠폰적용
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const coupons = [
    {
      id: 1,
      name: "리뷰 1,000개 돌파 기념 할인",
      discount: "1,000원 할인",
    },
    {
      id: 2,
      name: "첫 구매 고객 특별 할인",
      discount: "2,000원 할인",
    },
    {
      id: 3,
      name: "신규 회원 가입 쿠폰",
      discount: "1,500원 할인",
    },
  ];

  const handleCouponSelect = (coupon) => {
    // 이미 선택된 쿠폰을 다시 클릭하면 취소
    if (selectedCoupon && coupon && selectedCoupon.id === coupon.id) {
      setSelectedCoupon(null);
    } else {
      setSelectedCoupon(coupon);
    }
    setIsOpen(false);
  };

  // 가격
  const originalPrice = price * peopleCount;

  const getDiscountAmount = (coupon) => {
    if (!coupon) return 0;
    const match = coupon.discount.match(/\d+/g);
    return match ? parseInt(match.join("")) : 0;
  };

  const discountAmount = getDiscountAmount(selectedCoupon);
  const finalPrice = Math.max(0, originalPrice - discountAmount);

  return (
    <div className="selectDate">
      <div className="selectTop">
        <article className="date-picker">
          <h3>1. 날짜 선택</h3>
          <div className="calendar">
            <DayPicker
              locale={ko}
              formatters={{
                formatCaption: (date) =>
                  format(date, "yyyy . MM", { locale: ko }),
              }}
              navLayout="around"
              showOutsideDays
              mode="single"
              selected={selected}
              onSelect={handleSelect}
              fromDate={new Date()} // 오늘부터 선택 가능
              disabled={{ before: new Date() }} // 과거 날짜 비활성화
            />

            {/* {selected && selected.from && (
              <p>
                선택한 기간: {selected.from.toLocaleDateString()} ~{" "}
                {selected.to.toLocaleDateString()}
              </p>
            )} */}
          </div>
        </article>
        <div className="selectRight">
          <article className="people-selector">
            <h3>2. 인원 선택</h3>
            <div className="people">
              <span>인원</span>
              <div className="peopleBtn">
                <button
                  className="minusBtn"
                  onClick={() =>
                    setPeopleCount((prev) => Math.max(1, prev - 1))
                  }
                >
                  <AiOutlineMinus />
                </button>
                <p>{peopleCount}</p>
                <button
                  className="plusBtn"
                  onClick={() => setPeopleCount((prev) => prev + 1)}
                >
                  <AiOutlinePlus />
                </button>
              </div>
            </div>
          </article>
          <article className="coupon-apply">
            <h3>3. 쿠폰 적용</h3>
            <div className="coupon-dropdown">
              {/* 드롭다운 버튼 */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="coupon-button"
              >
                <div className="coupon-content">
                  <span className={selectedCoupon ? "selected" : "placeholder"}>
                    {selectedCoupon
                      ? selectedCoupon.name
                      : "- - - - - 쿠폰을 선택하세요 - - - - -"}
                  </span>
                  {selectedCoupon && (
                    <span className="discount-amount">
                      {selectedCoupon.discount}
                    </span>
                  )}
                </div>
                <span className="chevron">
                  {isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                </span>
              </button>

              {/* 드롭다운 메뉴 */}
              {isOpen && (
                <div className="coupon-menu">
                  {coupons.map((coupon) => (
                    <button
                      key={coupon.id}
                      onClick={() => handleCouponSelect(coupon)}
                      className={`coupon-item ${
                        selectedCoupon && selectedCoupon.id === coupon.id
                          ? "selected"
                          : ""
                      }`}
                    >
                      <div className="coupon-item-content">
                        <span className="coupon-name">{coupon.name}</span>
                        <span className="coupon-discount">
                          {coupon.discount}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </article>
        </div>
      </div>
      <div className="selectBottom">
        <p>정가 {originalPrice.toLocaleString()}원</p>
        <strong>{finalPrice.toLocaleString()} 원</strong>
        <button>예약하기</button>
      </div>
    </div>
  );
};

export default SelectDate;
