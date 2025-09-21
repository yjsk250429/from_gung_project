import { useAuthStore, useModalStore } from '../../../store';
import './style.scss';
import { BsQuestionCircleFill } from 'react-icons/bs';
const RewardCheck = () => {
    const { rewardOpen, closeReward, openReward, openStampNotice } = useModalStore();
    const user = useAuthStore((s) => s.user);

    if (!rewardOpen) return null;

    return (
        <div className="rewardModal" onMouseEnter={openReward} onMouseLeave={closeReward}>
            <div className="myreward">
                <strong>
                    나의 리워드<span>충전하기</span>
                </strong>
                <ul>
                    <li>
                        <img src="/images/coin.png" alt="reward" />
                    </li>
                    <li>
                        {user.reward} <span>전</span>
                    </li>
                </ul>
            </div>
            <div className="attendance">
                <strong>
                    출석 도장
                    <span onClick={openStampNotice}>
                        <i>
                            <BsQuestionCircleFill />
                        </i>
                    </span>
                </strong>
                <ul>
                    <li className="on"></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
        </div>
    );
};

export default RewardCheck;
