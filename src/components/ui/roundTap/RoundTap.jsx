import './style.scss';
import { useMovieStore, useTourClassStore } from '../../../store';
import { useEffect, useState } from 'react';

const RoundTap = ({
    text1 = '',
    text2 = '',
    value1 = '',
    value2 = '',
    bgColor,
    onChange,
    selected,
}) => {
    const { setCategory } = useTourClassStore();
    const setMediaCategory = useMovieStore((s) => s.setMediaCategory);
    const [isRight, setIsRight] = useState(false);

    useEffect(() => {
        // selected가 오른쪽 탭(value2)일 경우 오른쪽으로 이동
        setIsRight(selected === value2);
    }, [selected, value2]);

    const handleTabClick = (value) => {
        setCategory(value);
        setMediaCategory(value);
        setIsRight(value === value2);

        if (onChange) onChange(value);
    };

    return (
        <ul className="roundTap" style={{ background: bgColor }}>
            <li style={{ left: isRight ? '50%' : '0%' }}></li>

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
