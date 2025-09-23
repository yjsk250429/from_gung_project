import './style.scss';

const WishlistSection = ({ activeSubMenu }) => {
    const items = Array.from({ length: 6 }).map((_, i) => ({
        id: i + 1,
        title: '경복궁 달빛기행',
        img: '/images/sample/tour_sample.jpg', // 임시
        disabled: i === 2, // 예시: 비활성 카드
    }));

    return (
        <div className="wishlist">
            <h2>{activeSubMenu === 'tour' ? '투어 찜 목록' : 'OTT 찜 목록'}</h2>
            <div className="wishlist_toolbar">
                <span>전체 선택 / 선택 삭제</span>
            </div>
            <ul className="wishlist_grid">
                {items.map((it) => (
                    <li key={it.id} className={it.disabled ? 'disabled' : ''}>
                        <div className="card">
                            <div className="imgwrap">
                                <img src={it.img} alt={it.title} />
                                <i className="selector" aria-hidden />
                            </div>
                            <p className="title">{it.title}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WishlistSection;
