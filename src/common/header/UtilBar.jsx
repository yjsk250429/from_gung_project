import { TbSearch } from 'react-icons/tb';
import { useAuthStore, useModalStore } from '../../store';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

const UtilBar = () => {
    const { openLogin, openJoin, openReward, closeReward, openLogoutCom } = useModalStore();
    const navigate = useNavigate();
    const location = useLocation();
    const authed = useAuthStore((s) => s.authed);
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);
    const [searchOn, setSearchOn] = useState(false);
    const [q, setQ] = useState('');
    const formRef = useRef(null);
    const inputRef = useRef(null);
    const protectedPaths = ['/mypage'];

    const onLogout = () => {
        logout();
        openLogoutCom();
        if (protectedPaths.some((path) => location.pathname.startsWith(path))) {
            navigate('/');
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (formRef.current && !formRef.current.contains(e.target)) {
                setSearchOn(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (searchOn && inputRef.current) inputRef.current.focus();
    }, [searchOn]);
    const onSubmit = (e) => {
        e.preventDefault();
        const keyword = q.trim();
        navigate(`/tourresults${keyword ? `?q=${encodeURIComponent(keyword)}` : ''}`);
        setSearchOn(false);
        setQ('');
        setSearchOn(false);
    };
    return (
        <div className="util">
            <form ref={formRef} className={searchOn ? 'on' : ''} onSubmit={onSubmit}>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder=""
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onFocus={() => setSearchOn(true)}
                />
                <button type="submit" className="search-btn" aria-label="검색">
                    <i>
                        <TbSearch />
                    </i>
                </button>
            </form>
            <ul className="mymenu">
                {authed ? (
                    <>
                        <li onClick={onLogout}>로그아웃</li>
                        <li>
                            <Link to="/mypage">마이페이지</Link>
                        </li>
                    </>
                ) : (
                    <>
                        <li onClick={openLogin}>로그인</li>
                        <li onClick={openJoin}>회원가입</li>
                    </>
                )}
            </ul>
            <ul className="reward" onMouseEnter={openReward} onMouseLeave={closeReward}>
                <li>
                    <img src="/images/coin_w.png" alt="coin" />
                    {user?.reward || 0}
                </li>
                <li>
                    <img src="/images/calendar_w.png" alt="calendar" />{user?.attandance?.length || 0}
                </li>
            </ul>
        </div>
    );
};

export default UtilBar;
