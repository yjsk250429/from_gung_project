import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();
    const path = location.pathname;
    const isDarkPage =
        path.startsWith('/ottmain') ||
        path.startsWith('/ott') ||
        path.startsWith('/ottsub') ||
        path.startsWith('/ottresults');
    return (
        <footer id="footer" className={isDarkPage ? 'dark' : ''}>
            <div className="footer_bg"></div>
            <div className="inner">
                <div className="top">
                    <h2>
                        <Link to="/">
                            <img src="/images/logo.png" alt="fromgung" />
                        </Link>
                    </h2>
                    <ul className="policy">
                        <li>개인정보처리방침</li>
                        <li>유튜브</li>
                        <li>인스타그램</li>
                    </ul>
                </div>
                <div className="bottom">
                    <ul className="info">
                        <li>상호. 궁에서 온</li>
                        <li>대표. 홍석균</li>
                        <li>대표번호. 1544-1234</li>
                        <li>주소. 서울 서초구 서초대로77길 41 대동2빌딩 9층 </li>
                        <li>e-mail. ghltkdlfma@ezen.co.kr</li>
                        <li>사업자 번호. 130-12-35678</li>
                    </ul>
                    <p className="copy">FromGung ⓒ All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
