import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ScrollTrigger 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

const TraditionClass = () => {
    const sectionRef = useRef(null);
    const topImageRef = useRef(null);
    const bottomImageRef = useRef(null);
    const cardTopRightRef = useRef(null);
    const cardBottomLeftRef = useRef(null);
    const cardBottomRightRef = useRef(null);
    const topMessageRef = useRef(null);
    const bottomMessageRef = useRef(null);
    const centerImageRef = useRef(null);

    // 중앙 이미지 상태 관리
    const [activeImage, setActiveImage] = useState('default');

    // 이미지 맵핑
    const imageMap = {
        default: '/images/con3_img4.png',
        tea: '/images/con3_img3.png', // 다도 체험 이미지
        hanbok: '/images/con3_img1.png', // 한복 체험 이미지
        bibimbap: '/images/con3_img2.png', // 비빔밥 체험 이미지
    };

    // 카드 클릭 핸들러
    const handleCardClick = (imageType) => {
        if (activeImage !== imageType) {
            // 페이드 아웃 -> 이미지 변경 -> 페이드 인 효과
            gsap.to(centerImageRef.current, {
                opacity: 0,
                duration: 0.2,
                ease: 'power2.out',
                onComplete: () => {
                    setActiveImage(imageType);
                    gsap.to(centerImageRef.current, {
                        opacity: 1,
                        duration: 0.4,
                        ease: 'power2.out',
                    });
                },
            });
        }
    };

    useEffect(() => {
        const section = sectionRef.current;

        // 초기 위치 설정 (화면 밖으로)
        gsap.set([topImageRef.current, cardTopRightRef.current], { x: 200, opacity: 0 });
        gsap.set([bottomImageRef.current, cardBottomLeftRef.current], { x: -200, opacity: 0 });
        gsap.set(cardBottomRightRef.current, { x: 200, opacity: 0 });
        gsap.set(topMessageRef.current, { y: -50, opacity: 0 });
        gsap.set(bottomMessageRef.current, { y: 50, opacity: 0 });

        // 스크롤 트리거 애니메이션 설정
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 100%',
                end: 'bottom 60%',
                scrub: 0, // 스크롤과 동기화 (1초 지연)
                markers: false, // 개발 시 true로 설정하면 마커 표시
            },
        });

        // 오른쪽에서 나타나는 요소들
        timeline
            .to(
                topImageRef.current,
                {
                    x: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'power2.out',
                },
                0
            )
            .to(
                cardTopRightRef.current,
                {
                    x: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: 'power2.out',
                },
                0
            )
            .to(
                cardBottomRightRef.current,
                {
                    x: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: 'power2.out',
                },
                0
            );

        // 왼쪽에서 나타나는 요소들
        timeline
            .to(
                bottomImageRef.current,
                {
                    x: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'power2.out',
                },
                0
            )
            .to(
                cardBottomLeftRef.current,
                {
                    x: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: 'power2.out',
                },
                0
            );

        // 상단 메시지는 위에서 아래로
        timeline.to(
            topMessageRef.current,
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power2.out',
            },
            0
        );

        // 하단 메시지는 아래에서 위로
        timeline.to(
            bottomMessageRef.current,
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power2.out',
            },
            0.5
        );

        // 컴포넌트 언마운트 시 정리
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
            <div className="s3_center-image">
                <img
                    ref={centerImageRef}
                    src={imageMap[activeImage]}
                    alt=""
                    className="main-image"
                />
            </div>

            {/* 카드 영역들 */}
            {/* 우측 상단 카드 - 차 향에 머무는 시간 */}
            <div
                className={`s3_card s3_card--top-right ${activeImage === 'tea' ? 'active' : ''}`}
                ref={cardTopRightRef}
                onMouseEnter={() => handleCardClick('tea')}
                // onMouseLeave={() => handleCardClick('default')}
                style={{ cursor: 'pointer' }}
            >
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

            {/* 좌측 하단 카드 - 한국의 시간을 입다 */}
            <div
                className={`s3_card s3_card--bottom-left ${
                    activeImage === 'hanbok' ? 'active' : ''
                }`}
                ref={cardBottomLeftRef}
                onMouseEnter={() => handleCardClick('hanbok')}
                // onMouseLeave={() => handleCardClick('default')}
                style={{ cursor: 'pointer' }}
            >
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

            {/* 우측 하단 카드 - 오색의 맛을 비비다 */}
            <div
                className={`s3_card s3_card--bottom-right ${
                    activeImage === 'bibimbap' ? 'active' : ''
                }`}
                ref={cardBottomRightRef}
                onMouseEnter={() => handleCardClick('bibimbap')}
                // onMouseLeave={() => handleCardClick('default')}
                style={{ cursor: 'pointer' }}
            >
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

            {/* 하단 메시지 */}
            <div className="s3_bottom-message" ref={bottomMessageRef}>
                <p>지금 가장 많은 이들의 사랑을 받는, 인기 클래스를 경험해보세요.</p>
            </div>
        </div>
    );
};

export default TraditionClass;
