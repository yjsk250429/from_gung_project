// components/mypage/InquirySection.jsx
import { useState } from 'react';
import { useAuthStore } from '../../../store';

const InquirySection = () => {
    const [mode, setMode] = useState('list'); // "list" | "form" | "detail"
    const [form, setForm] = useState({ title: '', content: '' });
    const [selectedInquiry, setSelectedInquiry] = useState(null);

    // zustand store (AuthStore) 사용
    const inquiries = useAuthStore.getState().getMyInquiries();
    const addInquiry = useAuthStore((s) => s.addInquiry);
    const user = useAuthStore((s) => s.user);
    const removeInquiry = useAuthStore((s) => s.removeInquiry);

    const handleSave = () => {
        if (!form.title.trim()) {
            alert('제목을 입력하세요');
            return;
        }
        const newItem = {
            title: form.title,
            content: form.content,
        };
        addInquiry(newItem); // ✅ 현재 로그인한 유저 계정에 저장됨
        setForm({ title: '', content: '' });
        setMode('list');
    };

    const handleCancel = () => {
        setForm({ title: '', content: '' });
        setMode('list');
    };

    if (!user) {
        return <div className="inquiry">로그인 후 이용 가능합니다.</div>;
    }

    return (
        <div className="inquiry">
            <h2>1:1 문의 내역</h2>

            {mode === 'list' && (
                <div className="table">
                    <div className="thead">
                        <span>번호</span>
                        <span>날짜</span>
                        <span>내용</span>
                        <span>답변상태</span>
                        <span>-</span>
                    </div>
                    {inquiries.length === 0 ? (
                        <div className="tbody empty">1:1 문의 내역이 없습니다.</div>
                    ) : (
                        <div className="tbody">
                            {inquiries.map((q) => (
                                <div className="row clickable" key={q.id}>
                                    <span>{q.id}</span>
                                    <span>{q.date}</span>
                                    <span
                                        className="detailBtn"
                                        onClick={() => {
                                            setSelectedInquiry(q);
                                            setMode('detail');
                                        }}
                                    >
                                        {q.title}
                                    </span>
                                    <span>{q.status}</span>
                                    <span>
                                        <button
                                            onClick={(e) => {
                                                removeInquiry(q.id);
                                                // 선택된 상세보기도 지워질 수 있게 mode, selectedInquiry 처리 (선택사항)
                                                if (selectedInquiry?.id === q.id) {
                                                    setSelectedInquiry(null);
                                                    setMode('list');
                                                }
                                            }}
                                        >
                                            삭제
                                        </button>
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                    <button onClick={() => setMode('form')}>문의하기</button>
                </div>
            )}

            {mode === 'form' && (
                <div className="form">
                    <div className="form-group">
                        <label>제목</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>내용</label>
                        <textarea
                            rows="5"
                            value={form.content}
                            onChange={(e) => setForm({ ...form, content: e.target.value })}
                        />
                    </div>
                    <div className="form-buttons">
                        <button onClick={handleSave}>저장</button>
                        <button onClick={handleCancel}>취소</button>
                    </div>
                </div>
            )}

            {mode === 'detail' && selectedInquiry && (
                <div className="detail">
                    <h3>문의 상세</h3>
                    <p>
                        <strong>번호:</strong> {selectedInquiry.id}
                    </p>
                    <p>
                        <strong>날짜:</strong> {selectedInquiry.date}
                    </p>
                    <p>
                        <strong>제목:</strong> {selectedInquiry.title}
                    </p>
                    <p>
                        <strong>내용:</strong> {selectedInquiry.content}
                    </p>
                    <p>
                        <strong>상태:</strong> {selectedInquiry.status}
                    </p>

                    <div className="detail-buttons">
                        <button
                            onClick={() => {
                                removeInquiry(selectedInquiry.id);
                                setSelectedInquiry(null);
                                setMode('list');
                            }}
                        >
                            삭제
                        </button>
                        <button onClick={() => setMode('list')}>목록으로</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InquirySection;
