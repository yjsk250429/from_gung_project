import { useModalStore } from '../../../store';
import Button from '../button/Button';

const EditInfoComplete = () => {
    const { editCompleteOpen, closeEditComplete } = useModalStore();

    if (!editCompleteOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal editInfoComplete">
                <h3>회원 정보가 저장되었습니다</h3>
                <p className="btns">
                    <Button text="확인" className="small gray" onClick={closeEditComplete} />
                </p>
            </div>
        </div>
    );
};
export default EditInfoComplete;
