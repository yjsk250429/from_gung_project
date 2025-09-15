import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Mainvisual = () => {
    const containerRef = useRef(null);
    const starRefs = useRef([]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // ⭐ STAR 순차 애니메이션
            const tlStar = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 100%',
                    end: 'bottom top',
                    toggleActions: 'restart reset restart reset',
                    invalidateOnRefresh: true,
                },
            });

            starRefs.current.forEach((star, i) => {
                if (!star) return;
                tlStar.fromTo(
                    star,
                    { x: 100, y: -50, scale: 0.9, opacity: 0 },
                    {
                        x: 0,
                        y: 30,
                        scale: 1.1,
                        opacity: 1,
                        duration: 1,
                        ease: 'power2.out',
                    },
                    i * 0.3
                );
            });

            // ⬆️ BOTTOM: 왼쪽→오른쪽, 아래→위 (opacity 변화 없음)
            const bottomImgs = gsap.utils.toArray('.main_bottom img');

            const tlBottom = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 100%',
                    end: 'bottom top',
                    toggleActions: 'restart reset restart reset',
                    invalidateOnRefresh: true,
                },
            });

            // 각 이미지를 순차적으로 y:40 -> 0 이동 (불투명도 변화 없음)
            bottomImgs.forEach((el, i) => {
                tlBottom.fromTo(
                    el,
                    { y: 200 }, // 살짝 아래에서 시작
                    { y: 0, duration: 0.7, ease: 'power2.out' },
                    i * 0.18 // 왼쪽부터 0.18초 간격으로 순차 실행
                );
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="mainvisual" ref={containerRef}>
            {/* STAR */}
            <div className="main_star">
                {[0, 1, 2, 3].map((n, i) => (
                    <img
                        key={i}
                        ref={(el) => (starRefs.current[i] = el)}
                        src={`/images/mainvisual/visual_star${n}.png`}
                        alt={`star-${n}`}
                    />
                ))}
            </div>

            <div className="main_bg">
                <img src="/images/mainvisual/visual_bg1.png" alt="" />
                <img src="/images/mainvisual/visual_bg2.png" alt="" />
            </div>

            <div className="main_banner">
                <div className="banner_line">
                    <img src="/images/mainvisual/visual_main1.png" alt="" />
                    <img src="/images/mainvisual/visual_main2.png" alt="" />
                </div>
                <div className="banner_image">
                    <img src="/images/mainvisual/visual_main0.png" alt="" />
                    <img src="/images/mainvisual/visual_main3.png" alt="" />
                </div>
                <div className="banner_cloud">
                    <img src="/images/mainvisual/visual_cloud1.png" alt="" />
                    <img src="/images/mainvisual/visual_cloud2.png" alt="" />
                </div>
            </div>

            <div className="main_bottom">
                <img src="/images/mainvisual/visual_bottom1.png" alt="" />
                <img src="/images/mainvisual/visual_bottom2.png" alt="" />
                <img src="/images/mainvisual/visual_bottom3.png" alt="" />
                <img src="/images/mainvisual/visual_bottom4.png" alt="" />
                <img src="/images/mainvisual/visual_bottom5.png" alt="" />
            </div>
            <div className="main_text">
                <h2>전통의 숨결을 따라,</h2>
                <h2>궁궐을 걷다</h2>
                <p>
                    Walking the Palaces,
                    <br />
                    Where Tradition Still Breathes
                </p>
                <img src="/images/mainvisual/visual_text1.png" alt="" />
            </div>
        </div>
    );
};

export default Mainvisual;
