import './style.scss';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BrandIntro = () => {
    const containerRef = useRef(null);
    const branchRef = useRef(null);
    const StoryLeftRef = useRef(null);

    useEffect(() => {
        if (branchRef.current) {
            gsap.to(branchRef.current, {
                rotation: 3,
                transformOrigin: '100% 5%',
                duration: 3,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
            });
        }
    }, []);

    useEffect(() => {
        if (!StoryLeftRef.current) return;

        const container = StoryLeftRef.current;
        const titles = container.querySelectorAll('.title h4');
        const paragraphs = container.querySelectorAll('.sentence p');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: 'top 80%',
                toggleActions: 'play none none reset',
                // markers: true,
            },
        });

        tl.fromTo(container, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power1.out' });

        tl.fromTo(
            titles,
            { x: -50, opacity: 0 },
            { x: 0, opacity: 1, duration: 1, ease: 'power1.out', stagger: 0.5 }
        );

        tl.fromTo(
            paragraphs,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power1.out', stagger: 0.4 }
        );
    }, []);

    return (
        <section className="brandIntro" ref={containerRef}>
            <div className="con1-section brandLogo">
                <div className="logoBox">
                    <img src="/images/logo_2.png" alt="" />
                    <h4>K-컬처 역사 여행 × OTT 콘텐츠 플랫폼</h4>
                </div>
            </div>
            <div className="con1-section brandStory">
                <div className="brandStory_left" ref={StoryLeftRef}>
                    <div className="title">
                        <h4>과거의 숨결과 오늘의 감각이 어우러진,</h4>
                        <h4>한국만의 특별한 경험을 찾고 계신가요?</h4>
                    </div>
                    <div className="sentence">
                        <p>
                            궁궐, 박물관, 전통 공간 속에서 한국의 이야기를 따라가며 특별한 여정을
                            시작해 보세요.
                        </p>
                        <p>한복과 다도, 음악과 공예 같은 체험이 전통의 깊이를 느끼고,</p>
                        <p>
                            현장에서의 감동은 OTT 콘텐츠로 이어져 언제 어디서든 한국 문화와 다시
                            이어집니다.
                        </p>
                        <p>
                            ‘궁에서 온’은 전통과 현대를 아우르는 문화융합 콘텐츠로 사용자에게 특별한
                            경험을 제공합니다.
                        </p>
                    </div>
                </div>
                <div className="brandStory_right">
                    <img src="/images/brand/flower.png" alt="flower" ref={branchRef} />
                </div>
            </div>
            <div className="con1-section brandSlogan"></div>
        </section>
    );
};

export default BrandIntro;
