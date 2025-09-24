// src/components/ottDetail/con1Cast/OttDetailCast.jsx
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMovieStore } from '../../../store';
import './style.scss';

const IMG_BASE = 'https://image.tmdb.org/t/p/w185';
const FALLBACK_IMG = '/images/no-profile.png';

// 프로필 URL 보정
const buildProfile = (u) => {
    if (!u || String(u).trim() === '') return FALLBACK_IMG;
    if (u.startsWith('http')) return u;
    if (u.startsWith('/')) return IMG_BASE + u; // TMDB path
    return u;
};

// 콘텐츠 타입 판정
const kindOf = (it) => {
    if (!it) return '';
    const t = (it.mediaType ?? it.media_type ?? '').toString().toLowerCase();
    if (t === 'tv' || t === 'movie') return t;
    if (typeof it.title === 'string' && it.title.trim()) return 'movie';
    if (typeof it.name === 'string' && it.name.trim()) return 'tv';
    return '';
};

// 포스터 선택
const getPoster = (it) =>
    it?.poster || it?.backdrop || it?._seed?.poster || it?._seed?.backdrop || '';

// cast 이름 배열 추출(문자열/객체 배열 모두 지원)
const getCastNames = (node) => {
    const cand = [node?.cast, node?._seed?.cast, node?.credits?.cast, node?.actors];
    const out = [];
    for (const arr of cand) {
        if (!Array.isArray(arr)) continue;
        for (const c of arr) {
            if (!c) continue;
            if (typeof c === 'string') out.push(c);
            else if (typeof c?.name === 'string') out.push(c.name);
            else if (typeof c?.original_name === 'string') out.push(c.original_name);
        }
    }
    return out;
};

const OttDetailCast = ({ cast = [] }) => {
    const curated = useMovieStore((s) => s.curated);
    const initCurated = useMovieStore.getState().initCurated;

    const [selectedActor, setSelectedActor] = useState(null); // 문자열(배우 이름)

    // 초기 curated 없으면 로드
    useEffect(() => {
        if (!Array.isArray(curated) || curated.length === 0) initCurated();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ⛳ 모달 닫기 함수 (에러 원인이던 부분)
    const closeModal = () => setSelectedActor(null);

    // 배우 출연작 필터
    const actorWorks = useMemo(() => {
        if (!selectedActor || !Array.isArray(curated)) return [];
        return curated.filter((it) => getCastNames(it).includes(selectedActor));
    }, [selectedActor, curated]);

    return (
        <section className="ottcast">
            <div className="con1-inner">
                <div className="cast-title" data-aos="fade-up" data-aos-delay="150">
                    <strong>등장인물</strong>
                    <i className="line" />
                </div>

                <div className="castlist" data-aos="fade-up" data-aos-delay="350">
                    {cast.map((p) => (
                        <div
                            className="castpic clickable"
                            key={p.id || p.name}
                            onClick={() => setSelectedActor(p.name)}
                        >
                            <img
                                src={buildProfile(p.profile)}
                                alt={p.name || '배우'}
                                loading="lazy"
                            />
                            <span>{p.name || '알 수 없음'}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 모달 */}
            {selectedActor && (
                <div className="cast-modal" role="dialog" aria-modal="true" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={closeModal}>
                            ✕
                        </button>
                        <h2>{selectedActor}</h2>

                        <div className="works-list">
                            {actorWorks.length > 0 ? (
                                actorWorks.map((w) => {
                                    const type = kindOf(w);
                                    const cid = w.id ?? w.tmdbId;
                                    const title = w.title ?? w.name ?? '작품';
                                    const poster = getPoster(w);

                                    if (!type || !cid) return null;

                                    return (
                                        <div className="work-card" key={`${type}-${cid}`}>
                                            <Link to={`/ott/${type}/${cid}`}>
                                                {poster ? (
                                                    <img src={poster} alt={title} loading="lazy" />
                                                ) : (
                                                    <div className="img-fallback">No Image</div>
                                                )}
                                                {w.points != null && (
                                                    <span className="points-badge">
                                                        {typeof w.points === 'number'
                                                            ? `${w.points}p`
                                                            : `${parseInt(w.points, 10) || 0}p`}
                                                    </span>
                                                )}
                                            </Link>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="empty">출연작품이 없습니다.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default OttDetailCast;
