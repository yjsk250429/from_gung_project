import Mainvisual from './mainvisual/mainvisual';
import Section5 from './mainvisual/section5/section5';
import Section1 from './section1/section1';
import Section2 from './section2/section2';
import Section3 from './section3/section3';
import Section4 from './section4/section4';
import './style.scss';

const Home = () =>{

    return (
        <>
            <Mainvisual/>
            <Section1/>
            <Section2/>
            <Section3/>
            <Section4/>
            <Section5/>
           
        </>
    );
}

export default Home;
