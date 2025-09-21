import { useState } from 'react';
import { useModalStore, useAuthStore } from '../../../store';
import Button from '../button/Button';

const EditPassword = () => {
    const { editPasswordOpen, switchToEditPassword, closeEditPassword } = useModalStore();
    const user = useAuthStore((s) => s.user);

    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    if (!editPasswordOpen) return null;

    const handleChange = (e) => {
        setPassword(e.target.value);

        // input 지우면 에러 메시지 사라짐
        if (e.target.value === '') {
            setError('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!user) return;

        if (password === user.password) {
            //  비밀번호 일치 → 다음 단계로 이동
            switchToEditPassword();
            setPassword('');
            setError('');
        } else {
            //  비밀번호 불일치 → 에러 메시지 출력
            setError('비밀번호가 올바르지 않습니다.');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal editPassword">
                <h3>비밀번호를 입력해 주세요</h3>
                <form onSubmit={handleSubmit}>
                    <input type="password" value={password} onChange={handleChange} />
                    {error && <p className="error-message">{error}</p>}
                </form>
                <p className="btns">
                    <Button
                        text="취소"
                        className="small gray"
                        type="button"
                        onClick={() => {
                            setPassword('');
                            setError('');
                            closeEditPassword();
                        }}
                    />
                    <Button
                        text="확인"
                        className="small main1"
                        type="submit"
                        onClick={handleSubmit}
                    />
                </p>
            </div>
        </div>
    );
};

export default EditPassword;
