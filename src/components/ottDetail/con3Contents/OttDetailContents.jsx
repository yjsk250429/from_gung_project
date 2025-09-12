// src/components/ottDetail/con3Contents/OttDetailContents.jsx
import './style.scss';
import 'aos/dist/aos.css';
import { useEffect, useMemo } from 'react';
import AOS from 'aos';

const TMDB_IMG_BASE = 'https://image.tmdb.org/t/p/w500';

function toFullUrl(path) {
    if (!path) return '';
    const s = String(path);
    if (s.startsWith('http')) return s; // 이미 절대 URL
    if (s.startsWith('/')) return `${TMDB_IMG_BASE}${s}`; // TMDB 경로
    return s; // 그 외 상대/정적 경로
}

function pickPosterPath(it) {
    // TMDB 필드 우선 → 커스텀 필드 보조
    return (
        it.poster_path ??
        it.backdrop_path ??
        it.profile_path ??
        it.poster ??
        it.thumb ??
        it.image ??
        it.profile ??
        ''
    );
}

function shufflePick(arr, n) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a.slice(0, n);
}

const OttDetailContents = ({ items = [], max = 5 }) => {
    useEffect(() => {
        AOS.init({
            duration: 600, // 애니메이션 시간(ms)
            offset: 80, // 트리거 오프셋
            easing: 'ease-out',
            once: true, // 한 번만 실행
        });
    }, []);

    const list = useMemo(() => {
        // 1) 정규화
        const normalized = (items || []).map((it, idx) => {
            const title = it.title || it.name || it.original_title || it.original_name || '';
            const img = toFullUrl(pickPosterPath(it));
            return {
                id: it.id ?? `${title || 'item'}-${idx}`,
                title,
                img,
                points: it.points ?? '10p',
            };
        });

        // 2) 이미지 있는 것 우선 랜덤
        const withImg = normalized.filter((x) => !!x.img);
        const pool = withImg.length ? withImg : normalized;

        // 3) 최대 max개 뽑기
        const count = Math.min(max, pool.length || 0);
        if (count === 0) return [];

        return shufflePick(pool, count);
    }, [items, max]);

    return (
        <section className="ottDetail">
            <div className="con3-inner">
                <div className="vod" data-aos="fade-up" data-aos-delay="150">
                    <strong>관련콘텐츠</strong>
                    <i className="line"></i>
                </div>

                <ul className="vodlist" data-aos="fade-up" data-aos-delay="350">
                    {list.length > 0
                        ? list.map((v) => (
                              <li className="vod-img" key={v.id} title={v.title}>
                                  {v.img ? (
                                      <img
                                          src={v.img}
                                          alt={v.title || '관련콘텐츠'}
                                          loading="lazy"
                                      />
                                  ) : (
                                      <div
                                          className="vod-img__placeholder"
                                          aria-label={`${v.title || '관련콘텐츠'} 이미지 없음`}
                                      />
                                  )}
                                  <span>{v.points}</span>
                              </li>
                          ))
                        : // 완전 비었을 때 기본 5개 플레이스홀더
                          Array.from({ length: 5 }).map((_, i) => (
                              <li className="vod-img" key={`ph-${i}`}>
                                  <div className="vod-img__placeholder" aria-label="이미지 없음" />
                                  <span>10p</span>
                              </li>
                          ))}
                </ul>
            </div>
        </section>
    );
};

export default OttDetailContents;
