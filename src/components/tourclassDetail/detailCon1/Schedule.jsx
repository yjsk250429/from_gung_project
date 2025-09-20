import { FiDownload } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import "./style.scss";
import { Fragment } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const Schedule = ({ thisitem }) => {
  const {
    id,
    category,
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

  // 20개 이미지 경로 배열
  const allImages = Array(20)
    .fill(null)
    .map((_, i) => `/images/tourclass/detail/pics${i + 1}.png`);

  // 배열에서 중복 없이 n개 랜덤 뽑는 함수
  const getRandomImages = (arr, n) => {
    const shuffled = arr.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  };

  const getDaysCount = (period) => {
    if (period === "하루") return 1;
    if (period === "1박 2일") return 2;
    if (period === "2박 3일") return 3;
    return 1; // 기본값
  };

  const daysCount = getDaysCount(period);

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
          {Array(daysCount)
            .fill(null)
            .map((_, dayIdx) => {
              // 동적으로 className과 imgSrc 만들기
              const dayClassName = `day0${dayIdx + 1}`;
              const dayImgSrc = `/images/tourclass/tourclassDetail_DAY0${
                dayIdx + 1
              }.png`;

              // 이미지 3개 랜덤 추출
              const dayImages =
                category === "tour"
                  ? getRandomImages(allImages, 3).map((img, idx) => ({
                      img,
                      title: `투어 이미지 ${idx + 1}`,
                    }))
                  : Array(3)
                      .fill(null)
                      .map((_, idx) => ({
                        img,
                        title: `클래스 이미지 ${idx + 1}`,
                      }));

              return (
                <SwiperSlide key={dayIdx}>
                  <article className={`day ${dayClassName}`}>
                    {/* tour일 때만 상단 이미지 보여주기 */}
                    {category === "tour" && (
                      <strong>
                        <img src={dayImgSrc} alt="" />
                      </strong>
                    )}
                    <ul>
                      {dayImages.map(({ img, title }, idx) => (
                        <Fragment key={idx}>
                          <li>
                            <img src={img} alt={title} />
                            <h5>{title}</h5>
                            <p></p>
                          </li>
                          {(dayIdx !== daysCount - 1 ||
                            idx !== dayImages.length - 1) && (
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
              );
            })}
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
