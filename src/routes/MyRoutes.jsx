import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../common/Layout';

import {
    Brand,
    Home,
    MyPage,
    NotFiles,
    OttDetail,
    OttMain,
    OttSearch,
    OttSub,
    TourClass,
    TourClassDetail,
    TourSearch,
} from '../pages';
import ScrollToTop from '../components/ui/scrolltotop/ScrollToTop';
import Intro from '../components/ui/intro/intro';

export const MyRoutes = () => {
    return (
        <BrowserRouter>
            <ScrollToTop/>
            <Routes>
                {/* 첫 진입은 Intro 페이지 */}
                <Route path="/" element={<Intro />} />

                {/* Intro 끝나면 4초 후 navigate("/") → 아래 Layout 실행됨 */}
                <Route path="/home" element={<Layout />}>
                    <Route index element={<Home />} />

                    <Route path="brand" element={<Brand />} />
                    <Route path="tourclass" element={<TourClass />} />
                    <Route path="tourclass/:tourclassID" element={<TourClassDetail />} />
                    <Route path="tourresults" element={<TourSearch />} />

                    <Route path="ottmain" element={<OttMain />} />
                    <Route path="ottsub" element={<OttSub />} />
                    <Route path="ott/:mediaType/:ottID" element={<OttDetail />} />
                    <Route path="ottresults" element={<OttSearch />} />

                    <Route path="mypage" element={<MyPage />} />
                    <Route path="*" element={<NotFiles />} />
                </Route>

                {/* Intro 끝나고 / → /home으로 자동 리다이렉트 */}
                <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
        </BrowserRouter>
    );
};
