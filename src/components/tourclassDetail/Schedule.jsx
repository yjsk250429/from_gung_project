import { FiDownload, FiHeart } from 'react-icons/fi';
import './style.scss';

const Schedule = ({thisitem}) => {
    const {id, title, theme=[], description, period, price, time, img, region, place=[]} = thisitem;

    return (
        <div className='schedule'>
            <strong>{description}</strong>
            <p>궁중음식 체험부터 전통공연, 특별 내부 관람까지!<br/>조용히 스며드는 고궁의 매력을 당일치기로 충분히 즐길 수 있어요.</p>
            <div className="pics">
                <ul>
                    <li><img src="/images/tourclass/pics.png" alt="" /></li>
                    <li><img src="/images/tourclass/pics.png" alt="" /></li>
                    <li><img src="/images/tourclass/pics.png" alt="" /></li>
                    <li><img src="/images/tourclass/pics.png" alt="" /></li>
                    <li><img src="/images/tourclass/pics.png" alt="" /></li>
                </ul>
            </div>
            <p className="btns">
                            <button><i><FiHeart /></i>투어 찜하기</button>
                            <button><i><FiDownload /></i>쿠폰 받기</button>
                        </p>
        </div>
    );
};

export default Schedule;