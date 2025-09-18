import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { Link } from 'react-router-dom';
import tourItems from '../../../api/mainData';

// GSAP 플러그인 등록
gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin);

const BestTour = () => {
    const gridRef = useRef(null);
    const sectionRef = useRef(null);
    const extraPadding = 200;

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const grid = gridRef.current;

            // 가로 스크롤 연동
            gsap.to(grid, {
                x: () => -(grid.scrollWidth - window.innerWidth + extraPadding),
                ease: 'none',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top+=80',
                    end: () => '+=' + (grid.scrollWidth - window.innerWidth),
                    scrub: 1.5,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                },
            });

            // 드래그로 스크롤도 가능하게
            Draggable.create(grid, {
                type: 'x',
                bounds: { minX: -(grid.scrollWidth - window.innerWidth + extraPadding), maxX: 0 },
                inertia: true,
                edgeResistance: 0.85,
                dragResistance: 0.3,
                dragClickables: true,
            });

            // 텍스트 애니메이션 (위 → 아래)
            gsap.fromTo(
                '.top-text',
                { y: -150, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top bottom',
                        toggleActions: 'play none none reverse',
                    },
                }
            );

            // 텍스트 애니메이션 (아래 → 위)
            gsap.fromTo(
                '.bottom-text',
                { y: 150, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'bottom-=200 100%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
        }, sectionRef); // context는 sectionRef 하위에서만 작동

        return () => ctx.revert(); // 자동 cleanup
    }, []);

    return (
        <div className="section1-main" ref={sectionRef}>
            <div className="top-text">
                <p>A Journey Back in Time</p>
            </div>
            <div className="image-grid" ref={gridRef}>
                {tourItems.map((item, index) => (
                    <div className="image-box" key={item.id}>
                        <Link
                            to={`/tourclass/${item.id}`} // ✅ 라우트: /tourclass/:id
                            className="image-link"
                            aria-label={`${item.label} 상세보기`}
                            draggable={false}
                        >
                            <div className="top-font" data-index={index + 1}>
                                <p>{item.text}</p>
                            </div>
                            <img src={item.img} alt={item.label} draggable={false} />
                            <div className="overlay">
                                <img src="/images/con1_hover.png" alt="" className="overlay-icon" />
                                <span className="label">{item.label}</span>{' '}
                            </div>
                            {' '}
                        </Link>
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
