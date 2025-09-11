import TourClassList from "../../components/tourClass/TourClassList";
import TourClassTop from "../../components/tourClass/tourClassTop";
import Button from "../../components/ui/button/Button";
import Tab from "../../components/ui/tab/Tab";
import './style.scss';

const TourClass = () => {
    const tabItems = ['전체', '서울', '인천/경기', '지방'];

    return (
        <section className="tourclass">
            <div className="inner">
                <TourClassTop/>
                <Tab items={tabItems}/>
                <TourClassList/>
                <Button text="더보기" className="default"/>
            </div>
        </section>
    );
};

export default TourClass;