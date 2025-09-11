import React, { useRef, useState } from 'react';
import './style.scss';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/scrollbar';
import { Scrollbar } from 'swiper/modules';

import { RiInstagramFill, RiFacebookFill, RiShare2Line } from 'react-icons/ri';
import { GoHomeFill } from 'react-icons/go';
import { FaRegHeart } from 'react-icons/fa';
import { HiPlay } from 'react-icons/hi2';

import { MdOutlineStarBorderPurple500, MdOutlineStarHalf } from 'react-icons/md';

const OttDetailVisual = () => {
    return (
        <div className="detailvisual">
            <div className="bg"></div>
            <div className="left">
                <div className="episode">
                    <strong>회차</strong>
                    <p>(총 18회)</p>
                </div>
                <div className="swiper">
                    <Swiper
                        direction="vertical"
                        slidesPerView="auto"
                        spaceBetween={16}
                        scrollbar={{
                            hide: false,
                            draggable: true,
                        }}
                        modules={[Scrollbar]}
                        className="episodeSwiper"
                    >
                        <SwiperSlide>
                            <div className="lists epi1">
                                <img src="/images/ott/ottdetail.png" alt="thumnail" />
                                <i className="icon">
                                    <img src="/images/ott/playicon-1.png" alt="play" />
                                </i>
                                <strong>
                                    EP.1 <span>달빛연인</span>
                                </strong>
                                <div className="date">
                                    <p>59분</p>
                                    <p>|</p>
                                    <p>2016.08.22</p>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="lists">
                                <img src="/images/ott/ottdetail.png" alt="" />
                                <strong>
                                    EP.1 <span>달빛연인</span>
                                </strong>
                                <div className="date">
                                    <p>59분</p>
                                    <p>|</p>
                                    <p>2016.08.22</p>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="lists">
                                <img src="/images/ott/ottdetail.png" alt="" />
                                <strong>
                                    EP.1 <span>달빛연인</span>
                                </strong>
                                <div className="date">
                                    <p>59분</p>
                                    <p>|</p>
                                    <p>2016.08.22</p>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="lists">
                                <img src="/images/ott/ottdetail.png" alt="" />
                                <strong>
                                    EP.1 <span>달빛연인</span>
                                </strong>
                                <div className="date">
                                    <p>59분</p>
                                    <p>|</p>
                                    <p>2016.08.22</p>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="lists">
                                <img src="/images/ott/ottdetail.png" alt="" />
                                <strong>
                                    EP.1 <span>달빛연인</span>
                                </strong>
                                <div className="date">
                                    <p>59분</p>
                                    <p>|</p>
                                    <p>2016.08.22</p>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="lists">
                                <img src="/images/ott/ottdetail.png" alt="" />
                                <strong>
                                    EP.1 <span>달빛연인</span>
                                </strong>
                                <div className="date">
                                    <p>59분</p>
                                    <p>|</p>
                                    <p>2016.08.22</p>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="lists">
                                <img src="/images/ott/ottdetail.png" alt="" />
                                <strong>
                                    EP.1 <span>달빛연인</span>
                                </strong>
                                <div className="date">
                                    <p>59분</p>
                                    <p>|</p>
                                    <p>2016.08.22</p>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="lists">
                                <img src="/images/ott/ottdetail.png" alt="" />
                                <strong>
                                    EP.1 <span>달빛연인</span>
                                </strong>
                                <div className="date">
                                    <p>59분</p>
                                    <p>|</p>
                                    <p>2016.08.22</p>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="lists">
                                <img src="/images/ott/ottdetail.png" alt="" />
                                <strong>
                                    EP.1 <span>달빛연인</span>
                                </strong>
                                <div className="date">
                                    <p>59분</p>
                                    <p>|</p>
                                    <p>2016.08.22</p>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="lists">
                                <img src="/images/ott/ottdetail.png" alt="" />
                                <strong>
                                    EP.1 <span>달빛연인</span>
                                </strong>
                                <div className="date">
                                    <p>59분</p>
                                    <p>|</p>
                                    <p>2016.08.22</p>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="lists">
                                <img src="/images/ott/ottdetail.png" alt="" />
                                <strong>
                                    EP.1 <span>달빛연인</span>
                                </strong>
                                <div className="date">
                                    <p>59분</p>
                                    <p>|</p>
                                    <p>2016.08.22</p>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="lists">
                                <img src="/images/ott/ottdetail.png" alt="" />
                                <strong>
                                    EP.1 <span>달빛연인</span>
                                </strong>
                                <div className="date">
                                    <p>59분</p>
                                    <p>|</p>
                                    <p>2016.08.22</p>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="lists">
                                <img src="/images/ott/ottdetail.png" alt="" />
                                <strong>
                                    EP.1 <span>달빛연인</span>
                                </strong>
                                <div className="date">
                                    <p>59분</p>
                                    <p>|</p>
                                    <p>2016.08.22</p>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="lists">
                                <img src="/images/ott/ottdetail.png" alt="" />
                                <strong>
                                    EP.1 <span>달빛연인</span>
                                </strong>
                                <div className="date">
                                    <p>59분</p>
                                    <p>|</p>
                                    <p>2016.08.22</p>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="lists">
                                <img src="/images/ott/ottdetail.png" alt="" />
                                <strong>
                                    EP.1 <span>달빛연인</span>
                                </strong>
                                <div className="date">
                                    <p>59분</p>
                                    <p>|</p>
                                    <p>2016.08.22</p>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="lists">
                                <img src="/images/ott/ottdetail.png" alt="" />
                                <strong>
                                    EP.1 <span>달빛연인</span>
                                </strong>
                                <div className="date">
                                    <p>59분</p>
                                    <p>|</p>
                                    <p>2016.08.22</p>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="lists">
                                <img src="/images/ott/ottdetail.png" alt="" />
                                <strong>
                                    EP.1 <span>달빛연인</span>
                                </strong>
                                <div className="date">
                                    <p>59분</p>
                                    <p>|</p>
                                    <p>2016.08.22</p>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="lists">
                                <img src="/images/ott/ottdetail.png" alt="" />
                                <strong>
                                    EP.1 <span>달빛연인</span>
                                </strong>
                                <div className="date">
                                    <p>59분</p>
                                    <p>|</p>
                                    <p>2016.08.22</p>
                                </div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>
            <div className="title">
                <div className="con1">
                    <div className="star">
                        <p>
                            <MdOutlineStarBorderPurple500 />
                            <MdOutlineStarBorderPurple500 />
                            <MdOutlineStarBorderPurple500 />
                            <MdOutlineStarBorderPurple500 />
                            <MdOutlineStarHalf />
                        </p>
                        <span>4.5</span>
                    </div>
                    <p>
                        <FaRegHeart />
                    </p>
                    <em>찜</em>
                    <p>
                        <RiShare2Line />
                    </p>
                    <em>공유</em>
                </div>
                <div className="con2">
                    <strong>15</strong>
                    <p>2016</p>
                    <p>드라마</p>
                    <p>퓨전사극</p>
                    <p>시즌 1개</p>
                    <p>자막</p>
                </div>
                <img src="/images/ott/title_logo.png" alt="타이틀 로고" />
                <div className="cast">
                    <strong>출연</strong>
                    <span>박보검,</span>
                    <span>김유정,</span>
                    <span>진영,</span>
                    <span>채수빈,</span>
                    <span>곽동연</span>
                </div>
                <div className="desc">
                    한 나라의 세자가, 내시와 사랑에 빠졌다! <br />
                    츤데레 왕세자 이영과 남장 내시 홍라온의 예측불허 궁중위장 로맨스
                </div>
                <div className="price">
                    <span>1회당</span>
                    <strong>3전</strong>
                    <em>/</em>
                    <span>전체회차</span>
                    <strong>50전</strong>
                </div>
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
                        <a href="https://program.kbs.co.kr/2tv/drama/gurumi/pc/index.html">
                            <GoHomeFill />
                        </a>
                    </p>
                    <p>
                        <a href="https://www.instagram.com/gurumi2016/">
                            <RiInstagramFill />
                        </a>
                    </p>
                    <p>
                        <a href="https://www.facebook.com/gurumi2016/">
                            <RiFacebookFill />
                        </a>
                    </p>
                </div>
            </div>
            <div className="inner"></div>
        </div>
    );
};

//https://codesandbox.io/p/sandbox/y7gs6q?file=%2Fsrc%2FApp.jsx%3A22%2C29

export default OttDetailVisual;
