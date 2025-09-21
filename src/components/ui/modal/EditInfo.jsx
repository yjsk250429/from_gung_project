import { useAuthStore, useModalStore } from '../../../store';
import { useEffect, useState } from 'react';
import Button from '../button/Button';
import './style.scss';

const validateNickName = (nick) => {
    if (!nick) return '닉네임을 입력해주세요.';
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

const validatePassword = (pw) => {
    if (!pw) return null; // 비밀번호 변경 안 했으면 통과
    if (pw.length < 8 || pw.length > 20) return '숫자, 특수기호 포함 8자 이상 20자 이내';
    if (!/[0-9]/.test(pw) || !/[a-zA-Z]/.test(pw)) return '숫자, 특수기호 포함 8자 이상 20자 이내';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pw)) return '숫자, 특수기호 포함 8자 이상 20자 이내';
    return null;
};

const EditInfo = () => {
    const { editInfoOpen, closeEditInfo, switchToEditComplete } = useModalStore();
    const user = useAuthStore((s) => s.user);
    const updateUser = useAuthStore((s) => s.updateUser);

    const { userId, name, birth, nickName, tel, marketing, marketingDate } = user || {};

    const initialForm = {
        nickName: nickName || '',
        password: '',
        passwordConfirm: '',
        tel: { ...tel },
        birth: { ...birth },
        marketing: marketing || false,
    };

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (user) {
            setForm({
                nickName: user.nickName || '',
                password: '',
                passwordConfirm: '',
                tel: { ...user.tel },
                birth: { ...user.birth },
                marketing: user.marketing || false,
            });
        }
    }, [user]);
    if (!editInfoOpen || !user) return null;

    const resetForm = () => {
        setForm(initialForm);
        setErrors({});
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (['first', 'middle', 'last'].includes(name)) {
            setForm((prev) => ({
                ...prev,
                tel: { ...prev.tel, [name]: value.replace(/\D/g, '').slice(0, 4) },
            }));
        } else if (['year', 'month', 'date'].includes(name)) {
            setForm((prev) => ({
                ...prev,
                birth: { ...prev.birth, [name]: value },
            }));
        } else if (type === 'checkbox') {
            setForm((prev) => ({ ...prev, marketing: checked }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }

        if (name === 'password' || name === 'passwordConfirm') {
            setErrors((prev) => {
                const newErrors = { ...prev };
                if (
                    (name === 'passwordConfirm' ? value : form.passwordConfirm) !==
                    (name === 'password' ? value : form.password)
                ) {
                    newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
                } else {
                    delete newErrors.passwordConfirm;
                }
                return newErrors;
            });
        }

        if (value === '') {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        let newErrors = {};

        // 닉네임 검사
        const nickErr = validateNickName(form.nickName);
        if (nickErr) newErrors.nickName = nickErr;

        // 비밀번호 검사
        const pwErr = validatePassword(form.password);
        if (pwErr) newErrors.password = pwErr;

        if (form.password && form.password !== form.passwordConfirm) {
            newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        // 업데이트 실행
        updateUser({
            nickName: form.nickName,
            ...(form.password ? { password: form.password } : {}),
            tel: form.tel,
            birth: form.birth,
            marketing: form.marketing,
            marketingDate: new Date().toISOString(),
        });
        resetForm();
        switchToEditComplete();
    };

    const handleCancel = () => {
        resetForm();
        closeEditInfo();
    };

    return (
        <div className="modal-overlay">
            <div className="modal editInfo">
                <h3>회원정보 수정</h3>
                <dl>
                    <dt>아이디</dt>
                    <dd>{userId}</dd>
                </dl>
                <dl>
                    <dt>이름</dt>
                    <dd>{name}</dd>
                </dl>

                <form onSubmit={onSubmit}>
                    <label>
                        닉네임
                        <input
                            type="text"
                            name="nickName"
                            value={form.nickName}
                            onChange={handleChange}
                        />
                        {errors.nickName && <p className="error-message">{errors.nickName}</p>}
                    </label>
                    <label>
                        비밀번호 변경
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                        />
                        {errors.password && <p className="error-message">{errors.password}</p>}
                    </label>
                    <label>
                        비밀번호 확인
                        <input
                            type="password"
                            name="passwordConfirm"
                            value={form.passwordConfirm}
                            onChange={handleChange}
                        />
                        {errors.passwordConfirm && (
                            <p className="error-message">{errors.passwordConfirm}</p>
                        )}
                        {form.password && form.passwordConfirm && !errors.passwordConfirm && (
                            <p
                                className={
                                    form.password === form.passwordConfirm
                                        ? 'success-message'
                                        : 'error-message'
                                }
                            >
                                {form.password === form.passwordConfirm
                                    ? '비밀번호가 일치합니다.'
                                    : '비밀번호가 일치하지 않습니다.'}
                            </p>
                        )}
                    </label>
                    <label>
                        연락처
                        <select name="first" value={form.tel.first} onChange={handleChange}>
                            <option value="010">010</option>
                            <option value="011">011</option>
                            <option value="012">012</option>
                            <option value="013">013</option>
                        </select>
                        -
                        <input
                            type="text"
                            name="middle"
                            value={form.tel.middle}
                            onChange={handleChange}
                        />
                        -
                        <input
                            type="text"
                            name="last"
                            value={form.tel.last}
                            onChange={handleChange}
                        />
                    </label>
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
                    <label>
                        <input
                            type="checkbox"
                            name="marketing"
                            checked={form.marketing}
                            onChange={handleChange}
                        />
                        <span>(선택)</span> 이벤트 · 혜택 정보 수신 동의
                        {marketingDate && (
                            <p className="marketingDate">
                                {form.marketing
                                    ? `동의일자 ${new Date(marketingDate).toLocaleString()}`
                                    : `수신거부 ${new Date(marketingDate).toLocaleString()}`}
                            </p>
                        )}
                    </label>

                    <p className="btns">
                        <Button
                            text="취소"
                            className="small white"
                            onClick={handleCancel}
                            type="button"
                        />
                        <Button text="저장" className="small white" type="submit" />
                    </p>
                </form>
            </div>
        </div>
    );
};

export default EditInfo;
