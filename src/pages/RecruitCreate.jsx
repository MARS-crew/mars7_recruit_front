import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/header';
import '../styles/RecruitCreate.css';

export default function RecruitCreate() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefilledClub = location.state?.club;

  const initialFormData = useMemo(
    () => ({
      title: '',
      content: '',
      category: '',
      gender: '',
      recruitCount: '',
      startDate: '',
      endDate: '',
      deadline: '',
      managerName: '최예은',
      phoneNumber: '010-9017-0806'
    }),
    []
  );

  const [formData, setFormData] = useState(initialFormData);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  const [endDateError, setEndDateError] = useState('');
  const [deadlineError, setDeadlineError] = useState('');
  const [emptyFieldError, setEmptyFieldError] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  // refs for each section
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const categoryRef = useRef(null);
  const genderRef = useRef(null);
  const recruitCountRef = useRef(null);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const deadlineRef = useRef(null);
  const managerRef = useRef(null);
  const imageInputRef = useRef(null);

  // refs for dropdown and date picker wrappers
  const categoryDropdownRef = useRef(null);
  const genderDropdownRef = useRef(null);
  const startDatePickerRef = useRef(null);
  const endDatePickerRef = useRef(null);
  const deadlinePickerRef = useRef(null);

  const categoryOptions = ['취미동아리', '전공동아리'];
  const genderOptions = ['남자', '여자', '무관'];

  const normalizeDateString = (value) => {
    if (!value) return '';
    const cleaned = value.trim().replace(/\./g, '-');
    const match = cleaned.match(/(\d{4})[-.](\d{2})[-.](\d{2})/);
    if (match) {
      const [, y, m, d] = match;
      return `${y}-${m}-${d}`;
    }
    return cleaned;
  };

  const parseRecruitPeriod = (period) => {
    if (!period) return { start: '', end: '' };
    const parts = period.split('-');
    if (parts.length !== 2) return { start: '', end: '' };
    const [startRaw, endRaw] = parts;
    return {
      start: normalizeDateString(startRaw),
      end: normalizeDateString(endRaw),
    };
  };

  const mapClubToFormData = (club) => ({
    title: club?.title || '',
    content: club?.description || club?.content || '',
    category: club?.category || '',
    gender: club?.gender || '',
    recruitCount: club?.recruitCount ? String(club.recruitCount) : '',
    startDate: club?.startDate || parseRecruitPeriod(club?.recruitPeriod).start,
    endDate: club?.endDate || parseRecruitPeriod(club?.recruitPeriod).end,
    deadline: normalizeDateString(club?.deadline || club?.announcementDate || ''),
    managerName: club?.managerName || '최예은',
    phoneNumber: club?.contact || club?.phoneNumber || '010-9017-0806'
  });

  useEffect(() => {
    if (prefilledClub) {
      const mappedData = mapClubToFormData(prefilledClub);
      setFormData((prev) => ({ ...prev, ...mappedData }));
      
      // 포스터 이미지 추가
      if (prefilledClub.posterImage) {
        const posterImage = {
          file: null,
          preview: prefilledClub.posterImage,
          isExisting: true
        };
        setUploadedImages([posterImage]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefilledClub]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      isExisting: false
    }));
    setUploadedImages(prev => [...prev, ...newImages]);
  };

  const handleImageDelete = (index) => {
    setUploadedImages(prev => {
      const newImages = [...prev];
      if (newImages[index].file) {
        URL.revokeObjectURL(newImages[index].preview);
      }
      newImages.splice(index, 1);
      return newImages;
    });
  };

  // 외부 클릭 감지하여 드롭다운/데이트피커 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
      if (genderDropdownRef.current && !genderDropdownRef.current.contains(event.target)) {
        setShowGenderDropdown(false);
      }
      if (startDatePickerRef.current && !startDatePickerRef.current.contains(event.target)) {
        setShowStartDatePicker(false);
      }
      if (endDatePickerRef.current && !endDatePickerRef.current.contains(event.target)) {
        setShowEndDatePicker(false);
      }
      if (deadlinePickerRef.current && !deadlinePickerRef.current.contains(event.target)) {
        setShowDeadlinePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
            
            // 시작일 > 종료일 체크 (종료일 필드 아래 에러)
            if (newFormData.startDate && newFormData.endDate && newFormData.startDate > newFormData.endDate) {
              setEndDateError('마감일이 잘못 선택되었습니다.');
            } else {
              setEndDateError('');
              if (emptyFieldError.includes('마감일이 잘못 선택되었습니다.')) setEmptyFieldError('');
            }
            
            // 시작일 > 발표일 또는 종료일 > 발표일 체크 (발표일 필드 아래 에러)
            if (newFormData.deadline && (
              (newFormData.startDate && newFormData.startDate > newFormData.deadline) ||
              (newFormData.endDate && newFormData.endDate > newFormData.deadline)
            )) {
              setDeadlineError('발표일이 잘못 선택되었습니다.');
            } else {
              setDeadlineError('');
              if (emptyFieldError.includes('발표일이 잘못 선택되었습니다.')) setEmptyFieldError('');
            }

            // 필수 입력 경고 제거
            if (dateField === 'startDate' && emptyFieldError.includes('모집 시작일')) setEmptyFieldError('');
            if (dateField === 'endDate' && emptyFieldError.includes('모집 종료일')) setEmptyFieldError('');
            if (dateField === 'deadline' && emptyFieldError.includes('합격 발표일')) setEmptyFieldError('');
            
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
    // 필수 입력 검증 순서대로 확인
    if (!formData.title) {
      setEmptyFieldError('제목을 입력해 주세요.');
      titleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (!formData.content) {
      setEmptyFieldError('모집글을 입력해 주세요.');
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (!formData.category) {
      setEmptyFieldError('동아리 분야를 선택해 주세요.');
      categoryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (!formData.gender) {
      setEmptyFieldError('성별을 선택해 주세요.');
      genderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (!formData.recruitCount) {
      setEmptyFieldError('모집 인원을 입력해 주세요.');
      recruitCountRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (!formData.startDate) {
      setEmptyFieldError('모집 시작일을 선택해 주세요.');
      startDateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (!formData.endDate) {
      setEmptyFieldError('모집 종료일을 선택해 주세요.');
      endDateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (endDateError) {
      setEmptyFieldError(endDateError);
      endDateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (!formData.deadline) {
      setEmptyFieldError('합격 발표일을 선택해 주세요.');
      deadlineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (deadlineError) {
      setEmptyFieldError(deadlineError);
      deadlineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (!formData.managerName || !formData.phoneNumber) {
      setEmptyFieldError('담당자 정보를 입력해 주세요.');
      managerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setEmptyFieldError('');
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
      <div className="title-input-section" ref={titleRef}>
        <input
          type="text"
          className="title-input"
          placeholder="제목을 입력해주세요."
          value={formData.title}
          maxLength="50"
          onChange={(e) => {
            setFormData({ ...formData, title: e.target.value });
            if (emptyFieldError.includes('제목')) setEmptyFieldError('');
          }}
        />
      </div>
      {formData.title.length >= 50 && (
        <div className="error-message" style={{ marginTop: '-18px' }}>50자까지 작성가능합니다</div>
      )}
      {emptyFieldError && emptyFieldError.includes('제목') && (
        <div className="error-message" style={{ marginTop: '-18px' }}>{emptyFieldError}</div>
      )}

      {/* 모집글 입력 */}
      <div className="form-group" ref={contentRef}>
        <label className="form-label">
          <span style={{ fontWeight : 600 }}>모집글</span>
          <span className="required">*</span>
        </label>
        <div className="char-count">
          <span style={{ color: '#2572B9' }}>{formData.content.length}/</span>
          <span style={{ color: '#A4A4A4' }}>500</span>
        </div>
        <div className="textarea-wrapper">
          <textarea
            className="form-textarea"
            placeholder="모집글을 작성해주세요."
            value={formData.content}
            onChange={(e) => {
              setFormData({ ...formData, content: e.target.value });
              if (emptyFieldError.includes('모집글')) setEmptyFieldError('');
            }}
            maxLength={500}
          />
          <button
            type="button"
            className="image-upload-button"
            onClick={() => imageInputRef.current?.click()}
          >
            <img src="../../public/icons/image-icon.png" alt="이미지 추가" style={{ width: '20px', height: '20px' }} />
          </button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
        </div>
        {uploadedImages.length > 0 && (
          <div className="uploaded-images">
            {uploadedImages.map((img, index) => (
              <div key={index} className="image-preview">
                <img src={img.preview} alt={`업로드 ${index + 1}`} />
                <button
                  type="button"
                  className="image-delete-button"
                  onClick={() => handleImageDelete(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        {emptyFieldError && emptyFieldError.includes('모집글') && (
          <div className="error-message" style={{ marginTop: '8px' }}>{emptyFieldError}</div>
        )}
      </div>

      {/* 동아리 분야 드롭다운 */}
      <div className="form-group" ref={categoryRef}>
        <label className="form-label">
          <span style={{ marginLeft : 8 }}>동아리 분야</span>
          <span className="required">*</span>
        </label>
        <div className="dropdown-wrapper" ref={categoryDropdownRef}>
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
                    if (emptyFieldError.includes('동아리 분야')) setEmptyFieldError('');
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
        {emptyFieldError && emptyFieldError.includes('동아리 분야') && (
          <div className="error-message" style={{ marginTop: '8px' }}>{emptyFieldError}</div>
        )}
      </div>

      {/* 성별 드롭다운 */}
      <div className="form-group" ref={genderRef}>
        <label className="form-label">
          <span style={{ marginLeft : 8 }}>성별</span>
          <span className="required">*</span>
        </label>
        <div className="dropdown-wrapper" ref={genderDropdownRef}>
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
                    if (emptyFieldError.includes('성별')) setEmptyFieldError('');
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
        {emptyFieldError && emptyFieldError.includes('성별') && (
          <div className="error-message" style={{ marginTop: '8px' }}>{emptyFieldError}</div>
        )}
      </div>

      {/* 모집 인원 */}
      <div className="form-group" ref={recruitCountRef}>
        <label className="form-label">
          <span style={{ marginLeft : 8 }}>모집 인원</span>
          <span className="required">*</span>
        </label>
        <div className="recruit-count-wrapper">
          <input
            type="number"
            className="recruit-count-input"
            placeholder="모집 인원을 입력하세요."
            value={formData.recruitCount}
            min="1"
            max="100"
            onChange={(e) => {
              let value = e.target.value;
              // 입력값이 100을 넘으면 100으로 제한
              if (value && Number(value) > 100) {
                value = '100';
              }
              setFormData({ ...formData, recruitCount: value });
              if (emptyFieldError.includes('모집 인원')) setEmptyFieldError('');
            }}
          />
          <span className="recruit-count-unit">명</span>
        </div>
        {emptyFieldError && emptyFieldError.includes('모집 인원') && (
          <div className="error-message" style={{ marginTop: '8px' }}>{emptyFieldError}</div>
        )}
      </div>

      {/* 모집 시작일 */}
      <div className="form-group" ref={startDateRef}>
        <label className="form-label">
          <span style={{ marginLeft : 8 }}>모집 시작일</span>
          <span className="required">*</span>
        </label>
        <div className="date-input-container full-width" ref={startDatePickerRef}>
          <button
            className={`date-button full-width ${showStartDatePicker ? 'active' : ''}`}
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
        {emptyFieldError && emptyFieldError.includes('시작일') && (
          <div className="error-message" style={{ marginTop: '8px' }}>{emptyFieldError}</div>
        )}
      </div>

      {/* 모집 종료일 */}
      <div className="form-group" ref={endDateRef}>
        <label className="form-label">
          <span style={{ marginLeft : 8 }}>모집 종료일</span>
          <span className="required">*</span>
        </label>
        <div className="date-input-container full-width" ref={endDatePickerRef}>
          <button
            className={`date-button full-width ${showEndDatePicker ? 'active' : ''}`}
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
        </div>
        {endDateError && (
          <div className="error-message" style={{ marginTop: '8px' }}>{endDateError}</div>
        )}
        {emptyFieldError && emptyFieldError.includes('종료일') && (
          <div className="error-message" style={{ marginTop: '8px' }}>{emptyFieldError}</div>
        )}
      </div>

      {/* 합격 발표일 */}
      <div className="form-group" ref={deadlineRef}>
        <label className="form-label">
          <span style={{ marginLeft : 8 }}>합격 발표일</span>
          <span className="required">*</span>
        </label>
        <div className="date-input-container full-width" ref={deadlinePickerRef}>
          <button
            className={`date-button full-width ${showDeadlinePicker ? 'active' : ''}`}
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
        {deadlineError && (
          <div className="error-message" style={{ marginTop: '8px' }}>{deadlineError}</div>
        )}
        {emptyFieldError && emptyFieldError.includes('발표일') && (
          <div className="error-message" style={{ marginTop: '8px' }}>{emptyFieldError}</div>
        )}
      </div>

      {/* 담당자 정보 */}
      <div className="section-divider" />
      <div className="form-group" ref={managerRef}>
        <label className="form-label">
          <span style={{ fontWeight : 600 }}>담당자 정보</span>
        </label>
        <div className="manager-info-container">
          <div className="manager-info-row">
            <span className="manager-label">담당자</span>
            <input
              type="text"
              className="manager-input"
              placeholder="이름을 입력하세요"
              value={formData.managerName}
              onChange={(e) => {
                setFormData({ ...formData, managerName: e.target.value });
                if (emptyFieldError.includes('담당자')) setEmptyFieldError('');
              }}
            />
          </div>
          <div className="manager-info-row">
            <span className="manager-label">연락처</span>
            <input
              type="tel"
              className="manager-input"
              placeholder="010-0000-0000"
              value={formData.phoneNumber}
              onChange={(e) => {
                setFormData({ ...formData, phoneNumber: e.target.value });
                if (emptyFieldError.includes('담당자')) setEmptyFieldError('');
              }}
            />
          </div>
        </div>
        {emptyFieldError && emptyFieldError.includes('담당자') && (
          <div className="error-message" style={{ marginTop: '8px' }}>{emptyFieldError}</div>
        )}
      </div>
      <div className="section-divider" />

      {/* 제출 버튼 */}
      <button 
        className="submit-button" 
        onClick={handleSubmit}
      >
        작성하기
      </button>
    </div>
  );
}
