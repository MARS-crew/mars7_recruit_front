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
  const [error, setError] = useState("");

  const [idError, setIdError] = useState(false);
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
    setError("");
    if (!userId || !userPw) {
      setError("필수 정보를 입력해주세요.");
      if (!userId) setIdError(true); // 아이디 비었으면 에러
      if (!userPw) setPwError(true); // 비번 비었으면 에러
      return;
    }
    if (userId == null) {
      setError("존재하지 않는 회원 정보입니다.");
      return;
    }
    if (userId && !userPw) {
      setError("비밀번호가 올바르지 않습니다.");
    }

    console.log("로그인 성공 시도:", { userId, userPw, isIDSaved });
    navigate("/home");
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
            if (e.target.value) setIdError(false); // 입력 시작하면 에러 해제
          }}
          focusColor="#FFC10033"
          borderColor="#FFC100"
          placeholder="아이디를 입력해주세요."
        />

        <PasswordField
          ref={pwRef}
          label="비밀번호"
          value={userPw}
          error={pwError}
          onChange={(e) => {
            setUserPw(e.target.value);
            if (e.target.value) setPwError(false); // 입력 시작하면 에러 해제
          }}
          focusColor="#FFC10033"
          borderColor="#FFC100"
          placeholder="비밀번호를 입력해주세요."
        />
        <MessageText message={error} color="#FF4D4D" />
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
              transition: "all 0.2s ease", // 색상 변할 때 부드럽게
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
            onClick={() => navigate("/Signup")}
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
