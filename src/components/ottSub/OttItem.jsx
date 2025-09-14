// src/components/ottSub/OttItem.jsx
import './style.scss';

const buildPosterSrc = (poster, poster_path) => {
    // 1) seed에서 온 완전 URL or 로컬 경로가 있으면 그걸 우선 사용
    if (poster) return poster;

    // 2) poster_path가 URL이면 그대로, 로컬(/images/...)이면 그대로
    if (poster_path) {
        if (/^https?:\/\//.test(poster_path)) return poster_path;
        if (poster_path.startsWith('/images/')) return poster_path; // 로컬 자원
        // 3) TMDB 파일 경로(/abc.jpg)면 TMDB 베이스 붙이기
        return `https://image.tmdb.org/t/p/w200${poster_path}`;
    }

    return null;
};

const OttItem = ({ id, poster, poster_path, title, name, points }) => {
    const src = buildPosterSrc(poster, poster_path);
    const alt = title || name || '';

    return (
        <li>
            {src ? <img src={src} alt={alt} /> : <div className="img-fallback">No Image</div>}
            {typeof points === 'number' ? <span>{points}p</span> : <span>10p</span>}
        </li>
    );
};

export default OttItem;
