import { useAuthStore, useModalStore } from '../../../store';
import './style.scss';
import { BsQuestionCircleFill } from 'react-icons/bs';

const RewardCheck = () => {
    const { rewardOpen, closeReward, openReward, openStampNotice } = useModalStore();
    const user = useAuthStore((s) => s.user);
    const authed = useAuthStore((s) => s.authed);

    if (!rewardOpen) return null;

    // ✅ 출석 횟수 (배열 길이 기반)
    const attendanceCount = user?.attandance?.length || 0;

    const isFull = attendanceCount >= 10;

    return (
        <div className="rewardModal" onMouseEnter={openReward} onMouseLeave={closeReward}>
            {authed ? (
                <>
                    <div className="myreward">
                        <strong>
                            나의 리워드<span>충전하기</span>
                        </strong>
                        <ul>
                            <li>
                                <img src="/images/coin.png" alt="reward" />
                            </li>
                            <li>
                                {user?.reward ?? 0} <span>전</span>
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

                        <div className={`attendance-board ${isFull ? 'full' : ''}`}>
                            <ul>
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <li key={i} className={i < attendanceCount ? 'on' : ''}></li>
                                ))}
                            </ul>

                            {isFull && (
                                <div className="reward-overlay">
                                    <button type="button" className="coupon-btn">
                                        쿠폰받기
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <h3>로그인 후 이용 가능한 서비스입니다.</h3>
            )}
        </div>
    );
};

export default RewardCheck;
