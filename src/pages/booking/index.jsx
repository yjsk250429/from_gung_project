import Payment from '../../components/booking/Payment';
import WishModal from '../../components/ui/modal/WishModal';
import { useModalStore } from '../../store';
import './style.scss';

const Booking = () => {
    const {wishModalOpen} = useModalStore();
    return (
        <>
            <Payment />
            {wishModalOpen && <WishModal className="bookingComplete" />}
        </>
    );
};

export default Booking;
