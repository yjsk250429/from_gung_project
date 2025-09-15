import { TbSearch } from "react-icons/tb";
import { useModalStore } from "../../store";
const UtilBar = () => {
    const { openLogin, openJoin, openReward, closeReward } = useModalStore();

    return (
        <div className="util">
        <form >
            <input type="text" /><i><TbSearch /></i>
        </form>
        <ul className="mymenu">
            <li onClick={openLogin}>로그인</li>
            {/* <li>로그아웃</li> */}
            <li onClick={openJoin}>회원가입</li>
            {/* <li>마이페이지</li> */}
        </ul>
        <ul className="reward" onMouseEnter={openReward} onMouseLeave={closeReward}>
            <li><img src="/images/coin_w.png" alt="coin" />0</li>
            <li><img src="/images/calendar_w.png" alt="calendar" />0</li>
        </ul>
        </div>
    );
};

export default UtilBar;