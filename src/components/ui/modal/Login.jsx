import { useModalStore } from "../../../store";
import Button from "../button/Button";
import './style.scss';

const Login = () => {
    const { loginOpen, closeLogin, switchToJoin } = useModalStore();
    if (!loginOpen) return null;

    return (
        <div className="modal-overlay">
        <div className="modal login">
            <h3>로그인</h3>
            <form>
                <label htmlFor="">아이디
                    <input type="text" />
                </label>
                <label htmlFor="">비밀번호
                    <input type="password" />
                </label>
                <p className="findId">
                <label htmlFor="">
                    <input type="checkbox" />
                    아이디 저장</label>
                    <span>아이디/비밀번호 찾기</span>
                </p>
                <p className="btns">
                    <Button text="취소" className="small gray" onClick={closeLogin}/>
                    <Button text="로그인" className="small main1"/>
                </p>
            </form>
            <ul className="bottom">
                <li><img src="/images/components/kakaologin.png" alt="kakaologin" />카카오 계정으로 로그인</li>
                <li onClick={switchToJoin}>회원가입</li>
            </ul>
        </div>
        </div>
    );
};

export default Login;