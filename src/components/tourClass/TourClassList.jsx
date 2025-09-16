import { useTourClassStore } from '../../store';
import TourClassItem from './TourClassItem';

const TourClassList = ({ showAll = false }) => {
    const category = useTourClassStore((state) => state.category);
    const tourClass = useTourClassStore((state) => state.tourClass);

    const list = tourClass.filter((item) => item.category === category);
    const visible = showAll ? list : list.slice(0, 8); // ← 여기서 8개 제한

    return (
        <ul className="TourClassList">
            {visible.map((tourclass) => (
                <TourClassItem key={tourclass.id} {...tourclass} />
            ))}
        </ul>
    );
};

export default TourClassList;
