import { useEffect, useState } from 'react';
import { useAuthStore, useModalStore } from '../../../store';
import Button from '../button/Button';
import './style.scss';

const Login = () => {
    const { loginOpen, closeLogin, switchToJoin, openLoginCom } = useModalStore();
    const { login, members, kakaoLogin } = useAuthStore();

    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [saveId, setSaveId] = useState(false);

    const [idError, setIdError] = useState('');
    const [pwError, setPwError] = useState('');
    const [shakeKey, setShakeKey] = useState(0);

    const resetForm = () => {
        if (saveId) {
            setPassword('');
            setIdError('');
            setPwError('');
        } else {
            // 아이디 저장 X → 전부 초기화
            setUserId('');
            setPassword('');
            setIdError('');
            setPwError('');
        }
    };

    // 닫기 + 초기화
    const handleClose = () => {
        resetForm();
        closeLogin();
    };

    const onSubmit = (e) => {
        e.preventDefault();

        setIdError('');
        setPwError('');

        const idRegex = /^[a-zA-Z0-9]+$/;
        if (!idRegex.test(userId)) {
            setIdError('올바른 아이디를 입력해 주세요');
            setPassword('');
            setShakeKey(Date.now());
            return;
        }

        const member = members.find((m) => m.userId === userId);

        if (!member) {
            setIdError('존재하지 않는 아이디입니다');
            setPassword('');
            setShakeKey(Date.now());
            return;
        }

        if (member.password !== password) {
            setPwError('비밀번호가 일치하지 않습니다');
            setPassword('');
            setShakeKey(Date.now());
            return;
        }

        // 로그인 성공
        login({ userId, password });

        if (saveId) {
            localStorage.setItem('savedId', userId);
        } else {
            localStorage.removeItem('savedId');
        }

        handleClose(); // 닫으면서 초기화
        openLoginCom();
    };

    const kakaoLoginHandler = () => {
        window.Kakao.Auth.login({
            scope: 'profile_nickname,profile_image',
            success: function (authObj) {
                console.log('로그인 성공', authObj);

                window.Kakao.API.request({
                    url: '/v2/user/me',
                    success: function (res) {
                        console.log(' 사용자 정보', res);

                        const kakaoUser = {
                            userId: `kakao_${res.id}`,
                            name: res.kakao_account.profile.nickname,
                            profile: res.kakao_account.profile.profile_image_url,
                            reward: 0,
                            coupon: 0,
                            isKakao: true,
                        };

                        // 여기서 kakaoLogin 호출해야 authed, user 업데이트 됨
                        kakaoLogin(kakaoUser);

                        closeLogin();
                        openLoginCom();
                    },
                    fail: function (error) {
                        console.error(error);
                    },
                });
            },
            fail: function (err) {
                console.error('❌ 로그인 실패', err);
            },
        });
    };

    //모달이 열릴 때 savedId 불러오기
    useEffect(() => {
        if (loginOpen) {
            const savedId = localStorage.getItem('savedId');
            if (savedId) {
                setUserId(savedId);
                setSaveId(true);
            } else {
                setSaveId(false);
            }
        }
    }, [loginOpen]);

    if (!loginOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal login">
                <h3>로그인</h3>
                <form onSubmit={onSubmit}>
                    <label>
                        아이디
                        <input
                            key={`id-${shakeKey}`}
                            type="text"
                            className={idError ? 'error-input' : ''}
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        />
                        {idError && <p className="error">{idError}</p>}
                    </label>
                    <label>
                        비밀번호
                        <input
                            key={`pw-${shakeKey}`}
                            type="password"
                            className={pwError ? 'error-input' : ''}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {pwError && <p className="error">{pwError}</p>}
                    </label>
                    <p className="findId">
                        <label>
                            <input
                                type="checkbox"
                                checked={saveId}
                                onChange={(e) => setSaveId(e.target.checked)}
                            />
                            아이디 저장
                        </label>
                        <span>아이디/비밀번호 찾기</span>
                    </p>
                    <p className="btns">
                        <Button
                            text="취소"
                            className="small gray"
                            onClick={handleClose}
                            type="button"
                        />
                        <Button text="로그인" className="small main1" type="submit" />
                    </p>
                </form>
                <ul className="bottom">
                    <li onClick={kakaoLoginHandler}>
                        <img src="/images/components/kakaologin.png" alt="kakaologin" />
                        카카오 로그인
                    </li>
                    <li onClick={switchToJoin}>회원가입</li>
                </ul>
            </div>
        </div>
    );
};
export default Login;
