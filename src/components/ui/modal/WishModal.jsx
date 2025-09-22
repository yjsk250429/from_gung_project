import Button from "../button/Button";
import './style.scss';

const WishModal = ({message='', text1='', text2='', onClick1 = () => {}, onClick2 = () => {} }) => {
    return (
        <div className="modal-overlay">
            <div className="modal wishModal">
                <h3>{message}</h3>
                <p className="btns">
                {text1 && (
                    <Button text={text1} className="small gray" onClick={onClick1} type="button"/>
                )}
                {text2 && (
                    <Button text={text2} className="small main1" onClick={onClick2} type="button"/>
                )}
                </p>
            </div>
        </div>
    );
};

export default WishModal;