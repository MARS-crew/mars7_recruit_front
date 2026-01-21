import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import recruitApi from '../api/recruit';
import Modal from '../components/Modal';
import '../styles/Clubs.css';
import Nobackheader from '../components/nobackheader';

export default function Clubs() {
  const navigate = useNavigate();
  const location = useLocation();
  const [LoginOpen, setLoginOpen] = useState(false); 
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('전체');
  const [showToast, setShowToast] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [recruits, setRecruits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (location.state?.showDeleteToast) {
      setShowToast(true);
      setFadeOut(false);
      window.history.replaceState({}, document.title);
      
      setTimeout(() => {
        setFadeOut(true);
      }, 1500);
      
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    }
  }, [location]);

  const mapCategory = (raw) => {
    if (!raw) return '전체';
    if (raw === 'MAJOR') return '전공';
    if (raw === 'HOBBY') return '취미';
    return raw;
  };

  const mapFilterToField = (filter) => {
    if (filter === '전공') return 'MAJOR';
    if (filter === '취미') return 'HOBBY';
    return 'ALL';
  };

  const calculateDDay = (dueDate) => {
    if (!dueDate) return '';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return '마감';
    if (diffDays === 0) return 'D-0';
    return `D-${diffDays}`;
  };

  const normalizeRecruit = (item, index) => {
    // field는 서버에서 'MAJOR', 'HOBBY' 등으로 옴
    const category = mapCategory(item?.field ?? item?.category ?? item?.clubCategory);

    // startDate 포맷팅 (ISO 형식 → YYYY-MM-DD)
    let startDate = '';
    if (item?.createdAt) {
      const date = new Date(item.createdAt);
      startDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
    } else if (item?.startDate) {
      startDate = item.startDate;
    }

    // D-day 계산
    const dDay = calculateDDay(item?.dueDate);

    return {
      id: item?.recruitId ?? item?.id ?? `recruit-${index}`,
      title: item?.title ?? item?.recruitTitle ?? '제목 없음',
      description: item?.description ?? item?.content ?? '',
      category,
      startDate,
      dueDate: dDay,
      members: item?.people ?? item?.members ?? item?.targetCount ?? '',
      image: item?.posterImage ?? item?.thumbnailUrl ?? '/icons/clubimage.png',
    };
  };

  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');

      try {
        const keyword = searchTerm.trim();
        let rawList;

        if (keyword) {
          // 검색어가 있으면 검색 API 사용
          console.log('🔍 검색 키워드:', keyword);
          rawList = await recruitApi.search(keyword);
        } else {
          // 검색어가 없으면 전체 조회 API 사용 (필터 적용)
          const field = mapFilterToField(activeFilter);
          console.log('📋 분야 필터:', field);
          rawList = await recruitApi.getList(field);
        }
        
        console.log('📦 API 응답:', rawList);
        
        const normalized = (rawList || []).map((item, index) =>
          normalizeRecruit(item, index),
        );
        console.log('✅ 정규화된 데이터:', normalized);

        if (!cancelled) {
          setRecruits(normalized);
        }
      } catch (err) {
        console.error('❌ API 에러:', err);
        if (!cancelled) {
          const errorMsg = err.message || '동아리 모집글을 불러오지 못했습니다.';
          setError(errorMsg);
          setRecruits([]);
          alert(errorMsg);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchTerm, activeFilter]);

  // 이미 서버에서 필터링되어 오므로 클라이언트 필터링 불필요
  const filteredClubs = recruits;
  const isFiltering = searchTerm.trim() !== '' || activeFilter !== '전체';

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
        <path d="M21 20L16.8033 15.8033M19 10.5C19 6.35786 15.6421 3 11.5 3C7.35786 3 4 6.35786 4 10.5C4 14.6421 7.35786 18 11.5 18C15.6421 18 19 14.6421 19 10.5Z" stroke="#D9D9D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
        {error ? (
          <div className="empty-state">
            <p>{error}</p>
          </div>
        ) : loading ? (
          <div className="empty-state">
            <p>모집글을 불러오는 중입니다.</p>
          </div>
        ) : filteredClubs.length === 0 ? (
          <div className="empty-state">
            <p>{isFiltering ? '검색 결과가 없습니다.' : '현재 모집글이 없습니다.'}</p>
          </div>
        ) : (
          filteredClubs.map((club, index) => {
            const dueDateLabel = club.dueDate || '모집중';
            const startLabel = club.startDate ? `${club.startDate} 시작` : '시작일 미정';
            const memberLabel = club.members ? `${club.members}명` : '인원 미정';

            return (
              <div 
                key={club.id}
                className={`club-card ${index === filteredClubs.length - 1 ? 'last' : ''}`}
                onClick={() => navigate(`/clubs/${club.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="club-content">
                  <h3 className="club-title" style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'block'
                  }}>{club.title}</h3>
                  <p className="club-description" style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}>{club.description}</p>
                  <div className="club-info">
                    <span className={`club-code ${dueDateLabel === 'D-1' ? 'red' : ''}`}>{dueDateLabel}</span>
                    <span className="club-date">{startLabel}</span>
                    <span className="club-members">
                      <img src="/icons/user-icon.png" alt="멤버" className="member-icon" />
                      <span className="club-members-count">{memberLabel}</span>
                    </span>
                  </div>
                </div>
                <div className="club-image">
                  <img src={club.image || '/icons/clubimage.png'} alt={club.title} />
                </div>
              </div>
            );
          })
        )}
      </div>
      {/* FAB 버튼 */}
      <button
        className="fab-button"
        onClick={() => {
          setLoginOpen(true); // 로그인 모달을 다시 사용할 때 주석 해제
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 14.2525V18.0025H3.75L14.81 6.9425L11.06 3.1925L0 14.2525ZM17.71 4.0425C18.1 3.6525 18.1 3.0225 17.71 2.6325L15.37 0.2925C14.98 -0.0975 14.35 -0.0975 13.96 0.2925L12.13 2.1225L15.88 5.8725L17.71 4.0425Z" fill="white"/>
        </svg>

      </button>

        <Modal
          isOpen={LoginOpen}
          lBtn="취소"
          onClose={() => setLoginOpen(false)}
          onRightClick={() => navigate('/login')}
        />
      
      {/* 토스트 팝업 */}
      {showToast && (
        <div
          style={{
            position: 'fixed',
            bottom: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(150, 150, 150, 0.7)',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: 16,
            fontSize: 14,
            fontWeight: 500,
            zIndex: 10000,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            opacity: fadeOut ? 0 : 1,
            transition: 'opacity 0.5s ease-out',
          }}
        >
          삭제되었습니다.
        </div>
      )}
    </div>
  );
}
