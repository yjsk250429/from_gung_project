import { useEffect, useState } from 'react';
import {
    BestTour,
    Mainvisual,
    OttLink,
    PalaceVideo,
    TextBanner,
    TraditionClass,
} from '../../components/home';
import ReviewBlocks from '../../components/home/section6/ReviewBlocks';
import './style.scss';

const Home = () => {
    // App/IntroOverlay에서 인트로가 끝나면 전역 플래그 & 이벤트를 보낸다고 가정
    const [ready, setReady] = useState(!!window.__INTRO_DONE__);

    useEffect(() => {
        if (window.__INTRO_DONE__) {
            setReady(true);
            return;
        }
        const onDone = () => setReady(true);
        window.addEventListener('intro:done', onDone);

        // 안전망: 이벤트가 안 와도 잠시 뒤 자동 진행
        const fallback = setTimeout(() => setReady(true), 800);

        return () => {
            window.removeEventListener('intro:done', onDone);
            clearTimeout(fallback);
        };
    }, []);

    return (
        // ✅ 항상 존재하는 최상위 래퍼
        <main className="home">
            {/* ✅ 항상 존재하는 고정 슬롯(앵커). 조건부는 '안쪽'만 바뀜 */}
            <section
                id="mainvisual-slot"
                style={{ minHeight: '100vh', position: 'relative' }} // 레이아웃 점프 방지용(원하면 높이 조절)
            >
                {ready ? <Mainvisual key="mainvisual" /> : null}
            </section>

            <BestTour />
            <PalaceVideo />
            <TraditionClass />
            <TextBanner />
            <OttLink />
            <ReviewBlocks />
        </main>
    );
};

export default Home;
