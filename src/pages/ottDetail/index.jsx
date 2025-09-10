import OttDetailContents from "../../components/ottDetail/OttDetailContents";
import OttDetailPeople from "../../components/ottDetail/OttDetailPeople";
import OttDetailReview from "../../components/ottDetail/OttDetailReview";
import OttDetailVisual from "../../components/ottDetail/OttDetailVisual";

const OttDetail = () => {
    return (
        <div>
            <OttDetailVisual/>
            <OttDetailPeople/>
            <OttDetailReview/>
            <OttDetailContents/>
        </div>
    );
};

export default OttDetail;