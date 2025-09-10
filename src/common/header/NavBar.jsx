import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <>
            <nav className="nav">
                <ul>
                    <li>
                        <Link to="/brand"><span>BRAND</span> 읽다</Link>
                    </li>
                    <li>
                        <Link to="/tourclass"><span>TOUR</span> 가다</Link>
                    </li>
                    <li>
                        <Link to="/ottmain"><span>OTT</span> 보다</Link>
                    </li>
                </ul>
            </nav>
        </>
    );
};

export default NavBar;
