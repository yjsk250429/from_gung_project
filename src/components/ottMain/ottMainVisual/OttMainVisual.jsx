import Button from '../../ui/button/Button';
import './style.scss';

const OttMainVisual = () => {
    return (
        <section>
            <div>
                <Button text="콘텐츠 전체보기" className="medium" />
                <strong>{/* 마우스 휠 */}</strong>
                <p>{/* 그라데이션 */}</p>
            </div>
            <video src="/images/ott/OTTmain_VisualVideo.mp4" autoPlay muted loop playsInline />
        </section>
    );
};

export default OttMainVisual;
