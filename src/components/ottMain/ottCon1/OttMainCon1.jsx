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

    const postersData = [
        {
            className: 'pic01',
            jagaeImg: '/images/ott/ottPoster_Jagae_1600.png',
            title: '[드라마] 폭군의 셰프',
            actor: '이윤아, 이채민, 강한나, 최귀화',
            description:
                '최고의 순간 과거로 타임슬립한 셰프가 최악의 폭군이자\n절대미각 소유자인 왕을 만나며 벌어지는 서바이벌 판타지 로코',
        },
        {
            className: 'pic02',
            jagaeImg: '/images/ott/ottPoster_Jagae_750x1060.png',
            title: '[드라마] 옥씨부인전',
            actor: '임지연, 추영우, 김재원, 연우',
            description:
                '이름도, 신분도, 남편도 모든 것이 가짜였던 외지부 옥태영과 그녀를 지키기 위해 목숨까지 걸었던 예인 천승휘의  치열한 생존 사기극을 담은 드라마',
        },
        {
            className: 'pic03',
            jagaeImg: '/images/ott/ottPoster_Jagae_750x1060.png',
            title: '[드라마] 고려거란전쟁',
            actor: '최수종, 김동준',
            description:
                '최고의 순간 과거로 타임슬립한 셰프가 최악의 폭군이자 절대미각 소유자인 왕을 만나며 벌어지는 서바이벌 판타지 로코',
        },
    ];

    return (
        <section className="ottMainCon1">
            <div className="textLoop" ref={textLoopRef}>
                <p>K-CULTURE CHRONICLES</p>
                <p>K-CULTURE CHRONICLES</p>
            </div>

            <div className="ottPosters">
                {postersData.map(({ className, jagaeImg, title, actor, description }, idx) => (
                    <div key={idx} className={`poster ${className}`}>
                        <img className="jagae" src={jagaeImg} alt="hoverJagaeImg" />
                        <article className="posterText">
                            <h3>{title}</h3>
                            <h4>{actor}</h4>
                            <img src="/images/ott/PosterTextbox_hoverImg.png" alt="hoverImg" />
                            <p>{description}</p>
                        </article>
                        <span className="overlay"></span>
                    </div>
                ))}

                <div className="jagaeImg">
                    <img src="/images/ott/mainJagae.png" alt="jagae" />
                </div>
            </div>
        </section>
    );
};

export default OttMainCon1;
