import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoundTap from '../ui/roundTap/RoundTap';
import './style.scss';
import { useTourClassStore } from '../../store';

const TourRecommend = [
    {
        id: 1,
        img: '/images/tourclass/tourList_top2.png',
        title: '왕실의 발걸음을 따라',
        caption: '왕의 행차를 따라, 궁중의 시간을 걷다',
        link: '/tourclass/2',
    },
    {
        id: 2,
        img: '/images/tourclass/tourList_top3.jpg',
        title: '맛으로 느끼는 미식 산책',
        caption: '감성과 전통을 한번에 느낄 수 있는 시간',
        link: '/tourclass/3',
    },
    {
        id: 3,
        img: '/images/tourclass/tourList_top4.jpg',
        title: '전통과 현대의 교차점',
        caption: '도시 곳곳에 숨은 전통여행',
        link: '/tourclass/4',
    },
    {
        id: 4,
        img: '/images/tourclass/tourList_top5.png',
        title: '문화가 흐르는 시간여행',
        caption: '흥선대원군의 자취의 발자국',
        link: '/tourclass/5',
    },
    {
        id: 5,
        img: '/images/tourclass/tourList_top1.png',
        title: '빛으로 물드는 궁궐의 밤',
        caption: '조선 왕궁의 고요한 아름다움을 느껴보세요',
        link: '/tourclass/1',
    },
];

const ClassRecommend = [
    {
        id: 1,
        img: '/images/tourclass/classList_top2.png',
        title: '한복 한 자락, 멋을 입다',
        caption: '아름다운 한복 체험으로 남기는 품격의 추억',
        link: '/tourclass/88',
    },
    {
        id: 2,
        img: '/images/tourclass/classList_top3.jpg',
        title: '향긋한 향, 아름다운 매력',
        caption: '다도에서 느낄 수 있는 여유로운 시간',
        link: '/tourclass/89',
    },
    {
        id: 3,
        img: '/images/tourclass/classList_top4.jpg',
        title: '손으로 만드는 전통문화',
        caption: '전통과 예술이 숨 쉬는 도자기 체험',
        link: '/tourclass/90',
    },
    {
        id: 4,
        img: '/images/tourclass/classList_top5.jpg',
        title: '즐기는 문화유산 속 놀이',
        caption: '즐기며 모두가 함께 어울리는 따뜻한 시간',
        link: '/tourclass/91',
    },
    {
        id: 5,
        img: '/images/tourclass/classList_top1.png',
        title: '천연자개, 감성을 담다',
        caption: '자연이 빚은 자개의 빛을 내 손에 담다',
        link: '/tourclass/88',
    },
];

const VISIBLE = 2;
const STEP_MS = 3000;
const TRANSITION_MS = 600;

const TourClassTop = () => {
    const navigate = useNavigate();
    const category = useTourClassStore((s) => s.category);
    const setCategory = useTourClassStore((s) => s.setCategory);

    const base = category === 'tour' ? TourRecommend : ClassRecommend;
    const doubled = base.concat(base); // 2배로 늘려서 자연스럽게 반복

    const trackRef = useRef(null);
    const itemRef = useRef(null);

    const [index, setIndex] = useState(0);
    const [stepPx, setStepPx] = useState(0);
    const [noTrans, setNoTrans] = useState(false);
    const [isPaused, setIsPaused] = useState(false); // 👈 일시정지 상태

    useEffect(() => {
        setCategory('tour');
    }, [setCategory]);

    // 프리로드
    useEffect(() => {
        [...TourRecommend, ...ClassRecommend].forEach(({ img }) => {
            const im = new Image();
            im.src = img;
        });
    }, []);

    // 한 칸 이동 px 측정
    const measure = () => {
        const li = itemRef.current;
        if (!li) return;
        const rect = li.getBoundingClientRect();
        const style = getComputedStyle(li);
        const mr = parseFloat(style.marginRight || '0') || 0;
        const ulStyle = getComputedStyle(li.parentElement);
        const gap = parseFloat(ulStyle.gap || ulStyle.columnGap || '0') || 0;
        setStepPx(Math.round(rect.width + mr + gap));
    };

    useLayoutEffect(() => {
        measure();
        const onResize = () => measure();
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [category]);

    // 자동 이동
    useEffect(() => {
        if (isPaused) return; // 👈 마우스 올리면 멈춤

        let t;
        if (index === base.length - 2) {
            // 마지막 슬라이드 도착했을 때 → 더 오래 멈춤
            t = setTimeout(() => setIndex(0), STEP_MS + 1000); // 네가 맞춰둔 로직 그대로
        } else {
            // 일반 슬라이드 이동
            t = setTimeout(() => setIndex((v) => v + 1), STEP_MS);
        }
        return () => clearTimeout(t);
    }, [index, base.length, isPaused]); // 👈 isPaused 의존성 추가

    // 경계 처리 (되감기식 리셋)
    const onTransitionEnd = () => {
        if (index >= base.length - 1) {
            setNoTrans(true);
            setIndex(0); // 맨 처음으로 점프
            requestAnimationFrame(() => setNoTrans(false));
        }
    };

    useEffect(() => {
        setNoTrans(true);
        setIndex(0);
        requestAnimationFrame(() => setNoTrans(false));
    }, [category]);

    return (
        <article className="top">
            <RoundTap
                text1="투어"
                value1="tour"
                text2="클래스"
                value2="class"
                bgColor="#d9d9d9"
                selected={category}
                onChange={setCategory}
            />

            <div className="slider">
                <ul
                    className="recommend"
                    ref={trackRef}
                    onTransitionEnd={onTransitionEnd}
                    onMouseEnter={() => setIsPaused(true)} // 👈 마우스 올리면 멈춤
                    onMouseLeave={() => setIsPaused(false)} // 👈 마우스 치우면 다시 재생
                    style={{
                        transform: `translate3d(-${index * stepPx}px,0,0)`,
                        transition: noTrans ? 'none' : `transform ${TRANSITION_MS}ms ease`,
                    }}
                >
                    {doubled.map((item, i) => (
                        <li
                            key={`${item.id}-${i}`}
                            ref={i === 0 ? itemRef : null}
                            onClick={() => navigate(item.link)}
                        >
                            <img src={item.img} alt={item.title} />
                            <div className="grad" />
                            <div className="text">
                                <strong>{item.title}</strong>
                                <em>{item.caption}</em>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </article>
    );
};

export default TourClassTop;
