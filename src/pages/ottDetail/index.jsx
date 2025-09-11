import OttDetailCast from '../../components/ottDetail/Con1Cast/OttDetailCast';
import OttDetailReview from '../../components/ottDetail/con2Review/OttDetailReview';
import OttDetailContents from '../../components/ottDetail/con3Contents/OttDetailContents';
import OttDetailVisual from '../../components/ottDetail/ottDetailVisual/OttDetailVisual';

const OttDetail = () => {
    return (
        <div>
            <OttDetailVisual />
            <OttDetailCast />
            <OttDetailReview />
            <OttDetailContents />
        </div>
    );
};

export default OttDetail;
