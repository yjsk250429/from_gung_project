import { useModalStore } from "../../../store";
import Button from "../button/Button";
import './style.scss';
 
const NeedLogin = () => {
    const { needLoginOpen, closeNeedLogin, openLogin} = useModalStore();
    const switchToLogin = () =>{
        closeNeedLogin();
        openLogin();
    }

    if (!needLoginOpen) return;

    return (
        <div className="modal-overlay">
            <div className="modal needLogin">
                <h3>로그인이 필요합니다</h3>
                <p className="btns">
                    <Button text="취소" className="small gray" onClick={closeNeedLogin}/>
                    <Button text="로그인" className="small main1" onClick={switchToLogin}/>
                </p>
                </div>
                </div>
    );
};

export default NeedLogin;