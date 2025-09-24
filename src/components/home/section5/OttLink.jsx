import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const OttLink = () => {
    const [isHovered, setIsHovered] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        const targets = section.querySelectorAll('.section5-images .image-container');

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('show'); // 들어오면 위로 채워짐
                    } else {
                        entry.target.classList.remove('show'); // 벗어나면 다시 닫힘
                    }
                });
            },
            { threshold: 0.5 }
        );

        targets.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);

    return (
        <div className={`section5-main ${isHovered ? 'hovered' : ''}`} ref={sectionRef}>
            <div className="section5-container">
                <div className="section5-content">
                    <div className="section5-text-area">
                        <h2 className="section5-main-title">
                            CONTENTS
                            <br />
                            OF K-CULTURE
                        </h2>
                        <div className="section5-subtitle">
                            <h3>전통을 잇고, 세계와 나누는 힘</h3>
                            <p>
                                한국의 궁과 박물관, 전통 공간을 무대로 한 특별한 여행.
                                <br />
                                단순한 관광을 넘어, 역사와 이야기를 체험으로 담아내고
                                <br />그 경험이 OTT 콘텐츠로 이어지는 새로운 여정을 제안합니다.
                            </p>
                        </div>
                        <div
                            className="section5-cta"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <Link to="/ottsub" className="cta-text">
                                K-컬처 OTT 콘텐츠 보기
                            </Link>
                            <div className="cta-arrow">→</div>
                        </div>
                    </div>

                    <div className="section5-images">
                        <div className="image-container image1">
                            <img src="/images/con5_img1.png" alt="Image 1" />
                        </div>
                        <div className="image-container image2">
                            <img src="/images/con5_img2.png" alt="Image 2" />
                        </div>
                        <div className="image-container image3">
                            <img src="/images/con5_img3.png" alt="Image 3" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OttLink;
