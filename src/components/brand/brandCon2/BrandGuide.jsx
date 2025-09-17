import "./style.scss";
import { useEffect, useRef } from "react";

const BrandGuide = () => {
  const guideRef = useRef(null);

  useEffect(() => {
    const el = guideRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("active");
          const img = el.querySelector(".bg-road");
          img?.classList.add("active");
        } else {
          el.classList.remove("active");
          const img = el.querySelector(".bg-road");
          img?.classList.remove("active");
        }
      },
      {
        threshold: 0.3, // 30% 보이면 트리거
      }
    );

    if (el) observer.observe(el);
    return () => el && observer.unobserve(el);
  }, []);

  return (
    <section className="brandGuide" ref={guideRef}>
      <div className="guideTitle">
        <h3>궁에서 펼쳐지는 특별한 경험 가이드</h3>
        <h4>한눈에 따라가는 사이트 완벽 이용 안내</h4>
      </div>
      <div className="guideBg">
        <img
          src="/images/brand/con2_bg-road.png"
          alt="road"
          className="bg-road"
        />
        <span>
          <img
            src="/images/brand/con2_bg-left.png"
            alt="bg"
            className="bg-left"
          />
          <img
            src="/images/brand/con2_bg-centerL.png"
            alt="bg"
            className="bg-centerL"
          />
          <img
            src="/images/brand/con2_bg-center.png"
            alt="bg"
            className="bg-center"
          />
          <img
            src="/images/brand/con2_bg-centerR.png"
            alt="bg"
            className="bg-centerR"
          />
          <img
            src="/images/brand/con2_bg-right.png"
            alt="bg"
            className="con2_bg-right"
          />
        </span>
      </div>
      <div className="guideStepWrap">
        <article className="Steps step01">
          <div className="stepBox activeBox">
            <strong>ㄱ</strong>
            <p>투어/체험 알아보기</p>
            <img src="/images/brand/con2_kickboard.png" alt="con2_kickboard" />
          </div>
        </article>
        <article className="Steps step02">
          <div className="stepBox">
            <strong>ㄴ</strong>
            <p>예매하기</p>
            <img src="/images/brand/con2_kickboard.png" alt="con2_kickboard" />
          </div>
        </article>
        <article className="Steps step03">
          <div className="stepBox">
            <strong>ㄷ</strong>
            <p>체험 후 리워드 받기</p>
            <img src="/images/brand/con2_kickboard.png" alt="con2_kickboard" />
          </div>
        </article>
        <article className="Steps step04">
          <div className="stepBox">
            <strong>ㄹ</strong>
            <p>리워드로 ott 시청</p>
            <img src="/images/brand/con2_kickboard.png" alt="con2_kickboard" />
          </div>
        </article>
        <article className="Steps step05">
          <div className="stepBox">
            <strong>ㅁ</strong>
            <p>리뷰 작성 !</p>
            <img src="/images/brand/con2_kickboard.png" alt="con2_kickboard" />
          </div>
        </article>
      </div>
    </section>
  );
};

export default BrandGuide;
