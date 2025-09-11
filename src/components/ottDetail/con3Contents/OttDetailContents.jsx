import './style.scss';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import AOS from 'aos';

const OttDetailContents = () => {
    useEffect(() => {
        AOS.init({
            duration: 600, // 애니메이션 시간(ms)
            offset: 80, // 트리거 오프셋
            easing: 'ease-out',
            once: true, // 한 번만 실행
        });
    }, []);

    return (
        <section className="ottDetail">
            <div className="con3-inner">
                <div className="vod" data-aos="fade-up" data-aos-delay="150">
                    <strong>관련콘텐츠</strong>
                    <i class="line"></i>
                </div>
                <ul className="vodlist" data-aos="fade-up" data-aos-delay="350">
                    <li className="vod-img">
                        <img src="" alt="" />
                        <span>10p</span>
                    </li>
                    <li className="vod-img">
                        <img src="" alt="" />
                        <span>10p</span>
                    </li>
                    <li className="vod-img">
                        <img src="" alt="" />
                        <span>10p</span>
                    </li>
                    <li className="vod-img">
                        <img src="" alt="" />
                        <span>10p</span>
                    </li>
                    <li className="vod-img">
                        <img src="" alt="" />
                        <span>10p</span>
                    </li>
                </ul>
            </div>
        </section>
    );
};

export default OttDetailContents;
