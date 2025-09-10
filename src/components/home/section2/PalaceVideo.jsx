import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const items = [
    '경복궁',
    '창경궁',
    '윤현궁',
    '경희궁',
    '덕수궁',
    '국립중앙박물관',
    '국악박물관',
    '대한민국역사박물관',
    '서대문구국립민속박물관',
    '어린이박물관',
    '국립민속박물관',
    '청계천박물관',
    '한양도성박물관',
    '올림픽공원한성백제박물관',
    '북촌한옥마을',
];

const PalaceVideo = () => {
    const listRef = useRef(null);

    useEffect(() => {
        const list = listRef.current;
        const width = list.scrollWidth / 2;

        gsap.to(list, {
            x: -width, // 왼쪽으로 이동
            duration: 50, // 속도 조절 (커질수록 느려짐)
            ease: 'none',
            repeat: -1, // 무한 반복
        });
    }, []);

    return (
        <div className="section2-main">
            <div className="video">
                <video src="/images/con2_video1.mp4" autoPlay muted loop></video>
            </div>
            <div className="s2_middle-text">
                {/* <img src="/images/con2_text.png" alt="" /> */}
                <em>"한국 문화의 새로운 경험"</em>
                <h3>
                    여행하고,
                    <br />
                    <span>기록하고</span>
                    <span>이어보다</span>
                </h3>
            </div>
            <ul className="s2_bottom-text" ref={listRef}>
                {items.map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
                {items.map((item, i) => (
                    <li key={`copy-${i}`}>{item}</li>
                ))}
            </ul>
        </div>
    );
};
export default PalaceVideo;
