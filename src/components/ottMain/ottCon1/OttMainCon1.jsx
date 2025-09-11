import './style.scss';
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const OttMainCon1 = () => {
    const textLoopRef = useRef(null);

    useEffect(() => {
        if (textLoopRef.current) {
            gsap.set(textLoopRef.current, { xPercent: 0 });

            gsap.to(textLoopRef.current, {
                xPercent: -50,
                repeat: -1,
                duration: 10,
                ease: 'linear',
            });
        }
    }, []);

    return (
        <section className="OttMainCon1">
            <div className="TextLoop" ref={textLoopRef}>
                <p>K-CULTURE CHRONICLES</p>
                <p>K-CULTURE CHRONICLES</p>
            </div>
        </section>
    );
};

export default OttMainCon1;
