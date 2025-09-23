import { useModalStore } from "../../../store";
import Button from "../button/Button";
import './style.scss';

const WishModal = ({ className="" }) => {

    const {wishModalOpen, closeWishModal, wishMessage, wishButtons, wishAction } = useModalStore();
    if( !wishModalOpen) return null;

    return (
        <div className="modal-overlay">
            <div className={`modal wishModal ${className}`}>
                <h3>{wishMessage}</h3>
                <p className="btns">
                {wishButtons.text1 && (
                    <Button text={wishButtons.text1} className="small gray" onClick={closeWishModal}/>
                )}
                {wishButtons.text2 && (
                    <Button text={wishButtons.text2} className="small main1"
                    onClick={() => {
                        if (wishAction)
                            wishAction(); 
                        closeWishModal();
                      }}/>
                )}
                </p>
            </div>
        </div>
    );
};

export default WishModal;