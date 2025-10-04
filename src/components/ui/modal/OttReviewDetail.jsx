import Button from '../button/Button';
import './style.scss';
import { useModalStore } from '../../../store';

const OttReviewDetail = () => {
    const { ottReviewOpen, closeOttReview } = useModalStore();

    // const onDel = () => {};

    // const onEdit = () => {};

    if (!ottReviewOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal ottReviewDetail">
                <div className="top"></div>
                <div className="bottom"></div>
                <p className="btns">
                    <Button text="닫기" className="small gray" onClick={closeOttReview} />
                </p>
            </div>
        </div>
    );
};

export default OttReviewDetail;
