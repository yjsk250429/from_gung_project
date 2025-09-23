import { FiHeart } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { IoTimeOutline } from 'react-icons/io5';
import { useAuthStore, useModalStore } from '../../store';
import { FaHeart } from "react-icons/fa";

const TourClassItem = ({ id, title, theme, description, period, price, img, category, time, region, place }) => {
    const navigate = useNavigate();
    const { user, authed, toggleWishlist } = useAuthStore();
    const { openNeedLogin, openWishModal} = useModalStore();
    const isWished = authed && user?.wishlist?.some((w) => w.id === id);

    return (
        <li>
            <Link to={`/tourclass/${id}`}>
                <div className="img-wrap">
                    <img src={img} alt={title} />
                    <article className="tourclassInfo">
                        <div className="tourclassThemes">
                            {(Array.isArray(theme) ? theme : [theme]).map((item, index) => (
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
                                            : item === '만들기'
                                            ? 'tourclassTheme making'
                                            : item === '요리하기'
                                            ? 'tourclassTheme cooking'
                                            : item === '체험하기'
                                            ? 'tourclassTheme experience'
                                            : 'tourclassTheme'
                                    }
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                        <h4>{title}</h4>

                        <dl className="period">
                            <dt>
                                <i>
                                    <IoTimeOutline />
                                </i>
                                {category === 'tour'
                                    ? '기간'
                                    : category === 'class'
                                    ? '운영시간'
                                    : ''}
                            </dt>
                            <dd>{period}</dd>
                        </dl>

                        <h5>{description}</h5>
                        <h6>{price.toLocaleString()} 원</h6>
                    </article>
                    <span className="hoverImg">
                        <img src="/images/tourclass/tourclassList_hover.png" alt="deco" />
                    </span>
                    <span className="overlay"></span>
                </div>
            </Link>
            <div className="title">
                <strong onClick={() => navigate(`/tourclass/${id}`)}>{title}</strong>
                <i
                onClick={() => {
                    if (!authed) {
                    openNeedLogin();
                    return;
                    }
                    toggleWishlist({ id, title, category, theme, description, period, time, region, place, price, img });

                    if (isWished) {
                    openWishModal("찜 목록에서 삭제하였습니다", { text1: "닫기" });
                    } else {
                    openWishModal("찜 목록에 추가하였습니다", { text1: "닫기", text2: "찜 목록 보기" }, () => navigate('/mypage'));
                    }
                }}
                >
                {isWished ? <FaHeart style={{ color: 'red' }} /> : <FiHeart />}
                </i>
            </div>
        </li>
    );
};

export default TourClassItem;
