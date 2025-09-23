import { useState } from 'react';
import { useAuthStore, useModalStore } from '../../../store';
import './style.scss';

const WishlistSection = ({ activeSubMenu }) => {
    const { user, clearWishlist, removeFromWishlist  } = useAuthStore();
    const {openWishModal} = useModalStore();
    const items =
        activeSubMenu === 'tour'
            ? user?.wishlist || []   
            : user?.ottWishList || [];     

    const [selectedIds, setSelectedIds] = useState([]);

    const handleSelect = (id, checked) => {
        setSelectedIds((prev) =>
          checked ? [...prev, id] : prev.filter((sid) => sid !== id)
        );
      };

    const deleteAll = () =>{
        openWishModal("모두 삭제하시겠습니까?", { text1: "취소", text2:"확인" }, clearWishlist);
    }

    const deleteSelected = () => {
        if (selectedIds.length === 0) {
          openWishModal("항목을 선택해 주세요", { text1: "확인" });
          return;
        }
      
        openWishModal(
          "선택 항목을 삭제하시겠습니까?",
          { text1: "취소", text2: "확인" },
          () => removeFromWishlist(selectedIds)
        );
      };


    return (
        <div className="wishlist">
            <div className="top">
            <h2>{activeSubMenu === 'tour' ? '투어 찜 목록' : 'OTT 찜 목록'}</h2>
                <ul className="wishlist_toolbar">
                    <li onClick={deleteAll}>전체 삭제</li>
                    <li onClick={deleteSelected}>선택 삭제</li>
                </ul>
            </div>

            {items.length > 0 ? (
                <ul className="wishlist_grid">
                    {items.map((it) => (
                        <li key={it.id} className={it.disabled ? 'disabled' : ''}>
                                <div className="img-wrap">
                                    <img src={it.img} alt={it.title} />
                                    {/* <i className="selector" aria-hidden /> */}
                                    <input type="checkbox" id='selector' checked={selectedIds.includes(it.id)}
                  onChange={(e) => handleSelect(it.id, e.target.checked)}/>
                                    <label htmlFor="selector"></label>
                                </div>
                                <p className="title">{it.title}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="empty">찜한 항목이 없습니다.</p>
            )}
        </div>
    );
};

export default WishlistSection;
