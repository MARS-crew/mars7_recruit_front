import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../icon/LOGO.png";
import Input from "../components/Input";
import PasswordField from "../components/PasswordField"; // 비밀번호 전용 컴포넌트
import MessageText from "../components/MessageText"; // 경고문구 컴포넌트
import Button from "../components/Button";
import Header from "../components/header";
import check from "../icon/check.png";
import authApi from "../api/auth";

function Login() {
  const navigate = useNavigate();

  // 1. 상태 관리 (입력값, 아이디저장, 에러메세지)
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  const [isIDSaved, setIsIDSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [idError, setIdError] = useState(false);
  const [IdMError, setIdMError] = useState("");
  const [PwMError, setPwMError] = useState("");
  const [pwError, setPwError] = useState(false);
  // 2. Ref 설정
  const idRef = useRef(null);
  const pwRef = useRef(null);

  // 4. 로그인 버튼 클릭 함수 (유효성 검사 포함)
  const handleLogin = async () => {
    setIdError(false);
    setPwError(false);
    setIdMError("");
    setPwMError("");

    //id
    const idRegex = /^(?=.*[a-z])(?=.*\d)[a-z0-9]{3,15}$/;
    const pwRegex =
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;

    // 1. 필수 입력 확인 (아이디와 비밀번호 각각 독립적으로 체크)
    if (!userId || !userPw) {
      if (!userId) {
        setIdError(true);
        setIdMError("필수 정보를 입력해주세요.");
      }

      if (!userPw) {
        setPwError(true);
        setPwMError("필수 정보를 입력해주세요.");
      }

      // 포커스는 가장 위에 있는 아이디부터, 아이디가 있으면 비밀번호로 이동
      if (!userId) {
        idRef.current?.focus();
      } else {
        pwRef.current?.focus();
      }
      return;
    }
    // 3. 아이디 형식 확인 (형식 불일치)
    if (!idRegex.test(userId)) {
      setIdError(true);
      setIdMError("3-15자 영문자, 숫자 포함 후 작성해 주세요.");
      pwRef.current?.focus();
      return;
    }
    // 3. 비밀번호 형식 확인 (형식 불일치)
    if (!pwRegex.test(userPw)) {
      setPwError(true);
      setPwMError("8-20자 숫자, 영문, 특수 문자 포함 후 작성해 주세요.");
      pwRef.current?.focus();
      return;
    }

    const loginData = {
      usersId: userId,
      password: userPw,
      rememberMe: isIDSaved,
    };
    try {
      const response = await authApi.login(loginData);

      if (response) {
        const accessToken = response.accessToken || response.data?.accessToken;
        const refreshToken = response.refreshToken || response.data?.refreshToken;
        const userDetails = response.userDetails || response.data?.userDetails;
        console.log('🔍 로그인 응답 전체:', response);
        console.log('🔍 userDetails:', userDetails);
        const name = userDetails?.name;
        const phoneNumber = userDetails?.phoneNumber;
        const userIdFromServer = userDetails?.id; // userId가 아니라 id
        console.log('🔍 추출된 값 | userId:', userIdFromServer, '| name:', name, '| phoneNumber:', phoneNumber);
        
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        
        // 사용자 정보 저장 (담당자 정보 + userId로 활용)
        if (name || phoneNumber || userIdFromServer) {
          const userInfo = {
            userId: userIdFromServer || "",
            name: name || "",
            phoneNumber: phoneNumber || ""
          };
          console.log('💾 localStorage에 저장할 userInfo:', userInfo);
          localStorage.setItem("user", JSON.stringify(userInfo));
        }
        
        if (isIDSaved) {
          localStorage.setItem("savedUserId", userId);
        } else {
          localStorage.removeItem("savedUserId");
        }
        navigate("/");
      }
    } catch (error) {
      const serverResponse = error.response?.data;
      const errorCode = serverResponse?.error?.code;

      if (errorCode === "USER_NOT_FOUND") {
        // 1. 아이디와 관련된 에러인 경우 (예: "사용자를 찾을 수 없습니다")
        setIdError(true);
        setIdMError("존재하지 않는 회원 정보입니다.");
        idRef.current?.focus();
      } else if (errorCode === "INVALID_INPUT") {
        // 2. 비밀번호와 관련된 에러인 경우
        setPwError(true);
        setPwMError("비밀번호가 올바르지 않습니다.");
        pwRef.current?.focus();
      } else {
        setPwMError("알 수 없는 오류입니다.");
      }
    }
  };
  useEffect(() => {
    const savedId = localStorage.getItem("savedUserId");
    if (savedId) {
      setUserId(savedId);
      setIsIDSaved(true);
    }
  }, []);

  return (
    <div>
      <Header title="로그인" />
      <div
        style={{
          padding: "0 16px",
          minHeight: "100%",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          backgroundColor: "#FFFFFF",
        }}
      >
        {/* 상단 헤더 */}

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

        {/* 아이디 영역 */}
        <div style={{ marginTop: 40, height: 90 }}>
          <Input
            ref={idRef}
            label="아이디"
            maxLength="15"
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
        </div>
        {/* 비밀번호 영역 */}
        <div style={{ marginTop: 30, height: 90 }}>
          <PasswordField
            ref={pwRef}
            label="비밀번호"
            maxLength="20"
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
              marginTop: 8,
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
                color: "#9EA3B2",
                transition: "color 0.2s",
              }}
            >
              아이디 저장
            </span>
          </div>
        </div>

        <div style={{ marginTop: 50 }}>
          <Button label="로그인" onClick={handleLogin} />
        </div>

        <div style={{ flex: 1 }}></div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "50px",
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
    </div>
  );
}

export default Login;
