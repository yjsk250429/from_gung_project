import { Link, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import UtilBar from './UtilBar';
import { useEffect, useState } from 'react';

const Header = () => {
    const [visible, setVisible] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const path = location.pathname;
    const isLightPage =
        path.startsWith('/brand') ||
        path.startsWith('/mypage') ||
        path.startsWith('/tourclass') ||
        path.startsWith('/tourresults') ||
        path.startsWith('*');

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const onScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY <= 0) {
                // 맨 위에서는 항상 보이고 배경 없음
                setVisible(true);
            } else if (currentScrollY > lastScrollY) {
                // 스크롤 내릴 때 → 숨김
                setVisible(false);
            } else if (currentScrollY < lastScrollY) {
                // 스크롤 올릴 때 → 보임
                setVisible(true);
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        let headerOn = false;
        const onScroll = () => {
            if (!headerOn) {
                window.requestAnimationFrame(() => {
                    const y = window.scrollY;
                    // scrollY가 50 이하일 때는 배경(off) 유지
                    setScrolled(y > 200);
                    headerOn = false;
                });
                headerOn = true;
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            id="header"
            className={`${scrolled ? 'on' : ''} ${visible ? 'show' : 'hide'} ${
                isLightPage ? 'light' : ''
            }`}
        >
            <div className="inner">
                <h1>
                    <Link to="/">
                        <img src="/images/logo.png" alt="fromgung" />
                    </Link>
                </h1>
                <NavBar />
                <UtilBar />
            </div>
        </header>
    );
};

export default Header;
