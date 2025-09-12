import OttList from '../../components/ottSub/OttList';
import CuratedSageuk from '../../components/tmdb/CuratedSageuk';
import './style.scss';

const OttSub = () => {
    
      return (
        <section className='ottsub'>
          <div className="inner">
            {/* <OttList/> */}
            <CuratedSageuk />
          </div>
        </section>
      );
    };
    
    export default OttSub;