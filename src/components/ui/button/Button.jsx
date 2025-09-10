import './style.scss';

const Button = ({ text = '확인', onClick = () => {}, className = '' }) => {
    return (
        <button className={`button ${className}`} onClick={onClick}>
            {text}
        </button>
    );
};

export default Button;
