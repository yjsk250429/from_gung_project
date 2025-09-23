import { useAuthStore, useModalStore } from '../../store';
import Button from '../ui/button/Button';
import './style.scss';
import { useEffect, useState } from 'react';

const SelectProfile = () => {
    const { selectProfileOpen, selectedProfileImage, closeSelectProfile } = useModalStore();
    const updateUser = useAuthStore((state) => state.updateUser);
    const [chosenProfile, setChosenProfile] = useState(selectedProfileImage);

    useEffect(() => {
        setChosenProfile(selectedProfileImage);
    }, [selectedProfileImage]);

    if (!selectProfileOpen) return null;

    const handleSelect = (img) => {
        setChosenProfile(img);
    };

    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    const handleSave = () => {
        if (chosenProfile) {
            updateUser({ profile: chosenProfile });
            closeSelectProfile();
        }
    };

    return (
        <div className="modal-overlay" onClick={closeSelectProfile}>
            <div className="modal selectProfile" onClick={handleModalClick}>
                <h3>프로필 선택하기</h3>

                <div className="profileImg_preview">
                    <img
                        src={chosenProfile || selectedProfileImage || '/images/profile/default.png'}
                        alt="프로필 선택 이미지"
                    />
                </div>

                <ul className="editProfileImg_List">
                    {Array.from({ length: 18 }, (_, i) => {
                        const imgPath = `/images/profile/profile_${i + 1}.png`;
                        return (
                            <li
                                key={i}
                                className={`editProfileImg_Item ${
                                    chosenProfile === imgPath ? 'selected' : ''
                                }`}
                                onClick={() => handleSelect(imgPath)}
                            >
                                <img src={imgPath} alt={`프로필 ${i + 1}`} />
                                <span className="overlayBlack" />
                            </li>
                        );
                    })}
                </ul>

                <p className="btns">
                    <Button text="취소" className="default gray" onClick={closeSelectProfile} />
                    <Button text="저장" className="default main1" onClick={handleSave} />
                </p>
            </div>
        </div>
    );
};

export default SelectProfile;
