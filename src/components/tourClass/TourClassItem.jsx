import { FiHeart } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const TourClassItem = ({ id, title, theme, description, period, price, img }) => {
    return (
        <li>
            <Link to={`/tourclass/${id}`}>
                <div className="img-wrap">
                    <img src={img} alt={title} />
                    <article className="tourclassInfo">
                        <div className="tourclassThemes">
                            {theme.map((item, index) => (
                                <div
                                    key={index}
                                    className={
                                        item === '역사'
                                            ? 'tourclassTheme history'
                                            : item === '예술'
                                            ? 'tourclassTheme art'
                                            : item === '힐링'
                                            ? 'tourclassTheme healing'
                                            : item === '라이프'
                                            ? 'tourclassTheme life'
                                            : item === '융합'
                                            ? 'tourclassTheme fusion'
                                            : 'tourclassTheme'
                                    }
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                        <h4>{title}</h4>
                        <h5>{description}</h5>
                        <dl className="period">
                            <dt>
                                <i></i>기간
                            </dt>
                            <dd>{period}</dd>
                        </dl>
                    </article>
                    <span className="overlay"></span>
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
