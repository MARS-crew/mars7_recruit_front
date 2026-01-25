import Nobackheader from "../components/nobackheader";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userImage from "../icon/userImage.png";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import Toggle from "../components/Toggle";
import RA from "../icon/RightArrow.png";
import MessageText from "../components/MessageText";
import mypageApi from "../api/mypage";
import { authApi } from "../api/auth";
import Modal from "../components/Modal";
import Header from "../components/header";

export default function MyPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [LoginOpen, setLoginOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Refs
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const gradeRef = useRef(null);
  const majorRef = useRef(null);
  const fileInputRef = useRef(null);

  // States
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [grade, setGrade] = useState("");
  const [major, setMajor] = useState("");
  const [appPush, setAppPush] = useState(false);
  const [profileImg, setProfileImg] = useState(userImage);
  const [toastMsg, setToastMsg] = useState("");
  const [imgFile, setImgFile] = useState(null);
  // Error States
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [gradeError, setGradeError] = useState("");
  const [majorError, setMajorError] = useState("");

  //  토스트 메시지 표시 여부 상태 추가
  const [showToast, setShowToast] = useState(false);

  const isDefaultImage = profileImg === userImage;

  const majorOptions = [
    "기계공학과",
    "기계설계공학과",
    "자동화공학과",
    "로봇소프트웨어과",
    "전기공학과",
    "반도체전자공학과",
    "정보통신공학과",
    "소방안전관리과",
    "웹응용소프트웨어공학과",
    "컴퓨터소프트웨어공학과",
    "인공지능소프트웨어학과",
    "생명화학공학과",
    "바이오융합공학과",
    "건축과",
    "실내건축디자인과",
    "시각디자인과",
    "AR·VR콘텐츠디자인과",
    "경영학과",
    "세무회계학과",
    "유통마케팅학과",
    "호텔관광학과",
    "경영정보학과",
    "빅데이터경영과",
    "자유전공학과",
  ].sort();

  const gradeOptions = ["1학년", "2학년", "3학년", "4학년"];

  // 핸들러 함수들
  const handleImageClick = () => fileInputRef.current.click();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfileImg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const formatPhoneNumber = (value) => {
    const raw = value.replace(/[^\d]/g, "");
    if (raw.length <= 3) return raw;
    if (raw.length <= 7) return `${raw.slice(0, 3)}-${raw.slice(3)}`;
    return `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
  };

  const saveHandle = async () => {
    // 에러 초기화
    setNameError("");
    setPhoneError("");
    setGradeError("");
    setMajorError("");

    let isValid = true;
    let firstErrorRef = null;

    // 1. 이름 검증
    const nameRegex = /^[a-zA-Z가-힣]*$/;
    if (!userName) {
      setNameError("필수정보를 입력해 주세요.");
      isValid = false;
      firstErrorRef = nameRef;
    } else if (!nameRegex.test(userName)) {
      setNameError("이름을 다시 확인해 주세요.");
      isValid = false;
      firstErrorRef = nameRef;
    }

    // 2. 전화번호 검증
    const pureNumbers = userPhone.replace(/-/g, "");
    const onlyNumberRegex = /^[0-9]*$/;
    if (!userPhone) {
      setPhoneError("필수 정보를 입력해 주세요.");
      isValid = false;
      if (!firstErrorRef) firstErrorRef = phoneRef;
    } else if (!onlyNumberRegex.test(pureNumbers) || userPhone.length !== 13) {
      setPhoneError("전화번호를 확인해 주세요.");
      isValid = false;
      if (!firstErrorRef) firstErrorRef = phoneRef;
    }

    // 3. 학년/학과 검증
    if (!grade) {
      setGradeError("학년을 선택해 주세요.");
      isValid = false;
    }
    if (!major) {
      setMajorError("학과를 선택해 주세요.");
      isValid = false;
    }

    if (isValid) {
      if (isValid) {
        try {
          let finalImgUrl = profileImg;
          if (imgFile) {
            const formData = new FormData();
            formData.append("file", imgFile);

            const uploadRes = await mypageApi.uploadImage(formData);

            if (uploadRes.success) {
              finalImgUrl = uploadRes.data.imageUrl;
            } else {
              throw new Error("이미지 업로드에 실패했습니다.");
            }
          }

          const patchData = {
            name: userName,
            phoneNumber: userPhone,
            grade: parseInt(grade.replace("학년", "")),
            major: major,
            profileImage: finalImgUrl,
            apppushAgreed: appPush,
          };

          const response = await mypageApi.mypageUpdate(patchData);

          if (response.success) {
            setToastMsg("저장되었습니다.");
            setShowToast(true);
            setImgFile(null); // 전송 완료 후 파일 객체 초기화
            setTimeout(() => setShowToast(false), 2000);
          }
        } catch (error) {
          console.error("수정 실패:", error);

          setToastMsg(error.message || "저장에 실패했습니다.");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 2000);
        }
      } else if (firstErrorRef) {
        firstErrorRef.current?.focus();
      }
    }
  };

  const ModalLogoutConfirm = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.log(error.message, "오류발생");
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/");
    }
  };
  const ModalLoginConfirm = () => {
    navigate("/login");
  };
  const ModaldeleteAccount = async () => {
    try {
      await authApi.deleteAccount();
    } catch (error) {
      console.log(error.message, "오류발생");
    } finally {
      // 탈퇴 후에는 무조건 토큰을 지우고 메인으로 보냄
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/");
    }
  };

  // 푸시 알람 설정!
  const handlePushToggle = async () => {
    const prev = appPush;
    const next = !prev;

    setAppPush(next);

    try {
      const response = await mypageApi.mypageUpdatePush();

      if (response.success) {
        // 서버 값으로 최종 동기화 (선택)
        setAppPush(response.data.apppushAgreed);
      }
    } catch (error) {
      setAppPush(prev);
      console.error("푸시 변경 실패:", error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoginOpen(true);
      return; // 토큰 없으면 로직 중단
    }
    //마이페이지 수정 기능
    const fetchMypageData = async () => {
      try {
        const response = await mypageApi.mypage();
        if (response.success) {
          const res = response.data;
          setUserData(res);
          // API 데이터를 입력 폼 상태와 동기화
          setUserName(res.name);
          setUserPhone(res.phoneNumber);
          setGrade(`${res.grade}학년`);
          setMajor(res.major);
          setAppPush(res.apppushAgreed);
          if (res.profileImage) {
            setProfileImg(res.profileImage);
          }
        }
      } catch (err) {
        console.error("마이페이지 로드 실패:", err);
        if (
          err.message.includes("401") ||
          !localStorage.getItem("accessToken")
        ) {
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchMypageData();
  }, []);
  //로딩
  if (isLoading) {
    return <div className="page-container"></div>;
  }

  return (
    <div>
      <div className="page-container">
        <Header showArrow={false} title="마이페이지" />

        {/* 1. 프로필 이미지 */}
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 22 }}
        >
          <div
            style={{
              position: "relative",
              width: 120,
              height: 120,
              cursor: "pointer",
            }}
            onClick={handleImageClick}
          >
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleFileChange}
            />
            <img
              src={profileImg}
              alt="user"
              style={{
                width: 120,
                height: 120,
                borderRadius: isDefaultImage ? "0%" : "50%",
                objectFit: isDefaultImage ? "contain" : "cover",
              }}
            />
          </div>
        </div>

        {/* 2. 입력 필드 */}
        <div style={{ marginTop: 32 }}>
          <div style={{ height: 90 }}>
            <Input
              label="이름"
              ref={nameRef}
              error={!!nameError}
              value={userName}
              focusColor="#FFC10033"
              marginBottom="0"
              borderColor="#FFC100"
              onChange={(e) => setUserName(e.target.value)}
            />
            <MessageText marginTop={4} message={nameError} color="#FF4D4D" />
          </div>
          <div style={{ marginTop: 24, height: 90 }}>
            <Input
              label="전화번호"
              ref={phoneRef}
              error={!!phoneError}
              value={userPhone}
              focusColor="#FFC10033"
              marginBottom="0"
              borderColor="#FFC100"
              onChange={(e) => setUserPhone(formatPhoneNumber(e.target.value))}
            />
            <MessageText marginTop={4} message={phoneError} color="#FF4D4D" />
          </div>

          <div style={{ marginTop: 24 }}>
            <Select
              label="학년"
              value={grade}
              options={gradeOptions}
              ref={gradeRef}
              star={false}
              error={!!gradeError}
              onChange={(val) => setGrade(val)}
            />
            <MessageText marginTop={4} message={gradeError} color="#FF4D4D" />
          </div>

          <div style={{ marginTop: 24 }}>
            <Select
              label="학과"
              customHeight={276}
              value={major}
              options={majorOptions}
              ref={majorRef}
              star={false}
              error={!!majorError}
              onChange={(val) => setMajor(val)}
            />
            <MessageText marginTop={4} message={majorError} color="#FF4D4D" />
          </div>
        </div>

        {/* 3. 저장 버튼 */}

        <div style={{ marginTop: 40 }}>
          <Button label="저장" onClick={saveHandle} />
        </div>
        {/* 4. 기타 설정 및 메뉴 */}
        <div style={{ marginTop: 48 }}>
          <p
            style={{
              color: "#9EA3B2",
              fontSize: 16,
              fontWeight: "500",
              marginBottom: 16,
            }}
          >
            기타 설정
          </p>

          {/* 앱 푸시 알림 */}
          <div
            style={{
              height: 60,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #F0F0F0",
            }}
          >
            <span style={{ fontSize: 16, color: "#000" }}>알림 푸시 알림</span>
            <Toggle
              id="app-push"
              checked={appPush}
              onChange={handlePushToggle}
            />
          </div>

          {/* 비밀번호 변경 */}
          <div
            onClick={() => navigate("/Pwchange")}
            style={{
              height: 60,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #F0F0F0",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 16, color: "#000" }}>비밀번호 변경</span>
            <img src={RA} alt="arrow" />
          </div>

          {/* 회원 탈퇴 */}
          <div
            style={{
              height: 60,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #F0F0F0",
              cursor: "pointer",
            }}
            onClick={() => setIsWithdrawOpen(true)}
          >
            <span style={{ fontSize: 16, color: "#333" }}>회원 탈퇴</span>
            <img src={RA} alt="arrow" />
          </div>
          <Modal
            title="정말로 탈퇴하시겠습니까?"
            content={
              <>
                탈퇴한 계정은 영구 삭제되어
                <br />
                계정 복구가 불가능합니다.
              </>
            }
            padding="19px"
            spacing={{
              iconToTitle: 8,
              titleToContent: 3,
              contentToBtn: 18,
            }}
            rBtnColor="#FF383C"
            lBtn="취소"
            rBtn="탈퇴"
            isOpen={isWithdrawOpen}
            onClose={() => setIsWithdrawOpen(false)}
            onRightClick={ModaldeleteAccount}
          />
        </div>

        {/* 5. 로그아웃 */}
        <div style={{ marginTop: 48 }}>
          <Button
            label="로그아웃"
            backgroundColor="#F5F5F5"
            color="#9EA3B2"
            onClick={() => setIsModalOpen(true)}
          />
          <Modal
            title="정말로 로그아웃 하시겠습니까?"
            rBtnColor="#FF383C"
            lBtn="취소"
            height="192px"
            rBtn="로그아웃"
            spacing={{
              iconToTitle: 24,
              titleToContent: 28,
            }}
            padding="15px"
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onRightClick={ModalLogoutConfirm}
          />
        </div>
      </div>

      <Modal
        onRightClick={ModalLoginConfirm}
        isOpen={LoginOpen}
        lBtn="취소"
        onClose={() => navigate(-1)}
      />
      {/* 3. 토스트 UI (하단 고정) */}
      {showToast && (
        <div
          style={{
            position: "fixed",
            bottom: "100px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "12px 24px",
            borderRadius: "30px",
            fontSize: "14px",
            zIndex: 10000,
            whiteSpace: "nowrap",
            animation: "fadeInOut 2s",
          }}
        >
          {toastMsg}
        </div>
      )}

      {/* 토스트 애니메이션 스타일 */}
      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; bottom: 70px; }
          15% { opacity: 1; bottom: 100px; }
          85% { opacity: 1; bottom: 100px; }
          100% { opacity: 0; bottom: 70px; }
        }
      `}</style>
    </div>
  );
}
