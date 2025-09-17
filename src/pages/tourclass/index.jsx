import { useEffect, useMemo, useState } from 'react';
import { useTourClassStore } from '../../components/tourClass/../../store';
import TourClassList from '../../components/tourClass/TourClassList';
import TourClassTop from '../../components/tourClass/TourClassTop';
import Button from '../../components/ui/button/Button';
import Tab from '../../components/ui/tab/Tab';
import './style.scss';
import { IoIosList } from 'react-icons/io';
import { BiSortAlt2 } from 'react-icons/bi';

const INITIAL_COUNT = 8;
const STEP = 8;

const TourClass = () => {
    const tabItems = ['전체', '서울', '인천/경기', '기타'];
    const setRegionCategory = useTourClassStore((s) => s.setRegionCategory);
    const category = useTourClassStore((s) => s.category);
    const regionCategory = useTourClassStore((s) => s.regionCategory);
    const tourClass = useTourClassStore((s) => s.tourClass);


    const filteredList = useMemo(() => {
        // 1차: 투어/클래스
        let filtered = tourClass.filter((item) => item.category === category);
    
        // 2차: 지역
        if (regionCategory === '전체') return filtered;
        if (regionCategory === '서울') {
          return filtered.filter((item) => item.region.includes('서울'));
        }
        if (regionCategory === '인천/경기') {
          return filtered.filter(
            (item) => item.region.includes('인천') || item.region.includes('경기')
          );
        }
        if (regionCategory === '기타') {
          return filtered.filter(
            (item) =>
              !item.region.includes('서울') &&
              !item.region.includes('인천') &&
              !item.region.includes('경기')
          );
        }
        return filtered;
      }, [tourClass, category, regionCategory]);


    const totalInCategory = filteredList.length;
    const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

    // 탭(카테고리) 바뀌면 다시 8개로 리셋
    useEffect(() => {
        setVisibleCount(INITIAL_COUNT);
    }, [category, filteredList]);

    const atEnd = visibleCount >= totalInCategory; // 끝까지 보여줬는지
    const canToggle = totalInCategory > INITIAL_COUNT; // 전체가 8개 이하면 버튼 숨김

    const handleMoreOrFold = () => {
        if (atEnd) {
            // 접기
            setVisibleCount(INITIAL_COUNT);
        } else {
            // 더보기 (8개씩 증가, 끝 넘지 않게)
            setVisibleCount((c) => Math.min(c + STEP, totalInCategory));
        }
    };

    return (
        <section className="tourclass">
            <div className="bg"></div>
            <div className="inner">
                <TourClassTop />
                <Tab items={tabItems} onClick={(index) => setRegionCategory(tabItems[index])}/>

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

                {/* 리스트: limit 개수만 표시 */}
                <TourClassList list={filteredList} limit={visibleCount} />

                {/* 전체가 8개 초과일 때만 버튼 표시 */}
                {canToggle && (
                    <p className="more">
                        <Button
                            text={atEnd ? '접기' : '더보기'}
                            className="default"
                            onClick={handleMoreOrFold}
                            aria-pressed={atEnd}
                        />
                    </p>
                )}
            </div>
        </section>
    );
};

export default TourClass;
