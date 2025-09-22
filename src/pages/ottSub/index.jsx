import OttTop from '../../components/ottSub/OttTop';
import CuratedSageuk from '../../components/tmdb/CuratedSageuk';
import './style.scss';
import Tab from '../../components/ui/tab/Tab';
import { BiSortAlt2 } from 'react-icons/bi';
import { useMemo, useState } from 'react';
import { useMovieStore } from '../../store';

const OttSub = () => {
    const mediaCategory = useMovieStore((s) => s.mediaCategory);

    const tabItems = useMemo(() => {
        if (mediaCategory === 'tv') {
            return ['전체', '정통사극', '퓨전사극', '판타지사극'];
        }
        if (mediaCategory === 'movie') {
            return ['전체', '드라마', '액션', '코미디'];
        }
        return ['전체'];
    }, [mediaCategory]);

    // index 기반 상태 관리
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);

    return (
        <section className="ottsub">
            <div className="inner">
                <div className="ottclass">
                    <OttTop />
                </div>

                <Tab
                    items={tabItems}
                    activeIndex={selectedTabIndex}
                    onClick={setSelectedTabIndex}
                />

                <ul className="sort">
                    <li>
                        <i>
                            <BiSortAlt2 />
                        </i>
                        정렬
                    </li>
                </ul>

                <CuratedSageuk filterCategory={tabItems[selectedTabIndex]} />
            </div>
        </section>
    );
};

export default OttSub;
