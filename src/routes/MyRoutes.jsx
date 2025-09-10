import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../common/Layout';
import {
    Brand,
    Home,
    Join,
    Login,
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
                    {/* 
                        추후 OTT에 다크모드 적용 예정
                        <Route path="/ott" element={<Layout theme="dark" />} >
                             <Route index element={<Ott />} />
                        </Route>
                    */}
                    <Route path="/ottmain" element={<OttMain />} />
                    <Route path="/ottsub" element={<OttSub />} />
                    {/* <Route path="/ott/:ottID" element={<OttDetail />} /> */}
                    <Route path="/ott/ottdetail" element={<OttDetail />} />
                    <Route path="/ottresults" element={<OttSearch />} />

                    <Route path="/mypage" element={<MyPage />} />

                    {/* <Route path="/login" element={<Login />} />
                    
                    <Route path="/join" element={<Join />} /> */}

                    <Route path="*" element={<NotFiles />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
