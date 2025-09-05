// sweetalert2 css
import 'sweetalert2/dist/sweetalert2.min.css';
import Swal from 'sweetalert2';
import './style.scss';

const ModalDemo = () => {
    // 1) Alert
    const onAlert = () => {
        Swal.fire({
            icon: 'success',
            title: '알림이 실행되었습니다!',
            text: '이 메시지는 단순 안내 예시입니다.',
            customClass: {
                popup: 'my-alert',
                title: 'my-title',
                htmlContainer: 'my-text',
                confirmButton: 'my-confirm-btn',
            },
        });
    };

    // 2) Confirm
    const onConfirm = async () => {
        const result = await Swal.fire({
            title: '정말 진행하시겠습니까?',
            text: '되돌릴 수 없는 작업입니다.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '네, 진행합니다',
            cancelButtonText: '취소',
            reverseButtons: true,
            customClass: {
                popup: 'my-confirm',
                title: 'my-title',
                htmlContainer: 'my-text',
                confirmButton: 'my-confirm-btn',
                cancelButton: 'my-cancel-btn',
            },
        });

        if (result.isConfirmed) {
            Swal.fire('진행 완료!', '요청하신 작업이 성공적으로 처리되었습니다.', 'success');
        }
    };

    // 3) Prompt
    const onPrompt = async () => {
        const { value: name } = await Swal.fire({
            title: '이름을 입력하세요',
            input: 'text',
            inputPlaceholder: '예: 홍길동',
            showCancelButton: true,
            confirmButtonText: '저장',
            cancelButtonText: '취소',
            customClass: {
                popup: 'my-prompt',
                title: 'my-title',
                confirmButton: 'my-confirm-btn',
                cancelButton: 'my-cancel-btn',
            },
        });

        if (name) {
            Swal.fire(`입력한 이름: ${name}`);
        }
    };

    // 4) Toast
    const onToast = () => {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            customClass: { popup: 'my-toast' },
        });

        Toast.fire({
            icon: 'success',
            title: '토스트 알림이 실행되었습니다!',
        });
    };

    // 5) Ajax
    const onAjax = async () => {
        const result = await Swal.fire({
            title: 'Github 아이디를 입력하세요',
            input: 'text',
            inputAttributes: { autocapitalize: 'off' },
            showCancelButton: true,
            confirmButtonText: '검색',
            showLoaderOnConfirm: true,
            customClass: {
                popup: 'my-ajax',
                title: 'my-title',
                confirmButton: 'my-confirm-btn',
                cancelButton: 'my-cancel-btn',
            },
            preConfirm: async (login) => {
                try {
                    const res = await fetch(`https://api.github.com/users/${login}`);
                    if (!res.ok) throw new Error(res.statusText);
                    return res.json();
                } catch (err) {
                    Swal.showValidationMessage(`요청 실패: ${String(err)}`);
                }
            },
            allowOutsideClick: () => !Swal.isLoading(),
        });

        if (result.isConfirmed && result.value) {
            Swal.fire({
                title: `${result.value.login}님의 아바타`,
                imageUrl: result.value.avatar_url,
            });
        }
    };

    return (
        <div className="p-3">
            <button className="btn btn-primary m-2" onClick={onAlert}>
                Alert 실행
            </button>
            <button className="btn btn-secondary m-2" onClick={onConfirm}>
                Confirm 실행
            </button>
            <button className="btn btn-success m-2" onClick={onPrompt}>
                Prompt 실행
            </button>
            <button className="btn btn-danger m-2" onClick={onToast}>
                Toast 실행
            </button>
            <button className="btn btn-warning m-2" onClick={onAjax}>
                Ajax 실행
            </button>
        </div>
    );
};

export default ModalDemo;
