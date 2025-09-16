import { useTourClassStore } from '../../store';
import TourClassItem from './TourClassItem';

const TourClassList = ({ limit = 8 }) => {
    const category = useTourClassStore((state) => state.category);
    const tourClass = useTourClassStore((state) => state.tourClass);

    const list = tourClass.filter((item) => item.category === category);
    const visible = list.slice(0, limit);

    return (
        <ul className="TourClassList">
            {visible.map((tourclass) => (
                <TourClassItem key={tourclass.id} {...tourclass} />
            ))}
        </ul>
    );
};

export default TourClassList;
