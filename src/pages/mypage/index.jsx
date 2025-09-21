import MyPagemain from '../../components/mypage/MyPagemain';
import EditInfo from '../../components/ui/modal/EditInfo';
import EditInfoComplete from '../../components/ui/modal/EditInfoComplete';
import EditPassword from '../../components/ui/modal/EditPassword';
import WithdrawComplete from '../../components/ui/modal/WithdrawComplete';
import WithdrawConfirm from '../../components/ui/modal/WithdrawConfirm';

const MyPage = () => {
    return (
        <>
            <MyPagemain />
            <EditPassword />
            <EditInfo />
            <EditInfoComplete />
            <WithdrawConfirm />
            <WithdrawComplete />
        </>
    );
};

export default MyPage;
