import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../icon/LOGO.png";
import Input from "../components/Input";
import PasswordField from "../components/PasswordField"; // 비밀번호 전용 컴포넌트
import MessageText from "../components/MessageText"; // 경고문구 컴포넌트
import Button from "../components/Button";
import Header from "../components/header";
import check from "../icon/check.png";

function Login() {
  const navigate = useNavigate();

  // 1. 상태 관리 (입력값, 아이디저장, 에러메세지)
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  const [isIDSaved, setIsIDSaved] = useState(false);

  const [idError, setIdError] = useState(false);
  const [IdMError, setIdMError] = useState("");
  const [PwMError, setPwMError] = useState("");
  const [pwError, setPwError] = useState(false);
  // 2. Ref 설정
  const idRef = useRef(null);
  const pwRef = useRef(null);

  // 3. 페이지 접속 시 아이디 칸에 자동 포커스
  useEffect(() => {
    if (idRef.current) {
      idRef.current.focus();
    }
  }, []);

  // 4. 로그인 버튼 클릭 함수 (유효성 검사 포함)
  const handleLogin = () => {
    setIdError(false);
    setPwError(false);
    setIdMError("");
    setPwMError("");

    // 임시 데이터 및 정규식
    const mockId = "aaa1";
    const mockPW = "1q2w3e4r!";
    const pwRegex =
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;

    // 1. 필수 입력 확인 (아이디와 비밀번호 각각 독립적으로 체크)
    if (!userId || !userPw) {
      setIdMError("필수 정보를 입력해주세요.");
      setPwMError("필수 정보를 입력해주세요.");
      if (!userId) {
        setIdError(true);
      }

      if (!userPw) {
        setPwError(true);
      }

      // 포커스는 가장 위에 있는 아이디부터, 아이디가 있으면 비밀번호로 이동
      if (!userId) {
        idRef.current?.focus();
      } else {
        pwRef.current?.focus();
      }
      return;
    }

    // 2. 아이디 존재 여부 확인 (아이디 x)
    if (userId != mockId) {
      setIdMError("존재하지 않는 회원 정보입니다.");
      setIdError(true);
      idRef.current?.focus();
      return;
    }

    // 3. 비밀번호 형식 확인 (형식 불일치)
    if (!pwRegex.test(userPw)) {
      setPwError(true);
      setPwMError("8-20자 숫자, 영문, 특수 문자 포함 후 작성해 주세요.");
      pwRef.current?.focus();
      return;
    }

    // 4. 비밀번호 일치 확인 (아이디 o, 비밀번호x)
    if (userPw !== mockPW) {
      setPwMError("비밀번호가 올바르지 않습니다.");
      setPwError(true);
      pwRef.current?.focus();
      return;
    }

    // 5. 로그인 성공 및 자동 로그인 처리
    try {
      if (isIDSaved) {
        localStorage.setItem("savedId", userId);
      }
      console.log("로그인 성공:", { userId, isIDSaved });
      navigate("/");
    } catch (e) {
      setPwMError("알 수 없는 오류입니다.");
    }
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
      {/* 상단 헤더 */}
      <Header title="로그인" />

      {/* 로고 영역 */}
      <div
        style={{
          marginTop: 56,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={logo}
          alt="서비스 로고"
          style={{ width: "100%", maxWidth: "80%", height: "auto" }}
        />
      </div>

      {/* 입력 영역 */}
      <div style={{ marginTop: 40 }}>
        <Input
          ref={idRef}
          label="아이디"
          value={userId}
          error={idError}
          onChange={(e) => {
            setUserId(e.target.value);
          }}
          focusColor="#FFC10033"
          borderColor="#FFC100"
          placeholder="아이디를 입력해주세요."
        />
        <MessageText message={IdMError} color="#FF4D4D" />

        <PasswordField
          ref={pwRef}
          label="비밀번호"
          value={userPw}
          error={pwError}
          onChange={(e) => {
            setUserPw(e.target.value);
          }}
          focusColor="#FFC10033"
          borderColor="#FFC100"
          placeholder="비밀번호를 입력해주세요."
        />
        <MessageText message={PwMError} color="#FF4D4D" />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 30,
        }}
      >
        <div
          onClick={() => setIsIDSaved(!isIDSaved)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px", // 아이콘과 글자 간격
            cursor: "pointer",
          }}
        >
          {/* 커스텀 체크박스 박스 */}
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "4px", // 박스의 둥근 정도
              border: isIDSaved ? "1px solid #FFC100" : "1px solid #D9D9D9",
              backgroundColor: isIDSaved ? "#FFC100" : "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
          >
            {/* 선택되었을 때만 흰색 V 표시 등장 */}
            {isIDSaved && (
              <span
                style={{
                  color: "#FFFFFF", // 흰색 고정
                  fontSize: "14px",
                  fontWeight: "bold",
                  userSelect: "none",
                  marginTop: "-1px", // 중앙 정렬 미세 조정
                }}
              >
                <img src={check} />
              </span>
            )}
          </div>

          <span
            style={{
              fontSize: 14,
              color: isIDSaved ? "#212121" : "#9EA3B2",
              transition: "color 0.2s",
            }}
          >
            아이디 저장
          </span>
        </div>
        <span
          style={{ fontSize: 14, color: "#9EA3B2" }}
          onClick={() => navigate("/findPw")}
        >
          비밀번호 찾기
        </span>
      </div>

      <div style={{ marginTop: 50 }}>
        <Button label="로그인" onClick={handleLogin} />
      </div>

      <div style={{ flex: 1 }}></div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "50px",
        }}
      >
        <p style={{ fontSize: 14, color: "#9EA3B2", margin: 0 }}>
          아직 회원이 아니신가요?{" "}
          <span
            onClick={() => navigate("/SignUp")}
            style={{
              color: "#FFC100",
              textDecoration: "underline",
              cursor: "pointer",
              marginLeft: "4px",
              fontWeight: "600",
            }}
          >
            회원가입
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
