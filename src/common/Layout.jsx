import { Outlet } from 'react-router-dom';
import Header from './header';
import Footer from './footer';
import Login from '../components/ui/modal/Login';

const Layout = () => {
    return (
        <div className="wrap">
            <Header />
            <main id="content" className="main">
                <Outlet />
            </main>
            <Login/>
            <Footer />
        </div>
    );
};

export default Layout;
