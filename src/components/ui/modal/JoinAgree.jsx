import { useState } from "react";
import { useModalStore, useAuthStore } from "../../../store";
import Button from "../button/Button";
import "./style.scss";

const JoinAgree = () => {
  const { joinOpen, closeJoin, switchToJoinInfo } = useModalStore();

  const [agreements, setAgreements] = useState({
    all: false,
    age: false, // (필수) 만 14세 이상
    terms: false, // (필수) 서비스 이용약관
    ott: false, // (필수) OTT 이용약관
    privacy: false, // (필수) 개인정보
    marketing: false, // (선택) 이벤트·혜택
  });

  if (!joinOpen) return null;

  const handleChange = (key) => {
    const updated = { ...agreements, [key]: !agreements[key] };

    // 개별 체크 변경 시 전체동의 상태 동기화
    const { age, terms, ott, privacy, marketing } = updated;
    updated.all = age && terms && ott && privacy && marketing;

    setAgreements(updated);
  };

  // 전체동의 핸들러
  const handleAllChange = () => {
    const newValue = !agreements.all;
    setAgreements({
      all: newValue,
      age: newValue,
      terms: newValue,
      ott: newValue,
      privacy: newValue,
      marketing: newValue,
    });
  };

  // 필수 체크 여부 확인
  const isRequiredChecked =
    agreements.age && agreements.terms && agreements.ott && agreements.privacy;

  // 다음으로 클릭 → 선택항목만 store에 저장
  const handleNext = () => {
    if (!isRequiredChecked) return;
    // 선택항목만 데이터에 반영 (마이페이지 수정 가능)
    useAuthStore.getState().updateMarketing(agreements.marketing);
    switchToJoinInfo();
  };

  return (
    <div className="modal-overlay">
      <div className="modal joinAgree">
        <h3>약관 동의</h3>
        <form>
          <label>
            <input
              type="checkbox"
              checked={agreements.all}
              onChange={handleAllChange}
            />
            전체 동의하기
          </label>
          <label>
            <input
              type="checkbox"
              checked={agreements.age}
              onChange={() => handleChange("age")}
            />
            <span>(필수)</span> 만 14세 이상입니다.
          </label>
          <label>
            <input
              type="checkbox"
              checked={agreements.terms}
              onChange={() => handleChange("terms")}
            />
            <span>(필수)</span> 서비스 이용약관 동의
          </label>
          <label>
            <input
              type="checkbox"
              checked={agreements.ott}
              onChange={() => handleChange("ott")}
            />
            <span>(필수)</span> OTT 서비스 이용약관 동의
          </label>
          <label>
            <input
              type="checkbox"
              checked={agreements.privacy}
              onChange={() => handleChange("privacy")}
            />
            <span>(필수)</span> 개인정보 수집 및 이용 동의
          </label>
          <label>
            <input
              type="checkbox"
              checked={agreements.marketing}
              onChange={() => handleChange("marketing")}
            />
            <span>(선택)</span> 이벤트 · 혜택 정보 수신 동의
          </label>

          <p className="btns">
            <Button text="취소" className="small gray" onClick={closeJoin} />
            <Button
              text="다음으로"
              className="small main1"
              onClick={handleNext}
              disabled={!isRequiredChecked}
            />
          </p>
        </form>
      </div>
    </div>
  );
};

export default JoinAgree;
