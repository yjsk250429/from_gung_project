// src/components/ottDetail/ottDetailVisual/OttDetailVisual.jsx
import React, { useState, useMemo } from 'react';
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
import { getSocialLinks } from '../../../api/socialLinks';

function Stars({ rating = 0, className = '' }) {
    const n = Number(rating);
    const safe10 = Number.isFinite(n) ? Math.max(0, Math.min(10, n)) : 0;
    const r = safe10 / 2;
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

function linkProps(url) {
    const ok = !!(url && String(url).trim());
    const base = { 'aria-disabled': !ok, className: ok ? undefined : 'disabled' };
    return ok
        ? { href: url, target: '_blank', rel: 'noreferrer', ...base }
        : { href: '#', onClick: (e) => e.preventDefault(), ...base };
}

const normalizeUrl = (u, size = 'original') => {
    if (!u || typeof u !== 'string') return null;
    if (/^https?:\/\//.test(u)) return u;
    if (u.startsWith('/images/')) return u;
    if (u.startsWith('/')) return `https://image.tmdb.org/t/p/${size}${u}`;
    return u;
};

const pickFromArray = (arr, preferLang = 'ko', size = 'original') => {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    const normalized = arr.map((x) =>
        typeof x === 'string'
            ? { url: x, lang: null }
            : { url: x.url ?? x.file_path ?? null, lang: x.lang ?? x.iso_639_1 ?? null }
    );
    const chosen =
        normalized.find((x) => x.lang === preferLang && x.url) ||
        normalized.find((x) => (x.lang == null || x.lang === 'xx') && x.url) ||
        normalized.find((x) => x.url);
    return normalizeUrl(chosen?.url, size);
};

const normalizeGenres = (g) => {
    if (!g) return [];
    const toName = (x) => (typeof x === 'string' ? x : x?.name ?? '');
    const arr = Array.isArray(g) ? g.map(toName) : [toName(g)];
    return arr
        .flatMap((s) => String(s).split(/[·,|/]/))
        .map((s) => s.trim())
        .filter(Boolean);
};

// 디폴트 값을 '전체이용가'로 맞춤 (UI 요구사항)
const normalizeCert = (cert) => {
    const fallback = '전체이용가';
    if (cert == null) return fallback;

    if (typeof cert === 'string' || typeof cert === 'number') {
        const s = String(cert).trim();
        return s || fallback;
    }

    const getFromNode = (node) => {
        if (!node || typeof node !== 'object') return null;
        const direct = (node.certification ?? node.rating ?? node.label ?? node.name ?? '')
            .toString()
            .trim();
        if (direct) return direct;
        const arr = node.release_dates ?? node.results ?? node.ratings ?? node.data;
        if (Array.isArray(arr)) {
            const found = arr.find((e) => (e?.certification ?? e?.rating ?? '').toString().trim());
            const s = (found?.certification ?? found?.rating ?? '').toString().trim();
            if (s) return s;
        }
        return null;
    };

    if (Array.isArray(cert)) {
        const pickBy = (cc) => {
            const node = cert.find((n) => (n?.iso_3166_1 ?? n?.country ?? n?.iso) === cc);
            return node && (getFromNode(node) ?? null);
        };
        return pickBy('KR') || pickBy('US') || cert.map(getFromNode).find(Boolean) || fallback;
    }

    if (typeof cert === 'object') {
        const direct = getFromNode(cert);
        if (direct) return direct;
        if (cert.KR) {
            const s = normalizeCert(Array.isArray(cert.KR) ? cert.KR : [cert.KR]);
            if (s !== fallback) return s;
        }
        if (cert.US) {
            const s = normalizeCert(Array.isArray(cert.US) ? cert.US : [cert.US]);
            if (s !== fallback) return s;
        }
        const arr = cert.results ?? cert.release_dates ?? cert.ratings ?? cert.data;
        if (Array.isArray(arr)) return normalizeCert(arr);
    }

    return fallback;
};

const OttDetailVisual = ({
    backdrop,
    titleLogo,
    images = {},
    backdrops = [],
    logos = [],
    rating,
    year,
    genres = [],
    seasonCount = 1,
    hasSubtitle = false,
    // ⬇ props 호환: cert 우선, 없으면 기존 contentRating를 사용
    cert,
    contentRating,
    episodes = [],
    cast = [],
    social = { homepage: '', instagram: '', facebook: '' },
    overview = '',
}) => {
    const safeRating = Number.isFinite(Number(rating)) ? Number(rating) : 0;

    const bgSrc = useMemo(
        () =>
            normalizeUrl(backdrop, 'w1280') ||
            pickFromArray(images.backdrops, 'ko', 'w1280') ||
            pickFromArray(backdrops, 'ko', 'w1280') ||
            null,
        [backdrop, images, backdrops]
    );

    const logoSrc = useMemo(
        () =>
            normalizeUrl(titleLogo, 'w500') ||
            pickFromArray(images.logos, 'ko', 'w500') ||
            pickFromArray(logos, 'ko', 'w500') ||
            null,
        [titleLogo, images, logos]
    );

    // ⬇ 연령등급 안전화 (cert || contentRating)
    const safeCert = useMemo(() => normalizeCert(cert ?? contentRating), [cert, contentRating]);

    const safeYear = Number.isFinite(Number(year))
        ? String(year)
        : (year ?? '').toString().slice(0, 4) || '-';

    const gList = normalizeGenres(genres);
    const [g0, g1] = [...new Set(gList)].slice(0, 2);

    const safeSeasons =
        Number.isFinite(Number(seasonCount)) && Number(seasonCount) > 0
            ? Number(seasonCount)
            : null;

    const [liked, setLiked] = useState(false);
    const [particles, setParticles] = useState([]);
    const triggerBurst = () => {
        const count = 8,
            dist = 48;
        const ps = Array.from({ length: count }).map((_, i) => {
            const angle = (360 / count) * i;
            const rad = (angle * Math.PI) / 180;
            return {
                dx: Math.cos(rad) * dist,
                dy: Math.sin(rad) * dist,
                rot: Math.floor(Math.random() * 40 - 20),
                delay: Math.random() * 0.1,
                scale: 0.75 + Math.random() * 0.35,
            };
        });
        setParticles(ps);
        setTimeout(() => setParticles([]), 750);
    };
    const onToggleWish = () =>
        setLiked((prev) => {
            const next = !prev;
            if (!prev && next) triggerBurst(); // ON으로 바뀔 때만 파티클
            return next;
        });

    const socialFixed = useMemo(() => {
        const idFromPath =
            (typeof window !== 'undefined' &&
                window.location?.pathname.match(/\/ott\/(\d+)/)?.[1]) ||
            '';
        const tv = getSocialLinks('tv', idFromPath);
        const mv = getSocialLinks('movie', idFromPath);
        return {
            homepage: social.homepage || tv.homepage || mv.homepage || '',
            instagram: social.instagram || tv.instagram || mv.instagram || '',
            facebook: social.facebook || tv.facebook || mv.facebook || '',
        };
    }, [social]);

    const epCount = Array.isArray(episodes) ? episodes.length : 0;

    return (
        <div className="detailvisual">
            <div className="grad" />
            <div className="bg" style={bgSrc ? { backgroundImage: `url(${bgSrc})` } : undefined} />

            <div className="left">
                {/* 회차 */}
                <div className="episode">
                    <strong>회차</strong>
                    <p>({`총 ${epCount}회`})</p>
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
                        {Array.isArray(episodes) &&
                            episodes.map((ep, idx) => (
                                <SwiperSlide key={ep?.ep ?? idx}>
                                    <div className="lists">
                                        <div className="ep-thumb">
                                            <span className="point-badge" aria-label="포인트 3p">
                                                3p
                                            </span>
                                            {ep?.thumb && (
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
                                            {`EP.${ep?.ep ?? idx + 1} `}
                                            <span>{ep?.name || ''}</span>
                                        </strong>
                                        <div className="date">
                                            <p>{ep?.runtime ? `${ep.runtime}분` : ''}</p>
                                            <p>|</p>
                                            <p>{ep?.date || ''}</p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                    </Swiper>
                </div>
            </div>

            {/* 중앙: 타이틀/정보 */}
            <section className="title-area">
                <div className="title">
                    <div className="con1">
                        <div className="star">
                            <Stars rating={safeRating} />
                            <span>{safeRating.toFixed(1)}</span>
                        </div>

                        <div
                            className={`wish ${liked ? 'on' : ''}`}
                            role="button"
                            aria-pressed={liked}
                            aria-label="찜"
                            onClick={onToggleWish}
                            title="찜"
                        >
                            {liked ? <FaHeart /> : <FaRegHeart />}
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

                    {/* 연령/연도/장르/시즌/자막 표기 */}
                    <div className="con2">
                        <strong>{safeCert}</strong>
                        <p>{safeYear}</p>
                        <p>{g0 || '-'}</p>
                        <p>{g1 || ''}</p>
                        <p>{safeSeasons ? `시즌 ${safeSeasons}개` : '시즌 정보 없음'}</p>
                        <p>{hasSubtitle ? '자막' : '자막 없음'}</p>
                    </div>

                    {logoSrc ? (
                        <img className="title-logo" src={logoSrc} alt="타이틀 로고" />
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
            </section>

            <div className="bottom">
                <div className="line" />
                <div className="icons">
                    <p>
                        <a {...linkProps(socialFixed.homepage)} aria-label="홈페이지">
                            <GoHomeFill />
                        </a>
                    </p>
                    <p>
                        <a {...linkProps(socialFixed.instagram)} aria-label="Instagram">
                            <RiInstagramFill />
                        </a>
                    </p>
                    <p>
                        <a {...linkProps(socialFixed.facebook)} aria-label="Facebook">
                            <RiFacebookFill />
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OttDetailVisual;
