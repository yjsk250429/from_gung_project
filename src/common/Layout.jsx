import { Outlet } from 'react-router-dom';
import Header from './header';
import Footer from './footer';
import Login from '../components/ui/modal/Login';
import JoinAgree from '../components/ui/modal/JoinAgree';
import RewardCheck from '../components/ui/modal/RewardCheck';
import StampNotice from '../components/ui/modal/StampNotice';
import JoinInfo from '../components/ui/modal/JoinInfo';
import JoinComplete from '../components/ui/modal/JoinComplete';
import LoginComplete from '../components/ui/modal/LoginComplete';
import LogoutComplete from '../components/ui/modal/LogoutComplete';
import NeedLogin from '../components/ui/modal/NeedLogin';

const Layout = () => {
    return (
        <div className="wrap">
            <Header />
            <main id="content" className="main">
                <Outlet />
            </main>
            <Login/>
            <JoinAgree/>
            <RewardCheck/>
            <StampNotice/>
            <JoinInfo/>
            <JoinComplete/>
            <LoginComplete/>
            <LogoutComplete/>
            <NeedLogin/>
            <Footer />
        </div>
    );
};

export default Layout;
