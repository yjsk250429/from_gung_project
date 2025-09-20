import { FiDownload } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import "./style.scss";
import { Fragment } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const Schedule = ({ thisitem }) => {
  const {
    id,
    title,
    theme = [],
    description,
    period,
    price,
    time,
    img,
    region,
    place = [],
    detailsub1,
    detailsub2,
  } = thisitem;

  const scheduleList = [
    { img: "/images/tourclass/pics.png", title: "투어 이미지 1" },
    { img: "/images/tourclass/pics.png", title: "투어 이미지 2" },
    { img: "/images/tourclass/pics.png", title: "투어 이미지 3" },
  ];

  const getDaysCount = (period) => {
    if (period === "하루") return 1;
    if (period === "1박 2일") return 2;
    if (period === "2박 3일") return 3;
    return 1; // 기본값
  };

  const daysCount = getDaysCount(period);

  // day 데이터 배열
  const daysData = [
    {
      className: "day01",
      imgSrc: "/images/tourclass/tourclassDetail_DAY01.png",
    },
    {
      className: "day02",
      imgSrc: "/images/tourclass/tourclassDetail_DAY02.png",
    },
    {
      className: "day03",
      imgSrc: "/images/tourclass/tourclassDetail_DAY03.png",
    },
  ];

  return (
    <div className="schedule">
      <div className="description">
        <h3>{description}</h3>
        <h4>
          {detailsub1}
          <br />
          {detailsub2}
        </h4>
      </div>
      <div className="pics">
        <Swiper slidesPerView="auto" grabCursor={true} className="days">
          {daysData.slice(0, daysCount).map((day, dayIdx) => (
            <SwiperSlide key={dayIdx}>
              <article className={`day ${day.className}`}>
                <strong>
                  <img src={day.imgSrc} alt="" />
                </strong>
                <ul>
                  {scheduleList.map(({ img, title }, idx) => (
                    <Fragment key={idx}>
                      <li>
                        <img src={img} alt={title} />
                        <h5>{title}</h5>
                        <p></p>
                      </li>
                      {/* 마지막 day가 아니거나, 마지막 day이지만 마지막 이미지가 아닐 때만 span 표시 */}
                      {(dayIdx !== daysCount - 1 ||
                        idx !== scheduleList.length - 1) && (
                        <span>
                          <img
                            src="/images/tourclass/tourclassDetail_dayFlower.png"
                            alt="꽃 이미지"
                          />
                        </span>
                      )}
                    </Fragment>
                  ))}
                </ul>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <p className="btns">
        <button>
          <i>
            <FaHeart />
          </i>
          투어 찜하기
        </button>
        <button>
          <i>
            <FiDownload />
          </i>
          쿠폰 받기
        </button>
      </p>
    </div>
  );
};

export default Schedule;
