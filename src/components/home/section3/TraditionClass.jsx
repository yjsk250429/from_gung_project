import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const PANELS = 4;
const SNAP_STEP = 1 / PANELS;

const ZOOM_RATIO = 0.22;

export default function TraditionClass() {
    const sectionRef = useRef(null);

    const topImageRef = useRef(null);
    const bottomImageRef = useRef(null);
    const topMessageRef = useRef(null);
    const bottomMessageRef = useRef(null);

    const centerImageRef = useRef(null);
    const imageRefs = useRef([]);
    const cardRefs = useRef([]);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const idxRef = useRef(0);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const section = sectionRef.current;
            const center = centerImageRef.current;

            gsap.set(topImageRef.current, { x: 200, opacity: 0 });
            gsap.set(bottomImageRef.current, { x: -200, opacity: 0 });
            gsap.set(topMessageRef.current, { y: -300, opacity: 0 });
            gsap.set(bottomMessageRef.current, { y: 50, opacity: 0 });

            gsap.set(center, { opacity: 0, scale: 1 });

            const entry = gsap.timeline({ defaults: { duration: 1 } });
            entry
                .to(topImageRef.current, { x: 0, opacity: 1 }, 0)
                .to(bottomImageRef.current, { x: 0, opacity: 1 }, 0)
                .to(topMessageRef.current, { y: 0, opacity: 1 }, 0)
                .to(bottomMessageRef.current, { y: 0, opacity: 1 }, 0.5)

                .to(center, { opacity: 1, duration: 0.8 }, 0.3);

            ScrollTrigger.create({
                id: 's3-entry',
                trigger: section,
                start: 'top 90%',
                end: 'top 60%',
                once: true,
                animation: entry,
            });

            const calcPinLen = () => window.innerHeight * (PANELS + 1.2);
            let PIN_LEN = calcPinLen();

            const pinST = ScrollTrigger.create({
                id: 's3-pin',
                trigger: section,
                start: 'center center',
                end: `+=${PIN_LEN}`,
                pin: true,
                pinSpacing: true,
                scrub: 0.6,
                anticipatePin: 1,
                onUpdate: (self) => {
                    const p = self.progress; // 0~1
                    if (p < ZOOM_RATIO) {
                        if (idxRef.current !== 0) {
                            idxRef.current = 0;
                            setCurrentImageIndex(0);
                        }
                        return;
                    }

                    const remain = (p - ZOOM_RATIO) / (1 - ZOOM_RATIO);
                    const idx = Math.min(Math.floor(remain * PANELS), PANELS - 1);
                    if (idx !== idxRef.current) {
                        idxRef.current = idx;
                        setCurrentImageIndex(idx);
                    }
                },
            });

            const firstImg = imageRefs.current[0];
            if (firstImg) {
                gsap.set(firstImg, {
                    scale: 0.5,
                    transformOrigin: '50% 50%',
                    willChange: 'transform',
                });

                const zoomTween = gsap.to(firstImg, {
                    scale: 1,
                    ease: 'none',
                    scrollTrigger: {
                        id: 's3-zoom',
                        trigger: section,
                        start: 'center center',
                        end: () => `+=${PIN_LEN * ZOOM_RATIO}`,
                        scrub: true,
                    },
                });
            }

            const snapST = ScrollTrigger.create({
                id: 's3-snap',
                trigger: section,
                start: 'top top',
                end: `+=${PIN_LEN}`,
                snap: {
                    snapTo: (v) => {
                        if (v <= ZOOM_RATIO) return ZOOM_RATIO;
                        const norm = (v - ZOOM_RATIO) / (1 - ZOOM_RATIO);
                        const snapped = Math.round(norm / SNAP_STEP) * SNAP_STEP;
                        return ZOOM_RATIO + snapped * (1 - ZOOM_RATIO);
                    },
                    duration: { min: 0.1, max: 0.5 },
                    ease: 'power1.inOut',
                },
            });

            const onResize = () => {
                PIN_LEN = calcPinLen();
                pinST.vars.end = `+=${PIN_LEN}`;
                pinST.refresh();

                const z = ScrollTrigger.getById('s3-zoom');
                if (z) {
                    z.vars.end = `+=${PIN_LEN * ZOOM_RATIO}`;
                    z.refresh();
                }

                snapST.refresh();
                ScrollTrigger.refresh();
            };
            window.addEventListener('resize', onResize);

            return () => {
                window.removeEventListener('resize', onResize);
                pinST.kill();
                snapST.kill();
                ScrollTrigger.getById('s3-entry')?.kill();
                ScrollTrigger.getById('s3-zoom')?.kill();
            };
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    useLayoutEffect(() => {
        imageRefs.current.forEach((img, i) => {
            if (!img) return;
            gsap.to(img, {
                opacity: i === currentImageIndex ? 1 : 0,
                y: i === currentImageIndex ? 0 : 50,
                duration: 0.9,
                ease: 'power2.out',
            });
        });
    }, [currentImageIndex]);

    useLayoutEffect(() => {
        cardRefs.current.forEach((card, i) => {
            if (!card) return;
            if (i === currentImageIndex - 1) {
                gsap.fromTo(
                    card,
                    { y: 2000, display: 'none' },
                    {
                        y: 0,
                        duration: 0.5,
                        ease: 'power3.out',
                        display: 'block',
                        pointerEvents: 'auto',
                    }
                );
            } else {
                gsap.to(card, {
                    y: -2100,
                    duration: 0.4,
                    ease: 'power2.in',
                    pointerEvents: 'none',
                    onComplete: () => gsap.set(card, { display: 'none' }),
                });
            }
        });
    }, [currentImageIndex]);

    const imageList = [
        '/images/con3_img4.png',
        '/images/con3_img3.png',
        '/images/con3_img1.png',
        '/images/con3_img2.png',
    ];

    return (
        <section className="section3-main" ref={sectionRef}>
            <div className="s3_main-title" ref={topMessageRef}>
                <h1>
                    Korean
                    <br />
                    Tradition Class
                </h1>
            </div>

            <div className="s3_top-image" ref={topImageRef}>
                <img src="/images/con3_bg1.png" alt="" />
            </div>

            {/* 뷰포트 크기 영역 안에서 이미지 전환 */}
            <div className="s3_center-image" ref={centerImageRef}>
                {imageList.map((src, i) => (
                    <img
                        key={i}
                        ref={(el) => (imageRefs.current[i] = el)}
                        src={src}
                        alt={`image-${i}`}
                        className="main-image"
                        style={{ opacity: i === 0 ? 1 : 0 }} // 초기는 첫 이미지 보이게
                    />
                ))}
            </div>

            {/* 카드들 (그대로) */}
            <div className="s3_card s3_card--top-right" ref={(el) => (cardRefs.current[0] = el)}>
                <div className="card-hover-image">
                    <img src="/images/con3_hover_navi.png" alt="" />
                </div>
                <div className="card-content">
                    <h3>
                        차 향에
                        <br />
                        머무는 시간
                    </h3>
                    <div className="card-tag">&lt;다도 체험&gt;</div>
                    <p>
                        온은한 차향이 번지는
                        <br />
                        마음을 가다듬는 시간.
                        <br />
                        다도의 깊 정에서선들의 예와 멋을
                        <br />
                        함께 느껴보시길 바랍니다.
                    </p>
                </div>
            </div>

            <div className="s3_card s3_card--bottom-left" ref={(el) => (cardRefs.current[1] = el)}>
                <div className="card-hover-image">
                    <img src="/images/con3_hover_navi.png" alt="" />
                </div>
                <div className="card-content">
                    <h3>
                        한국의
                        <br />
                        시간을 입다
                    </h3>
                    <div className="card-tag">&lt;한복 체험&gt;</div>
                    <p>
                        고운 색감과 우아한 곡선을 간직한
                        <br />
                        한복을 직접 입어보며,
                        <br />
                        한국의 미와 전통을 몸소 느껴보는
                        <br />
                        특별한 하루를 경험하세요.
                    </p>
                </div>
            </div>

            <div className="s3_card s3_card--bottom-right" ref={(el) => (cardRefs.current[2] = el)}>
                <div className="card-hover-image">
                    <img src="/images/con3_hover_navi.png" alt="" />
                </div>
                <div className="card-content">
                    <h3>
                        오색의 맛을
                        <br />
                        비비다
                    </h3>
                    <div className="card-tag">&lt;비빔밥 체험&gt;</div>
                    <p>
                        다섯 가지 빛깔의 재료가 어우러져
                        <br />한 그릇에 담기는 한국의 맛.
                        <br />
                        직접 손으로 비벼며 만들어가는
                        <br />
                        과정에서 한국 음식의 멋과 정을
                        <br />
                        느껴 수 있습니다.
                    </p>
                </div>
            </div>

            <div className="s3_bottom-image" ref={bottomImageRef}>
                <img src="/images/con3_bg2.png" alt="" />
            </div>

            <div className="s3_bottom-message" ref={bottomMessageRef}>
                <p>지금 가장 많은 이들의 사랑을 받는, 인기 클래스를 경험해보세요.</p>
            </div>
        </section>
    );
}
