import { useTourClassStore } from '../../../store';
import './style.scss';

const RoundTap = ({ text1, text2, value1, value2, selected, onChange, bgColor }) => {
    const { setCategory } = useTourClassStore();

    const handleTabClick = (value) => {
        setCategory(value);
        onChange?.(value);
    };

    return (
        <ul className="roundTap" style={{ background: bgColor }}>
            <li
                style={{ transform: selected === value2 ? 'translateX(100%)' : 'translateX(0%)' }}
            />
            <li
                className={selected === value1 ? 'active' : ''}
                onClick={() => handleTabClick(value1)}
            >
                <span>{text1}</span>
            </li>
            <li
                className={selected === value2 ? 'active' : ''}
                onClick={() => handleTabClick(value2)}
            >
                <span>{text2}</span>
            </li>
        </ul>
    );
};

export default RoundTap;
