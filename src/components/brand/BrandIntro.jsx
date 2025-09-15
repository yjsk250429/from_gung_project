import React, { useEffect, useRef, useState } from 'react';
import './style.scss';

const BrandIntro = () => {
    const inkRefs = useRef([]);
    const con2Ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        };

        // con2 스크롤 애니메이션용 옵션
        const con2ObserverOptions = {
            root: null,
            rootMargin: '-100px',
            threshold: 0.3,
        };

        // Ink 애니메이션만 유지
        const inkObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // 이미 활성화된 요소는 건너뛰기
                    if (entry.target.classList.contains('is-active')) return;

                    entry.target.classList.add('is-active');
                }
            });
        }, observerOptions);

        // con2 스크롤 애니메이션 옵저버
        const con2Observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // 한 번만 실행하고 관찰 중지
                    con2Observer.unobserve(entry.target);
                }
            });
        }, con2ObserverOptions);

        // js-ink-trigger 요소들만 찾아서 observer 등록
        const inkElements = document.querySelectorAll('.js-ink-trigger');

        inkElements.forEach((inkEl, index) => {
            inkRefs.current[index] = inkEl;
            inkObserver.observe(inkEl);
        });

        // con2 요소 observer 등록
        if (con2Ref.current) {
            con2Observer.observe(con2Ref.current);
        }

        // Cleanup
        return () => {
            inkObserver.disconnect();
            con2Observer.disconnect();
        };
    }, []);

    return (
        <div>
            <div className="intro">
                <div className="inner">
                    <div className="o-container">
                        <h1 className="c-author">
                            <img src="/images/logo_2.png" alt="로고" />
                            <div className="c-author_desc">
                                K-컬처 역사 여행 × OTT 콘텐츠 플랫폼
                            </div>
                        </h1>

                        <div className="js-ink-trigger c-transition c-transition--large c-transition--center">
                            <img
                                className="c-transition__img"
                                src="images/brand/ink_pink.png"
                                alt="물감"
                            />
                        </div>

                        <section ref={con2Ref} className={`con2 ${isVisible ? 'is-visible' : ''}`}>
                            <span>과거의 숨결과 오늘의 감각이 어우러진,</span>
                            <span>한국만의 특별한 경험을 찾고 계신가요?</span>
                            <img src="images/brand/ink_pink.png" alt="물감" />
                            <img className="flower" src="images/brand/flower.png" alt="꽃" />

                            <div
                                className="desc"
                                data-aos="fade-right"
                                data-aos-offset="300"
                                data-aos-easing="ease-in-sine"
                            >
                                <p>
                                    궁궐, 박물관, 전통 공간 속에서 한국의 이야기를 따라가며 특별한
                                    여정을 시작해 보세요.
                                </p>
                                <p>한복과 다도, 음악과 공예 같은 체험이 전통의 깊이를 느끼고,</p>
                                <p>
                                    현장에서의 감동은 OTT 콘텐츠로 이어져 언제 어디서든 한국 문화와
                                    다시 이어집니다.
                                </p>
                                <p>
                                    '궁에서 온'은 전통과 현대를 아우르는 문화융합 콘텐츠로
                                    사용자에게 특별한 경험을 제공합니다.
                                </p>
                            </div>
                        </section>

                        <section className="con3">
                            <strong>과거로의 시간여행,</strong>
                            <strong>전통의 숨결을 따라 걷다.</strong>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandIntro;
