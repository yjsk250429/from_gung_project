import { useTourClassStore } from "../../store";
import TourClassItem from "./TourClassItem";


const TourClassList = () => {
    const tourClass = useTourClassStore((state)=>state.tourClass);
    return (
        <ul className="TourClassList">
            {
                tourClass.map((tourclass)=>(<TourClassItem key={tourclass.id} {...tourclass}/>))
            }
        </ul>
    );
};

export default TourClassList;