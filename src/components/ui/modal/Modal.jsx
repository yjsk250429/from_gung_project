

const Modal = ({className, titleTxt}) => {

    const style={}
    return (
        <div className={`modal ${className}`}>
            <h3>{titleTxt}</h3>
        </div>
    );
};

export default Modal;