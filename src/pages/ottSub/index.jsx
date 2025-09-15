import OttList from '../../components/ottSub/OttList';
import OttTop from '../../components/ottSub/OttTop';
import CuratedSageuk from '../../components/tmdb/CuratedSageuk';
import './style.scss';

import Tab from '../../components/ui/tab/Tab';
import { BiSortAlt2 } from 'react-icons/bi';

const OttSub = () => {
    const tabItems = ['전체', '퓨전사극', '액션', '로맨스', '코미디'];

    return (
        <section className="ottsub">
            <div className="inner">
                {/* <OttList/> */}
                <div className="ottclass">
                    <OttTop />
                </div>
                <Tab items={tabItems} />
                <ul className="sort">
                    <li>
                        <i>
                            <BiSortAlt2 />
                        </i>
                        정렬
                    </li>
                </ul>

                <CuratedSageuk />
            </div>
        </section>
    );
};

export default OttSub;
