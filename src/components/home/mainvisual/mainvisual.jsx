import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Button from '../../ui/button/Button';

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
                repeat: -1,
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

            // ⬆️ BOTTOM: 왼쪽→오른쪽, 아래→위
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

            bottomImgs.forEach((el, i) => {
                tlBottom.fromTo(
                    el,
                    { y: 200 },
                    { y: 0, duration: 0.7, ease: 'power2.out' },
                    i * 0.18
                );
            });

            const SPEED = 0.4;
            gsap.set('.main_bg img', { willChange: 'transform' });
            gsap.to('.main_bg img', {
                y: (i) => (i % 2 === 0 ? 14 : 22),
                duration: (i) => (i % 2 === 0 ? 3.6 : 4.2) * SPEED,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
                force3D: true,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 100%',
                    end: 'bottom top',
                    toggleActions: 'play pause resume pause',
                },
                delay: (i) => i * 0.2,
            });

            // ===== main_banner: 인트로 + 플로팅 =====
            gsap.set(['.banner_line img', '.banner_image img'], {
                transformOrigin: '50% 50%',
                willChange: 'transform',
            });

            const floatLine = gsap.to('.banner_line img', {
                y: 10,
                rotation: 3,
                duration: 15,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
                paused: true,
            });

            const floatImage = gsap.to('.banner_image img', {
                y: 12,
                duration: 4.6,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
                paused: true,
                stagger: { each: 0.15 },
            });

            const tlBanner = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 100%',
                    end: 'bottom top',
                    toggleActions: 'restart reset restart reset',
                    invalidateOnRefresh: true,
                    onLeaveBack: () => {
                        floatLine.pause(0);
                        floatImage.pause(0);
                    },
                },
            });

            tlBanner.fromTo(
                '.banner_line img',
                { scale: 0.1, rotation: 0 },
                { scale: 1, rotation: 360, duration: 0.5, ease: 'power3.out' }
            );

            tlBanner.fromTo(
                '.banner_image img',
                { scale: 0.001, y: 20 },
                { scale: 1, y: 0, duration: 0.9, ease: 'back.out(1.6)', stagger: 0.15 },
                '-=0.3'
            );

            tlBanner.add(() => {
                floatLine.play();
                floatImage.play();
            });

            // ☁️ 구름 둥실둥실 효과 (각각 다르게)
            const SPEED1 = 0.8;
            gsap.utils.toArray('.banner_cloud img').forEach((cloud, i) => {
                gsap.to(cloud, {
                    x: i % 2 === 0 ? 25 : -25,

                    duration: (i) => (i % 2 === 0 ? 3.6 : 4.2) * SPEED1,
                    ease: 'sine.inOut',
                    repeat: -1,
                    yoyo: true,
                    delay: i * 0.3,
                });
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
                        // ref={(el) => (starRefs.current[i] = el)}
                        src={`/images/mainvisual/visual_star${n}.png`}
                        alt={`star-${n}`}
                    />
                ))}
            </div>

            <div className="main_bg">
                <img src="/images/mainvisual/visual_bg1.png" alt="bg" />
                <img src="/images/mainvisual/visual_bg2.png" alt="bg" />
            </div>

            <div className="main_banner">
                <div className="banner_line">
                    {/* <img src="/images/mainvisual/visual_main1.png" alt="" /> */}
                    <img src="/images/mainvisual/visual_main4.png" alt="line" />
                </div>
                <div className="banner_image">
                    <img src="/images/mainvisual/visual_main0.png" alt="image" />
                    <img src="/images/mainvisual/visual_main3.png" alt="image" />
                </div>
                <div className="banner_cloud">
                    <img src="/images/mainvisual/visual_cloud1.png" alt="cloud" />
                    <img src="/images/mainvisual/visual_cloud2.png" alt="cloud" />
                </div>
            </div>

            <div className="main_bottom">
                <img src="/images/mainvisual/visual_bottom1.png" alt="bottom" />
                <img src="/images/mainvisual/visual_bottom2.png" alt="bottom" />
                <img src="/images/mainvisual/visual_bottom3.png" alt="bottom" />
                <img src="/images/mainvisual/visual_bottom4.png" alt="bottom" />
                <img src="/images/mainvisual/visual_bottom5.png" alt="bottom" />
            </div>
            <div className="main_text">
                <h2>전통의 숨결을 따라,</h2>
                <h2>궁궐을 걷다</h2>
                <p>
                    Walking the Palaces,
                    <br />
                    Where Tradition Still Breathes
                </p>
                <img src="/images/mainvisual/visual_text1.png" alt="text" />
            </div>
            <Button text="더보기" className="default" />
        </div>
    );
};

export default Mainvisual;
