import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import recruitApi from '../api/recruit';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import '../styles/Clubs.css';
import Nobackheader from '../components/nobackheader';

export default function Clubs() {
  const navigate = useNavigate();
  const location = useLocation();
  const [LoginOpen, setLoginOpen] = useState(false); 
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('전체');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [fadeOut, setFadeOut] = useState(false);
  const [recruits, setRecruits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (location.state?.showDeleteToast) {
      setToastMessage('삭제되었습니다.');
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
    
    if (location.state?.showSuccessToast) {
      setToastMessage('등록되었습니다.');
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
    
    // 수정/작성 후 새로고침 트리거
    if (location.state?.refresh) {
      setRefreshKey(prev => prev + 1);
      window.history.replaceState({}, document.title);
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
    // 한국 시간 기준 오늘 날짜 (로컬)
    const koreaToday = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
    koreaToday.setHours(0, 0, 0, 0);

    // 종료일을 로컬 날짜로 안전하게 파싱 (UTC 변환 방지, 다양한 포맷 대응)
    const raw = typeof dueDate === 'string' ? dueDate.trim() : dueDate;
    let dateOnly = raw;
    if (typeof raw === 'string') {
      if (raw.includes('T')) dateOnly = raw.split('T')[0];
      else if (/^\d{4}\.\d{2}\.\d{2}$/.test(raw)) dateOnly = raw.replaceAll('.', '-');
    }

    let due;
    if (typeof dateOnly === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
      const [y, m, d] = dateOnly.split('-').map(Number);
      due = new Date(y, m - 1, d);
    } else {
      due = new Date(dateOnly);
    }
    if (Number.isNaN(due.getTime())) return '';
    due.setHours(0, 0, 0, 0);
    // 날짜 차이 계산 (시간 무관)
    const diffDays = Math.floor((due.getTime() - koreaToday.getTime()) / 86400000);
    if (diffDays < 0) return '마감';
    return `D-${diffDays}`;
  };

  const normalizeRecruit = (item, index) => {
    // field는 서버에서 'MAJOR', 'HOBBY' 등으로 옴
    const category = mapCategory(item?.field ?? item?.category ?? item?.clubCategory);

    // startDate 포맷팅 (UTC 변환 없이 안전하게 YYYY-MM-DD 추출)
    let startDate = '';
    if (item?.startDate) {
      if (typeof item.startDate === 'string') {
        const match = item.startDate.match(/^(\d{4}-\d{2}-\d{2})/);
        if (match) {
          startDate = match[1];
        } else {
          const d = new Date(item.startDate);
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          startDate = `${y}-${m}-${day}`;
        }
      } else {
        const d = new Date(item.startDate);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        startDate = `${y}-${m}-${day}`;
      }
    }

    // D-day 계산
    const dDay = calculateDDay(item?.dueDate);

    const memberValue = item?.people ?? item?.members ?? item?.targetCount ?? '';

    return {
      id: item?.recruitId ?? item?.id ?? `recruit-${index}`,
      title: item?.title ?? item?.recruitTitle ?? '제목 없음',
      description: item?.description ?? item?.content ?? '',
      category,
      startDate,
      dueDate: dDay,
      members: memberValue,
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
          rawList = await recruitApi.search(keyword);
        } else {
          // 검색어가 없으면 전체 조회 API 사용 (필터 적용)
          const field = mapFilterToField(activeFilter);
          rawList = await recruitApi.getList(field);
        }
        const normalized = (rawList || []).map((item, index) =>
          normalizeRecruit(item, index),
        );

        const categoryFiltered = activeFilter === '전체'
          ? normalized
          : normalized.filter((item) => item.category === activeFilter);
        
        // 마감 여부와 관계없이 모든 모집글 표시
        // 종료일이 없는 경우만 제외
        const activeRecruits = categoryFiltered.filter((item) => {
          const isValid = item.dueDate !== undefined && item.dueDate !== null && item.dueDate !== '';
          return isValid;
        });
        
        // Sort by creation date (descending, newest first)
        const sortedRecruits = activeRecruits.sort((a, b) => {
          const dateA = rawList.find(item => item?.recruitId === a.id)?.createdAt || '';
          const dateB = rawList.find(item => item?.recruitId === b.id)?.createdAt || '';
          return new Date(dateB) - new Date(dateA);
        });
        
        if (!cancelled) {
          setRecruits(sortedRecruits);
        }
      } catch (err) {
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
  }, [searchTerm, activeFilter, refreshKey]);

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
            const memberLabel = club.members !== undefined && club.members !== null && club.members !== '' ? `${club.members}명` : '인원 미정';

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
                    <span className={`club-code ${dueDateLabel === 'D-0' || dueDateLabel === 'D-1' ? 'red' : ''}`}>{dueDateLabel}</span>
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
          const token = localStorage.getItem('accessToken');
          if (!token) {
            setLoginOpen(true);
          } else {
            navigate('/recruit');
          }
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
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
