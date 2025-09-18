import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoundTap from '../ui/roundTap/RoundTap';
import './style.scss';

const TourRecommend = [
    {
        id: 1,
        img: '/images/tourclass/tourList_top1.png',
        title: '빛으로 물드는 궁궐의 밤',
        caption: '조선 왕궁의 고요한 아름다움을 느껴보세요',
        link: '/tourclass/1',
    },
    {
        id: 2,
        img: '/images/tourclass/tourList_top2.png',
        title: '왕실의 발걸음을 따라',
        caption: '왕의 행차를 따라, 궁중의 시간을 걷다',
        link: '/tourclass/7',
    },
];
const ClassRecommend = [
    {
        id: 1,
        img: '/images/tourclass/classList_top1.png',
        title: '천연자개, 감성을 담다',
        caption: '자연이 빚은 자개의 빛을 내 손에 담다',
        link: '/tourclass/86',
    },
    {
        id: 2,
        img: '/images/tourclass/classList_top2.png',
        title: '한복 한 자락, 멋을 입다',
        caption: '아름다운 한복 체험으로 남기는 품격의 추억',
        link: '/tourclass/88',
    },
];

const TourClassTop = () => {
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState('tour');

    const handleTabChange = (tabValue) => {
        setSelectedTab(tabValue);
    };

    const recommendList = selectedTab === 'tour' ? TourRecommend : ClassRecommend;

    return (
        <article className="top">
            <RoundTap
                text1="투어"
                value1="tour"
                text2="클래스"
                value2="class"
                bgColor="#d9d9d9"
                selected={selectedTab}
                onChange={handleTabChange}
            />
            <ul className="recommend">
                {recommendList.map((item) => (
                    <li key={item.id} onClick={() => navigate(item.link)}>
                        <img src={item.img} alt={item.title} />
                        <div className="grad"></div>
                        <div className="text">
                            <strong>{item.title}</strong>
                            <em>{item.caption}</em>
                        </div>
                    </li>
                ))}
            </ul>
        </article>
    );
};

export default TourClassTop;
