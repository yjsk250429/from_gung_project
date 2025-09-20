import { useModalStore } from '../../../store';
import Button from '../button/Button';
import './style.scss';

const LogoutComplete = () => {
    const { logoutComOpen, closeLogoutCom, switchToLogin } = useModalStore();

    if (!logoutComOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal logoutComplete">
                <h3>로그아웃 했습니다</h3>
                <p className="btns">
                    <Button text="로그인" className="small gray" onClick={switchToLogin} />
                    <Button text="확인" className="small main1" onClick={closeLogoutCom} />
                </p>
            </div>
        </div>
    );
};

export default LogoutComplete;
