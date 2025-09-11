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
                duration: 20,
                ease: 'linear',
            });
        }
    }, []);

    return (
        <section className="ottMainCon1">
            <div className="textLoop" ref={textLoopRef}>
                <p>K-CULTURE CHRONICLES</p>
                <p>K-CULTURE CHRONICLES</p>
            </div>
            <div className="inner">
                <div className="poster pic01">
                    <img
                        className="jagae"
                        src="/images/ott/ottPoster_Jagae_1600.png"
                        alt="hoverJagaeImg"
                    />
                    <article className="posterText">
                        <h3>[드라마] 폭군의 셰프</h3>
                        <h4>이윤아, 이채민, 강한나, 최귀화</h4>
                        <img src="/images/ott/PosterTextbox_hoverImg.png" alt="hoverTextImg" />
                        <p>
                            최고의 순간 과거로 타임슬립한 셰프가 최악의 폭군이자
                            <br />
                            절대미각 소유자인 왕을 만나며 벌어지는 서바이벌 판타지 로코
                        </p>
                    </article>
                    <span className="overlay"></span>
                </div>
                <section className="ottPosters_bottom">
                    <div className="poster pic02">
                        <img
                            className="jagae"
                            src="/images/ott/ottPoster_Jagae_750x1060.png"
                            alt="hoverJagaeImg"
                        />
                        <article className="posterText">
                            <h3>[드라마] 옥씨부인전</h3>
                            <h4>임지연, 추영우, 김재원, 연우</h4>
                            <img src="/images/ott/PosterTextbox_hoverImg.png" alt="hoverTextImg" />
                            <p>
                                이름도, 신분도, 남편도 모든 것이 가짜였던 외지부 옥태영과
                                <br />
                                그녀를 지키기 위해 목숨까지 걸었던 예인 천승휘의
                                <br />
                                치열한 생존 사기극을 담은 드라마
                            </p>
                        </article>
                        <span className="overlay"></span>
                    </div>
                    <section className="ottPosters_last">
                        <div className="poster pic03">
                            <img
                                className="jagae"
                                src="/images/ott/ottPoster_Jagae_750x420.png"
                                alt="hoverJagaeImg"
                            />
                            <article className="posterText">
                                <h3>[드라마] 고려거란전쟁</h3>
                                <h4>최수종, 김동준</h4>
                                <img
                                    src="/images/ott/PosterTextbox_hoverImg.png"
                                    alt="hoverTextImg"
                                />
                                <p>
                                    고려 현종은 거란과의 전쟁에서 승리해 동아시아의 평화를 이룩하고,
                                    <br />
                                    강감찬 등 고려의 영웅들이 펼친 역사의 이야기를 담는다.
                                </p>
                            </article>
                            <span className="overlay"></span>
                        </div>
                        <div className="jagaeImg">
                            <img src="/images/ott/mainJagae.png" alt="jagae" />
                        </div>
                    </section>
                </section>
            </div>
        </section>
    );
};

export default OttMainCon1;
