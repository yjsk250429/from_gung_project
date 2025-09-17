import "./style.scss";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BrandQuestion = () => {
  const questionRef = useRef(null);

  useEffect(() => {
    if (questionRef.current) {
      const title = questionRef.current.querySelector("h3");
      const paragraphs =
        questionRef.current.querySelectorAll(".con3Sentence p");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: questionRef.current,
          start: "top 80%",
          toggleActions: "play none none reset",
          //   markers: true,
        },
      });

      tl.fromTo(
        title,
        { y: -30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 2,
          ease: "power1.out",
          stagger: 0.5,
        }
      );

      tl.fromTo(
        paragraphs,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power1.out",
          stagger: 0.2,
        },
        0.6
      );
    }
  }, []);

  return (
    <section className="brandQuestion" ref={questionRef}>
      <h3>리워드, 적립과 사용은 어떻게 하나요 ?</h3>
      <div className="con3Sentence">
        <p>결제하신 금액 2,000원마다 리워드 1전이 적립되고</p>
        <p>적립된 리워드는 OTT 콘텐츠 시청 시 사용할 수 있어요</p>
        <p>
          한국 전통 체험 후, 관련된 OTT 콘텐츠까지 리워드로 무료 시청해보세요!
        </p>
        <p>한국의 멋을 더 가까이, 즐거움은 더욱 풍성하게</p>
      </div>
      <img src="/images/brand/con3_img.png" alt="" />
    </section>
  );
};

export default BrandQuestion;
