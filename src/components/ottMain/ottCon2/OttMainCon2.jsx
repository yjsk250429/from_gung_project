import './style.scss';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const OttMainCon2 = () => {
    const navigate = useNavigate();

    useEffect(() => {
        gsap.fromTo(
            '.ottMainCon2 .inner article',
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.6,
                ease: 'power2.out',
                stagger: 0.2,
                scrollTrigger: {
                    trigger: '.ottMainCon2 .inner',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                    //   markers: true,
                },
            }
        );
    }, []);

    return (
        <section className="ottMainCon2">
            <div className="inner">
                <article
                    className="con2Poster myDearest_01"
                    onClick={() => navigate('/ott/tv/206693')}
                >
                    <img src="/images/ott/main_4-1.png" alt="myDearest_poster" />
                </article>
                <article
                    className="con2Poster myDearest_02"
                    onClick={() => navigate('/ott/tv/206693')}
                >
                    <img src="/images/ott/main_4-2.png" alt="myDearest_poster" />
                </article>
                <article
                    className="con2Poster myDearest_03"
                    onClick={() => navigate('/ott/tv/206693')}
                >
                    <img src="/images/ott/main_4-3.png" alt="myDearest_poster" />
                </article>
                <article
                    className="con2Poster myDearest_04"
                    onClick={() => navigate('/ott/tv/206693')}
                >
                    <img src="/images/ott/main_4-4.png" alt="myDearest_poster" />
                </article>
                <article
                    className="con2Poster myDearest_05"
                    onClick={() => navigate('/ott/tv/206693')}
                >
                    <img src="/images/ott/main_4-5.png" alt="myDearest_poster" />
                </article>
            </div>
        </section>
    );
};

export default OttMainCon2;
