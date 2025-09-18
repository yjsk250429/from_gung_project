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
            <ScrollToTop />
            <Routes>
                {/* 첫 진입은 Intro 페이지 */}
                <Route path="/" element={<Intro />} />

                {/* 실제 앱은 /home 아래 */}
                <Route path="/home" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="brand" element={<Brand />} />
                    <Route path="tourclass" element={<TourClass />} />
                    <Route path="tourclass/:tourclassID" element={<TourClassDetail />} />
                    <Route path="tourresults" element={<TourSearch />} />

                    {/* OTT */}
                    {/* 
                        추후 OTT에 다크모드 적용 예정
                        <Route path="/ott" element={<Layout theme="dark" />} >
                             <Route index element={<Ott />} />
                        </Route>
                        */}

                    <Route path="ottmain" element={<OttMain />} />
                    <Route path="ottsub" element={<OttSub />} />
                    <Route path="ott/:mediaType/:ottID" element={<OttDetail />} />
                    <Route path="ottresults" element={<OttSearch />} />
                    <Route path="mypage" element={<MyPage />} />
                    <Route path="*" element={<NotFiles />} />
                </Route>

                <Route path="/brand" element={<Navigate to="/home/brand" replace />} />
                <Route path="/tourclass" element={<Navigate to="/home/tourclass" replace />} />
                <Route
                    path="/tourclass/:tourclassID"
                    element={<Navigate to="/home/tourclass/:tourclassID" replace />}
                />
                <Route path="/tourresults" element={<Navigate to="/home/tourresults" replace />} />
                <Route path="/ottmain" element={<Navigate to="/home/ottmain" replace />} />
                <Route path="/ottsub" element={<Navigate to="/home/ottsub" replace />} />
                <Route
                    path="/ott/:mediaType/:ottID"
                    element={<Navigate to="/home/ott/:mediaType/:ottID" replace />}
                />
                <Route path="/ottresults" element={<Navigate to="/home/ottresults" replace />} />
                <Route path="/mypage" element={<Navigate to="/home/mypage" replace />} />

                <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
        </BrowserRouter>
    );
};
