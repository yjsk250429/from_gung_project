import './style.scss';

const Button = ({ text = '확인', onClick = () => {}, className = '', type='' }) => {
    return (
        <button className={`button ${className}`} onClick={onClick} type={type}>
            {text}
        </button>
    );
};

export default Button;
