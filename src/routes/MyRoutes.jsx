import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../common/Layout';
import { Brand, Class, ClassDatail, Home, Join, Login, MyPage, NotFiles, Ott, OttCategory, OttDetail, Tour, TourDatail } from '../pages';

export const MyRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    
                    <Route index element={<Home />} />

                    <Route path="/brand" element={<Brand />} />

                    <Route path="/tour" element={<Tour />} />
                    <Route path="/tour/:tourID" element={<TourDatail />} />
                    
                    <Route path="/class" element={<Class />} />
                    <Route path="/class/:classID" element={<ClassDatail />} />
                    
                    {/* 
                        추후 OTT에 다크모드 적용 예정
                        <Route path="/ott" element={<Layout theme="dark" />} >
                             <Route index element={<Ott />} />
                        </Route>
                    */}
                    <Route path="/ott" element={<Ott />} />
                    <Route path="/ottcategory" element={<OttCategory />} />
                    <Route path="/ott/:ottID" element={<OttDetail />} />

                    <Route path="/mypage" element={<MyPage />} />
                    
                    <Route path="/login" element={<Login />} />
                    
                    <Route path="/join" element={<Join />} />

                    <Route path="/notfiles" element={<NotFiles />} />

                </Route>
            </Routes>
        </BrowserRouter>
    );
};
