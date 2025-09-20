import { useAuthStore, useModalStore } from '../../../store';
import Button from '../button/Button';
import './style.scss';

const EditInfo = () => {
    const { editInfoOpen, closeEditInfo } = useModalStore();
    const user = useAuthStore((s) => s.user);
    if (!editInfoOpen || !user) return null;
    const { userId, name, birth, nickName, tel, marketing, marketingDate } = user;

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
                <dl>
                    <dt>생년월일</dt>
                    <dd>
                        {birth?.year}.{birth?.month}.{birth?.date}
                    </dd>
                </dl>

                <form>
                    <label htmlFor="">
                        닉네임
                        <input type="text" placeholder={nickName} />
                    </label>
                    <label htmlFor="">
                        비밀번호 변경
                        <input type="password" />
                    </label>
                    <label htmlFor="">
                        비밀번호 변경 확인
                        <input type="password" />
                    </label>
                    <label htmlFor="">
                        연락처
                        <select defaultValue={tel?.first || '010'}>
                            <option value="010">010</option>
                            <option value="011">011</option>
                            <option value="012">012</option>
                            <option value="013">013</option>
                        </select>
                        -
                        <input type="text" placeholder={tel?.middle} />-
                        <input type="text" placeholder={tel?.last} />
                    </label>
                    <label htmlFor="">
                        <input type="checkbox" defaultChecked={marketing} />
                        <span>(선택)</span> 이벤트 · 혜택 정보 수신 동의
                        {marketingDate && (
                            <p>
                                {marketing
                                    ? `동의일자 ${new Date(marketingDate).toLocaleString()}`
                                    : `수신거부 ${new Date(marketingDate).toLocaleString()}`}
                            </p>
                        )}
                    </label>

                    <p className="btns">
                        <Button text="취소" className="small white" onClick={closeEditInfo} />
                        <Button text="저장" className="small white" />
                    </p>
                </form>
            </div>
        </div>
    );
};

export default EditInfo;
