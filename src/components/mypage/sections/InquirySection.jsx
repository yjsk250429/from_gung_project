// components/mypage/InquirySection.jsx
import { useState } from 'react';
import { useInquiryStore } from '../../../store';

const InquirySection = () => {
    const [mode, setMode] = useState('list'); // "list" | "form" | "detail"
    const [form, setForm] = useState({ title: '', content: '' });
    const [selectedInquiry, setSelectedInquiry] = useState(null);

    // zustand store 가져오기
    const { inquiries, addInquiry } = useInquiryStore();

    const handleSave = () => {
        if (!form.title.trim()) {
            alert('제목을 입력하세요');
            return;
        }
        const newItem = {
            title: form.title,
            content: form.content,
        };
        addInquiry(newItem); // ✅ zustand store에 저장 (localStorage 유지됨)
        setForm({ title: '', content: '' });
        setMode('list');
    };

    const handleCancel = () => {
        setForm({ title: '', content: '' });
        setMode('list');
    };

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
                    </div>
                    {inquiries.length === 0 ? (
                        <div className="tbody empty">1:1 문의 내역이 없습니다.</div>
                    ) : (
                        <div className="tbody">
                            {inquiries.map((q) => (
                                <div
                                    className="row clickable"
                                    key={q.id}
                                    onClick={() => {
                                        setSelectedInquiry(q);
                                        setMode('detail');
                                    }}
                                >
                                    <span>{q.id}</span>
                                    <span>{q.date}</span>
                                    <span>{q.title}</span>
                                    <span>{q.status}</span>
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
                        <button onClick={() => setMode('list')}>목록으로</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InquirySection;
