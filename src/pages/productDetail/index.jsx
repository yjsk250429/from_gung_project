import { useParams } from "react-router-dom";
import { useTourClassStore } from "../../store";
import './style.scss';
import Tab from "../../components/ui/tab/Tab";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { LuClock3, LuMapPin } from "react-icons/lu";
import { IoMapOutline } from "react-icons/io5";
import { BiCoin } from "react-icons/bi";

const TourClassDatail = () => {
    const { tourclassID } = useParams();
      const tourClass = useTourClassStore((state) => state.tourClass);
      const thisitem = tourClass.find((t) => String(t.id) === tourclassID);
      const {id, title, theme=[], description, period, price, time, img, region, place=[]} = thisitem;
      const items = ['투어 일정', '예약하기', '리뷰'];
      
    if (!thisitem) {
        return <p>존재하지 않는 투어/클래스입니다.</p>;
      }
    return (
        <section className="tourclassDetail">
            <div className="inner">
                <article className="left">
                    <div className="img-wrap">
                        <img src='/images/con1_default.png' alt={title} />
                    </div>
                </article>
                <article className="right">
                    <ul className="theme">
                        {
                            theme.map((tm, i)=>(<li key={i} className={
                                tm === '역사' ? 'history' :
                                tm === '예술' ? 'art' :
                                tm === '힐링' ? 'healing' :
                                tm === '라이프' ? 'life' :
                                tm === '융합' ? 'fusion' : ''}>{tm}</li>))
                        }
                    </ul>
                    <div className="basic-info">
                        <h3>{title}<span className="rate">평점</span></h3>
                        <ul className="details">
                            <li><i><MdOutlineCalendarMonth /></i>{time}</li>
                            <li><i><LuClock3 /></i>{period}</li>
                            <li><i><IoMapOutline /></i>{region}</li>
                            <li><i><LuMapPin /></i>{place.length}개 명소</li>
                            <li><i><BiCoin /></i>1인 {price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원 <span>(리워드 xxp 지급)</span></li>
                        </ul>
                    </div>
                <Tab items={items}/>
                    
                </article>
            </div>
        </section>
    );
};

export default TourClassDatail;