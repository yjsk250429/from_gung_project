import { useModalStore } from '../../store';
import Button from '../ui/button/Button';
import './style.scss' ;

const SelectProfile = () => {
    const {selectProfileOpen, closeSelectProfile} = useModalStore();
    if (!selectProfileOpen) return null;
    return (
        <div className="modal-overlay">
            <div className="modal selectProfile">
                <h3>프로필 선택</h3>
                <p className="btns">
                    <Button text='취소' className='small gray' onClick={closeSelectProfile}/>
                    <Button text='저장' className='small main1'/>
                </p>
           
            </div>
        </div>
    );
};

export default SelectProfile;