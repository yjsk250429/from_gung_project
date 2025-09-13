import React, { useState } from 'react';
import './style.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/scrollbar';
import { Scrollbar } from 'swiper/modules';

import { RiInstagramFill, RiFacebookFill, RiShare2Line } from 'react-icons/ri';
import { GoHomeFill } from 'react-icons/go';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { HiPlay } from 'react-icons/hi2';
import { MdStar, MdStarHalf, MdStarBorder } from 'react-icons/md';

function Stars({ rating = 0, className = '' }) {
    const n = Number(rating);
    const safe10 = Number.isFinite(n) ? Math.max(0, Math.min(10, n)) : 0;
    const r = safe10 / 2; // 0~5
    const full = Math.floor(r);
    const half = r - full >= 0.5 ? 1 : 0;
    const empty = Math.max(0, 5 - full - half);

    return (
        <p className={className} aria-label={`평점 ${safe10.toFixed(1)}점 (10점 만점)`}>
            {Array.from({ length: full }).map((_, i) => (
                <MdStar key={`f${i}`} className="star full" />
            ))}
            {half ? <MdStarHalf className="star half" /> : null}
            {Array.from({ length: empty }).map((_, i) => (
                <MdStarBorder key={`e${i}`} className="star empty" />
            ))}
        </p>
    );
}

// 주소 없으면 비활성(회색) 처리 + 클릭 막기
function linkProps(url) {
    const ok = !!(url && String(url).trim());
    const base = { 'aria-disabled': !ok, className: ok ? undefined : 'disabled' };
    return ok
        ? { href: url, target: '_blank', rel: 'noreferrer', ...base }
        : { href: '#', onClick: (e) => e.preventDefault(), ...base };
}

// 하트 파티클용 유틸
function makeBurst(n = 12) {
    return Array.from({ length: n }, (_, i) => ({
        id: `${Date.now()}-${i}`,
        dx: (Math.random() * 2 - 1) * 48, // -48 ~ 48px
        dy: -(18 + Math.random() * 54), // 위쪽으로
        rot: Math.floor(Math.random() * 360),
        scale: 0.8 + Math.random() * 0.6,
        delay: Math.random() * 0.05,
    }));
}

/**
 * props
 * - backdrop, poster, titleLogo
 * - rating (0~10), year, genres (string[])
 * - seasonCount (number), hasSubtitle (boolean), cert (예: '15')
 * - episodes: [{ ep, name, runtime, date, thumb }]
 * - cast: [{ name, profile }]
 * - social: { homepage, instagram, facebook }
 * - overview (string)
 */
const OttDetailVisual = ({
    backdrop,
    titleLogo,
    rating,
    year,
    genres = [],
    seasonCount = 1,
    hasSubtitle = false,
    cert,
    episodes = [],
    cast = [],
    social = { homepage: '', instagram: '', facebook: '' },
    overview = '',
}) => {
    const safeRating = (() => {
        const n = Number(rating);
        return Number.isFinite(n) ? n : 0;
    })();

    // 🔴 찜(하트) 상태 + 파티클 생성
    const [liked, setLiked] = useState(false);
    const [particles, setParticles] = useState([]);

    const triggerBurst = () => {
        // 8방향으로 흩어지는 하트 파티클
        const count = 8;
        const dist = 48; // px
        const ps = Array.from({ length: count }).map((_, i) => {
            const angle = (360 / count) * i;
            const rad = (angle * Math.PI) / 180;
            const dx = Math.cos(rad) * dist;
            const dy = Math.sin(rad) * dist;
            const rot = Math.floor(Math.random() * 40 - 20); // -20~20deg
            const delay = Math.random() * 0.1; // 0 ~ 0.1s
            const scale = 0.75 + Math.random() * 0.35; // 0.75~1.1
            return { dx, dy, rot, delay, scale };
        });
        setParticles(ps);
        setTimeout(() => setParticles([]), 750);
    };

    const onToggleWish = () => {
        setLiked((prev) => {
            const next = !prev;
            // 👉 "빈 → 꽉"으로 바뀔 때만 파티클
            if (!prev && next) triggerBurst();
            return next;
        });
    };

    return (
        <div className="detailvisual">
            <div className="grad"></div>
            <div className="bg"></div>

            <div className="left">
                <div className="episode">
                    <strong>회차</strong>
                    <p>({`총 ${episodes.length}회`})</p>
                </div>

                <div className="swiper">
                    <Swiper
                        direction="vertical"
                        slidesPerView="auto"
                        spaceBetween={16}
                        scrollbar={{ hide: false, draggable: true }}
                        modules={[Scrollbar]}
                        className="episodeSwiper"
                    >
                        {episodes.map((ep, idx) => (
                            <SwiperSlide key={ep.ep ?? idx}>
                                <div className="lists">
                                    <div className="ep-thumb">
                                        {ep.thumb && (
                                            <img
                                                src={ep.thumb}
                                                alt="thumbnail"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        )}
                                    </div>
                                    <i className="icon">
                                        <img src="/images/ott/playicon-1.png" alt="play" />
                                    </i>
                                    <strong>
                                        {`EP.${ep.ep} `}
                                        <span>{ep.name || ''}</span>
                                    </strong>
                                    <div className="date">
                                        <p>{ep.runtime ? `${ep.runtime}분` : ''}</p>
                                        <p>|</p>
                                        <p>{ep.date || ''}</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            {/* 중앙: 타이틀/정보 */}
            <div className="title">
                <div className="con1">
                    <div className="star">
                        <Stars rating={safeRating} />
                        <span>{safeRating.toFixed(1)}</span>
                    </div>

                    {/* 찜(하트) + 파티클 */}
                    <div
                        className={`wish ${liked ? 'on' : ''}`}
                        role="button"
                        aria-pressed={liked}
                        aria-label="찜"
                        onClick={onToggleWish}
                        title="찜"
                    >
                        {liked ? <FaHeart /> : <FaRegHeart />}

                        {/* 클릭으로 '빈→꽉' 전환시에만 렌더 */}
                        {particles.length > 0 && (
                            <div className="burst" aria-hidden="true">
                                {particles.map((p, i) => (
                                    <span
                                        key={i}
                                        className="particle"
                                        style={{
                                            '--dx': `${p.dx}px`,
                                            '--dy': `${p.dy}px`,
                                            '--rot': `${p.rot}deg`,
                                            '--delay': `${p.delay}s`,
                                            '--scale': p.scale,
                                        }}
                                    >
                                        <FaHeart />
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <em>찜</em>

                    <p title="공유">
                        <RiShare2Line />
                    </p>
                    <em>공유</em>
                </div>

                <div className="con2">
                    <strong>{cert || '-'}</strong>
                    <p>{year || '-'}</p>
                    <p>{genres[0] || '-'}</p>
                    <p>{genres[1] || ''}</p>
                    <p>{`시즌 ${seasonCount}개`}</p>
                    <p>자막</p>
                </div>

                {titleLogo ? (
                    <img className="title-logo" src={titleLogo} alt="타이틀 로고" />
                ) : null}

                <div className="cast">
                    <strong>출연</strong>
                    {cast.slice(0, 5).map((c, i) => (
                        <span key={i}>
                            {c.name}
                            {i < Math.min(cast.length, 5) - 1 ? ',' : ''}
                        </span>
                    ))}
                </div>

                <div className="desc">{overview || ''}</div>

                <div className="btns">
                    <button className="ep1">1회 무료시청하기</button>
                    <button className="all">
                        <HiPlay /> 재생하기
                    </button>
                </div>
            </div>

            <div className="bottom">
                <div className="line"></div>
                <div className="icons">
                    <p>
                        <a {...linkProps(social.homepage)} aria-label="홈페이지">
                            <GoHomeFill />
                        </a>
                    </p>
                    <p>
                        <a {...linkProps(social.instagram)} aria-label="Instagram">
                            <RiInstagramFill />
                        </a>
                    </p>
                    <p>
                        <a {...linkProps(social.facebook)} aria-label="Facebook">
                            <RiFacebookFill />
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OttDetailVisual;
