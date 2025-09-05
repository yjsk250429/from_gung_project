import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <>
            <nav className="nav">
                <ul>
                    <li>
                        <Link to="/brand">BRAND 읽다</Link>
                    </li>
                    <li>
                        <Link to="/tour">TOUR 가다</Link>
                    </li>
                    <li>
                        <Link to="/ott">OTT 보다</Link>
                    </li>
                </ul>
            </nav>
        </>
    );
};

export default NavBar;
