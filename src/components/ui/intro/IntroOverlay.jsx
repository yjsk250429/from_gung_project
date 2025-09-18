import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './style.scss';

const IntroOverlay = ({ onFinish }) => {
    const rootRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

            tl.set('.door-left', { rotateY: 0, transformOrigin: 'left center' })
                .set('.door-right', { rotateY: 0, transformOrigin: 'right center' })
                .to('.door-left', { rotateY: -100, duration: 1.6 }, 0.2)
                .to('.door-right', { rotateY: 100, duration: 1.6 }, 0.2)
                .to(rootRef.current, { opacity: 0, duration: 0.5, ease: 'power1.out', delay: 1.3 })
                .add(() => {
                    // 비디오 쓰면 GPU 점유 끊기
                    const vid = rootRef.current?.querySelector('video');
                    try {
                        vid?.pause();
                    } catch (e) {}
                    // ✅ 오버레이만 내리고 App이 2-RAF 뒤 'intro:done'을 보냄
                    onFinish?.();
                });
        }, rootRef);

        return () => ctx.revert();
    }, [onFinish]);

    return (
        <div className="intro-overlay" ref={rootRef}>
            <div className="doors">
                <div className="door door-left" />
                <div className="door door-right" />
            </div>
            <video
                className="intro_video"
                src="/images/intro2.mov"
                autoPlay
                muted
                loop
                playsInline
            />
        </div>
    );
};

export default IntroOverlay;
