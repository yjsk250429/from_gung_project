import './style.scss';

const EditInfo = () => {
    return (
        <div className="modal-overlay">
        <div className="modal editInfo">
            <h3>회원정보 수정</h3>

            <form>
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
                    <Button text="취소" className="small white" />
                    <Button text="저장" className="small white" />
                </p>
            </form>
        </div>
        </div>
    );
};

export default EditInfo;