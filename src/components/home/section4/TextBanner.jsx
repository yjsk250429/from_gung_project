import gsap from 'gsap';
import { useEffect, useRef } from 'react';

const topItems = ['LIKE NEVER BEFORE ,', 'UNFORGETTABLE ,', 'EXCLUSIVE ,'];

const bottomItems = ['지금까지 몰랐던 한국 , ', '지금 경험해보세요 '];

const TextBanner = () => {
    const textLeftRef = useRef(null);
    const textRightRef = useRef(null);

    useEffect(() => {
        if (textLeftRef.current) {
            gsap.set(textLeftRef.current, { xPercent: 0 });

            gsap.to(textLeftRef.current, {
                xPercent: -50,
                repeat: -1,
                duration: 15,
                ease: 'linear',
            });
        }
        if (textRightRef.current) {
            gsap.set(textRightRef.current, { xPercent: -50 });

            gsap.to(textRightRef.current, {
                xPercent: 0,
                repeat: -1,
                duration: 10,
                ease: 'linear',
            });
        }
    }, []);

    return (
        <div className="section4-main">
            {/* 위쪽 텍스트 */}
            <div className="marquee-container">
                <ul className="s4_top-text" ref={textLeftRef}>
                    {/* {topItems.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))} */}
                    <li>LIKE NEVER BEFORE UNFORGETTABLE EXCLUSIVE</li>
                    <li>LIKE NEVER BEFORE UNFORGETTABLE EXCLUSIVE</li>
                </ul>
            </div>

            {/* 아래쪽 텍스트 */}
            <div className="marquee-container">
                <ul className="s4_bottom-text" ref={textRightRef}>
                    <li>지금까지 몰랐던 한국 지금 경험해보세요</li>
                    <li>지금까지 몰랐던 한국 지금 경험해보세요</li>
                </ul>
            </div>
        </div>
    );
};

export default TextBanner;
