import React, { useState, useRef, useEffect } from "react";
import Header from "../components/header";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import PasswordField from "../components/PasswordField";
import check from "../icon/check.png";
import RightArrow from "../icon/RightArrow.png";
import MessageText from "../components/MessageText";
import { useNavigate } from "react-router-dom";
export default function SignUp() {
  const majorRef = useRef(null);
  const gradeRef = useRef(null);
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const idRef = useRef(null);
  const pwRef = useRef(null);
  const pwcRef = useRef(null);
  const navigate = useNavigate();
  const [grade, setGrade] = useState("");
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [major, setMajor] = useState("");
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  const [userPwC, setUserPwC] = useState("");
  const [agree, setAgree] = useState(false);
  const [appPush, setAppPush] = useState(false);
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [idError, setIdError] = useState("");
  const [idOk, setIdOk] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwcError, setPwcError] = useState("");
  const [useId, setUseId] = useState(false);
  const [agreeError, setAgreeError] = useState("");
  const [gradeError, setGradeError] = useState("");
  const [majorError, setMajorError] = useState("");
  const majorOptions = [
    "자유전공학부",
    "컴퓨터소프트웨어공학과",
    "컴퓨터정보공학과",
    "인공지능소프트웨어학과",
    "웹응용소프트웨어공학과",
    "빅데이터경영과",
    "기계공학과",
    "기계설계공학과",
    "자동화공학과",
    "로봇공학과",
    "전기공학과",
    "전자공학과",
    "정보통신공학과",
    "반도체전자공학과",
    "생명화학공학과",
    "건축과",
    "실내디자인과",
    "시각디자인과",
    "경영학과",
    "세무회계학과",
    "관광컨벤션학과",
    "소방안전관리과",
  ].sort();
  const gradeOptions = ["1학년", "2학년", "3학년", "4학년"];
  //체크
  const handleSingUP = () => {
    // 모든 에러 초기화
    setNameError("");
    setPhoneError("");
    setGradeError("");
    setMajorError("");
    setIdError("");
    setPwError("");
    setPwcError("");
    setAgreeError("");

    let isValid = true;
    let firstErrorRef = null; // 가장 첫 번째 에러가 난 Ref를 담을 변수

    // 1. 이름 검증
    const nameRegex = /^[a-zA-Z가-힣]+$/;
    if (!userName) {
      setNameError("필수정보를 입력해 주세요.");
      isValid = false;
      if (!firstErrorRef) firstErrorRef = nameRef;
    } else if (!nameRegex.test(userName)) {
      setNameError("이름을 다시 확인해 주세요.");
      isValid = false;
      if (!firstErrorRef) firstErrorRef = nameRef;
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

    // 4. 아이디 검증
    if (!userId) {
      setIdError("필수 정보를 입력해 주세요.");
      isValid = false;
      if (!firstErrorRef) firstErrorRef = idRef;
    } else if (!useId) {
      setIdError("아이디 중복 확인을 해주세요.");
      isValid = false;
      if (!firstErrorRef) firstErrorRef = idRef;
    }

    // 5. 비밀번호 검증
    const pwRegex =
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;
    if (!userPw) {
      setPwError("필수 정보를 입력해 주세요.");
      isValid = false;
      if (!firstErrorRef) firstErrorRef = pwRef;
    } else if (!pwRegex.test(userPw)) {
      setPwError("8-20자 숫자, 영문, 특수 문자 포함 후 작성해 주세요.");
      isValid = false;
      if (!firstErrorRef) firstErrorRef = pwRef;
    }

    // 6. 비밀번호 확인
    if (!userPwC) {
      setPwcError("필수 정보를 입력해 주세요.");
      isValid = false;
      if (!firstErrorRef) firstErrorRef = pwcRef;
    } else if (userPw !== userPwC) {
      setPwcError("비밀번호가 일치하지 않습니다.");
      isValid = false;
      if (!firstErrorRef) firstErrorRef = pwcRef;
    }

    // 7. 이용약관 동의 확인
    if (!agree) {
      setAgreeError("필수 약관에 동의해 주세요.");
      isValid = false;
    }

    // 검증 결과 처리
    if (isValid) {
      console.log("모든 검증 통과! 서버 전송");
      navigate("/signUpDetail");
    } else {
      // 에러가 있다면 가장 최상단 에러 필드로 포커스 이동
      if (firstErrorRef) {
        firstErrorRef.current?.focus();
      }
    }
  };
  //아이디 중복 체크
  const idChecked = () => {
    //임시 중복  체크용
    const nameT = "qwer";
    setIdOk("");
    setIdError("");
    setUseId(false);
    // 영문(대/소문자)과 숫자가 섞인 3~15자
    const idRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{3,15}$/;
    if (userId === nameT) {
      setIdError("사용할 수 없는 아이디입니다.");
      setIdOk("no");
    } else if (!idRegex.test(userId)) {
      setIdError("조건은 3-15자 영문자, 숫자 포함 후 작성해 주세요.");
      setIdOk("");
    } else {
      setUseId(true);

      setIdError("사용 가능한 아이디입니다.");
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
  // 전화번호 하이픈 자동 삽입 함수
  const formatPhoneNumber = (value) => {
    const raw = value.replace(/[^\d]/g, "");
    if (raw.length <= 3) return raw;
    if (raw.length <= 7) return `${raw.slice(0, 3)}-${raw.slice(3)}`;
    return `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
  };
  return (
    <div
      ref={containerRef} // ★ 이 Ref가 반드시 필요합니다
      style={{
        padding: "0 16px",
        backgroundColor: "#FFFFFF",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header title="회원가입" />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          marginTop: "20px",
        }}
      >
        {/* 이름 입력 */}
        <div>
          <Input
            label="이름"
            ref={nameRef}
            error={!!nameError}
            star={true}
            value={userName}
            focusColor="#FFC10033"
            marginBottom="0"
            borderColor="#FFC100"
            maxLength="10"
            onChange={(e) => setUserName(e.target.value)}
            placeholder="이름을 입력해주세요."
          />
          <MessageText marginTop={2} message={nameError} color="#FF4D4D" />
        </div>
        <div>
          <Input
            label="전화번호"
            ref={phoneRef}
            error={!!phoneError}
            star={true}
            value={userPhone}
            focusColor="#FFC10033"
            marginBottom="0"
            borderColor="#FFC100"
            onChange={(e) => setUserPhone(formatPhoneNumber(e.target.value))} // 하이픈 자동 삽입 적용
            placeholder="전화번호를 입력해주세요."
          />
          <MessageText marginTop={2} message={phoneError} color="#FF4D4D" />
        </div>
        {/* 학년 선택 */}
        <div>
          <Select
            label="학년"
            value={grade}
            ref={gradeRef}
            error={!!gradeError}
            options={gradeOptions}
            customHeight={276}
            placeholder="학년을 선택해주세요."
            onChange={(val) => {
              setGrade(val);
            }}
          />
          <MessageText marginTop={2} message={gradeError} color="#FF4D4D" />
        </div>
        {/* 학과 선택 */}
        <div>
          <Select
            label="학과"
            value={major}
            options={majorOptions}
            ref={majorRef}
            error={!!majorError}
            customHeight={276}
            placeholder="학과를 선택해주세요."
            onChange={(val) => {
              setMajor(val);
            }}
          />
          <MessageText marginTop={2} message={majorError} color="#FF4D4D" />
        </div>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end", // 바닥 라인을 맞춤
              width: "100%",
            }}
          >
            <Input
              label="아이디"
              customWidth={"62%"}
              value={userId}
              star={true}
              ref={idRef}
              maxLength="15"
              error={!!idError}
              marginBottom={0} // 인풋 박스 자체의 하단 마진 제거
              focusColor="#FFC10033"
              borderColor="#FFC100"
              onChange={(e) => {
                setUserId(e.target.value);
              }}
              placeholder="아이디를 입력해주세요."
            />
            {/* 버튼을 감싸는 영역 */}
            <div style={{ width: "35%" }}>
              <Button
                onClick={idChecked}
                label="중복확인"
                fontWeight="semibold"
                // 만약 Button 컴포넌트에 height props가 있다면 60으로 고정해주는 것이 좋습니다.
                style={{ height: "60px", marginBottom: "0" }}
              />
            </div>
          </div>
          <MessageText
            marginTop={2}
            message={idError}
            color={useId ? "#4CAF50" : "#FF4D4D"}
          />
        </div>
        <div style={{ height: 90 }}>
          <PasswordField
            label="비밀번호"
            value={userPw}
            ref={pwRef}
            maxLength="20"
            error={!!pwError}
            star={true}
            onChange={(e) => {
              setUserPw(e.target.value);
            }}
            focusColor="#FFC10033"
            borderColor="#FFC100"
            placeholder="비밀번호를 입력해주세요."
          />
          <MessageText marginTop={-13} message={pwError} color="#FF4D4D" />
        </div>
        <div style={{ height: 90 }}>
          <PasswordField
            label="비밀번호 확인"
            value={userPwC}
            ref={pwcRef}
            maxLength="20"
            error={!!pwcError}
            star={true}
            onChange={(e) => {
              setUserPwC(e.target.value);
            }}
            focusColor="#FFC10033"
            borderColor="#FFC100"
            placeholder="비밀번호를 입력해주세요."
          />
          <MessageText marginTop={-13} message={pwcError} color="#FF4D4D" />
        </div>
      </div>
      {/* 앱 푸시 동의 */}

      <div
        style={{
          position: "relative",
          width: "100%",
          display: "inline-flex",
          alignItems: "center",
          height: 22,
          marginTop: 40,
          gap: "10px",
        }}
      >
        <div
          onClick={() => {
            setAgree(!agree);
            setAgreeError("");
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "4px",
              border: agree ? "1px solid #FFC100" : "1px solid #D9D9D9",
              backgroundColor: agree ? "#FFC100" : "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {agree && <img src={check} alt="checked" />}
          </div>
          <span style={{ fontSize: 14, color: "#9EA3B2" }}>
            이용약관 동의 (필수)
          </span>
        </div>
        <div
          onClick={() => navigate("/termsDetail")}
          style={{ position: "absolute", right: "3.5px", cursor: "pointer" }}
        >
          <img src={RightArrow} alt="detail" />
        </div>
      </div>
      <div style={{ minHeight: "24px" }}>
        <MessageText marginTop={2} message={agreeError} color="#FF4D4D" />
      </div>
      {/* 2. 앱 푸시 동의 (선택) */}
      <div
        style={{
          position: "relative",
          width: "100%",
          display: "inline-flex",
          alignItems: "center",
          height: 22,
          gap: "10px",
        }}
      >
        <div
          onClick={() => setAppPush(!appPush)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "4px",
              border: appPush ? "1px solid #FFC100" : "1px solid #D9D9D9",
              backgroundColor: appPush ? "#FFC100" : "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {appPush && <img src={check} alt="checked" />}
          </div>
          <span style={{ fontSize: 14, color: "#9EA3B2" }}>
            앱 푸시 수신 동의 (선택)
          </span>
        </div>
        <div
          onClick={() => navigate("/pushTermsDetail")}
          style={{ position: "absolute", right: "3.5px", cursor: "pointer" }}
        >
          <img src={RightArrow} alt="detail" />
        </div>
      </div>

      <div style={{ marginTop: 35 }}>
        <Button label="다음" onClick={handleSingUP} />
      </div>
    </div>
  );
}
