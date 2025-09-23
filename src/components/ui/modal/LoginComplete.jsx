// src/components/ui/loginComplete/LoginComplete.jsx
import { useEffect, useState } from 'react';
import { useModalStore } from '../../../store';
import './style.scss';

const LoginComplete = () => {
    const { loginComOpen, closeLoginCom } = useModalStore();
    const [stamped, setStamped] = useState(false);

    useEffect(() => {
        if (!loginComOpen) return;

        // 초기화
        setStamped(false);

        // ❶ 약간의 텀 뒤 "찍기"
        const t1 = setTimeout(() => setStamped(true), 450);

        // ❷ 3초 후 자동 닫힘
        const t2 = setTimeout(() => closeLoginCom(), 2500);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [loginComOpen, closeLoginCom]);

    if (!loginComOpen) return null;

    return (
        <div className="modal-overlay" onClick={closeLoginCom}>
            <div
                className="modal loginComplete"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                <h3>로그인 했습니다</h3>
                <em className="subtitle">오늘 출석도장 적립 완료!</em>

                {/* 도장 영역 */}
                <div className={`stamp-wrap ${stamped ? 'is-stamped' : ''}`}>
                    {/* 기본 도장(연한 회색 인쇄) */}
                    <img
                        className="stamp stamp--base"
                        src="/images/components/stamp_default_big.png"
                        alt="출석 도장 기본"
                        draggable="false"
                    />
                    {/* 찍힌 도장(선명한 인쇄) */}
                    <img
                        className="stamp stamp--on"
                        src="/images/components/stamp_on_big.png"
                        alt="출석 도장 인쇄됨"
                        draggable="false"
                    />

                    {/* 충격파 / 번짐 링 */}
                    <span className="ring" aria-hidden="true" />
                    <span className="ink" aria-hidden="true" />
                </div>
            </div>
        </div>
    );
};

export default LoginComplete;
