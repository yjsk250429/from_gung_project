import { FiHeart } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const TourClassItem = ({ id, title, theme, description, period, price, img }) => {
    return (
        <li>
            <Link to={`/tourclass/${id}`}>
                <div className="img-wrap">
                    <img src={img} alt={title} />
                </div>
                <div className="title">
                    <strong>{title}</strong>
                    <i>
                        <FiHeart />
                    </i>
                </div>
            </Link>
        </li>
    );
};

export default TourClassItem;
