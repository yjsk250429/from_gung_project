import { useEffect, useMemo, useRef, useState } from 'react';
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
    const themeTaps = [ '전체', '역사', '예술', '라이프', '힐링', '융합'];
    const dayTaps = [ '전체', '하루', '1박 2일', '2박 3일'];
    const setRegionCategory = useTourClassStore((s) => s.setRegionCategory);
    const category = useTourClassStore((s) => s.category);
    const regionCategory = useTourClassStore((s) => s.regionCategory);
    const tourClass = useTourClassStore((s) => s.tourClass);

    const [filterOpen, setFilterOpen] = useState(false);
    const [selected1, setSeleted1] = useState(0);
    const [selected2, setSeleted2] = useState(0);

    const filterRef = useRef(null);
    
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };

    if (filterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filterOpen]);

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

    useEffect(() => {
        setVisibleCount(INITIAL_COUNT);
    }, [category, filteredList]);

    const atEnd = visibleCount >= totalInCategory; 
    const canToggle = totalInCategory > INITIAL_COUNT; 

    const handleMoreOrFold = () => {
        if (atEnd) {
            setVisibleCount(INITIAL_COUNT);
        } else {
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
                    <li ref={filterRef}>
                        <span onClick={()=>setFilterOpen((prev)=>!prev)}> <i>
                            <IoIosList />
                        </i>필터</span>
                        <ul className={ filterOpen ? 'filterBox on' : 'filterBox'}>
                            <li><span>테마별</span>
                                <ul className='themeTaps'>
                                    {
                                        themeTaps.map((t, index)=>
                                            <li className={selected1=== index ? 'on' : ''} onClick={()=>setSeleted1(index)}>{t}</li>
                                        )
                                    }
                                </ul>
                            </li>
                            <li><span>일정별</span>
                            <ul className='dayTaps'>
                                    {
                                        dayTaps.map((t, index)=>
                                            <li className={selected2=== index ? 'on' : ''} onClick={()=>setSeleted2(index)}>{t}</li>
                                        )
                                    }
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li>
                        
                        <span><i>
                            <BiSortAlt2 />
                        </i>인기순</span>
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
