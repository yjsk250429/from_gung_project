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
                        <Link to="/tour"><span>TOUR</span> 가다</Link>
                    </li>
                    <li>
                        <Link to="/ott"><span>OTT</span> 보다</Link>
                    </li>
                </ul>
            </nav>
        </>
    );
};

export default NavBar;
