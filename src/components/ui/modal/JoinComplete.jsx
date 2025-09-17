import { useNavigate } from "react-router-dom";
import { useModalStore } from "../../../store";
import Button from "../button/Button";
import './style.scss';

const JoinComplete = () => {
    const { joinComOpen, closeJoinCom, openLogin } = useModalStore();
    const navigate = useNavigate();
    const goHome = ()=>{
        closeJoinCom();
        navigate('/');
    }
    const onLogin = () =>{
        closeJoinCom();
        openLogin();
    }
            if (!joinComOpen) return null;
    return (
        <div className="modal-overlay">
            <div className="modal joinComplete">
                <h3>
                    가입이 완료되었습니다<br/>
                    환영합니다
                </h3>
                <p className="btns">
                    <Button text="홈으로" className="small gray" onClick={goHome}/>
                    <Button text="로그인" className="small main1" onClick={onLogin}/>
                </p>
            </div>
        </div>
    );
};

export default JoinComplete;