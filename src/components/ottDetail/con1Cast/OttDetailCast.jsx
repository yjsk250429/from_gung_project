import './style.scss';

const IMG_BASE = 'https://image.tmdb.org/t/p/w185';
const FALLBACK_IMG = '/images/no-profile.png'; // 프로젝트에 맞게 준비

const buildProfile = (u) => {
    if (!u || u.trim() === '') return FALLBACK_IMG;
    if (u.startsWith('http')) return u;
    if (u.startsWith('/')) return IMG_BASE + u; // TMDB path
    return u;
};

const OttDetailCast = ({ cast = [] }) => {
    return (
        <section className="ottcast">
            <div className="con1-inner">
                <div className="cast-title" data-aos="fade-up" data-aos-delay="150">
                    <strong>등장인물</strong>
                    <i className="line"></i> {/* ← className로 고정 */}
                </div>

                <div className="castlist" data-aos="fade-up" data-aos-delay="350">
                    {cast.map((p) => (
                        <div className="castpic" key={p.id || p.name}>
                            {/* p.profile이 '', null이면 FALLBACK으로 */}
                            {buildProfile(p.profile) && (
                                <img
                                    src={buildProfile(p.profile)}
                                    alt={p.name || '배우'}
                                    loading="lazy"
                                />
                            )}
                            <span>{p.name || '알 수 없음'}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OttDetailCast;
