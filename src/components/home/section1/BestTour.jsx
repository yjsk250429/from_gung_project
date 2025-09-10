import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import tourItems from '../../../api/mainData';

// 플러그인 등록
gsap.registerPlugin(Draggable, InertiaPlugin, ScrollTrigger);

const BestTour = () => {
    const gridRef = useRef(null);

    useEffect(() => {
        const grid = gridRef.current;

        // 세로 스크롤
        gsap.to(grid, {
            x: () => -(grid.scrollWidth - window.innerWidth + 200),
            ease: 'none',
            scrollTrigger: {
                trigger: '.section1-main',
                start: 'top+=50',
                end: () => '+=' + (grid.scrollWidth - window.innerWidth - 200),
                scrub: 2,
                pin: true,
                anticipatePin: 1,
            },
        });

        // Draggable 설정
        Draggable.create(grid, {
            type: 'x',
            bounds: { minX: -grid.scrollWidth + window.innerWidth - 200, maxX: 0 },
            inertia: true,
            throwResistance: 1000,
            edgeResistance: 0.8,
            dragResistance: 0.2,
            snap: (endValue) => Math.round(endValue / 50) * 50,
        });

        // ScrollTrigger 애니메이션: top-text (위에서 아래로)
        gsap.fromTo(
            '.top-text',
            { y: -200, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: '.section1-main',
                    start: 'top 100%',
                    end: '+=2800',
                    toggleActions: 'play reverse play reverse',
                },
            }
        );

        // ScrollTrigger 애니메이션: bottom-text (아래에서 위로)
        gsap.fromTo(
            '.bottom-text',
            { y: 200, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: '.section1-main',
                    start: 'top+=200',
                    end: 'bottom+=400 100%',
                    toggleActions: 'play reverse play reverse',
                },
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
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
                            <img src="/images/con1_hover.png" alt="icon" className="overlay-icon" />
                            <span className="label">{item.label}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="bottom-text">
                <p>역사와 문화를 가장 가까이에서 느낄 수 있는, 주목받는 인기 투어를 소개합니다.</p>
            </div>
        </div>
    );
};

export default BestTour;
