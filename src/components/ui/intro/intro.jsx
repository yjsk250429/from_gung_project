import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import "./style.scss";

const Intro = () => {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 왼쪽/오른쪽 문 애니메이션
      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

      tl.set(".door-left",  { rotateY: 0, transformOrigin: "left center"  })
        .set(".door-right", { rotateY: 0, transformOrigin: "right center" })
        .to(".door-left",  { rotateY: -100, duration: 1.6 }, 0.2)
        .to(".door-right", { rotateY:  100, duration: 1.6 }, 0.2)
        // 문이 열리면서 살짝 어둠 → 사라짐
        .to(".intro", { opacity: 0, duration: 0.5, ease: "power1.out" }, ">-0.1")
        .add(() => {

          const params = new URLSearchParams(location.search);
          const to = params.get("from") || "/home";
          navigate(to, { replace: true });
        });
    }, rootRef);

    return () => ctx.revert();
  }, [navigate, location.search]);

  return (
    <div className="intro" ref={rootRef}>
      <div className="doors">
        <div className="door door-left" />
        <div className="door door-right" />
      </div>
    </div>
  );
};

export default Intro;
