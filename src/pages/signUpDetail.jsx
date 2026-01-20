import { useState, useRef, useEffect } from "react";
import Header from "../components/header";
import Select from "../components/Select";
import userImage from "../icon/userImage.png";
import MessageText from "../components/MessageText";
import Button from "../components/Button";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
export default function SingUpDetail() {
  const navigate = useNavigate();

  const genderRef = useRef(null);
  const yearRef = useRef(null);
  const addressRef = useRef(null);
  const fileInputRef = useRef(null);

  // 상태 관리
  const [gender, setGender] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [birthError, setBirthError] = useState("");
  const [profileImg, setProfileImg] = useState(userImage);

  const isDefaultImage = profileImg === userImage;

  // 옵션 데이터
  const genderOption = ["여성", "남성"];
  const yearOptions = Array.from({ length: 2026 - 1940 + 1 }, (_, i) =>
    String(2026 - i),
  );
  const monthOptions = Array.from({ length: 12 }, (_, i) => String(i + 1));
  const [dayOptions, setDayOptions] = useState(
    Array.from({ length: 31 }, (_, i) => String(i + 1)),
  );

  // 생년월일 동적 계산
  useEffect(() => {
    if (year && month) {
      const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
      const days = Array.from({ length: lastDay }, (_, i) => String(i + 1));
      setDayOptions(days);
      if (day && parseInt(day) > lastDay) {
        setDay(String(lastDay));
      }
    }
  }, [year, month, day]);

  // 프로필 이미지 핸들러
  const handleImageClick = () => fileInputRef.current.click();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleComplete = () => {
    setGenderError("");
    setBirthError("");
    // addressError는 실시간으로 관리되므로 초기화하지 않거나 필요 시 체크

    let isValid = true;

    // 성별 검증
    if (!gender) {
      setGenderError("성별을 선택해 주세요.");
      genderRef.current?.focus();
      isValid = false;
    }

    // 생년월일 검증
    if (!year || !month || !day) {
      setBirthError("생년월일을 모두 선택해 주세요.");
      if (!year && isValid) yearRef.current?.focus();
      isValid = false;
    }

    // 주소 검증
    const specialCharPattern = /[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s]/;
    if (!address) {
      setAddressError("주소를 입력해 주세요.");
      if (isValid) addressRef.current?.focus();
      isValid = false;
    } else if (specialCharPattern.test(address)) {
      setAddressError("문자만 입력해 주세요.");
      if (isValid) addressRef.current?.focus();
      isValid = false;
    }

    if (isValid) {
      console.log("전송 데이터:", {
        gender,
        birth: `${year}-${month}-${day}`,
        profileImg,
        address,
      });
      navigate("/");
    }
  };
  const containerRef = useRef(null); // 1. 최상단 div를 위한 Ref 추가

  // 2. 페이지 로딩 시 스크롤 최상단 이동 로직
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0; // 내부 스크롤 초기화
    }
    window.scrollTo(0, 0); // 브라우저 스크롤 초기화
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        padding: "0 16px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        backgroundColor: "#FFFFFF",
        overflowY: "auto",
      }}
    >
      <Header title={"회원가입"} />

      <div style={{ flex: 1 }}>
        {/* 프로필 이미지 */}
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

        {/* 입력 폼 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            marginTop: 62,
          }}
        >
          {/* 성별 */}
          <div>
            <Select
              ref={genderRef}
              label="성별"
              value={gender}
              error={!!genderError}
              options={genderOption}
              placeholder="성별 선택"
              onChange={(val) => {
                setGender(val);
                setGenderError("");
              }}
              borderColor={genderError ? "#FF4D4D" : "#D9D9D9"}
            />
            <div style={{ minHeight: "22px" }}>
              <MessageText
                marginTop={2}
                message={genderError}
                color="#FF4D4D"
              />
            </div>
          </div>

          {/* 생년월일 */}
          <div>
            <div
              style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}
            >
              <div style={{ flex: 1 }}>
                <Select
                  ref={yearRef}
                  value={year}
                  label="생년월일"
                  customHeight={276}
                  options={yearOptions}
                  placeholder="년"
                  onChange={(val) => {
                    setYear(val);
                    setBirthError("");
                  }}
                  borderColor={birthError && !year ? "#FF4D4D" : "#D9D9D9"}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Select
                  value={month}
                  options={monthOptions}
                  label=""
                  placeholder="월"
                  customHeight={276}
                  onChange={(val) => {
                    setMonth(val);
                    setBirthError("");
                  }}
                  borderColor={birthError && !month ? "#FF4D4D" : "#D9D9D9"}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Select
                  value={day}
                  label=""
                  options={dayOptions}
                  placeholder="일"
                  customHeight={276}
                  onChange={(val) => {
                    setDay(val);
                    setBirthError("");
                  }}
                  borderColor={birthError && !day ? "#FF4D4D" : "#D9D9D9"}
                />
              </div>
            </div>
            <div style={{ minHeight: "22px" }}>
              <MessageText marginTop={2} message={birthError} color="#FF4D4D" />
            </div>
          </div>

          {/* 주소 (특수문자 검사 적용) */}
          <div>
            <Input
              label="주소"
              ref={addressRef}
              error={!!addressError}
              star={true}
              value={address}
              focusColor="#FFC10033"
              marginBottom="0"
              maxLength="50"
              borderColor={addressError ? "#FF4D4D" : "#D9D9D9"}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="주소를 입력해주세요."
            />
            <div style={{ minHeight: "22px" }}>
              <MessageText
                marginTop={2}
                message={addressError}
                color="#FF4D4D"
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 40, marginBottom: 35 }}>
        <Button label="회원가입" onClick={handleComplete} />
      </div>
    </div>
  );
}
