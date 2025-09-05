import { Link } from 'react-router-dom';
import NavBar from './NavBar';

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
            </div>
        </header>
    );
};

export default Header;
