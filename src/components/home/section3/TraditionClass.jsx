import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ScrollTrigger 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

const TraditionClass = () => {
    const sectionRef = useRef(null);
    const topImageRef = useRef(null);
    const bottomImageRef = useRef(null);
    const topMessageRef = useRef(null);
    const bottomMessageRef = useRef(null);
    const centerImageRef = useRef(null); // 현재 이미지
    const nextImageRef = useRef(null); // 전환용 보조 이미지

    const [activeImage] = useState('default');

    // 이미지 맵핑
    const imageMap = {
        default: '/images/con3_img4.png',
        tea: '/images/con3_img3.png',
        hanbok: '/images/con3_img1.png',
        bibimbap: '/images/con3_img2.png',
    };

    useEffect(() => {
        const section = sectionRef.current;
        const centerImage = centerImageRef.current;

        // 초기 위치 설정
        gsap.set(topImageRef.current, { x: 200, opacity: 0 });
        gsap.set(bottomImageRef.current, { x: -200, opacity: 0 });
        gsap.set(topMessageRef.current, { y: -300, opacity: 0 });
        gsap.set(bottomMessageRef.current, { y: 50, opacity: 0 });
        gsap.set(centerImage, { scale: 0.5, opacity: 1 });
        gsap.set(nextImageRef.current, { opacity: 0 });

        // 등장 애니메이션
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 100%',
                end: 'bottom 60%',
                scrub: 0,
                markers: false,
            },
        });

        timeline.to(topImageRef.current, { x: 0, opacity: 1, duration: 1, ease: 'power2.out' }, 0);
        timeline.to(
            bottomImageRef.current,
            { x: 0, opacity: 1, duration: 1, ease: 'power2.out' },
            0
        );
        timeline.to(
            topMessageRef.current,
            { y: 0, opacity: 1, duration: 1, ease: 'power2.out' },
            0
        );
        timeline.to(
            bottomMessageRef.current,
            { y: 0, opacity: 1, duration: 1, ease: 'power2.out' },
            0.5
        );

        // ✅ 이미지 전환 함수 (페이드인·아웃 중심)
        const fadeImage = (newSrc) => {
            const current = centerImageRef.current;
            const next = nextImageRef.current;

            next.src = newSrc;

            // 초기 상태: 새 이미지는 투명하게 대기
            gsap.set(next, { opacity: 0 });

            const tl = gsap.timeline({
                defaults: { duration: 0.8, ease: 'power4.inOut' },
                onComplete: () => {
                    // 애니메이션이 끝난 후 current에 새 이미지를 세팅
                    current.src = newSrc;
                    gsap.set(current, { opacity: 1 });
                    gsap.set(next, { opacity: 0 });
                },
            });

            // 현재 이미지는 사라짐
            tl.to(current, { opacity: 0 });

            // 새 이미지는 겹치면서 등장 (조금 빨리 시작)
            tl.to(next, { opacity: 1 }, '-=0.4');
        };

        // 섹션 전체 고정 + 이미지 애니메이션
        gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'center center',
                end: '+=1200',
                scrub: true,
                pin: true,
                markers: false,
                onUpdate: (self) => {
                    const progress = self.progress;

                    if (progress <= 0.25) {
                        const scaleProgress = progress / 0.25;
                        const currentScale = 0.5 + 0.5 * scaleProgress;
                        gsap.set(centerImage, { scale: currentScale });
                        if (centerImage.src !== window.location.origin + imageMap.default) {
                            fadeImage(imageMap.default);
                        }
                    } else if (progress > 0.25 && progress <= 0.5) {
                        gsap.set(centerImage, { scale: 1 });
                        if (centerImage.src !== window.location.origin + imageMap.tea) {
                            fadeImage(imageMap.tea);
                        }
                    } else if (progress > 0.5 && progress <= 0.75) {
                        gsap.set(centerImage, { scale: 1 });
                        if (centerImage.src !== window.location.origin + imageMap.hanbok) {
                            fadeImage(imageMap.hanbok);
                        }
                    } else if (progress > 0.75) {
                        gsap.set(centerImage, { scale: 1 });
                        if (centerImage.src !== window.location.origin + imageMap.bibimbap) {
                            fadeImage(imageMap.bibimbap);
                        }
                    }
                },
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

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
            <div className="s3_center-image" style={{ position: 'relative' }}>
                {/* 현재 이미지 */}
                <img
                    ref={centerImageRef}
                    src={imageMap[activeImage]}
                    alt="main"
                    className="main-image"
                    style={{
                        maxWidth: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                    }}
                />
                {/* 보조 이미지 (교차 전환용) */}
                <img
                    ref={nextImageRef}
                    src={imageMap[activeImage]}
                    alt="fade"
                    className="main-image"
                    style={{
                        maxWidth: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        opacity: 0,
                    }}
                />
            </div>

            {/* 카드 영역들 */}
            <div className="s3_card s3_card--top-right">
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

            <div className="s3_card s3_card--bottom-left">
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

            <div className="s3_card s3_card--bottom-right">
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
