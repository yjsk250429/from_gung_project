import './style.scss';

const Button = ({
  text = '확인',
  width,
  height,
  onClick = () => {},
  className = '',
}) => {
  const style = {
    width: width || '150px',
    height: height || '42px',
  };

  return (
    <button
      className={`button ${className}`}
      style={style}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;