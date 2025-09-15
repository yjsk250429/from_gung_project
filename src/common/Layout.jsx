import { Outlet } from 'react-router-dom';
import Header from './header';
import Footer from './footer';
import Login from '../components/ui/modal/Login';
import JoinAgree from '../components/ui/modal/JoinAgree';
import RewardCheck from '../components/ui/modal/RewardCheck';
import StampNotice from '../components/ui/modal/StampNotice';

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
            <Footer />
        </div>
    );
};

export default Layout;
