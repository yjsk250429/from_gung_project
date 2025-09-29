import './style.scss';
import Button from '../../ui/button/Button';
import { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';

const OttMainCon4 = () => {
    const navigate = useNavigate();

    const con4SlidesInfo = [
        {
            posterImg: '/images/ott/mainCon4_TheThrone.png',
            titleLogo: '/images/ott/mainCon4_TheThrone_Logo.png',
            description01:
                '사도는 영조의 바람대로 완벽한 세자가 되고 싶었지만 다그치기만 하는 아버지를 점점 원망하게 된다.',
            description02:
                '왕과 세자로 만나 아버지와 아들의 연을 잇지 못한 운명, 역사상 가장 비극적인 가족사가 시작된다.',
            navigateLink: '/ott/movie/315439',
        },
        {
            posterImg: '/images/ott/mainCon4_TheKingofTears.png',
            titleLogo: '/images/ott/mainCon4_TheKingofTears_Logo.png',
            description01:
                '고려라는 구질서를 무너뜨리고 조선이라는 새로운 질서를 만들어가던 여말선초 시기,',
            description02:
                '누구보다 조선의 건국에 앞장섰던 리더 이방원의 모습을 새롭게 조명하는 드라마',
            navigateLink: '/ott/tv/135751',
        },
        {
            posterImg: '/images/ott/mainCon4_UndertheQueensUmbrella.png',
            titleLogo: '/images/ott/mainCon4_UndertheQueensUmbrella_Logo.png',
            description01: '내 자식들을 위해 기품 따윈 버렸다!',
            description02:
                '사고뭉치 왕자들을 위해 치열한 왕실 교육 전쟁에 뛰어드는 중전의 파란만장 궁중 분투기',
            navigateLink: '/ott/tv/156406',
        },
        {
            posterImg: '/images/ott/mainCon4_Uprising.png',
            titleLogo: '/images/ott/mainCon4_Uprising_Logo.png',
            description01:
                '조선 최고 무신 집안의 아들 종려와 그의 몸종 천영. 함께 자란 두 남자가 왜란의 시대에 적이 되어 다시 만난다.',
            description02:
                '한 사람은 선조의 최측근 무관으로, 다른 사람은 의병으로, 파란의 세월을 헤쳐간다.',
            navigateLink: '/ott/movie/1075676',
        },
        {
            posterImg: '/images/ott/mainCon4_TheQueenWhoCrowns.png',
            titleLogo: '/images/ott/mainCon4_TheQueenWhoCrowns_Logo.png',
            description01: '남편 태종 이방원과 함께 권력을 쟁취한 원경왕후.',
            description02: '왕과 왕비, 남편과 아내, 그 사이 감춰진 뜨거운 이야기',
            navigateLink: '/ott/tv/226103',
        },
    ];

    const [bgImage, setBgImage] = useState(con4SlidesInfo[0].posterImg);

    const settings = {
        className: 'center',
        centerMode: true,
        infinite: true,
        centerPadding: '60px',
        // slidesToShow: 3,
        speed: 500,

        swipeToSlide: true,
        touchThreshold: 10,
        focusOnSelect: true,

        variableWidth: true,

        beforeChange: (oldIndex, newIndex) => {
            setBgImage(con4SlidesInfo[newIndex].posterImg);
        },
    };

    return (
        <section
            className="ottMainCon4"
            style={{
                backgroundImage: `url(${bgImage})`,
            }}
        >
            <div className="slider-container">
                <Slider {...settings}>
                    {con4SlidesInfo.map((slide, idx) => (
                        <div key={idx} className="box">
                            <div className="imgwrap">
                                <img
                                    className="posterImg"
                                    src={slide.posterImg}
                                    alt={`slide ${idx + 1}`}
                                />
                            </div>
                            <span>10p</span>
                            <article className="ottInfo">
                                <img className="titleLogo" src={slide.titleLogo} alt="title-logo" />
                                <p>{slide.description01}</p>
                                <p>{slide.description02}</p>
                                <Button
                                    text="재생"
                                    className="small white"
                                    onClick={() => navigate(slide.navigateLink)}
                                />
                            </article>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
};
export default OttMainCon4;
