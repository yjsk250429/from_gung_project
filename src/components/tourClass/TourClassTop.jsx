import { useNavigate } from "react-router-dom";
import RoundTap from "../ui/roundTap/RoundTap";
import './style.scss';
import { useTourClassStore } from "../../store";

const TourRecommend = [
    {id:1, img:'/images/list_top1.jpg', title:'빛으로 물드는 궁궐의 밤', caption:'조선 왕궁의 고요한 아름다움을 느껴보세요', link:'/tourclass/1'},
    {id:2, img:'/images/list_top2.jpg', title:'왕실의 발걸음을 따라', caption:'궁중 행렬과 함께하는 생생한 전통 체험', link:'/tourclass/2'}
];
const ClassRecommend = [
    {id:1, img:'', title:'', caption:'', link:'/tourclass/51'},
    {id:2, img:'', title:'', caption:'', link:'/tourclass/52'}
]

const TourClassTop = () => {
    const navigate = useNavigate();
    const tourClass = useTourClassStore((state)=>state.tourClass);
    const {setTour, setClass} = useTourClassStore();

    return (
        <article className="top">
            <RoundTap text1="투어" text2="클래스" bgColor="#d9d9d9"/>
            <ul className="recommend">
                {TourRecommend.map((tour)=>(<li key={tour.id} onClick={()=>navigate(`${tour.link}`)}>
                    <img src={tour.img} alt={tour.title} />
                    <div className="text">
                    <strong>{tour.title}</strong>
                    <em>{tour.caption}</em>
                    </div>
                </li>))
                }
            </ul>
        </article>
    );
};

export default TourClassTop;