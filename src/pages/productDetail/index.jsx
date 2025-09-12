import { useParams } from "react-router-dom";
import { useTourClassStore } from "../../store";
import './style.scss';

const TourClassDatail = () => {
    const { tourclassID } = useParams();
      const tourClass = useTourClassStore((state) => state.tourClass);
      const {id, title, theme, description, period, price, img} = tourClass;
      
    // if (!products) {
    //     return <p>상품 데이터를 불러오는 중입니다.</p>;
    // }
    // const thisItem = products.find((product) => product.id === Number(productID));
    // if (!thisItem) {
    //     return <p>해당 상품을 찾을 수 없습니다.</p>;
    // }
    if (!tourclassID) {
        return <p>존재하지 않는 투어/클래스입니다.</p>;
      }
    return (
        <section className="tourclassDetail">
            <div className="inner">
                <article className="left">
                    <img src={img} alt={title} />
                </article>
                <article className="right">

                    
                </article>
            </div>
        </section>
    );
};

export default TourClassDatail;