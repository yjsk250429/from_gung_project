import './style.scss';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BrandGuide = () => {
    const guideRef = useRef(null);

    /**
     * A) 기존: IntersectionObserver로 섹션/배경 이미지 활성화 토글 (원래 애니메이션 유지)
     */
    useEffect(() => {
        const el = guideRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const road = el.querySelector('.bg-road');
                if (entry.isIntersecting) {
                    el.classList.add('active');
                    road?.classList.add('active');
                } else {
                    el.classList.remove('active');
                    road?.classList.remove('active');
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(el);
        return () => observer.unobserve(el);
    }, []);

    /**
     * B) 추가: GSAP ScrollTrigger로 pin + 스텝 진행(1→5), snap
     *  - 기존 클래스/스타일은 건드리지 않고 stepBox의 activeBox만 컨트롤
     */
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const el = guideRef.current;
            if (!el) return;

            const q = gsap.utils.selector(el);
            const boxes = gsap.utils.toArray(q('.guideStepWrap .stepBox'));
            if (!boxes.length) return;

            let lastIndex = -1;

            // 초기 상태 세팅 (첫 번째 강조, 나머지 살짝 축소/투명)
            const setActive = (i, direction = 1) => {
                boxes.forEach((b, idx) => b.classList.toggle('activeBox', idx === i));
                gsap.to(boxes, { opacity: 0.35, scale: 0.96, duration: 0.25, overwrite: 'auto' });
                gsap.to(boxes[i], { opacity: 1, scale: 1, duration: 0.35, overwrite: 'auto' });
              
                const img = boxes[i].querySelector('img');
                if (img) {
                  const isFirstToSecond = (lastIndex === 0 && i === 1 && direction === 1);
                  const isFifthToFourth = (lastIndex === 4 && i === 3 && direction === -1);
              
                  if (isFirstToSecond || isFifthToFourth) {
                    // ✅ 특정 구간만 애니메이션으로 반전
                    gsap.to(img, {
                      scaleX: direction === -1 ? -1 : 1,
                      duration: 0.3,
                      ease: 'power2.out',
                    });
                  } else {
                    // ✅ 나머지는 즉시 반전 (돌아가는 모션 없음)
                    gsap.set(img, {
                      scaleX: direction === -1 ? -1 : 1,
                    });
                  }
                }
              };


            gsap.set(boxes, { opacity: 0.35, scale: 0.96 });
            setActive(0, 1);

            ScrollTrigger.create({
                trigger: el,
                start: 'top top',
                end: () => '+=' + window.innerHeight * (boxes.length - 1), // 스텝당 한 화면 길이
                scrub: 0.6, // 살짝 부드럽게
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    const idx = Math.min(
                        boxes.length - 1,
                        Math.floor(self.progress * boxes.length)
                    );
                    if (idx !== lastIndex) {
                        setActive(idx, self.direction);
                        lastIndex = idx;
                    }
                },
                // 놓으면 각 스텝 경계로 스냅
                snap: {
                    snapTo: (v) => Math.round(v * (boxes.length - 1)) / (boxes.length - 1),
                    duration: { min: 0.25, max: 0.5 },
                    ease: 'power1.out',
                },
                // (선택) IO에서 하던 배경 on/off를 스크롤 경계에서도 보정하고 싶을 때:
                onEnter: () => el.querySelector('.bg-road')?.classList.add('active'),
                onLeaveBack: () => el.querySelector('.bg-road')?.classList.add('active'),
                onLeave: () => el.querySelector('.bg-road')?.classList.remove('active'),
                onEnterBack: () => el.querySelector('.bg-road')?.classList.add('active'),
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
