import { BestTour, Mainvisual, OttLink, PalaceVideo, TextBanner, TraditionClass } from '../../components/home';
import ReviewBlocks from '../../components/home/section6/ReviewBlocks';
import './style.scss';

const Home = () => {
    return (
        <>
            <Mainvisual />
            <BestTour />
            <PalaceVideo />
            <TraditionClass />
            <TextBanner />
            <OttLink />
            <ReviewBlocks/>
        </>
    );
};

export default Home;
