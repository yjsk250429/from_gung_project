import TourClassItem from './TourClassItem';

const TourClassList = ({ list=[], limit = 8 }) => {
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
