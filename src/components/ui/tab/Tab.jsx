import './style.scss';

const Tab = ({ items = [], activeIndex = 0, onClick = () => {} }) => {
    
    return (
        <ul className="tabs">
            {items.map((text, index) => (
                <li
                    key={index}
                    onClick={() => onClick(index)}
                    className={activeIndex === index ? 'on' : ''}
                >
                    {text}
                </li>
            ))}
        </ul>
    );
};

export default Tab;
