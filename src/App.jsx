import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './styles/App.css'
import AppRoutes from './routes/routes';
import BottomNavBar from './components/BottomNavBar';

function AppContent() {
  const location = useLocation();
  
  // Show bottom nav bar only on these pages
  const showBottomNav = ['/', '/clubs', '/applications', '/schedule', '/mypage'].includes(location.pathname);

  return (
    <div className="app-container">
      <main className="main-content">
        <AppRoutes/>
      </main>
      {showBottomNav && <BottomNavBar/>}
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
