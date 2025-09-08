import { Link } from 'react-router-dom';
import NavBar from './NavBar';
import UtilBar from './UtilBar';

const Header = () => {
    return (
        <header id="header">
            <div className="inner">
                <h1>
                    <Link to="/">
                        <img src="./vite.svg" alt="logo" />
                    </Link>
                </h1>
                <NavBar />
                <UtilBar/>
            </div>
        </header>
    );
};

export default Header;
