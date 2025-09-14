import "./style.scss";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger);
CustomEase.create("sameEase", "0.25, 0.1, 0.25, 1");

const OttMainCon3 = () => {
  const LoopTopRef = useRef(null);
  useEffect(() => {
    if (LoopTopRef.current) {
      gsap.set(LoopTopRef.current, { xPercent: 0 });

      gsap.to(LoopTopRef.current, {
        xPercent: -50,
        repeat: -1,
        duration: 40,
        ease: "linear",
      });
    }
  }, []);

  const LoopBottomRef = useRef(null);
  useEffect(() => {
    if (LoopBottomRef.current) {
      gsap.set(LoopBottomRef.current, { xPercent: -50 });

      gsap.to(LoopBottomRef.current, {
        xPercent: 0,
        repeat: -1,
        duration: 40,
        ease: "linear",
      });
    }
  }, []);

  const pic04Ref = useRef(null);
  const pic05Ref = useRef(null);
  useEffect(() => {
    if (pic04Ref.current) {
      gsap.fromTo(
        pic04Ref.current,
        { x: -150, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "sameEase",
          scrollTrigger: {
            trigger: pic04Ref.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
            // markers: true,
          },
        }
      );
    }

    if (pic05Ref.current) {
      gsap.fromTo(
        pic05Ref.current,
        { x: 150, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "sameEase",
          scrollTrigger: {
            trigger: pic05Ref.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
            // markers: true,
          },
        }
      );
    }
  }, []);

  return (
    <section className="ottMainCon3">
      <div className="inner">
        <section className="ottPosters_Left">
          <div className="jagaeImg">
            <img src="/images/ott/mainJagae_flower.png" alt="jagae" />
          </div>
          <div className="poster pic04" ref={pic04Ref}>
            <img
              className="jagae"
              src="/images/ott/ottPoster_Jagae_750x420.png"
              alt="hoverJagaeImg"
            />
            <article className="posterText">
              <h3>[드라마] 환혼</h3>
              <h4>이재욱, 정소민, 황민현, 신승호, 유준상, 오나라</h4>
              <img
                src="/images/ott/PosterTextbox_hoverImg.png"
                alt="hoverTextImg"
              />
              <p>
                역사와 지도에 없는 대호국을 배경으로,
                <br />
                ‘환혼술’로 운명이 비틀린 주인공들이 성장하는 판타지 로맨스 활극
              </p>
            </article>
            <span className="overlay"></span>
          </div>
        </section>
        <div className="poster pic05" ref={pic05Ref}>
          <img
            className="jagae"
            src="/images/ott/ottPoster_Jagae_750x1060.png"
            alt="hoverJagaeImg"
          />
          <article className="posterText">
            <h3>[영화] 노량: 죽음의 바다</h3>
            <h4>김윤석, 백윤식, 정재영, 허준호, 김성규, 이규형</h4>
            <img
              src="/images/ott/PosterTextbox_hoverImg.png"
              alt="hoverTextImg"
            />
            <p>
              조선을 지키는 불굴의 명장이 일본과의 해상 전쟁을 끝내기 위해
              <br />
              명나라 함대와 위험한 공조를 시작한다.
              <br />
              역사에 길이 남을 마지막 전투의 막이 오른다.
            </p>
          </article>
          <span className="overlay"></span>
        </div>
      </div>

      <div className="textLoop_Top" ref={LoopTopRef}>
        <p>STEP INTO KOREA'S TIMELESS JOURNEY</p>
        <p>STEP INTO KOREA'S TIMELESS JOURNEY</p>
      </div>
      <div className="textLoop_Bottom" ref={LoopBottomRef}>
        <p>시간을 넘어 한국의 여정 속으로</p>
        <p>시간을 넘어 한국의 여정 속으로</p>
      </div>
    </section>
  );
};

export default OttMainCon3;
