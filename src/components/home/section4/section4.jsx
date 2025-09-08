import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const topItems = [
    'like never before ,',
    'unforgettable ,',
    'exclusive ,',
    'like never before ,',
    'unforgettable ,',
    'exclusive ,',
];

const bottomItems = [
    '지금까지 몰랐던 한국 , ',
    '지금 경험해보세요',
    '지금까지 몰랐던 한국',
    '지금 경험해보세요',
];

const Section4 = () => {
    const topRef = useRef(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        const animateMarquee = (element, direction = 'left', duration = 20) => {
            if (!element) return;

            // 첫 번째 li 요소들의 총 너비 계산
            const items = element.children;
            const itemCount = items.length / 2; // 복제된 것 제외한 원본 개수
            let totalWidth = 0;

            for (let i = 0; i < itemCount; i++) {
                totalWidth += items[i].offsetWidth + 60; // margin-right 포함
            }

            // 시작 위치 설정
            gsap.set(element, { x: direction === 'left' ? 0 : -totalWidth });

            // 무한 애니메이션
            gsap.to(element, {
                x: direction === 'left' ? -totalWidth : 0,
                duration: duration,
                ease: 'none',
                repeat: -1,
                onComplete: () => {
                    // 애니메이션 완료 시 위치 리셋 (seamless loop를 위해)
                    gsap.set(element, { x: direction === 'left' ? 0 : -totalWidth });
                },
            });
        };

        // 컴포넌트가 마운트된 후 약간의 지연을 두고 실행
        const timer = setTimeout(() => {
            animateMarquee(topRef.current, 'left', 25);
            animateMarquee(bottomRef.current, 'right', 30);
        }, 100);

        return () => {
            clearTimeout(timer);
            // 애니메이션 정리
            if (topRef.current) gsap.killTweensOf(topRef.current);
            if (bottomRef.current) gsap.killTweensOf(bottomRef.current);
        };
    }, []);

    return (
        <div className="section4-main">
            {/* 위쪽 텍스트 */}
            <div className="marquee-container">
                <ul className="s4_top-text" ref={topRef}>
                    {topItems.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                    {topItems.map((item, i) => (
                        <li key={`copy-${i}`}>{item}</li>
                    ))}
                </ul>
            </div>

            {/* 아래쪽 텍스트 */}
            <div className="marquee-container">
                <ul className="s4_bottom-text" ref={bottomRef}>
                    {bottomItems.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                    {bottomItems.map((item, i) => (
                        <li key={`copy-${i}`}>{item}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Section4;
