import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginRequiredModal from '../components/LoginRequiredModal';
import '../styles/Clubs.css';
import Nobackheader from '../components/nobackheader';

export default function Clubs() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('전체');

  // 임시 동아리 데이터
  const clubsData = [
    {
      id: 1,
      dueDate: 'D-1',
      title: '26학년도 ONE 신입부원을 모집합니다',
      description: '26학년도 전공동아리 ONE에서 신입 부원을 모집합니다. 저희 전공동아리 ONE 웹응용소프트웨어공학과 등...',
      category: '전공',
      startDate: '26.02.18',
      members: '00',
      image: '../public/icons/clubimage.png'
    },
    {
      id: 2,
      dueDate: 'D-2',
      title: '댄스 동아리 MOVE 신입 모집',
      description: '댄스를 사랑하는 사람들의 모임! 초보자도 환영합니다.',
      category: '취미',
      startDate: '26.02.20',
      members: '00',
      image: '../public/icons/clubimage.png'
    },
    {
      id: 3,
      dueDate: 'D-3',
      title: 'AI 연구회 신입부원 모집',
      description: '인공지능과 머신러닝에 관심있는 학생들의 전공 동아리입니다.',
      category: '전공',
      startDate: '26.02.22',
      members: '00',
      image: '../public/icons/clubimage.png'
    },
    {
      id: 4,
      dueDate: 'D-4',
      title: '사진 동아리 LENS 모집',
      description: '사진 촬영과 편집을 함께 배우는 취미 동아리입니다.',
      category: '취미',
      startDate: '26.02.25',
      members: '00',
      image: '../public/icons/clubimage.png'
    },
    {
      id: 5,
      dueDate: 'D-5',
      title: '웹 개발 스터디 그룹',
      description: '프론트엔드와 백엔드 개발을 함께 공부하는 전공 동아리입니다.',
      category: '전공',
      startDate: '26.03.01',
      members: '00',
      image: '../public/icons/clubimage.png'
    },
  ];

  // 필터링된 데이터 (공백 제거 + 대소문자 무시)
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredClubs = clubsData.filter(club => {
    const matchesCategory = activeFilter === '전체' || club.category === activeFilter;
    const matchesSearch =
      normalizedSearch === '' ||
      club.title.toLowerCase().includes(normalizedSearch) ||
      club.description.toLowerCase().includes(normalizedSearch);
    return matchesCategory && matchesSearch;
  });

  const isFiltering = normalizedSearch !== '' || activeFilter !== '전체';

  return (
    <div style={{
        padding: "0 16px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Nobackheader title="동아리" />
      {/* 검색 바 */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="검색어를 입력해주세요."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <svg className="search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 20L16.8033 15.8033M19 10.5C19 6.35786 15.6421 3 11.5 3C7.35786 3 4 6.35786 4 10.5C4 14.6421 7.35786 18 11.5 18C15.6421 18 19 14.6421 19 10.5Z" stroke="#D9D9D9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      {/* 필터 탭 */}
      <div className="filter-tabs">
        {['전체', '전공', '취미'].map(filter => (
          <button
            key={filter}
            className={`filter-tab ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* 동아리 리스트 */}
      <div className="clubs-list">
        {filteredClubs.length === 0 ? (
          <div className="empty-state">
            <p>{isFiltering ? '검색 결과가 없습니다.' : '현재 모집글이 없습니다.'}</p>
          </div>
        ) : (
          filteredClubs.map((club, index) => (
            <div key={club.id} className={`club-card ${index === filteredClubs.length - 1 ? 'last' : ''}`}>
              <div className="club-content">
                <h3 className="club-title">{club.title}</h3>
                <p className="club-description">{club.description}</p>
                <div className="club-info">
                  <span className={`club-code ${club.dueDate === 'D-1' ? 'red' : ''}`}>{club.dueDate}</span>
                  <span className="club-date">{club.startDate} 시작</span>
                  <span className="club-members">
                    <img src="../public/icons/user-icon.png" alt="멤버" className="member-icon" />
                    <span className="club-members-count">{club.members}명</span>
                  </span>
                </div>
              </div>
              <div className="club-image">
                <img src={club.image} alt={club.title} />
              </div>
            </div>
          ))
        )}
      </div>
      {/* FAB 버튼 */}
      <button className="fab-button" onClick={() => navigate('/recruit')}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 14.2525V18.0025H3.75L14.81 6.9425L11.06 3.1925L0 14.2525ZM17.71 4.0425C18.1 3.6525 18.1 3.0225 17.71 2.6325L15.37 0.2925C14.98 -0.0975 14.35 -0.0975 13.96 0.2925L12.13 2.1225L15.88 5.8725L17.71 4.0425Z" fill="white"/>
        </svg>

      </button>
      <LoginRequiredModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
