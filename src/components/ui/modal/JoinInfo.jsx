import { useModalStore } from "../../../store";
import Button from "../button/Button";
import './style.scss';

const JoinInfo = () => {
        const { joinInfoOpen, closeJoinInfo, switchToJoinCom } = useModalStore();
        if (!joinInfoOpen) return null;
    return (
        <div className="modal-overlay">
        <div className="modal joinInfo">
            <h3>회원정보 입력 <span>* 필수항목</span></h3>
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
                <select name="first" id="">
                        <option value="010">010</option>
                        <option value="">011</option>
                        <option value="">012</option>
                    </select>-
                <input type="text" />-
                <input type="text" />
            </label>
            <label>
                생년월일
                {/* 년도 */}
                <select name="year">
                    <option value="">년도</option>
                    {Array.from({ length: 2025 - 1900 + 1 }, (_, i) => 2025 - i).map((year) => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                    ))}
                </select>
                    년
                {/* 월 */}
                <select name="month">
                    <option value="">월</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month.toString().padStart(2, "0")}>
                        {month.toString().padStart(2, "0")}
                    </option>
                    ))}
                </select>
                    월
                {/* 일 */}
                <select name="date">
                    <option value="">일</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day.toString().padStart(2, "0")}>
                        {day.toString().padStart(2, "0")}
                    </option>
                    ))}
                </select>
                일
            </label>
            <p className="btns">
            <Button text="취소" className="small gray" onClick={closeJoinInfo}/>
            <Button text="가입하기" className="small main1" onClick={switchToJoinCom}/>
            </p>
            </form>
        </div>
        </div>
    );
};

export default JoinInfo;