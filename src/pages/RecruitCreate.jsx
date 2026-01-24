import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import recruitApi from '../api/recruit';
import Header from '../components/header';
import Modal from '../components/Modal';
import '../styles/RecruitCreate.css';

export default function RecruitCreate() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefilledClub = location.state?.club;
  const editRecruitId = location.state?.recruitId; // 수정 모드 구분

  console.log('🔍 RecruitCreate 로드됨:', { editRecruitId, prefilledClub: prefilledClub?.id });

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
      managerName: '',
      phoneNumber: ''
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
  // const [LoginOpen, setLoginOpen] = useState(false);
  
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

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

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

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  //   const token = localStorage.getItem('accessToken');
  //   if (!token) {
  //     setLoginOpen(true);
  //     return;
  //   }
  //   setLoginOpen(false);
  // }, []);

  // const ModalLoginConfirm = () => {
  //   navigate('/login');
  // };

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
    const fetchUserInfo = async () => {
      try {
        // 사용자의 모집글 목록 조회
        const rawList = await recruitApi.getList('ALL');
        if (rawList && rawList.length > 0) {
          // 첫 번째 모집글의 상세 정보 조회 (게시자 상세)
          const recruitId = rawList[0].recruitId;
          const ownerDetail = await recruitApi.getOwnerDetail(recruitId);
          if (ownerDetail?.userName && ownerDetail?.userPhoneNumber) {
            setFormData((prev) => ({
              ...prev,
              managerName: ownerDetail.userName,
              phoneNumber: ownerDetail.userPhoneNumber
            }));
          }
        }
      } catch (error) {
        console.log('⚠️ 사용자 정보 로드 실패:', error.message);
      }
    };

    if (prefilledClub) {
      const mappedData = mapClubToFormData(prefilledClub);
      setFormData((prev) => ({ ...prev, ...mappedData }));
      
      if (prefilledClub.posterImage) {
        const posterImage = {
          file: null,
          preview: prefilledClub.posterImage,
          isExisting: true
        };
        setUploadedImages([posterImage]);
      }
    } else if (editRecruitId) {
      // 수정 모드: 서버에서 기존 데이터 로드
      const loadEditData = async () => {
        try {
          console.log('📥 기존 모집글 데이터 로드 중...', editRecruitId);
          const ownerDetail = await recruitApi.getOwnerDetail(editRecruitId);
          
          const mappedData = mapClubToFormData(ownerDetail);
          setFormData((prev) => ({ ...prev, ...mappedData }));
          
          if (ownerDetail.posterImage) {
            const posterImage = {
              file: null,
              preview: ownerDetail.posterImage,
              isExisting: true
            };
            setUploadedImages([posterImage]);
          }
          console.log('✅ 기존 모집글 데이터 로드 완료');
        } catch (error) {
          console.error('❌ 기존 모집글 데이터 로드 실패:', error);
        }
      };
      loadEditData();
    } else {
      fetchUserInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefilledClub, editRecruitId]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const fileEntries = await Promise.all(
      files.map(async (file) => ({
        file,
        preview: await readFileAsDataUrl(file), // base64 data URL로 저장해 새로고침에도 유지
        isExisting: false,
      })),
    );
    setUploadedImages((prev) => [...prev, ...fileEntries]);

    // 동일 파일을 다시 선택할 수 있도록 입력값을 비워준다.
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleImageDelete = (index) => {
    setUploadedImages((prev) => {
      const newImages = [...prev];
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

  const handleSubmit = async () => {
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

    if (uploadedImages.length === 0) {
      setEmptyFieldError('사진을 추가해 주세요.');
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

    const toIsoDateTime = (value) => {
      if (!value) return null;
      // YYYY-MM-DD 형식을 UTC 기준으로 직접 변환 (타임존 변환 방지)
      const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (match) {
        const [, year, month, day] = match;
        // UTC 기준 날짜로 직접 생성하여 타임존 문제 방지
        return `${year}-${month}-${day}T00:00:00.000Z`;
      }
      return null;
    };
    
    // 토큰 확인
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    
    // 서버에 전송할 데이터 포맷팅
    const submitData = {
      title: formData.title,
      content: formData.content,
      field: formData.category === '취미동아리' ? 'HOBBY' : 'MAJOR',
      gender: formData.gender === '무관' ? 'ANY' : formData.gender === '남자' ? 'M' : 'F',
      people: parseInt(formData.recruitCount),
      startDate: toIsoDateTime(formData.startDate),
      dueDate: toIsoDateTime(formData.endDate),
      resultDate: toIsoDateTime(formData.deadline),
      posterImage: uploadedImages[0]?.preview || null,
      managerName: formData.managerName,
      contact: formData.phoneNumber,
    };

    try {
      if (editRecruitId) {
        // 수정 모드: 새로 업로드한 이미지가 없으면 null로 전송 (기존 이미지 유지)
        const updateData = {
          ...submitData,
          posterImage: uploadedImages[0]?.isExisting ? null : submitData.posterImage
        };
        console.log('📝 모집글 수정 중...', { editRecruitId, updateData });
        const response = await recruitApi.update(editRecruitId, updateData);
        console.log('✅ 모집글 수정 완료:', response);
        console.log('📊 수정 API 응답 상태:', { status: response?.status, data: response });
      } else {
        // 작성 모드
        console.log('📝 모집글 작성 중...', submitData);
        const response = await recruitApi.create(submitData);
        console.log('✅ 모집글 작성 완료:', response);
        console.log('📊 작성 API 응답 상태:', { status: response?.status, data: response });
      }
      
      // 페이지 이동 후 토스트 표시
      navigate('/clubs', { state: { showSuccessToast: true, refresh: Date.now() } });
    } catch (error) {
      console.error('❌ 모집글 작성/수정 실패:', error);
      console.error('❌ 에러 메시지:', error.message);
      console.error('❌ 에러 전체:', error);
      alert(error.message || '모집글 작성/수정에 실패했습니다.');
    }
  };

  return (
  <div>
    {/* 헤더 */}
      <Header title={editRecruitId ? "모집글 수정" : "모집글 작성"} />
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
        {emptyFieldError && (emptyFieldError.includes('모집글') || emptyFieldError.includes('사진')) && (
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
              // 숫자만 허용 (정수)
              if (value === '') {
                setFormData({ ...formData, recruitCount: '' });
              } else {
                const numValue = parseInt(value, 10);
                // 1 이상 100 이하로 제한
                if (!isNaN(numValue)) {
                  if (numValue < 0) {
                    value = '0';
                  } else if (numValue > 100) {
                    value = '100';
                  } else {
                    value = String(numValue);
                  }
                  setFormData({ ...formData, recruitCount: value });
                }
              }
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
                const value = e.target.value;
                // 숫자만 추출
                const numbers = value.replace(/[^\d]/g, '');
                
                // 최대 11자리까지만 허용
                if (numbers.length > 11) return;
                
                // 포맷팅: xxx-xxxx-xxxx
                let formatted = '';
                if (numbers.length <= 3) {
                  formatted = numbers;
                } else if (numbers.length <= 7) {
                  formatted = `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
                } else {
                  formatted = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
                }
                
                setFormData({ ...formData, phoneNumber: formatted });
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

      {/* <Modal
        isOpen={LoginOpen}
        title="로그인"
        content="로그인이 필요합니다."
        lBtn="취소"
        rBtn="로그인"
        onClose={() => setLoginOpen(false)}
        onRightClick={() => {
          setLoginOpen(false);
          ModalLoginConfirm();
        }}
      /> */}
    </div>
  </div>
  );
}
