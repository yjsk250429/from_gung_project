import { useAuthStore } from '../../../store';

const ReservationSection = () => {
    const user = useAuthStore((s) => s.user);

    // 로그인 안 되어 있거나 예약이 없을 경우
    if (!user || !user.bookings || user.bookings.length === 0) {
        return (
            <div className="reservation">
                <h2>나의 예약 내역</h2>
                <p>예약 내역이 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="reservation">
            <h2>나의 예약 내역</h2>
            <div className="reservation_list">
                {user.bookings.map((booking) => {
                    const { id, bookingNumber, item, selected, createdAt, status } = booking;
                    const fromDate = selected?.from ? new Date(selected.from) : null;
                    const toDate = selected?.to ? new Date(selected.to) : null;

                    return (
                        <div className="reservation_item" key={id}>
                            <div className="thumb">
                                <img src={item.img} alt={item.title} />
                            </div>
                            <div className="info">
                                <p className="title">{item.title}</p>
                                <p className="date">
                                    예약일: {new Date(createdAt).toLocaleDateString()} &nbsp; 
                                    관람일: {fromDate?.toLocaleDateString()} 
                                    {toDate && fromDate?.getTime() !== toDate.getTime() 
                                        ? ` ~ ${toDate.toLocaleDateString()}` 
                                        : ''}
                                </p>
                                <p className="num">예약번호: {bookingNumber}</p>
                                <p className="status">상태: {status === 'confirmed' ? '예약완료' : '취소됨'}</p>
                            </div>
                            {status === 'confirmed' && (
                                <button className="btn_cancel" type="button">
                                    예약 취소
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ReservationSection;
