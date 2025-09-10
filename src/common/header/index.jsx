import { Link } from 'react-router-dom';
import NavBar from './NavBar';
import UtilBar from './UtilBar';
import { useEffect, useState } from 'react';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(()=>{
        let headerOn = false;

        const onScroll = ()=>{
            if(!headerOn){
                window.requestAnimationFrame(()=>{
                    setScrolled(window.scrollY>0);
                    headerOn = false;
                });
                headerOn = true;
            }
        };
        window.addEventListener('scroll', onScroll, {passive:true});
        onScroll();
        return ()=>window.removeEventListener('scroll', onScroll);
    },[])

    return (
        <header id="header" className={scrolled ? 'on' : ''}>
            <div className="inner">
                <h1>
                    <Link to="/">
                        <img src="/images/logo.png" alt="fromgung" />
                    </Link>
                </h1>
                <NavBar />
                <UtilBar/>
            </div>
        </header>
    );
};

export default Header;
