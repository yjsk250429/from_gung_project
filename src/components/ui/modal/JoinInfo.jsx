import { useRef, useState } from 'react';
import { useAuthStore, useModalStore } from '../../../store';
import Button from '../button/Button';
import './style.scss';
const badWords = ['시발', '존나', '썅'];

const JoinInfo = () => {
    const { joinInfoOpen, closeJoinInfo, switchToJoinCom } = useModalStore();
    const { members, signup } = useAuthStore();

    const initialForm = {
        name: '',
        nickName: '',
        userId: '',
        password: '',
        passwordConfirm: '',
        tel: { first: '010', middle: '', last: '' },
        birth: { year: null, month: null, date: null },
    };

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [idChecked, setIdChecked] = useState(false);
    const [pwMatchMessage, setPwMatchMessage] = useState('');
    const [shakeTrigger, setShakeTrigger] = useState(0);
    const [idCheckMessage, setIdCheckMessage] = useState(''); // ✅ 메시지 상태 추가
    const [idCheckSuccess, setIdCheckSuccess] = useState(false); // ✅ 성공 여부 색상 구분용

    const firstRef = useRef(null);
    const middleRef = useRef(null);
    const lastRef = useRef(null);

    if (!joinInfoOpen) return null;

    const resetForm = () => {
        setForm(initialForm);
        setErrors({});
        setIdChecked(false);
        setPwMatchMessage('');
        setShakeTrigger(0);
    };

    const handleCancel = () => {
        closeJoinInfo();
        resetForm();
    };

    // ✅ 유효성 검사 함수들 (기존 그대로)
    const validateName = (name) => {
        if (!name) return '필수 항목을 입력해주세요.';
        const regex = /^[a-zA-Z가-힣]+$/;
        if (!regex.test(name)) return '올바른 이름을 입력해 주세요';
        if (name.length < 2) return '이름은 2자 이상 입력해야 합니다.';
        if (/^[가-힣]+$/.test(name) && name.length > 10) return '최대 글자수를 초과했습니다';
        if (/^[a-zA-Z]+$/.test(name) && name.length > 20) return '최대 글자수를 초과했습니다';
        return null;
    };

    const validateNickName = (nick) => {
        if (!nick) return null;
        if (badWords.includes(nick)) return '사용할 수 없는 닉네임입니다.';
        const regex = /^[a-zA-Z0-9가-힣]+$/;
        if (!regex.test(nick)) return '사용할 수 없는 닉네임입니다.';

        if (/^[a-zA-Z0-9]+$/.test(nick)) {
            if (nick.length < 3) return '닉네임은 3자 이상 입력해야 합니다.';
            if (nick.length > 10) return '최대 글자수를 초과했습니다';
        }
        if (/^[가-힣]+$/.test(nick)) {
            if (nick.length < 2) return '닉네임은 2자 이상 입력해야 합니다.';
            if (nick.length > 6) return '최대 글자수를 초과했습니다';
        }
        return null;
    };

    const validateUserId = (id) => {
        const regex = /^[a-zA-Z0-9]+$/;
        if (!regex.test(id) || id.length < 5 || id.length > 20) {
            return '사용할 수 없는 아이디입니다.';
        }
        return null;
    };

    const validatePassword = (pw) => {
        if (pw.length < 8 || pw.length > 20) return '숫자, 특수기호 포함 8자 이상 20자 이내';
        if (!/[0-9]/.test(pw) || !/[a-zA-Z]/.test(pw))
            return '숫자, 특수기호 포함 8자 이상 20자 이내';
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(pw)) return '숫자, 특수기호 포함 8자 이상 20자 이내';
        return null;
    };

    // ✅ 입력 핸들러 (검증 없음, 값 지울 때만 에러 제거)
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (['first', 'middle', 'last'].includes(name)) {
            setForm((prev) => ({ ...prev, tel: { ...prev.tel, [name]: value } }));
        } else if (['year', 'month', 'date'].includes(name)) {
            setForm((prev) => ({
                ...prev,
                birth: { ...prev.birth, [name]: value || null },
            }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }

        // ✅ 값이 완전히 지워지면 해당 에러 제거
        if (value === '') {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }

        // 비밀번호 일치 여부는 UX 차원에서만 표시
        if (name === 'password' || name === 'passwordConfirm') {
            setPwMatchMessage(
                (name === 'passwordConfirm' ? value : form.passwordConfirm) ===
                    (name === 'password' ? value : form.password)
                    ? '비밀번호가 일치합니다.'
                    : '비밀번호가 일치하지 않습니다.'
            );
        }
    };

    const handleIdCheck = () => {
        const err = validateUserId(form.userId);
        if (err) {
            setErrors((prev) => ({ ...prev, userId: err }));
            setIdChecked(false);
            setIdCheckMessage('');
            return;
        }
        if (members.find((m) => m.userId === form.userId)) {
            setErrors((prev) => ({ ...prev, userId: '중복된 아이디가 존재합니다.' }));
            setIdChecked(false);
            setIdCheckMessage('');
        } else {
            setErrors((prev) => ({ ...prev, userId: null }));
            setIdChecked(true);
            setIdCheckSuccess(true); // 성공 상태
            setIdCheckMessage('사용 가능한 아이디입니다.'); // ✅ 메시지 설정
        }
    };
    const triggerContactShake = () => {
        [firstRef.current, middleRef.current, lastRef.current].forEach((el) => {
            if (!el) return;
            el.classList.remove('shake');
            // reflow 강제
            // eslint-disable-next-line no-unused-expressions
            el.offsetWidth;
            el.classList.add('shake');
            // 애니메이션 끝나면 깔끔히 제거 (다음에 또 재생되도록)
            el.addEventListener('animationend', () => el.classList.remove('shake'), { once: true });
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        let newErrors = {};

        if (
            !form.name ||
            !form.userId ||
            !form.password ||
            !form.passwordConfirm ||
            !form.tel.middle ||
            !form.tel.last
        ) {
            newErrors.required = '필수 항목을 입력해주세요.';
        }

        const nameErr = validateName(form.name);
        if (nameErr) newErrors.name = nameErr;

        let finalNick = form.nickName;
        if (!form.nickName && form.userId) {
            finalNick = form.userId.slice(0, 3) + '***';
        } else {
            const nickErr = validateNickName(form.nickName);
            if (nickErr) newErrors.nickName = nickErr;
        }

        const idErr = validateUserId(form.userId);
        if (idErr) newErrors.userId = idErr;

        if (!idChecked) {
            newErrors.userId = '아이디 중복확인을 해주세요.';
        }

        const pwErr = validatePassword(form.password);
        if (pwErr) newErrors.password = pwErr;

        if (form.password !== form.passwordConfirm) {
            newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            setShakeTrigger((prev) => prev + 1); // 나머지 input들
            if (newErrors.required) triggerContactShake(); // 연락처만 ref로
            return;
        }

        signup({
            name: form.name,
            userId: form.userId,
            password: form.password,
            nickName: finalNick,
            profile: '/images/mypage/honggildong.png',
            tel: form.tel,
            birth: form.birth,
            reward: 0,
            coupon: 0,
            marketing: false,
            marketingDate: null,
        });

        switchToJoinCom();
        resetForm();
    };

    return (
        <div className="modal-overlay">
            <div className="modal joinInfo">
                <h3>
                    회원정보 입력 <span>* 필수항목</span>
                </h3>
                <form onSubmit={onSubmit}>
                    {/* 이름 */}
                    <label>
                        이름*
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className={errors.name ? 'error shake' : ''}
                            key={shakeTrigger + (errors.name ? '-name' : '')}
                        />
                        {errors.name && <p className="error-message">{errors.name}</p>}
                    </label>

                    {/* 닉네임 */}
                    <label>
                        닉네임
                        <input
                            type="text"
                            name="nickName"
                            value={form.nickName}
                            onChange={handleChange}
                            className={errors.nickName ? 'error shake' : ''}
                            key={shakeTrigger + (errors.nickName ? '-nick' : '')}
                        />
                        {errors.nickName && <p className="error-message">{errors.nickName}</p>}
                    </label>

                    {/* 아이디 */}
                    <label>
                        아이디*
                        <input
                            type="text"
                            name="userId"
                            value={form.userId}
                            onChange={handleChange}
                            className={errors.userId ? 'error shake' : ''}
                            key={shakeTrigger + (errors.userId ? '-id' : '')}
                        />
                        <button className="idcheck" type="button" onClick={handleIdCheck}>
                            중복확인
                        </button>
                        {errors.userId && <p className="error-message">{errors.userId}</p>}
                        {!errors.userId && idCheckMessage && (
                            <p className={`idcheck-message ${idCheckSuccess ? 'success' : ''}`}>
                                {idCheckMessage}
                            </p>
                        )}
                    </label>

                    {/* 비밀번호 */}
                    <label>
                        비밀번호*
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className={errors.password ? 'error shake' : ''}
                            key={shakeTrigger + (errors.password ? '-pw' : '')}
                        />
                        {errors.password && <p className="error-message">{errors.password}</p>}
                    </label>

                    {/* 비밀번호 확인 */}
                    <label>
                        비밀번호 확인*
                        <input
                            type="password"
                            name="passwordConfirm"
                            value={form.passwordConfirm}
                            onChange={handleChange}
                            className={errors.passwordConfirm ? 'error shake' : ''}
                            key={shakeTrigger + (errors.passwordConfirm ? '-pw2' : '')}
                        />
                        {errors.passwordConfirm && (
                            <p className="error-message">{errors.passwordConfirm}</p>
                        )}
                        {pwMatchMessage && (
                            <p
                                className={`pw-message ${
                                    pwMatchMessage === '비밀번호가 일치합니다.'
                                        ? 'success'
                                        : 'error'
                                }`}
                            >
                                {pwMatchMessage}
                            </p>
                        )}{' '}
                    </label>

                    {/* 연락처 */}
                    <label>
                        연락처*
                        <select
                            ref={firstRef}
                            name="first"
                            value={form.tel.first}
                            onChange={handleChange}
                            className={`${errors.required ? 'error' : ''} ${
                                errors.required ? `shake-${shakeTrigger}` : ''
                            }`}
                        >
                            <option value="010">010</option>
                            <option value="011">011</option>
                            <option value="012">012</option>
                            <option value="013">013</option>
                        </select>
                        -
                        <input
                            ref={middleRef}
                            type="text"
                            name="middle"
                            value={form.tel.middle}
                            onChange={(e) => {
                                const onlyNum = e.target.value.replace(/\D/g, '').slice(0, 4);
                                setForm((prev) => ({
                                    ...prev,
                                    tel: { ...prev.tel, middle: onlyNum },
                                }));
                            }}
                            inputMode="numeric"
                            maxLength={4}
                            className={errors.required ? 'error' : ''}
                        />
                        -
                        <input
                            ref={lastRef}
                            type="text"
                            name="last"
                            value={form.tel.last}
                            onChange={(e) => {
                                const onlyNum = e.target.value.replace(/\D/g, '').slice(0, 4);
                                setForm((prev) => ({
                                    ...prev,
                                    tel: { ...prev.tel, last: onlyNum },
                                }));
                            }}
                            inputMode="numeric"
                            maxLength={4}
                            className={errors.required ? 'error' : ''}
                        />
                    </label>

                    {/* 생년월일 */}
                    <label>
                        생년월일
                        <select name="year" value={form.birth.year || ''} onChange={handleChange}>
                            <option value="">년도</option>
                            {Array.from({ length: 2025 - 1900 + 1 }, (_, i) => 2025 - i).map(
                                (year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                )
                            )}
                        </select>
                        년
                        <select name="month" value={form.birth.month || ''} onChange={handleChange}>
                            <option value="">월</option>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                <option key={month} value={month.toString().padStart(2, '0')}>
                                    {month.toString().padStart(2, '0')}
                                </option>
                            ))}
                        </select>
                        월
                        <select name="date" value={form.birth.date || ''} onChange={handleChange}>
                            <option value="">일</option>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                <option key={day} value={day.toString().padStart(2, '0')}>
                                    {day.toString().padStart(2, '0')}
                                </option>
                            ))}
                        </select>
                        일
                    </label>

                    {errors.required && <p className="error-message required">{errors.required}</p>}

                    <p className="btns">
                        <Button
                            text="취소"
                            className="small gray"
                            onClick={handleCancel}
                            type="button"
                        />
                        <Button text="가입하기" className="small main1" type="submit" />
                    </p>
                </form>
            </div>
        </div>
    );
};

export default JoinInfo;
