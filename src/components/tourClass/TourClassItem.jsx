import { FiHeart } from "react-icons/fi";

const TourClassItem = ({id, title, theme, description, period, price, img}) => {
    return (
        <li>
            <div className="img-wrap">
                <img src={img} alt={title} />
            </div>
            <div className="title">
                <strong>{title}</strong>
                <i><FiHeart /></i>
            </div>
        </li>
    );
};

export default TourClassItem;