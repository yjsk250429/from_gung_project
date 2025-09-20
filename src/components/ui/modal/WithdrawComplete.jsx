import { useModalStore } from '../../../store';
import Button from '../button/Button';
import { useNavigate } from 'react-router-dom';
import './style.scss';

const WithdrawComplete = () => {
    const { withdrawComOpen, closeWithdrawCom } = useModalStore();
    const navigate = useNavigate();
    if (!withdrawComOpen) return null;

    const goHome = () => {
        navigate('/');
        closeWithdrawCom();
    };

    return (
        <div className="modal-overlay">
            <div className="modal withdrawComplete">
                <h3>회원 탈퇴가 완료되었습니다</h3>
                <p className="btns">
                    <Button text="홈으로" className="small gray" onClick={goHome} />
                </p>
            </div>
        </div>
    );
};

export default WithdrawComplete;
