import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import tourItems from "../../../api/mainData";
import "../style.scss";

gsap.registerPlugin(Draggable);
gsap.registerPlugin(Draggable, InertiaPlugin);

const Section1 = () => {
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;

    // GSAP Draggable 설정
    Draggable.create(grid, {
       type: "x",
        bounds: { minX: -grid.scrollWidth + window.innerWidth, maxX: 0 },
        inertia: true,              
        throwResistance: 1000,      
        edgeResistance: 0.8,        
        dragResistance: 0.2,        
        snap: (endValue) => Math.round(endValue / 50) * 50, 
    });
  }, []);

  return (
    <div className="section1-main">
      <div className="top-text">
        <p>A Journey Back in Time</p>
      </div>
      <div className="image-grid" ref={gridRef}>
        {tourItems.map((item, index) => (
          <div className="image-box" key={index}>
            <img src={item.img} alt={`tour-${index}`} />
            <div className="overlay">
              <img
                src="/images/con1_hover.png"
                alt="icon"
                className="overlay-icon"
              />
              <span className="label">{item.label}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="bottom-text">
        <p>
          역사와 문화를 가장 가까이에서 느낄 수 있는, 주목받는 인기 투어를 소개합니다.
        </p>
      </div>
    </div>
  );
};

export default Section1;
