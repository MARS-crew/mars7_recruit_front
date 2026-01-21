import Header from "../components/header";
import React, { useEffect, useRef, useState } from "react";
import PasswordField from "../components/PasswordField";
import MessageText from "../components/MessageText";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function PwChange() {
  const navigate = useNavigate();
  const pwRef = useRef(null);
  const pwcRef = useRef(null);

  const [userPw, setUserPw] = useState("");
  const [userPwC, setUserPwC] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwcError, setPwcError] = useState("");

  // 1. 토스트 메시지 표시 여부 상태 추가
  const [showToast, setShowToast] = useState(false);

  const pwcheck = () => {
    setPwcError("");
    setPwError("");

    let isValid = true;
    let firstErrorRef = null;

    const pwRegex =
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;

    if (!userPw || !userPwC) {
      if (!userPw) {
        setPwError("필수 정보를 입력해 주세요.");
        isValid = false;
        firstErrorRef = pwRef;
      }
      if (!userPwC) {
        setPwcError("필수 정보를 입력해 주세요.");
        isValid = false;
        if (!firstErrorRef) firstErrorRef = pwcRef;
      }
    } else if (!pwRegex.test(userPw)) {
      setPwError("8-20자 숫자, 영문, 특수 문자를 포함해 주세요.");
      isValid = false;
      firstErrorRef = pwRef;
    } else if (userPw !== userPwC) {
      setPwcError("비밀번호가 일치하지 않습니다.");
      isValid = false;
      firstErrorRef = pwcRef;
    }

    if (isValid) {
      // 2. 알럿 대신 토스트 활성화
      setShowToast(true);

      // 2초 뒤에 마이페이지로 이동 (토스트를 보여주기 위해)
      setTimeout(() => {
        setShowToast(false);
        navigate("/mypage");
      }, 2000);
    } else if (firstErrorRef) {
      firstErrorRef.current?.focus();
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {" "}
      <Header title="비밀번호 변경" />
      <div
        style={{
          padding: "0 16px",
          backgroundColor: "#FFFFFF",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <div style={{ marginTop: 10 }}>
          <div style={{ height: 100, marginTop: 20 }}>
            <PasswordField
              ref={pwRef}
              label="변경할 비밀번호"
              value={userPw}
              error={!!pwError}
              star={true}
              onChange={(e) => setUserPw(e.target.value)}
              focusColor="#FFC10033"
              borderColor="#FFC100"
              placeholder="새 비밀번호를 입력해주세요."
            />
            <MessageText marginTop={-10} message={pwError} color="#FF4D4D" />
          </div>

          <div style={{ height: 100, marginTop: 20 }}>
            <PasswordField
              ref={pwcRef}
              label="비밀번호 확인"
              value={userPwC}
              error={!!pwcError}
              star={true}
              onChange={(e) => setUserPwC(e.target.value)}
              focusColor="#FFC10033"
              borderColor="#FFC100"
              placeholder="비밀번호를 한 번 더 입력해주세요."
            />
            <MessageText marginTop={-10} message={pwcError} color="#FF4D4D" />
          </div>
        </div>

        <div style={{ marginTop: 37 }}>
          <Button label="저장" onClick={pwcheck} />
        </div>

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
            비밀번호가 변경되었습니다.
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
    </div>
  );
}
