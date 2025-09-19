import { FiDownload } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import './style.scss';
import React from 'react';

const Schedule = ({ thisitem }) => {
    const {
        id,
        title,
        theme = [],
        description,
        period,
        price,
        time,
        img,
        region,
        place = [],
    } = thisitem;

    const scheduleList = [
        { img: '/images/tourclass/pics.png', title: '투어 이미지 1' },
        { img: '/images/tourclass/pics.png', title: '투어 이미지 2' },
        { img: '/images/tourclass/pics.png', title: '투어 이미지 3' },
    ];

    return (
        <div className="schedule">
            <div className="description">
                <h3>{description}</h3>
                <h4>
                    궁중음식 체험부터 전통공연, 특별 내부 관람까지!
                    <br />
                    조용히 스며드는 고궁의 매력을 당일치기로 충분히 즐길 수 있어요.
                </h4>
            </div>
            <div className="pics">
                <div className="days">
                    <article className="day day01">
                        <strong>
                            <img src="/images/tourclass/tourclassDetail_DAY01.png" alt="" />
                        </strong>
                        <ul>
                            {scheduleList.map(({ img, title }, idx) => (
                                <React.Fragment key={idx}>
                                    <li>
                                        <img src={img} alt={title} />
                                        <h5>{title}</h5>
                                        <p></p>
                                    </li>
                                    <span>
                                        <img
                                            src="/images/tourclass/tourclassDetail_dayFlower.png"
                                            alt="spanFlower"
                                        />
                                    </span>
                                </React.Fragment>
                            ))}
                        </ul>
                    </article>
                    <article className="day day02">
                        <strong>
                            <img src="/images/tourclass/tourclassDetail_DAY02.png" alt="" />
                        </strong>
                        <ul>
                            {scheduleList.map(({ img, title }, idx) => (
                                <React.Fragment key={idx}>
                                    <li>
                                        <img src={img} alt={title} />
                                    </li>
                                    <span>
                                        <img
                                            src="/images/tourclass/tourclassDetail_dayFlower.png"
                                            alt="spanFlower"
                                        />
                                    </span>
                                </React.Fragment>
                            ))}
                        </ul>
                    </article>
                    <article className="day day03">
                        <strong>
                            <img src="/images/tourclass/tourclassDetail_DAY03.png" alt="" />
                        </strong>
                        <ul>
                            {scheduleList.map(({ img, title }, idx) => (
                                <React.Fragment key={idx}>
                                    <li>
                                        <img src={img} alt={title} />
                                    </li>
                                    {idx !== scheduleList.length - 1 && (
                                        <span>
                                            <img
                                                src="/images/tourclass/tourclassDetail_dayFlower.png"
                                                alt="꽃 이미지"
                                            />
                                        </span>
                                    )}
                                </React.Fragment>
                            ))}
                        </ul>
                    </article>
                </div>
            </div>
            <p className="btns">
                <button>
                    <i>
                        <FaHeart />
                    </i>
                    투어 찜하기
                </button>
                <button>
                    <i>
                        <FiDownload />
                    </i>
                    쿠폰 받기
                </button>
            </p>
        </div>
    );
};

export default Schedule;
