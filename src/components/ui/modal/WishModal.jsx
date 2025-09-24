import { useModalStore } from "../../../store";
import Button from "../button/Button";
import './style.scss';

const WishModal = ({ className = "" }) => {
  const { wishModalOpen, closeWishModal, wishMessage, wishButtons, wishAction } = useModalStore();
  if (!wishModalOpen) return null;

  const handleClick = (btnText) => {
    // text2 버튼일 때만 action 실행
    if (btnText === wishButtons.text2 && wishAction) {
      wishAction(btnText);
    }
    // 항상 모달은 닫아주기
    closeWishModal();
  };


  return (
    <div className="modal-overlay">
      <div className={`modal wishModal ${className}`}>
        <h3>{wishMessage}</h3>
        <p className="btns">
          {wishButtons.text1 && (
            <Button
              text={wishButtons.text1}
              className="small gray"
              onClick={() => handleClick(wishButtons.text1)}
            />
          )}
          {wishButtons.text2 && (
            <Button
              text={wishButtons.text2}
              className="small main1"
              onClick={() => handleClick(wishButtons.text2)}
            />
          )}
        </p>
      </div>
    </div>
  );
};

export default WishModal;
