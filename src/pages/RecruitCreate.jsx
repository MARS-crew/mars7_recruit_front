import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import '../styles/RecruitCreate.css';

export default function RecruitCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    gender: '',
    recruitCount: '',
    startDate: '',
    endDate: '',
    deadline: '',
    managerName: '',
    phoneNumber: ''
  });
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  const [dateError, setDateError] = useState('');
  
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  const categoryOptions = ['취미동아리', '전공동아리'];
  const genderOptions = ['남자', '여자', '무관'];

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (year, month, day) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const parseDate = (dateString) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-').map(Number);
    return { year, month: month - 1, day };
  };

  const renderCalendar = (dateField, setShowPicker) => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];
    const selectedDate = parseDate(formData[dateField]);

    // 빈 칸 추가
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // 날짜 추가
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate && 
        selectedDate.year === currentYear && 
        selectedDate.month === currentMonth && 
        selectedDate.day === day;
      
      days.push(
        <div
          key={day}
          className={`calendar-day ${isSelected ? 'selected' : ''}`}
          onClick={() => {
            const dateStr = formatDate(currentYear, currentMonth, day);
            const newFormData = { ...formData, [dateField]: dateStr };
            setFormData(newFormData);
            
            // 날짜 유효성 검사
            if (dateField === 'startDate') {
              if (newFormData.endDate && dateStr > newFormData.endDate) {
                setDateError('시작일이 종료일보다 늦습니다.');
              } else {
                setDateError('');
              }
            } else if (dateField === 'endDate') {
              if (newFormData.startDate && dateStr < newFormData.startDate) {
                setDateError('종료일이 시작일보다 빠릅니다.');
              } else if (newFormData.deadline && dateStr > newFormData.deadline) {
                setDateError('마감일이 잘못 선택되었습니다.');
              } else {
                setDateError('');
              }
            } else if (dateField === 'deadline') {
              if (newFormData.endDate && dateStr < newFormData.endDate) {
                setDateError('마감일이 잘못 선택되었습니다.');
              } else {
                setDateError('');
              }
            }
            
            setShowPicker(false);
          }}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const CalendarPicker = ({ dateField, setShowPicker }) => (
    <div className="calendar-dropdown">
      <div className="calendar-header">
        <button
          className="calendar-nav-button"
          onClick={() => {
            if (currentMonth === 0) {
              setCurrentMonth(11);
              setCurrentYear(currentYear - 1);
            } else {
              setCurrentMonth(currentMonth - 1);
            }
          }}
        >
          ◀
        </button>
        <div className="calendar-month-year">
          {currentYear}년 {currentMonth + 1}월
        </div>
        <button
          className="calendar-nav-button"
          onClick={() => {
            if (currentMonth === 11) {
              setCurrentMonth(0);
              setCurrentYear(currentYear + 1);
            } else {
              setCurrentMonth(currentMonth + 1);
            }
          }}
        >
          ▶
        </button>
      </div>
      <div className="calendar-weekdays">
        <div>일</div>
        <div>월</div>
        <div>화</div>
        <div>수</div>
        <div>목</div>
        <div>금</div>
        <div>토</div>
      </div>
      <div className="calendar-days">
        {renderCalendar(dateField, setShowPicker)}
      </div>
    </div>
  );

  const handleSubmit = () => {
    // 폼 제출 로직
    console.log('Form submitted:', formData);
    navigate('/clubs');
  };

  return (
    <div
      style={{
        padding: "0 16px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* 헤더 */}
      <Header title="모집글 작성" />

      {/* 제목 입력 */}
      <div className="title-input-section">
        <input
          type="text"
          className="title-input"
          placeholder="제목을 입력해주세요."
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      {/* 모집글 입력 */}
      <div className="form-group">
        <label className="form-label">
          모집글<span className="required">*</span>
        </label>
        <div className="char-count">{formData.content.length}/500</div>
        <textarea
          className="form-textarea"
          placeholder="모집글을 작성해주세요."
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          maxLength={500}
        />
      </div>

      {/* 동아리 분야 드롭다운 */}
      <div className="form-group">
        <label className="form-label">
          동아리 분야<span className="required">*</span>
        </label>
        <div className="dropdown-wrapper">
          <button
            className={`dropdown-button ${showCategoryDropdown ? 'active' : ''}`}
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            <span className={formData.category ? 'selected' : 'placeholder'}>
              {formData.category || '동아리 분야를 선택해주세요.'}
            </span>
            <img 
              src="../public/icons/dropdown-arrow.png" 
              alt="드롭다운"
              style={{ width: '11px', height: '6px' }}
            />
          </button>
          {showCategoryDropdown && (
            <div className="dropdown-menu">
              {categoryOptions.map((option) => (
                <div
                  key={option}
                  className={`dropdown-item ${formData.category === option ? 'selected' : 'unselected'}`}
                  onClick={() => {
                    setFormData({ ...formData, category: option });
                    setShowCategoryDropdown(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 성별 드롭다운 */}
      <div className="form-group">
        <label className="form-label">
          성별<span className="required">*</span>
        </label>
        <div className="dropdown-wrapper">
          <button
            className={`dropdown-button ${showGenderDropdown ? 'active' : ''}`}
            onClick={() => setShowGenderDropdown(!showGenderDropdown)}
          >
            <span className={formData.gender ? 'selected' : 'placeholder'}>
              {formData.gender || '성별을 선택해주세요.'}
            </span>
            <img 
              src="../public/icons/dropdown-arrow.png" 
              alt="드롭다운"
              style={{ width: '11px', height: '6px' }}
            />
          </button>
          {showGenderDropdown && (
            <div className="dropdown-menu">
              {genderOptions.map((option) => (
                <div
                  key={option}
                  className={`dropdown-item ${formData.gender === option ? 'selected' : 'unselected'}`}
                  onClick={() => {
                    setFormData({ ...formData, gender: option });
                    setShowGenderDropdown(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 모집 인원 */}
      <div className="form-group">
        <label className="form-label">
          모집 인원<span className="required">*</span>
        </label>
        <div className="recruit-count-wrapper">
          <input
            type="number"
            className="recruit-count-input"
            placeholder="모집 인원을 입력하세요."
            value={formData.recruitCount}
            onChange={(e) => setFormData({ ...formData, recruitCount: e.target.value })}
          />
          <span className="recruit-count-unit">명</span>
        </div>
      </div>

      {/* 모집 시작일 */}
      <div className="form-group">
        <label className="form-label">
          모집 시작일<span className="required">*</span>
        </label>
        <div className="date-input-container full-width">
          <button
            className="date-button full-width"
            onClick={() => {
              setShowStartDatePicker(!showStartDatePicker);
              setShowEndDatePicker(false);
              setShowDeadlinePicker(false);
              setCurrentYear(new Date().getFullYear());
              setCurrentMonth(new Date().getMonth());
            }}
          >
            <span className={formData.startDate ? 'selected' : 'placeholder'}>
              {formData.startDate || '년도-월-일'}
            </span>
            <img 
              src="../public/icons/dropdown-arrow.png" 
              alt="달력"
              style={{ width: '11px', height: '6px' }}
            />
          </button>
          {showStartDatePicker && (
            <CalendarPicker dateField="startDate" setShowPicker={setShowStartDatePicker} />
          )}
        </div>
      </div>

      {/* 모집 종료일 */}
      <div className="form-group">
        <label className="form-label">
          모집 종료일<span className="required">*</span>
        </label>
        <div className="date-input-container full-width">
          <button
            className="date-button full-width"
            onClick={() => {
              setShowEndDatePicker(!showEndDatePicker);
              setShowStartDatePicker(false);
              setShowDeadlinePicker(false);
              setCurrentYear(new Date().getFullYear());
              setCurrentMonth(new Date().getMonth());
            }}
          >
            <span className={formData.endDate ? 'selected' : 'placeholder'}>
              {formData.endDate || '년도-월-일'}
            </span>
            <img 
              src="../public/icons/dropdown-arrow.png" 
              alt="달력"
              style={{ width: '11px', height: '6px' }}
            />
          </button>
          {showEndDatePicker && (
            <CalendarPicker dateField="endDate" setShowPicker={setShowEndDatePicker} />
          )}
          {dateError && (
            <div className="error-message">{dateError}</div>
          )}
        </div>
      </div>

      {/* 합격 발표일 */}
      <div className="form-group">
        <label className="form-label">
          합격 발표일<span className="required">*</span>
        </label>
        <div className="date-input-container full-width">
          <button
            className="date-button full-width"
            onClick={() => {
              setShowDeadlinePicker(!showDeadlinePicker);
              setShowStartDatePicker(false);
              setShowEndDatePicker(false);
              setCurrentYear(new Date().getFullYear());
              setCurrentMonth(new Date().getMonth());
            }}
          >
            <span className={formData.deadline ? 'selected' : 'placeholder'}>
              {formData.deadline || '년도-월-일'}
            </span>
            <img 
              src="../public/icons/dropdown-arrow.png" 
              alt="달력"
              style={{ width: '11px', height: '6px' }}
            />
          </button>
          {showDeadlinePicker && (
            <CalendarPicker dateField="deadline" setShowPicker={setShowDeadlinePicker} />
          )}
        </div>
      </div>

      {/* 담당자 정보 */}
      <div className="form-group">
        <label className="form-label">
          담당자 정보<span className="required">*</span>
        </label>
        <div className="manager-info-container">
          <div className="manager-info-row">
            <span className="manager-label">담당자:</span>
            <input
              type="text"
              className="manager-input"
              placeholder="이름을 입력하세요"
              value={formData.managerName}
              onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
            />
          </div>
          <div className="manager-info-row">
            <span className="manager-label">연락처:</span>
            <input
              type="tel"
              className="manager-input"
              placeholder="010-0000-0000"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* 제출 버튼 */}
      <button 
        className="submit-button" 
        onClick={handleSubmit}
        disabled={
          !formData.title ||
          !formData.content ||
          !formData.category ||
          !formData.gender ||
          !formData.recruitCount ||
          !formData.startDate ||
          !formData.endDate ||
          !formData.deadline ||
          !formData.managerName ||
          !formData.phoneNumber ||
          dateError
        }
      >
        작성하기
      </button>
    </div>
  );
}
