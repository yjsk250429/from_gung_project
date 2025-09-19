import { useState } from "react";
import { useAuthStore, useModalStore } from "../../../store";
import Button from "../button/Button";
import './style.scss';
const badWords = ["시발", "존나", "썅"];
const JoinInfo = () => {
        const { joinInfoOpen, closeJoinInfo, switchToJoinCom } = useModalStore();
        const { members, signup } = useAuthStore();

        const [form, setForm] = useState({
            name: "",
            nickName: "",
            userId: "",
            password: "",
            passwordConfirm: "",
            tel: { first: "010", middle: "", last: "" },
            birth: { year: null, month: null, date: null },
          });
        
          const [errors, setErrors] = useState({});
          const [idChecked, setIdChecked] = useState(false);
          const [pwMatchMessage, setPwMatchMessage] = useState("");

        if (!joinInfoOpen) return null;

        const validateName = (name) => {
            if (!name) return "필수 항목을 입력해주세요.";
            const regex = /^[a-zA-Z가-힣]+$/; // 영문, 한글만 허용
            if (!regex.test(name)) return "올바른 이름을 입력해 주세요";
            if (name.length < 2) return "이름은 2자 이상 입력해야 합니다.";
          
            // 한글 이름 제한
            if (/^[가-힣]+$/.test(name) && name.length > 10) {
              return "최대 글자수를 초과했습니다";
            }
          
            // 영문 이름 제한
            if (/^[a-zA-Z]+$/.test(name) && name.length > 20) {
              return "최대 글자수를 초과했습니다";
            }
          
            return null;
          };

          const validateNickName = (nick) => {
            if (!nick) return null; // 미입력 → 아이디 앞3자 + "***" 처리 예정
            if (badWords.includes(nick)) return "사용할 수 없는 닉네임입니다.";
          
            const regex = /^[a-zA-Z0-9가-힣]+$/; // 특수문자 ❌
            if (!regex.test(nick)) return "사용할 수 없는 닉네임입니다.";
          
            // 영문/숫자만
            if (/^[a-zA-Z0-9]+$/.test(nick)) {
              if (nick.length < 3) return "닉네임은 3자 이상 입력해야 합니다.";
              if (nick.length > 10) return "최대 글자수를 초과했습니다";
            }
          
            // 한글만
            if (/^[가-힣]+$/.test(nick)) {
              if (nick.length < 2) return "닉네임은 2자 이상 입력해야 합니다.";
              if (nick.length > 6) return "최대 글자수를 초과했습니다";
            }
          
            return null;
          };
        
          const validateUserId = (id) => {
            const regex = /^[a-zA-Z0-9]+$/; // 특수문자 ❌
            if (!regex.test(id) || id.length < 5 || id.length > 20) {
              return "사용할 수 없는 아이디입니다.";
            }
            return null;
          };
        
          const validatePassword = (pw) => {
            if (pw.length < 8 || pw.length > 20) return "사용할 수 없는 비밀번호입니다.";
            if (!/[0-9]/.test(pw) || !/[a-zA-Z]/.test(pw))
              return "숫자, 특수기호 포함 8자 이상 20자 이내";
            if (!/[!@#$%^&*(),.?":{}|<>]/.test(pw))
              return "숫자, 특수기호 포함 8자 이상 20자 이내";
            return null;
          };
        
          const handleChange = (e) => {
            const { name, value } = e.target;
            if (["first", "middle", "last"].includes(name)) {
              setForm((prev) => ({ ...prev, tel: { ...prev.tel, [name]: value } }));
            } else if (["year", "month", "date"].includes(name)) {
              setForm((prev) => ({ ...prev, birth: { ...prev.birth, [name]: value || null } }));
            } else {
              setForm((prev) => ({ ...prev, [name]: value }));
            }
        
            // 비밀번호 확인 처리
            if (name === "passwordConfirm" || name === "password") {
              setPwMatchMessage(
                (name === "passwordConfirm" ? value : form.passwordConfirm) ===
                  (name === "password" ? value : form.password)
                  ? "비밀번호가 일치합니다."
                  : "비밀번호가 일치하지 않습니다."
              );
            }
          };
        
          const handleIdCheck = () => {
            const err = validateUserId(form.userId);
            if (err) {
              setErrors((prev) => ({ ...prev, userId: err }));
              setIdChecked(false);
              return;
            }
            if (members.find((m) => m.userId === form.userId)) {
              setErrors((prev) => ({ ...prev, userId: "중복된 아이디가 존재합니다." }));
              setIdChecked(false);
            } else {
              setErrors((prev) => ({ ...prev, userId: null }));
              setIdChecked(true);
              alert("사용 가능한 아이디입니다.");
            }
          };
        
          const onSubmit = (e) => {
            e.preventDefault();
            let newErrors = {};
        
            if (!form.name || !form.userId || !form.password || !form.passwordConfirm || !form.tel.middle || !form.tel.last) {
              newErrors.required = "필수 항목을 입력해주세요.";
            }

            // 이름 검증
            const nameErr = validateName(form.name);
            if (nameErr) newErrors.name = nameErr;
        
            // 닉네임 검증 (없으면 아이디 기반으로 생성)
            let finalNick = form.nickName;
            if (!form.nickName && form.userId) {
              finalNick = form.userId.slice(0, 3) + "***";
            } else {
              const nickErr = validateNickName(form.nickName);
              if (nickErr) newErrors.nickName = nickErr;
            }
        
            // 아이디 검증
            const idErr = validateUserId(form.userId);
            if (idErr) newErrors.userId = idErr;
        
            // 비밀번호 검증
            const pwErr = validatePassword(form.password);
            if (pwErr) newErrors.password = pwErr;
        
            // 비밀번호 확인
            if (form.password !== form.passwordConfirm) {
              newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
            }
        
            setErrors(newErrors);
            if (Object.keys(newErrors).length > 0) return;
        
            // 최종 데이터 저장
            signup({
              name: form.name,
              userId: form.userId,
              password: form.password,
              nickName: finalNick,
              profile: "/images/mypage/default.png",
              tel: form.tel,
              birth: form.birth,
              reward: 0,
              coupon: 0,
              marketing: false,
              marketingDate: null,
            });
        
            switchToJoinCom();
          };


    return (
        <div className="modal-overlay">
        <div className="modal joinInfo">
            <h3>회원정보 입력 <span>* 필수항목</span></h3>
            <form onSubmit={onSubmit}>
            <label htmlFor="">
                이름*
                <input type="text" name="name" value={form.name} onChange={handleChange}/>
                {errors.name && <p className="error-message">{errors.name}</p>}
            </label>
            <label htmlFor="">
                닉네임
                <input type="text" name="nickName" value={form.nickName} onChange={handleChange}/>
                {errors.nickName && <p className="error-message">{errors.nickName}</p>}
            </label>
            <label htmlFor="">
                아이디*
                <input type="text" name="userId" value={form.userId} onChange={handleChange}/>
                <button className="idcheck" type="button" onClick={handleIdCheck}>중복확인</button>
                {errors.userId && <p className="error-message">{errors.userId}</p>}
            </label>
            <label htmlFor="">
                비밀번호*
                <input type="password" name="password" value={form.password} onChange={handleChange}/>
                {errors.password && <p className="error-message">{errors.password}</p>}
            </label>
            <label htmlFor="">
                비밀번호 확인*
                <input type="password" name="passwordConfirm"
              value={form.passwordConfirm}
              onChange={handleChange}/>
              {errors.passwordConfirm && <p className="error-message">{errors.passwordConfirm}</p>}
              {pwMatchMessage && <p className="info-message">{pwMatchMessage}</p>}
            </label>
            <label htmlFor="">
                연락처*
                <select name="first" value={form.tel.first} onChange={handleChange}>
                        <option value="010">010</option>
                        <option value="">011</option>
                        <option value="">012</option>
                        <option value="">013</option>
                    </select>-
                <input type="text" name="middle" value={form.tel.middle} onChange={handleChange}/>-
                <input type="text" name="last" value={form.tel.last} onChange={handleChange}/>
            </label>
            <label>
                생년월일
                {/* 년도 */}
                <select name="year" value={form.birth.year || ""} onChange={handleChange}>
                    <option value="">년도</option>
                    {Array.from({ length: 2025 - 1900 + 1 }, (_, i) => 2025 - i).map((year) => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                    ))}
                </select>
                    년
                {/* 월 */}
                <select name="month" value={form.birth.month || ""} onChange={handleChange}>
                    <option value="">월</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month.toString().padStart(2, "0")}>
                        {month.toString().padStart(2, "0")}
                    </option>
                    ))}
                </select>
                    월
                {/* 일 */}
                <select name="date" value={form.birth.date || ""} onChange={handleChange}>
                    <option value="">일</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day.toString().padStart(2, "0")}>
                        {day.toString().padStart(2, "0")}
                    </option>
                    ))}
                </select>
                일
            </label>
            {errors.required && <p className="error-message required">{errors.required}</p>}
            <p className="btns">
            <Button text="취소" className="small gray" onClick={closeJoinInfo} type="button"/>
            <Button text="가입하기" className="small main1" type="submit"/>
            </p>
            </form>
        </div>
        </div>
    );
};

export default JoinInfo;