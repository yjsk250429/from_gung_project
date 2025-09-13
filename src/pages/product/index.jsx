import TourClassList from '../../components/tourClass/TourClassList';
import TourClassTop from '../../components/tourClass/TourClassTop';
import Button from '../../components/ui/button/Button';
import Tab from '../../components/ui/tab/Tab';
import './style.scss';
import { IoIosList } from 'react-icons/io';
import { BiSortAlt2 } from 'react-icons/bi';

const TourClass = () => {
    const tabItems = ['전체', '서울', '인천/경기', '지방'];

    return (
        <section className="tourclass">
            <div className="bg"></div>
            <div className="inner">
                <TourClassTop />
                <Tab items={tabItems} />
                <ul className="sort">
                    <li>
                        <i>
                            <IoIosList />
                        </i>
                        필터
                    </li>
                    <li>
                        <i>
                            <BiSortAlt2 />
                        </i>
                        정렬
                    </li>
                </ul>
                <TourClassList />
                <p className="more">
                    <Button text="더보기" className="default" />
                </p>
            </div>
        </section>
    );
};

export default TourClass;
