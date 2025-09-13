// src/api/socialLinks.js
// 키: `${mediaType}:${ottID}`  (예: 'tv:12345', 'movie:550')
export const socialLinks = {
    'tv:66256': {
        homepage: 'https://program.kbs.co.kr/2tv/drama/gurumi/pc/index.html',
        instagram: 'https://www.instagram.com/gurumi2016/',
        facebook: 'https://www.facebook.com/gurumi2016/',
    },
    'movie:550': {
        instagram: 'https://instagram.com/fightclub_official',
    },
};

// 기본값(비활성 처리)
const EMPTY = { homepage: '', instagram: '', facebook: '' };

// 조회 헬퍼 (✅ 타입 기반 예비 매칭 추가)
export function getSocialLinks(mediaType, ottID) {
    const exact = socialLinks[`${mediaType}:${ottID}`];
    if (exact) return exact;

    // 🔁 Fallback: 같은 mediaType의 아무 엔트리나 사용 (개발 중 임시 보강)
    const any = Object.entries(socialLinks).find(([k]) => k.startsWith(`${mediaType}:`));
    return any ? any[1] : EMPTY;
}
