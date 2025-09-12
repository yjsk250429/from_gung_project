import React, { useState, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TraditionClass = () => {
    const sectionRef = useRef(null);
    const topImageRef = useRef(null);
    const bottomImageRef = useRef(null);
    const topMessageRef = useRef(null);
    const bottomMessageRef = useRef(null);
    const centerImageRef = useRef(null);
    const imageRefs = useRef([]);
    const cardRefs = useRef([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useLayoutEffect(() => {
        const section = sectionRef.current;

        // 초기 위치 설정
        gsap.set(topImageRef.current, { x: 200, opacity: 0 });
        gsap.set(bottomImageRef.current, { x: -200, opacity: 0 });
        gsap.set(topMessageRef.current, { y: -300, opacity: 0 });
        gsap.set(bottomMessageRef.current, { y: 50, opacity: 0 });
        gsap.set(centerImageRef.current, { scale: 0.5, opacity: 0 });

        const entryTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 100%',
                end: 'bottom 80%',
                scrub: 0,
                markers: false,
            },
        });

        entryTimeline.to(topImageRef.current, { x: 0, opacity: 1, duration: 1 }, 0);
        entryTimeline.to(bottomImageRef.current, { x: 0, opacity: 1, duration: 1 }, 0);
        entryTimeline.to(topMessageRef.current, { y: 0, opacity: 1, duration: 1 }, 0);
        entryTimeline.to(bottomMessageRef.current, { y: 0, opacity: 1, duration: 1 }, 0.5);
        entryTimeline.to(centerImageRef.current, { scale: 1, opacity: 1, duration: 1.2 }, 0.3);

        // 스크롤 트리거 - 고정 + 이미지 변경
        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'center center', // 섹션 최상단이 뷰포트 중앙에 도달했을 때 고정 시작
            end: '+=3650', // 고정 유지할 길이 (스크롤 길이)
            pin: true,
            pinSpacing: true,
            scrub: 0.5,
            onUpdate: (self) => {
                const progress = self.progress;
                const newIndex = Math.min(Math.floor(progress * 4), 3);
                if (newIndex !== currentImageIndex) {
                    setCurrentImageIndex(newIndex);
                }
            },
        });

        // Snap to section
        ScrollTrigger.create({
            trigger: centerImageRef.current,
            start: 'center center',
            end: '+=550%',
            scrub: 0.5,
            snap: {
                snapTo: 1 / 4,
                duration: { min: 0.1, max: 0.7 }, // snap 시 속도 조정
                ease: 'power1.inOut',
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, [currentImageIndex]);

    // 이미지 전환 애니메이션
    useLayoutEffect(() => {
        imageRefs.current.forEach((img, idx) => {
            if (!img) return;
            gsap.to(img, {
                opacity: idx === currentImageIndex ? 1 : 0,
                y: idx === currentImageIndex ? 0 : 50,
                duration: 0.5,
                ease: 'power2.out',
            });
        });
    }, [currentImageIndex]);

    useLayoutEffect(() => {
        cardRefs.current.forEach((card, idx) => {
            if (!card) return;

            if (idx === currentImageIndex - 1) {
                // 등장: 아래에서 올라와서 제자리
                gsap.fromTo(
                    card,
                    {
                        y: 1000, // 아래에서 시작
                        display: 'none',
                    },
                    {
                        y: 0, // 제자리로
                        duration: 0.7,
                        ease: 'power3.out',
                        display: 'block',
                        pointerEvents: 'auto',
                    }
                );
            } else {
                // 퇴장: 위로 쭉 올라가며 사라짐
                gsap.to(card, {
                    y: -1000, // 위로 사라짐
                    duration: 0.5,
                    ease: 'power2.in',
                    pointerEvents: 'none',
                    onComplete: () => {
                        gsap.set(card, { display: 'none' });
                    },
                });
            }
        });
    }, [currentImageIndex]);

    const imageList = [
        '/images/con3_img4.png', // default
        '/images/con3_img3.png', // tea
        '/images/con3_img1.png', // hanbok
        '/images/con3_img2.png', // bibimbap
    ];

    return (
        <div className="section3-main" ref={sectionRef}>
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

            <div className="s3_bottom-image" ref={bottomImageRef}>
                <img src="/images/con3_bg2.png" alt="" />
            </div>

            <div className="s3_center-image" ref={centerImageRef}>
                {imageList.map((src, idx) => (
                    <img
                        key={idx}
                        ref={(el) => (imageRefs.current[idx] = el)}
                        src={src}
                        alt={`image-${idx}`}
                        className="main-image"
                        style={{ opacity: 0 }}
                    />
                ))}
            </div>

            {/* Cards 그대로 유지 */}
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
                        <br />
                        한 그릇에 담기는 한국의 맛.
                        <br />
                        직접 손으로 비벼며 만들어가는
                        <br />
                        과정에서 한국 음식의 멋과 정을
                        <br />
                        느껴 수 있습니다.
                    </p>
                </div>
            </div>

            <div className="s3_bottom-message" ref={bottomMessageRef}>
                <p>지금 가장 많은 이들의 사랑을 받는, 인기 클래스를 경험해보세요.</p>
            </div>
        </div>
    );
};

export default TraditionClass;
