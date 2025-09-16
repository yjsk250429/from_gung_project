import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

export const MyRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />

                    <Route path="/brand" element={<Brand />} />
                    <Route path="/tourclass" element={<TourClass />} />
                    <Route path="/tourclass/:tourclassID" element={<TourClassDetail />} />
                    <Route path="/tourresults" element={<TourSearch />} />

                    <Route path="/ottmain" element={<OttMain />} />
                    <Route path="/ottsub" element={<OttSub />} />

                    <Route path="ott/:mediaType/:ottID" element={<OttDetail />} />
                    <Route path="/ottresults" element={<OttSearch />} />

                    <Route path="/mypage" element={<MyPage />} />

                    <Route path="*" element={<NotFiles />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
