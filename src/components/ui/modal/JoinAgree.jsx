import { useModalStore } from "../../../store";
import Button from "../button/Button";
import './style.scss';


const JoinAgree = () => {
    const { joinOpen, closeJoin, switchToJoinInfo } = useModalStore();
    if (!joinOpen) return null;

    return (
        <div className="modal-overlay">
        <div className="modal joinAgree">
            <h3>약관 동의</h3>
            <form action="">
                <label htmlFor="">
                    <input type="checkbox" />
                    전체 동의하기
                </label>
                <label htmlFor="">
                    <input type="checkbox" />
                    <span>(필수)</span> 만 14세 이상입니다.
                                    </label>
                <label htmlFor="">
                    <input type="checkbox" />
                    <span>(필수)</span> 서비스 이용약관 동의
                </label>
                <label htmlFor="">
                    <input type="checkbox" />
                    <span>(필수)</span> OTT 서비스 이용약관 동의
                </label>
                <label htmlFor="">
                    <input type="checkbox" />
                    <span>(필수)</span> 개인정보 수집 및 이용 동의
                </label>
                <label htmlFor="">
                    <input type="checkbox" />
                    <span>(선택)</span> 이벤트 · 혜택 정보 수신 동의
                </label>

            <p className="btns">
                    <Button text="취소" className="small gray" onClick={closeJoin}/>
                    <Button text="다음으로" className="small main1" onClick={switchToJoinInfo}/>
                </p>
            </form>
        </div>
        </div>
    );
};

export default JoinAgree;