import MyPagemain from '../../components/mypage/MyPagemain';
import SelectProfile from '../../components/mypage/SelectProfile';
import EditInfo from '../../components/ui/modal/EditInfo';
import EditInfoComplete from '../../components/ui/modal/EditInfoComplete';
import EditPassword from '../../components/ui/modal/EditPassword';
import WishModal from '../../components/ui/modal/WishModal';
import WithdrawComplete from '../../components/ui/modal/WithdrawComplete';
import WithdrawConfirm from '../../components/ui/modal/WithdrawConfirm';
import { useAuthStore } from '../../store';

const MyPage = () => {
    const { user } = useAuthStore();

    return (
        <>
            <MyPagemain />
            <EditPassword />
            <EditInfo />
            <EditInfoComplete />
            <WithdrawConfirm />
            <WithdrawComplete />
<<<<<<< HEAD
            {user.wishlist.length > 0 && <WishModal className="deleteAll" />}
=======
            {user.wishlist?.length > 0 && <WishModal className="deleteAll" />}
>>>>>>> 7cbd87f57e3ab6170e6f72580a130db0e15d7ff4
            <SelectProfile />
        </>
    );
};

export default MyPage;
