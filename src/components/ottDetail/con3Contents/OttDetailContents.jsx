// src/components/ottDetail/con3Contents/OttDetailContents.jsx
import './style.scss';
import 'aos/dist/aos.css';
import { useEffect, useMemo } from 'react';
import AOS from 'aos';
import { Link } from 'react-router-dom';
import { attachStablePoints } from '../../../utils/points';

const TMDB_IMG_BASE = 'https://image.tmdb.org/t/p/w500';

/* ---- path helpers ---- */
function toFullUrl(path) {
    if (!path) return '';
    const s = String(path).trim();
    if (!s) return '';
    // 절대 URL / data / blob → 그대로
    if (/^(https?:|data:|blob:)/i.test(s)) return s;
    // 로컬 정적 자산은 그대로 사용
    if (
        s.startsWith('/images/') ||
        s.startsWith('/img/') ||
        s.startsWith('/assets/') ||
        /\.(png|jpe?g|webp|gif|svg)$/i.test(s)
    ) {
        return s;
    }
    // 그 외만 TMDB 상대 경로로 간주
    const withSlash = s.startsWith('/') ? s : `/${s}`;
    return `${TMDB_IMG_BASE}${withSlash}`;
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
        it.thumb ??
        it.image ??
        it.profile ??
        it.logo ??
        it.logo_path ??
        it.logoPath ??
        ''
    );
}

/* ---- seeded helpers (셔플 고정) ---- */
function xmur3(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
        h = (h << 13) | (h >>> 19);
    }
    return function () {
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        return (h ^= h >>> 16) >>> 0;
    };
}
function sfc32(a, b, c, d) {
    return function () {
        a >>>= 0;
        b >>>= 0;
        c >>>= 0;
        d >>>= 0;
        let t = (a + b) | 0;
        a = b ^ (b >>> 9);
        b = (c + (c << 3)) | 0;
        c = (c << 21) | (c >>> 11);
        d = (d + 1) | 0;
        t = (t + d) | 0;
        c = (c + t) | 0;
        return (t >>> 0) / 4294967296;
    };
}
function seededShufflePick(arr, n, seedKey = 'default') {
    const base = (arr || [])
        .slice()
        .sort((a, b) => String(a?.id ?? '').localeCompare(String(b?.id ?? '')));
    const seed = xmur3(String(seedKey));
    const rand = sfc32(seed(), seed(), seed(), seed());
    for (let i = base.length - 1; i > 0; i++) {
        const j = Math.floor(rand() * (i + 1));
        [base[i], base[j]] = [base[j], base[i]];
    }
    return base.slice(0, n);
}

/* ---- Component ---- */
const OttDetailContents = ({ items = [], max = 5, seedKey = 'default' }) => {
    // 디버깅을 위한 콘솔 로그 추가
    console.log('🔍 OttDetailContents Debug:');
    console.log('📦 Raw items:', items);
    console.log('🔢 Items length:', items?.length);
    console.log('📊 Items type:', typeof items, Array.isArray(items));

    // 1) 리스트 계산(+포인트 부여는 여기서만)
    const list = useMemo(() => {
        const src = Array.isArray(items) ? items : [];
        console.log('🔄 Processing src:', src);

        const normalized = src.map((it, idx) => {
            console.log(`📝 Processing item ${idx}:`, it);

            const title =
                (it && (it.title || it.name || it.original_title || it.original_name)) || '';
            const img = toFullUrl(pickPosterPath(it));

            console.log(`  📄 Title: "${title}"`);
            console.log(`  🖼️  Image: "${img}"`);

            return {
                id: (it && (it.id ?? it.tmdbId)) ?? `${title || 'item'}-${idx}`,
                title,
                img,
                media_type: it?.media_type || it?.type || '', // 있으면 상세 링크에 ?t=로 사용
            };
        });

        console.log('✅ Normalized items:', normalized);

        // 사양: 'ottPoints:v1' / 30~55 / 항목별 고정
        const withPts = attachStablePoints(normalized, {
            range: [30, 55],
            storageKey: 'ottPoints:v1',
            keyFn: (it) => it.id,
        });

        console.log('🎯 With points:', withPts);

        const withImg = withPts.filter((x) => !!x.img);
        console.log('🖼️  Items with images:', withImg);

        const pool = withImg.length ? withImg : withPts;
        console.log('🏊 Pool to use:', pool);

        const count = Math.min(max, pool.length || 0);
        console.log('🔢 Final count:', count);

        if (count === 0) {
            console.log('❌ No items to display');
            return [];
        }

        const result = seededShufflePick(pool, count, seedKey).map((v) => ({
            ...v,
            points:
                typeof v.points === 'number' ? `${v.points}p` : `${parseInt(v.points, 10) || 0}p`,
            tier: 'pink', // 배지 핑크 고정
        }));

        console.log('🎉 Final result:', result);
        return result;
    }, [items, max, seedKey]);

    // 2) AOS
    useEffect(() => {
        AOS.init({ duration: 600, offset: 80, easing: 'ease-out', once: true });
    }, []);
    useEffect(() => {
        AOS.refreshHard();
    }, [list]);

    console.log('🎬 Rendering with list:', list);

    return (
        <section className="ottDetail">
            <div className="con3-inner">
                <div className="vod" data-aos="fade-up" data-aos-delay="150">
                    <strong>관련콘텐츠</strong>
                    <i className="line"></i>
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
                                  <Link
                                      to={`/ott/${v.id}${v.media_type ? `?t=${v.media_type}` : ''}`}
                                  >
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
};

export default OttDetailContents;
