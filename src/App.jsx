import { useState } from 'react';
import { MyRoutes } from './routes/MyRoutes';
import IntroOverlay from './components/ui/intro/IntroOverlay';
import './styles/index.scss';

function App() {
    const [introDone, setIntroDone] = useState(false);

    return (
        <>
            {/* 라우터/레이아웃은 항상 렌더 */}
            <MyRoutes introDone={introDone} />
            {/* 인트로 오버레이: 끝나면 내려감 */}
            {!introDone && (
                <IntroOverlay
                    onFinish={() => {
                        // 오버레이 먼저 내리고
                        setIntroDone(true);
                        // 두 프레임 뒤, 전역 신호 남김 (홈에서 듣고 Mainvisual 마운트)
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                window.__INTRO_DONE__ = true;
                                window.dispatchEvent(new Event('intro:done'));
                            });
                        });
                    }}
                />
            )}
        </>
    );
}

export default App;
