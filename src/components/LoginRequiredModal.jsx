import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import '../styles/LoginRequiredModal.css';

export default function LoginRequiredModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  
  // Dim and disable bottom nav bar while modal is open
  useEffect(() => {
    const nav = document.querySelector('.bottom-nav-bar');
    if (!nav) return;
    if (isOpen) {
      nav.classList.add('dimmed');
    } else {
      nav.classList.remove('dimmed');
    }
    return () => {
      nav.classList.remove('dimmed');
    };
  }, [isOpen]);

  const handleConfirm = () => {
    navigate('/Login');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-icon">!</div>
        <h2 className="modal-title">
          로그인이 필요한
          <br />
          콘텐츠 입니다.
          <br />
          로그인하시겠습니까?
        </h2>
        <div className="modal-buttons">
          <button className="modal-btn cancel-btn" onClick={onClose}>
            취소
          </button>
          <button className="modal-btn confirm-btn" onClick={handleConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
