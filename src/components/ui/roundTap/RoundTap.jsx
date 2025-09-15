import './style.scss';
import { useMovieStore, useTourClassStore } from '../../../store';
import { useState } from 'react';

const RoundTap = ({ text1 = '', text2 = '', bgColor }) => {
    const { category, setCategory } = useTourClassStore();
    const setMediaCategory = useMovieStore((s) => s.setMediaCategory);
    const [isRight, setIsRight] = useState(false);

    return (
        <ul className="roundTap" style={{ background: bgColor }}>
            <li style={{ left: isRight ? '50%' : '0%' }}></li>
            <li
                onClick={() => {
                    setCategory('tour');
                    setMediaCategory('movie');
                    setIsRight(false);
                }}
            >
                <span>{text1}</span>
            </li>
            <li
                onClick={() => {
                    setCategory('class');
                    setMediaCategory('tv');
                    setIsRight(true);
                }}
            >
                <span>{text2}</span>
            </li>
        </ul>
    );
};

export default RoundTap;
