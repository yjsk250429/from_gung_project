import { useModalStore } from '../../../store';
import Button from '../button/Button';
import './style.scss';

const EditInfo = () => {
    const { editInfoOpen, closeEditInfo } = useModalStore();
    if (!editInfoOpen) return null;
    return (
        <div className="modal-overlay">
        <div className="modal editInfo">
            <h3>회원정보 수정</h3>
            <ul className='id'>
                <li>아이디</li>
                <li>abc1234</li>
            </ul>
            <ul className='name'>
                <li>이름</li>
                <li>홍길동</li>
            </ul>
            <ul className='birthday'>
                <li>생년월일</li>
                <li>1999.01.01</li>
            </ul>

            <form>
            <label htmlFor="">
                닉네임
                <input type="text" />
            </label>
            <label htmlFor="">
                비밀번호 변경
                <input type="password" />
            </label>
            <label htmlFor="">
                비밀번호 변경 확인
                <input type="password" />
            </label>
            <label htmlFor="">
                연락처
                <input type="text" />
            </label>
            <label htmlFor="">
                <input type="checkbox" />
                <span>(선택)</span> 이벤트·혜택 정보 수신 동의
                <p>수신거부 2025.09.04 17:32</p>
            </label>

                <p className="btns">
                    <Button text="취소" className="small white" onClick={closeEditInfo}/>
                    <Button text="저장" className="small white" />
                </p>
            </form>
        </div>
        </div>
    );
};

export default EditInfo;