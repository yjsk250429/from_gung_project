import { useAuthStore, useModalStore } from '../../../store';
import Button from '../button/Button';
import './style.scss';

const LoginComplete = () => {
    const { loginComOpen, closeLoginCom, switchToLogoutCom } = useModalStore();
       const logout = useAuthStore((s) => s.logout);

    const onLogout = () =>{
        logout();
        switchToLogoutCom();
    }

    if (!loginComOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal loginComplete">
                <h3>로그인 했습니다</h3>
                <em>오늘 출석도장 적립 완료!
                    <img src="/images/components/stamp_black.png" alt="stamp" />
                </em>
                <p className="btns">
                    <Button text='로그아웃' className='small gray' onClick={onLogout}/>
                    <Button text='확인' className='small main1' onClick={closeLoginCom}/>
                </p>
            </div>
        </div>
    );
};

export default LoginComplete;