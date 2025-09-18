import { TbSearch } from "react-icons/tb";
import { useAuthStore, useModalStore } from "../../store";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const UtilBar = () => {
    const { openLogin, openJoin, openReward, closeReward, openLogoutCom} = useModalStore();
    const navigate = useNavigate();
    const location = useLocation();
    const authed = useAuthStore((s) => s.authed);
    const logout = useAuthStore((s) => s.logout);
    const [searchOn, setSearchOn] = useState(false);
    const formRef = useRef(null);
    const protectedPaths = ["/mypage",];
    const onLogout = ()=>{
      logout();
      openLogoutCom();
      if (protectedPaths.some((path) => location.pathname.startsWith(path))) {
        navigate("/");
      }
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
          if (formRef.current && !formRef.current.contains(e.target)) {
            setSearchOn(false);
          }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);

    return (
        <div className="util">
        <form ref={formRef} className={ searchOn ? "on" : ""}>
            <input type="text" onClick={()=>setSearchOn(true)}/><i><TbSearch /></i>
        </form>
        <ul className="mymenu">
            {
                authed ? 
            <>
            <li onClick={onLogout}>로그아웃</li>
            <li><Link to='/mypage'>마이페이지</Link></li>
            </>
            :
            <>
            <li onClick={openLogin}>로그인</li>
            <li onClick={openJoin}>회원가입</li>
            </>
            }
        </ul>
        <ul className="reward" onMouseEnter={openReward} onMouseLeave={closeReward}>
            <li><img src="/images/coin_w.png" alt="coin" />0</li>
            <li><img src="/images/calendar_w.png" alt="calendar" />0</li>
        </ul>
        </div>
    );
};

export default UtilBar;