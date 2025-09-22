import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import './style.scss';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  // 라우트 변경 시 맨 위로
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 클릭 시 맨 위로
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`topBtn ${visible ? "show" : ""}`}
      onClick={handleClick}
    >
      <img src="/images/home/topbutton-01.png" alt="left" />
      <img src="/images/home/topbutton-02.png" alt="right" />
      <img src="/images/home/topbutton-03.png" alt="arrow" />
    </div>
  );
};

export default ScrollToTop;
