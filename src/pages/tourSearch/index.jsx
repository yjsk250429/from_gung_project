import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { tourclassData } from '../../api/tourclassData';
import TourClassList from '../../components/tourClass/TourClassList';
import './style.scss';

function useQuery() {
    const { search } = useLocation();
    return new URLSearchParams(search);
}

const matchFields = (item, keyword) => {
    if (!keyword) return true;
    const q = keyword.toLowerCase().trim();

    const haystacks = [
        item.title,
        item.description,
        item.region,
        item.period,
        item.time,
        ...(Array.isArray(item.theme) ? item.theme : []),
        ...(Array.isArray(item.place) ? item.place : []),
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

    return haystacks.includes(q);
};

const Section = ({ title, list }) => {
    const [expanded, setExpanded] = useState(false);
    const visible = expanded ? list : list.slice(0, 4);

    return (
        <section className="search-section">
            <div className="section-header">
                <h2 className="section-title">{title}</h2>
                {list.length > 4 && (
                    <button
                        className="more-btn"
                        type="button"
                        onClick={() => setExpanded((v) => !v)}
                    >
                        {expanded ? '접기' : '더보기'}
                    </button>
                )}
            </div>

            {list.length > 0 ? (
                <TourClassList list={visible} />
            ) : (
                <div className="empty small">
                    <p>검색 결과가 없습니다.</p>
                </div>
            )}
        </section>
    );
};

const TourSearch = () => {
    const q = useQuery().get('q') || '';
    const filtered = useMemo(() => tourclassData.filter((it) => matchFields(it, q)), [q]);

    const tours = filtered.filter((it) => it.category === 'tour');
    const classes = filtered.filter((it) => it.category === 'class');

    return (
        <div className="tour-search-page">
            {/* 상단 배경 */}
            <div className="search-top">
                <img src="/images/tourclass/top_bg.png" alt="" />
                <p className="search-caption">
                    <strong>‘{q || '전체'}’</strong> 에 대한 검색결과 입니다.
                </p>
            </div>

            {/* 섹션: 좌측 정렬 + 더보기 */}
            <div className="section-list">
                <Section title="투어" list={tours} />
                <Section title="클래스" list={classes} />
            </div>
        </div>
    );
};

export default TourSearch;
