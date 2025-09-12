import { useTourClassStore } from "../../store";
import TourClassItem from "./TourClassItem";


const TourClassList = () => {
    const category = useTourClassStore((state) => state.category); 
  const tourClass = useTourClassStore((state) => state.tourClass);
    const list = tourClass.filter((item) => item.category === category);


    return (
        <ul className="TourClassList">
           {list.map((tourclass) => (
                <TourClassItem key={tourclass.id} {...tourclass} />
  ))}
        </ul>
    );
};

export default TourClassList;