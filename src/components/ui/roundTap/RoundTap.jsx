import { useState } from 'react';
import './style.scss';
import { useTourClassStore } from '../../../store';
import { useMovieStore } from '../../../store'; // ✅ 추가

// mode: 'tour' | 'media'
const RoundTap = ({
    text1 = '',
    text2 = '',
    bgColor,
    mode = 'tour',
    onSelect = () => {}, // 탭 선택 결과를 부모로 전달
}) => {
    
    const { category, setCategory } = useTourClassStore();
    const filterMovies = useMovieStore((s) => s.filterMovies);
    const filterDramas = useMovieStore((s) => s.filterDramas);

    const [active, setActive] = useState(0); // media 모드에서만 사용
    const isTourMode = mode === 'tour';

    const style = { backgroundColor: bgColor };
    const activeIndex = isTourMode ? (category === 'tour' ? 0 : 1) : active;

    const onClickLeft = () => {
        if (isTourMode) {
            setCategory('tour'); // ✅ 기존 투어/클래스 유지
            onSelect({ type: 'tour' });
        } else {
            setActive(0); // ✅ 드라마 탭
            const list = filterDramas('movies'); // 필요시 'searchResults'로 변경 가능
            onSelect({ type: 'tv', list });
        }
    };

    const onClickRight = () => {
        if (isTourMode) {
            setCategory('class'); // ✅ 기존 투어/클래스 유지
            onSelect({ type: 'class' });
        } else {
            setActive(1); // ✅ 영화 탭
            const list = filterMovies('movies');
            onSelect({ type: 'movie', list });
        }
    };

    return (
        <ul className="roundTap" style={style}>
            <li style={{ left: activeIndex === 0 ? '0' : '50%' }}></li>
            <li onClick={onClickLeft}>
                <span>{text1}</span>
            </li>
            <li onClick={onClickRight}>
                <span>{text2}</span>
            </li>
        </ul>
    );
};

export default RoundTap;
