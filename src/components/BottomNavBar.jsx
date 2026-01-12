import { Link, useLocation } from 'react-router-dom';
import '../styles/BottomNavBar.css';

export default function BottomNavBar() {
  const location = useLocation();

  const navItems = [
    { path: '/clubs', label: '동아리', icon: '../public/icons/clubs.png' },
    { path: '/applications', label: '지원서', icon: '../public/icons/applications.png' },
    { path: '/', label: '홈', icon: '../public/icons/home.png' },
    { path: '/schedule', label: '학사일정', icon: '../public/icons/schedule.png' },
    { path: '/mypage', label: '마이페이지', icon: '../public/icons/mypage.png' }
  ];

  return (
    <nav className="bottom-nav-bar">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          title={item.label}
        >
          <img src={item.icon} alt={item.label} className="nav-icon" />
        </Link>
      ))}
    </nav>
  );
}
