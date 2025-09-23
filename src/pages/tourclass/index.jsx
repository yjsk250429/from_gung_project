import { useEffect, useMemo, useRef, useState } from 'react';
import { useModalStore, useTourClassStore } from '../../components/tourClass/../../store';
import TourClassList from '../../components/tourClass/TourClassList';
import TourClassTop from '../../components/tourClass/TourClassTop';
import Button from '../../components/ui/button/Button';
import Tab from '../../components/ui/tab/Tab';
import './style.scss';
import { IoIosList } from 'react-icons/io';
import { BiSortAlt2 } from 'react-icons/bi';
import { FaCheck } from 'react-icons/fa6';
import { MdErrorOutline } from 'react-icons/md';
import WishModal from '../../components/ui/modal/WishModal';
import { useNavigate } from 'react-router-dom';

const INITIAL_COUNT = 8;
const STEP = 8;

const TourClass = () => {
    const category = useTourClassStore((s) => s.category);
    const setRegionCategory = useTourClassStore((s) => s.setRegionCategory);
    const regionCategory = useTourClassStore((s) => s.regionCategory);

    const tabItems = useMemo(() => {
        if (category === 'tour') {
            return ['전체', '서울', '인천/경기', '기타'];
        } else if (category === 'class') {
            return ['전체', '만들기', '요리하기', '체험하기'];
        } else {
            return ['전체'];
        }
    }, [category]);

    const themeTaps = ['전체', '역사', '예술', '라이프', '힐링', '융합'];
    const dayTaps = ['전체', '하루', '1박 2일', '2박 3일'];
    const sortTaps = ['최신순', '오래된순', '평점순', '리뷰순'];
    const tourClass = useTourClassStore((s) => s.tourClass);
    const activeIndex = tabItems.findIndex((item) => item === regionCategory);
    const navigate = useNavigate();

    const [filterOpen, setFilterOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);
    const [selected1, setSeleted1] = useState(0);
    const [selected2, setSeleted2] = useState(0);
    const [selected3, setSeleted3] = useState(0);

    const filterRef = useRef(null);
    const sortRef = useRef(null);

    useEffect(() => {
        setRegionCategory('전체');
        setSeleted1(0);
        setSeleted2(0);
        setSeleted3(0);
    }, [category, setRegionCategory]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                setFilterOpen(false);
            }
            if (sortRef.current && !sortRef.current.contains(e.target)) {
                setSortOpen(false);
            }
        };

        if (filterOpen || sortOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [filterOpen, sortOpen]);

    const filteredList = useMemo(() => {
        // 1차: 투어/클래스 카테고리 필터
        let filtered = tourClass.filter((item) => item.category === category);

        // 2차: category에 따라 필터 다르게 적용
        if (category === 'tour') {
            if (regionCategory !== '전체') {
                if (regionCategory === '서울') {
                    filtered = filtered.filter((item) => item.region.includes('서울'));
                } else if (regionCategory === '인천/경기') {
                    filtered = filtered.filter(
                        (item) => item.region.includes('인천') || item.region.includes('경기')
                    );
                } else if (regionCategory === '기타') {
                    filtered = filtered.filter(
                        (item) =>
                            !item.region.includes('서울') &&
                            !item.region.includes('인천') &&
                            !item.region.includes('경기')
                    );
                }
            }
        } else if (category === 'class') {
            if (regionCategory !== '전체') {
                if (regionCategory === '만들기') {
                    filtered = filtered.filter((item) => item.theme.includes('만들기'));
                }
                if (regionCategory === '요리하기') {
                    filtered = filtered.filter((item) => item.theme.includes('요리하기'));
                }
                if (regionCategory === '체험하기') {
                    filtered = filtered.filter((item) => item.theme.includes('체험하기'));
                }
            }
        }

        // 3차 필터: 테마 (themeTaps[selected1]) - "전체" 제외
        const selectedTheme = themeTaps[selected1];
        if (selectedTheme !== '전체') {
            filtered = filtered.filter((item) => item.theme?.includes(selectedTheme));
        }

        //  4차 필터: 일정 (dayTaps[selected2]) - "전체" 제외
        const selectedDay = dayTaps[selected2];
        if (selectedDay !== '전체') {
            filtered = filtered.filter((item) => item.period === selectedDay);
        }

       // 정렬
        let sorted = [...filtered];

        if (selected3 === 0) {
        // 최신순 (id 오름차순)
        sorted.sort((a, b) => a.id - b.id);
        } else if (selected3 === 1) {
        // 오래된순 (id 내림차순)
        sorted.sort((a, b) => b.id - a.id);
        } else if (selected3 === 2) {
        // 평점순 (평점 > 리뷰순)
        sorted.sort((a, b) => {
            const rateDiff = (b.rating?.rate || 0) - (a.rating?.rate || 0);
            if (rateDiff !== 0) return rateDiff;
            return (b.rating?.count || 0) - (a.rating?.count || 0);
        });
        } else if (selected3 === 3) {
        // 리뷰순 (리뷰수 > 평점순)
        sorted.sort((a, b) => {
            const countDiff = (b.rating?.count || 0) - (a.rating?.count || 0);
            if (countDiff !== 0) return countDiff;
            return (b.rating?.rate || 0) - (a.rating?.rate || 0);
        });
        }


        return sorted;
    }, [tourClass, category, regionCategory, selected1, selected2, selected3]);

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
                <Tab
                    items={tabItems}
                    activeIndex={activeIndex === -1 ? 0 : activeIndex}
                    onClick={(index) => setRegionCategory(tabItems[index])}
                />
                <ul className="sort">
                    {category === 'tour' && (
                        <li ref={filterRef}>
                            <span onClick={() => setFilterOpen((prev) => !prev)}>
                                <i>
                                    <IoIosList />
                                </i>
                                필터
                            </span>
                            <ul className={filterOpen ? 'filterBox on' : 'filterBox'}>
                                <li>
                                    <span>테마별</span>
                                    <ul className="themeTaps">
                                        {themeTaps.map((t, index) => (
                                            <li
                                                key={t}
                                                className={selected1 === index ? 'on' : ''}
                                                onClick={() => setSeleted1(index)}
                                            >
                                                {t}
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                                <li>
                                    <span>일정별</span>
                                    <ul className="dayTaps">
                                        {dayTaps.map((t, index) => (
                                            <li
                                                key={t}
                                                className={selected2 === index ? 'on' : ''}
                                                onClick={() => setSeleted2(index)}
                                            >
                                                {t}
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            </ul>
                        </li>
                    )}
                    <li ref={sortRef}>
                        <span onClick={() => setSortOpen((prev) => !prev)}>
                            <i>
                                <BiSortAlt2 />
                            </i>
                            {sortTaps[selected3]}
                        </span>
                        <ul className={sortOpen ? 'sortBox on' : 'sortBox'}>
                            {sortTaps.map((t, index) => (
                                <li
                                    key={t}
                                    onClick={() => setSeleted3(index)}
                                    className={selected3 === index ? 'sortSelected' : ''}
                                >
                                    <i>{selected3 === index && <FaCheck />}</i>
                                    <span>{t}</span>
                                </li>
                            ))}
                        </ul>
                    </li>
                </ul>

                {/* 리스트: limit 개수만 표시 */}
                {filteredList.length > 0 ? (
                    <TourClassList list={filteredList} limit={visibleCount} />
                ) : (
                    <div className="empty-message">
                        <i>
                            <MdErrorOutline />
                        </i>
                        해당 조건에 맞는 결과가 없습니다.
                    </div>
                )}

                {/* 전체가 8개 초과일 때만 버튼 표시 */}
                {canToggle && (
                    <p className="more">
                        <Button
                            text={atEnd ? '접기' : '더보기'}
                            className="default main1"
                            onClick={handleMoreOrFold}
                            aria-pressed={atEnd}
                        />
                    </p>
                )}
            </div>
            <WishModal className='addWish'/>
        </section>
    );
};

export default TourClass;
