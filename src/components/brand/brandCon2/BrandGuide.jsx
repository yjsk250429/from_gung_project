import './style.scss';
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BrandGuide = () => {
    const guideRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const el = guideRef.current;
            const q = gsap.utils.selector(el);

            const boxes = gsap.utils.toArray(q('.guideStepWrap .stepBox'));
            if (!boxes.length) return;

            const setActive = (i) => {
                boxes.forEach((b, idx) => b.classList.toggle('activeBox', idx === i));
                gsap.to(boxes, { opacity: 0.35, scale: 0.96, duration: 0.25, overwrite: 'auto' });
                gsap.to(boxes[i], { opacity: 1, scale: 1, duration: 0.35, overwrite: 'auto' });
            };
            const road = q('.bg-road')[0];
            const setRoad = (on) => road && road.classList.toggle('active', on);

            gsap.set(boxes, { opacity: 0.35, scale: 0.96 });
            setActive(0);
            setRoad(true);

            // 핀 고정 + 스텝 진행
            let lastIndex = -1;
            ScrollTrigger.create({
                trigger: el,
                start: 'top top',
                end: () => '+=' + window.innerHeight * (boxes.length - 1), // 스텝당 한 화면
                scrub: 0.5,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    // 진행도 → 인덱스 (0 ~ steps-1)
                    const idx = Math.min(
                        boxes.length - 1,
                        Math.floor(self.progress * boxes.length)
                    );
                    if (idx !== lastIndex) {
                        setActive(idx);
                        lastIndex = idx;
                    }
                },
                // 드래그/휠을 놓으면 각 스텝 지점에 착— 스냅
                snap: {
                    snapTo: (value) => Math.round(value * (boxes.length - 1)) / (boxes.length - 1),
                    duration: { min: 0.1, max: 0.4 },
                    ease: 'power1.out',
                },
                onLeave: () => setRoad(false),
                onEnterBack: () => setRoad(true),
            });
        }, guideRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="brandGuide" ref={guideRef}>
            <div className="guideTitle">
                <h3>궁에서 펼쳐지는 특별한 경험 가이드</h3>
                <h4>한눈에 따라가는 사이트 완벽 이용 안내</h4>
            </div>

            <div className="guideBg">
                <img src="/images/brand/con2_bg-road.png" alt="road" className="bg-road" />
                <span>
                    <img src="/images/brand/con2_bg-left.png" alt="bg" className="bg-left" />
                    <img src="/images/brand/con2_bg-centerL.png" alt="bg" className="bg-centerL" />
                    <img src="/images/brand/con2_bg-center.png" alt="bg" className="bg-center" />
                    <img src="/images/brand/con2_bg-centerR.png" alt="bg" className="bg-centerR" />
                    <img src="/images/brand/con2_bg-right.png" alt="bg" className="con2_bg-right" />
                </span>
            </div>

            <div className="guideStepWrap">
                <article className="Steps step01">
                    <div className="stepBox activeBox">
                        <strong>ㄱ</strong>
                        <p>투어/체험 알아보기</p>
                        <img src="/images/brand/con2_kickboard.png" alt="con2_kickboard" />
                    </div>
                </article>
                <article className="Steps step02">
                    <div className="stepBox">
                        <strong>ㄴ</strong>
                        <p>예매하기</p>
                        <img src="/images/brand/con2_kickboard.png" alt="con2_kickboard" />
                    </div>
                </article>
                <article className="Steps step03">
                    <div className="stepBox">
                        <strong>ㄷ</strong>
                        <p>체험 후 리워드 받기</p>
                        <img src="/images/brand/con2_kickboard.png" alt="con2_kickboard" />
                    </div>
                </article>
                <article className="Steps step04">
                    <div className="stepBox">
                        <strong>ㄹ</strong>
                        <p>리워드로 ott 시청</p>
                        <img src="/images/brand/con2_kickboard.png" alt="con2_kickboard" />
                    </div>
                </article>
                <article className="Steps step05">
                    <div className="stepBox">
                        <strong>ㅁ</strong>
                        <p>리뷰 작성 !</p>
                        <img src="/images/brand/con2_kickboard.png" alt="con2_kickboard" />
                    </div>
                </article>
            </div>
        </section>
    );
};

export default BrandGuide;
