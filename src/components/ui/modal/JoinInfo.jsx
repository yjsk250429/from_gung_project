import { useModalStore } from "../../../store";
import Button from "../button/Button";


const JoinInfo = () => {
        const { joinInfoOpen, closeJoinInfo, switchToJoinCom } = useModalStore();
        if (!joinInfoOpen) return null;
    return (
        <div className="modal-overlay">
        <div className="modal joinInfo">
            <h3>회원정보 입력 <span>* 필수항목</span></h3>
            <form action="">

            <label htmlFor="">
                이름*
                <input type="text" />
            </label>
            <label htmlFor="">
                닉네임
                <input type="text" />
            </label>
            <label htmlFor="">
                아이디*
                <input type="text" />
            </label>
            <label htmlFor="">
                비밀번호*
                <input type="password" />
            </label>
            <label htmlFor="">
                비밀번호 확인*
                <input type="password" />
            </label>
            <label htmlFor="">
                연락처*
                <input type="text" />
            </label>
            <label htmlFor="">
                생년월일
                    <select name="year" id="">
                        <option value=""></option>
                        <option value=""></option>
                        <option value=""></option>
                    </select>
                    <select name="month" id="">
                        <option value=""></option>
                        <option value=""></option>
                        <option value=""></option>
                    </select>
                    <select name="date" id="">
                        <option value=""></option>
                        <option value=""></option>
                        <option value=""></option>
                    </select>
            </label>
            <p className="btns">
            <Button text="취소" className="small" onClick={closeJoinInfo}/>
            <Button text="가입하기" className="small" onClick={switchToJoinCom}/>
            </p>
            </form>
        </div>
        </div>
    );
};

export default JoinInfo;