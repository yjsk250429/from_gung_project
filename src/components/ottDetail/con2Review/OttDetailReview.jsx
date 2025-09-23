import { useEffect, useMemo, useState } from 'react';
import './style.scss';
import { MdStar, MdStarBorder, MdStarHalf } from 'react-icons/md';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import { TiArrowSortedDown } from 'react-icons/ti';
import Button from '../../ui/button/Button';

const INITIAL_COUNT = 6; // 처음 6개
const LOAD_MORE_STEP = 3; // 클릭마다 3개 추가

// 🫧 하트 파티클 컴포넌트 (자동으로 나타났다 사라짐)
// 🫧 하트 파티클 컴포넌트 (자동으로 나타났다 사라짐)
const HeartBurst = ({ count = 10, duration = 720 }) => {
    const [alive, setAlive] = useState(true);
    const particles = useMemo(() => {
        return Array.from({ length: count }).map((_, index) => {
            const angle = (Math.PI * 2 * index) / count + (Math.random() * 0.5 - 0.25); // 균등 분포 + 약간의 랜덤
            const dist = 20 + Math.random() * 30; // px
            const scale = 0.6 + Math.random() * 0.8;
            const dur = duration - 200 + Math.random() * 400;
            const delay = Math.random() * 100; // 시작 시간을 약간씩 다르게

            return {
                tx: Math.cos(angle) * dist,
                ty: Math.sin(angle) * dist,
                scale,
                dur,
                delay,
                id: `${Date.now()}-${index}`, // 고유한 key 생성
            };
        });
    }, [count, duration]);

    useEffect(() => {
        const t = setTimeout(() => setAlive(false), duration + 300);
        return () => clearTimeout(t);
    }, [duration]);

    if (!alive) return null;

    return (
        <span className="heart-burst" aria-hidden="true">
            {particles.map((p) => (
                <i
                    key={p.id}
                    className="heart-particle"
                    style={{
                        '--tx': `${p.tx}px`,
                        '--ty': `${p.ty}px`,
                        '--dur': `${p.dur}ms`,
                        '--scale': p.scale,
                        '--delay': `${p.delay}ms`,
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none',
                        color: '#ff69b4',
                        fontSize: '12px',
                        animation: `heartBurstAnim ${p.dur}ms ease-out ${p.delay}ms forwards`,
                    }}
                >
                    ♥
                </i>
            ))}
        </span>
    );
};

const OttDetailReview = ({ reviews = [] }) => {
    const [list, setList] = useState([]);
    const [open, setOpen] = useState({});
    const [liked, setLiked] = useState({});
    const [likes, setLikes] = useState({});
    const [showCount, setShowCount] = useState(INITIAL_COUNT);
    const [shots, setShots] = useState({}); // 하트 이펙트 트리거용 카운터

    useEffect(() => {
        setList(reviews);
        const lk = {},
            ct = {};
        reviews.forEach((r) => {
            lk[r.id] = !!r.liked;
            ct[r.id] = Number(r.likes) || 0;
        });
        setLiked(lk);
        setLikes(ct);
        setOpen({});
        setShowCount(Math.min(INITIAL_COUNT, reviews.length));
        setShots({});
    }, [reviews]);

    // 별 UI (소수점 지원)
    const renderStars = (value) => {
        const rating = Math.max(0, Math.min(5, Number(value) || 0));
        return [1, 2, 3, 4, 5].map((i) => {
            if (rating >= i) return <MdStar key={i} className="full" />;
            if (rating >= i - 0.5) return <MdStarHalf key={i} className="half" />;
            return <MdStarBorder key={i} className="empty" />;
        });
    };

    const toggleOpen = (id) => setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

    // StrictMode에서도 +1/-1 정확히
    const toggleLike = (id) => {
        const wasLiked = !!liked[id];
        const willLike = !wasLiked;

        setLiked((prev) => ({ ...prev, [id]: willLike }));
        setLikes((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + (willLike ? 1 : -1) }));

        // ♥ 뿌리기는 "좋아요 켜질 때"만 실행
        if (willLike) {
            setShots((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
        }
    };

    const handleLoadMore = () => setShowCount((c) => Math.min(c + LOAD_MORE_STEP, list.length));

    const hasMore = list.length > showCount;

    return (
        <section className="ottreview">
            <div className="con2-inner">
                <div className="review" data-aos="fade-up" data-aos-delay="150">
                    <strong>리뷰</strong>
                    <span>{list.length}개</span>
                    <i className="line"></i>
                </div>

                <div className="reviewlist" data-aos="fade-up" data-aos-delay="350">
                    {list.slice(0, showCount).map((r) => (
                        <div className="listbox" key={r.id}>
                            <div
                                className="star"
                                aria-label={`별점 ${Number(r.rating ?? 0).toFixed(1)}점`}
                                title={`별점 ${Number(r.rating ?? 0).toFixed(1)}점`}
                            >
                                {renderStars(r.rating)}
                            </div>

                            <div className="nick">
                                <span>
                                    닉네임 <p>{r.nickname}</p>
                                </span>
                                <span>{r.date}</span>
                                <span>조회 {r.views}</span>
                                <span>공감 {likes[r.id] ?? r.likes ?? 0}</span>

                                {/* 하트 + 이펙트 */}
                                <span
                                    role="button"
                                    aria-pressed={!!liked[r.id]}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleLike(r.id);
                                    }}
                                    className={`heart ${liked[r.id] ? 'on' : ''}`}
                                >
                                    {liked[r.id] ? <IoMdHeart /> : <IoMdHeartEmpty />}
                                    {/* shots[r.id]가 변하면 새로운 Burst가 뜸 */}
                                    {shots[r.id] ? <HeartBurst key={shots[r.id]} /> : null}
                                </span>
                            </div>

                            <div className={`desc ${open[r.id] ? 'open' : ''}`}>
                                <strong>{r.title}</strong>
                                <p>{r.content}</p>
                            </div>

                            {/* <div
                                className={`more ${open[r.id] ? 'open' : ''}`}
                                role="button"
                                onClick={() => toggleOpen(r.id)}
                            >
                                {open[r.id] ? '접기' : '더보기'}
                                <TiArrowSortedDown />
                            </div> */}
                        </div>
                    ))}
                </div>

                {hasMore && (
                    <div className="morebtn">
                        <Button text="더보기" className="medium" onClick={handleLoadMore} />
                    </div>
                )}
            </div>
        </section>
    );
};

export default OttDetailReview;
