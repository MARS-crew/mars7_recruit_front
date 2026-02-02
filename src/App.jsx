import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './styles/App.css'
import AppRoutes from './routes/routes';
import BottomNavBar from './components/BottomNavBar';
import ClubDetailPage from './pages/ClubDetailPage';
import Modal from './components/Modal';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const handleAuthRequired = () => {
      setShowLoginModal(true);
    };

    window.addEventListener('auth:required', handleAuthRequired);

    return () => {
      window.removeEventListener('auth:required', handleAuthRequired);
    };
  }, []);
  
  // Show bottom nav bar only on these pages
  const showBottomNav = ['/', '/clubs', '/applications', '/schedule', '/mypage', '/notice'].includes(location.pathname);

  return (
    <div className="app-container">
      <main className="main-content">
        <AppRoutes/>
      </main>
      {showBottomNav && <BottomNavBar/>}
      <Modal
        isOpen={showLoginModal}
        title={
          <>
            로그인이 필요한
            <br />
            콘텐츠입니다.
            <br />
            로그인하시겠습니까?
          </>
        }
        lBtn="취소"
        rBtn="확인"
        onRightClick={() => {
          setShowLoginModal(false);
          navigate('/login');
        }}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent/>
    </BrowserRouter>
  );
}

export default App
