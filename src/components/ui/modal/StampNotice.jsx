import { useModalStore } from '../../../store';
import Button from '../button/Button';
import './style.scss';

const StampNotice = () => {
         const { stampNoticeOpen, closeStampNotice } = useModalStore();
            if (!stampNoticeOpen) return null;

    return (
        <div className="modal-overlay">
            <div className='modal stampNotice'>
                <img src="/images/components/stamp_notice.png" alt="stamp" />
            <h3>출첵<span> 하고</span> 클래스<span> 듣자</span>!</h3>
            <ul>
                <li>하나, 하루 한 번 로그인하고 출석 도장을 모으세요.</li>
                <li>둘, 화면 우측 상단 아이콘에서 출석 현황을 확인하세요.</li>
                <li>셋, 도장 <span>10개</span>를 모아서 <span>체험/클래스 이용권</span>을 받으세요.</li>
            </ul>
            <Button text='닫기' className='small white' onClick={closeStampNotice}/>
            </div>
        </div>
    );
};

export default StampNotice;