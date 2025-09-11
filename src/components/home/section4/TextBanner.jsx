import gsap from 'gsap';
import { useEffect } from 'react';

const topItems = ['LIKE NEVER BEFORE ,', 'UNFORGETTABLE ,', 'EXCLUSIVE ,'];

const bottomItems = ['지금까지 몰랐던 한국 , ', '지금 경험해보세요 '];

gsap.set('.s4_top-text', { xPercent: -50 });

const TextBanner = () => {
    useEffect(() => {
        gsap.set('.s4_top-text', { xPercent: 0 });

        gsap.to('.s4_top-text', {
            x: '-50%',
            repeat: -1, // 무한 반복으로 수정
            duration: 1,
            ease: 'linear',
        });
    }, []);

    return (
        <div className="section4-main">
            {/* 위쪽 텍스트 */}
            <div className="marquee-container">
                <ul className="s4_top-text">
                    {/* {topItems.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))} */}
                    <li>LIKE NEVER BEFORE UNFORGETTABLE EXCLUSIVE</li>
                    <li>LIKE NEVER BEFORE UNFORGETTABLE EXCLUSIVE</li>
                    <li>LIKE NEVER BEFORE UNFORGETTABLE EXCLUSIVE</li>
                    <li>LIKE NEVER BEFORE UNFORGETTABLE EXCLUSIVE</li>
                    <li>LIKE NEVER BEFORE UNFORGETTABLE EXCLUSIVE</li>
                </ul>
            </div>

            {/* 아래쪽 텍스트 */}
            <div className="marquee-container">
                <ul className="s4_bottom-text">
                    {bottomItems.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TextBanner;
