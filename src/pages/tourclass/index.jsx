import { useEffect, useMemo, useRef, useState } from 'react';
import { useTourClassStore } from '../../components/tourClass/../../store';
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
// 일정 태그 X 버튼으로 해제

const TourClass = () => {
    const category = useTourClassStore((s) => s.category);
    const setRegionCategory = useTourClassStore((s) => s.setRegionCategory);
    const regionCategory = useTourClassStore((s) => s.regionCategory);
    const removeDay = () => {
        setSeleted2(0); // '전체'로 초기화
    };
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

    // 기존 변수 유지
    const [selected1, setSeleted1] = useState(0);
    const [selected2, setSeleted2] = useState(0);
    const [selected3, setSeleted3] = useState(0);

    // 추가: 테마 다중 선택
    const [selectedThemes, setSelectedThemes] = useState([]);

    const filterRef = useRef(null);
    const sortRef = useRef(null);

    useEffect(() => {
        setRegionCategory('전체');
        setSeleted1(0);
        setSeleted2(0);
        setSeleted3(0);
        setSelectedThemes([]);
    }, [category, setRegionCategory]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            const target = e.target;
            if (filterRef.current && !filterRef.current.contains(target)) {
                setFilterOpen(false);
            }
            if (sortRef.current && !sortRef.current.contains(target)) {
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

    // 테마 토글
    const toggleTheme = (index) => {
        if (index === 0) {
            setSelectedThemes([]);
            setSeleted1(0);
            return;
        }
        setSelectedThemes((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
        setSeleted1(index);
    };

    // 태그 X 버튼으로 해제
    const removeTheme = (index) => {
        setSelectedThemes((prev) => prev.filter((i) => i !== index));
    };

    // 리스트 필터링
    const listSource = Array.isArray(tourClass) ? tourClass : [];

    const filteredList = useMemo(() => {
        let filtered = listSource.filter((item) => item.category === category);

        if (category === 'tour') {
            if (regionCategory !== '전체') {
                if (regionCategory === '서울') {
                    filtered = filtered.filter((item) => item.region?.includes('서울'));
                } else if (regionCategory === '인천/경기') {
                    filtered = filtered.filter(
                        (item) => item.region?.includes('인천') || item.region?.includes('경기')
                    );
                } else if (regionCategory === '기타') {
                    filtered = filtered.filter(
                        (item) =>
                            !item.region?.includes('서울') &&
                            !item.region?.includes('인천') &&
                            !item.region?.includes('경기')
                    );
                }
            }
        } else if (category === 'class') {
            if (regionCategory !== '전체') {
                if (regionCategory === '만들기') {
                    filtered = filtered.filter((item) => item.theme?.includes('만들기'));
                }
                if (regionCategory === '요리하기') {
                    filtered = filtered.filter((item) => item.theme?.includes('요리하기'));
                }
                if (regionCategory === '체험하기') {
                    filtered = filtered.filter((item) => item.theme?.includes('체험하기'));
                }
            }
        }

        if (selectedThemes.length > 0) {
            const names = selectedThemes.map((i) => themeTaps[i]);
            filtered = filtered.filter((item) => {
                const th = item.theme || '';
                return names.some((nm) => th.includes(nm));
            });
        }

        const selDay = dayTaps[selected2];
        if (selDay !== '전체') {
            filtered = filtered.filter((item) => item.period === selDay);
        }

        const sorted = [...filtered];
        if (selected3 === 0) {
            sorted.sort((a, b) => a.id - b.id);
        } else if (selected3 === 1) {
            sorted.sort((a, b) => b.id - a.id);
        } else if (selected3 === 2) {
            sorted.sort((a, b) => {
                const rateDiff = (b.rating?.rate || 0) - (a.rating?.rate || 0);
                if (rateDiff !== 0) return rateDiff;
                return (b.rating?.count || 0) - (a.rating?.count || 0);
            });
        } else if (selected3 === 3) {
            sorted.sort((a, b) => {
                const countDiff = (b.rating?.count || 0) - (a.rating?.count || 0);
                if (countDiff !== 0) return countDiff;
                return (b.rating?.rate || 0) - (a.rating?.rate || 0);
            });
        }

        return sorted;
    }, [listSource, category, regionCategory, selectedThemes, selected2, selected3]);

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
            <div className="bg" />
            <div className="inner">
                <TourClassTop />

                <Tab
                    items={tabItems}
                    activeIndex={activeIndex === -1 ? 0 : activeIndex}
                    onClick={(index) => setRegionCategory(tabItems[index])}
                />

                {/* ✅ sort: 왼쪽 필터태그 + 오른쪽 드롭다운 */}
                <ul className="sort">
                    <li className="selected-filters">
                        {(selectedThemes.length > 0 || selected2 !== 0) && (
                            <div className="filters-wrap">
                                {/* 전체 해제 버튼 */}
                                <button
                                    type="button"
                                    className="filter-tag reset"
                                    onClick={() => {
                                        setSelectedThemes([]);
                                        setSeleted2(0);
                                    }}
                                >
                                    전체 해제
                                </button>

                                {/* 테마 태그들 */}
                                {selectedThemes.map((i) => (
                                    <button
                                        key={`theme-${i}`}
                                        type="button"
                                        className="filter-tag"
                                        onClick={() => removeTheme(i)}
                                    >
                                        <span className="label">{themeTaps[i]}</span>
                                        <span className="close">×</span>
                                    </button>
                                ))}

                                {/* 일정 태그 */}
                                {selected2 !== 0 && (
                                    <button
                                        key="day"
                                        type="button"
                                        className="filter-tag"
                                        onClick={removeDay}
                                    >
                                        <span className="label">{dayTaps[selected2]}</span>
                                        <span className="close">×</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </li>

                    <li className="sort-right">
                        {category === 'tour' && (
                            <span ref={filterRef}>
                                <span onClick={() => setFilterOpen((prev) => !prev)}>
                                    <i>
                                        <IoIosList />
                                    </i>
                                    <p>필터</p>
                                </span>
                                <ul className={filterOpen ? 'filterBox on' : 'filterBox'}>
                                    <li>
                                        <span>테마별</span>
                                        <ul className="themeTaps">
                                            {themeTaps.map((t, index) => {
                                                const isOn =
                                                    index === 0
                                                        ? selectedThemes.length === 0
                                                        : selectedThemes.includes(index);
                                                return (
                                                    <li
                                                        key={t}
                                                        className={isOn ? 'on' : ''}
                                                        onClick={() => toggleTheme(index)}
                                                    >
                                                        {t}
                                                    </li>
                                                );
                                            })}
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
                            </span>
                        )}

                        <span ref={sortRef}>
                            <span onClick={() => setSortOpen((prev) => !prev)}>
                                <i>
                                    <BiSortAlt2 />
                                </i>
                                <p>{sortTaps[selected3]}</p>
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
                        </span>
                    </li>
                </ul>

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
            <WishModal className="addWish" />
        </section>
    );
};

export default TourClass;
