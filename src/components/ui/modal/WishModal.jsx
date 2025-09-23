import { useModalStore } from "../../../store";
import Button from "../button/Button";
import './style.scss';

const WishModal = ({ className = "" }) => {
  const { wishModalOpen, closeWishModal, wishMessage, wishButtons, wishAction } = useModalStore();
  if (!wishModalOpen) return null;

  // 버튼 클릭 핸들러: 버튼 텍스트를 인자로 넘겨줌
  const handleClick = (btnText) => {
    if (wishAction) {
      wishAction(btnText); // Payment.jsx 같은 곳에서는 분기 처리 가능
    }
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
