// src/components/ottDetail/con3Contents/OttDetailContents.jsx
import './style.scss';
import 'aos/dist/aos.css';
import { useEffect, useMemo } from 'react';
import AOS from 'aos';
import { Link } from 'react-router-dom';
import { attachStablePoints } from '../../../utils/points';

const TMDB_IMG_BASE = 'https://image.tmdb.org/t/p/w500';

// ---- path helpers ------------------------------------------------
function toFullUrl(path) {
    if (!path) return '';
    const s = String(path).trim();
    if (!s) return '';
    // 절대 URL / data / blob
    if (/^(https?:|data:|blob:)/i.test(s)) return s;
    // 로컬 정적 자산
    if (
        s.startsWith('/images/') ||
        s.startsWith('/img/') ||
        s.startsWith('/assets/') ||
        /\.(png|jpe?g|webp|gif|svg)$/i.test(s)
    )
        return s;
    // TMDB 상대경로
    const p = s.startsWith('/') ? s : `/${s}`;
    return `${TMDB_IMG_BASE}${p}`;
}

function pickPosterPath(it) {
    if (!it || typeof it !== 'object') return '';
    return (
        it.poster_path ??
        it.posterPath ??
        it.backdrop_path ??
        it.backdropPath ??
        it.profile_path ??
        it.profilePath ??
        it.poster ??
        it.image ??
        it.thumb ??
        it.logo_path ??
        it.logoPath ??
        ''
    );
}

// ---- Component ---------------------------------------------------
/**
 * OttDetailContents
 * - 부모에서 받은 items(관련/유사/추천 합본)를 Curated 카드 UI로 노출
 * - URL 훅 사용 안 함(링크는 부모 mediaType을 기본값으로 사용)
 */
export default function OttDetailContents({
    items = [],
    parentMediaType = '', // 'tv' | 'movie' (부모 페이지 타입)
    max = 10,
    seedKey = 'ott-related',
}) {
    // 1) 정규화 + 포인트 배지 + 고정 셔플
    const list = useMemo(() => {
        const src = Array.isArray(items) ? items : [];

        const normalized = src.map((it, idx) => {
            const id = it?.id ?? it?.tmdbId ?? `${idx}`;
            const title = it?.title ?? it?.name ?? it?.original_title ?? it?.original_name ?? '';
            const img = toFullUrl(pickPosterPath(it));
            const mt = (it?.media_type || it?.type || parentMediaType || '').toLowerCase();
            return { id: String(id), title, img, media_type: mt };
        });

        const withPts = attachStablePoints(normalized, {
            range: [30, 55],
            storageKey: 'ottPoints:v1',
            keyFn: (x) => x.id,
        });

        const usable = withPts.filter((x) => !!x.img);
        const pool = usable.length ? usable : withPts;
        const count = Math.min(max, pool.length);

        // 고정 셔플(간단 버전)
        const sorted = pool.slice().sort((a, b) => String(a.id).localeCompare(String(b.id)));
        const rng = (n) => {
            let h = 0;
            for (let i = 0; i < seedKey.length; i++) h = (h * 31 + seedKey.charCodeAt(i)) | 0;
            return Math.abs((h ^ (n * 2654435761)) >>> 0);
        };
        for (let i = sorted.length - 1; i > 0; i--) {
            const j = rng(i) % (i + 1);
            [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
        }

        return sorted.slice(0, count).map((v) => ({
            ...v,
            points:
                typeof v.points === 'number' ? `${v.points}p` : `${parseInt(v.points, 10) || 0}p`,
            tier: 'pink',
        }));
    }, [items, parentMediaType, max, seedKey]);

    // 2) AOS
    useEffect(() => {
        AOS.init({ duration: 600, offset: 80, easing: 'ease-out', once: true });
    }, []);
    useEffect(() => {
        AOS.refreshHard();
    }, [list]);

    return (
        <section className="ottDetail">
            <div className="con3-inner">
                <div className="vod" data-aos="fade-up" data-aos-delay="150">
                    <strong>관련콘텐츠</strong>
                    <i className="line" />
                </div>

                <ul className="vodlist">
                    {list.length > 0
                        ? list.map((v, i) => (
                              <li
                                  className="vod-img"
                                  key={v.id}
                                  title={v.title}
                                  data-aos="fade-up"
                                  data-aos-delay={200 + i * 60}
                              >
                                  <Link to={`/ott/${v.media_type || parentMediaType}/${v.id}`}>
                                      {v.img ? (
                                          <img
                                              src={v.img}
                                              alt={v.title || '관련콘텐츠'}
                                              loading="lazy"
                                          />
                                      ) : (
                                          <div
                                              className="vod-img__placeholder"
                                              aria-label="이미지 없음"
                                          />
                                      )}
                                  </Link>
                                  <span className={`point-badge ${v.tier}`}>{v.points}</span>
                              </li>
                          ))
                        : Array.from({ length: 5 }).map((_, i) => (
                              <li
                                  className="vod-img"
                                  key={`ph-${i}`}
                                  data-aos="fade-up"
                                  data-aos-delay={200 + i * 60}
                              >
                                  <div className="vod-img__placeholder" aria-label="이미지 없음" />
                                  <span className="point-badge pink">10p</span>
                              </li>
                          ))}
                </ul>
            </div>
        </section>
    );
}
