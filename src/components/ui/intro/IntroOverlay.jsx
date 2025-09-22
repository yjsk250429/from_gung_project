import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./style.scss";

const IntroOverlay = ({ onFinish }) => {
  const rootRef = useRef(null);

  // 오직 '/'에서만 렌더/실행
  const isRoot =
    typeof window !== "undefined" && window.location.pathname === "/";

  useEffect(() => {
    if (!isRoot) return; // 홈이 아니면 아예 실행 X

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

      tl.set(".door-left", { rotateY: 0, transformOrigin: "left center" })
        .set(".door-right", { rotateY: 0, transformOrigin: "right center" })
        .to(".door-left", { rotateY: -100, duration: 1.6 }, 0.2)
        .to(".door-right", { rotateY: 100, duration: 1.6 }, 0.2)
        .to(rootRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: "power1.out",
          delay: 1.3,
        })
        .add(() => {
          const vid = rootRef.current?.querySelector("video");
          try {
            vid?.pause();
          } catch (e) {}
          onFinish?.();
        });
    }, rootRef);

    return () => ctx.revert();
  }, [isRoot, onFinish]);

  if (!isRoot) return null; // 홈이 아니면 컴포넌트 자체를 렌더하지 않음

  return (
    <div className="intro-overlay" ref={rootRef}>
      <div className="doors">
        <div className="door door-left" />
        <div className="door door-right" />
      </div>
      <video
        className="intro_video"
        src="/images/intro1-1.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
    </div>
  );
};

export default IntroOverlay;
