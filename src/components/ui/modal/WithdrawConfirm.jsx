import { useAuthStore, useModalStore } from '../../../store';
import './style.scss';
import Button from '../button/Button';

const WithdrawConfirm = () => {
    const { withdrawConfirmOpen, closeWithdrawConfirm, switchToWithdrawCom } = useModalStore();
    const withdraw = useAuthStore((s) => s.withdraw);

    const onWithdraw = () => {
        withdraw();
        switchToWithdrawCom();
    };

    if (!withdrawConfirmOpen) return null;
    return (
        <div className="modal-overlay">
            <div className="modal withdrawConfirm">
                <h3>회원을 탈퇴하시겠습니까?</h3>
                <em>* 탈퇴 시 모든 포인트가 소멸됩니다.</em>
                <p className="btns">
                    <Button
                        text="취소"
                        className="small gray"
                        onClick={closeWithdrawConfirm}
                        type="button"
                    />
                    <Button
                        text="확인"
                        className="small main1"
                        onClick={onWithdraw}
                        type="button"
                    />
                </p>
            </div>
        </div>
    );
};

export default WithdrawConfirm;
