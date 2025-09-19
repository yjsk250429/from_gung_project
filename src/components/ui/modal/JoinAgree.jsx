import { useState } from "react";
import { useModalStore, useAuthStore } from "../../../store";
import Button from "../button/Button";
import "./style.scss";

const JoinAgree = () => {
  const { joinOpen, closeJoin, switchToJoinInfo } = useModalStore();

  const initialAgreements = {
    all: false,
    age: false,
    terms: false,
    ott: false,
    privacy: false,
    marketing: false,
  };

  const [agreements, setAgreements] = useState(initialAgreements);
  const [errorMessage, setErrorMessage] = useState("");

  if (!joinOpen) return null;

  const resetForm = () => {
    setAgreements(initialAgreements);
    setErrorMessage("");
  };

  const handleChange = (key) => {
    const updated = { ...agreements, [key]: !agreements[key] };

    // 개별 체크 변경 시 전체동의 상태 동기화
    const { age, terms, ott, privacy, marketing } = updated;
    updated.all = age && terms && ott && privacy && marketing;

    setAgreements(updated);

    // 필수 체크 다 되면 에러 메시지 제거
    if (updated.age && updated.terms && updated.ott && updated.privacy) {
      setErrorMessage("");
    }
  };

  const handleAllChange = () => {
    const newValue = !agreements.all;
    const updated = {
      all: newValue,
      age: newValue,
      terms: newValue,
      ott: newValue,
      privacy: newValue,
      marketing: newValue,
    };
    setAgreements(updated);

    // 전체동의 시 에러 메시지 제거
    if (newValue) setErrorMessage("");
  };

  const isRequiredChecked =
    agreements.age && agreements.terms && agreements.ott && agreements.privacy;

  const handleNext = () => {
    if (!isRequiredChecked) {
      setErrorMessage("* 필수 항목에 동의해주세요.");
      return;
    }
    setErrorMessage("");

    // 선택항목만 store에 반영
    useAuthStore.getState().updateMarketing(agreements.marketing);

    // 다음 단계로 이동 + 상태 초기화
    switchToJoinInfo();
    resetForm();
  };

  const handleCancel = () => {
    closeJoin();
    resetForm(); // 모달 닫으면서 초기화
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

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <p className="btns">
            <Button
              text="취소"
              className="small gray"
              onClick={handleCancel}
              type="button"
            />
            <Button
              text="다음으로"
              className="small main1"
              onClick={handleNext}
              type="button"
            />
          </p>
        </form>
      </div>
    </div>
  );
};

export default JoinAgree;
