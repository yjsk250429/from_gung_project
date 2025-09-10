import Button from "../../components/ui/button/Button";
import Tab from "../../components/ui/tab/Tab";
import './style.scss';

const TourClass = () => {
    const tabItems = ['전체', '서울', '인천/경기', '지방'];

    return (
        <>
            <div className="inner">
                <Tab items={tabItems}/>
                <Button text="더보기" className="default"/>
            </div>
        </>
    );
};

export default TourClass;