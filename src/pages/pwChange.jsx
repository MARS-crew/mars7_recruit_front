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

  const pwcheck = () => {
    // 에러 상태 초기화
    setPwcError("");
    setPwError("");

    let isValid = true; // 기본값을 true로 설정
    let firstErrorRef = null;

    const pwRegex =
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;

    // 1. 비밀번호 유효성 검사
    if (!userPw || !userPwC) {
      if (!userPw) {
        setPwError("필수 정보를 입력해 주세요.");
        isValid = false;
        firstErrorRef = pwRef;
      }
      if (!userPwC) {
        setPwcError("필수 정보를 입력해 주세요.");
        isValid = false;
        firstErrorRef = pwcRef;
      }
      if (!userPw && !userPwC) firstErrorRef = pwRef;
    } else if (!pwRegex.test(userPw)) {
      setPwError("8-20자 숫자, 영문, 특수 문자를 포함해 주세요.");
      isValid = false;
      firstErrorRef = pwRef;
    }

    // 2. 비밀번호 확인 유효성 검사
    else if (userPw !== userPwC) {
      setPwcError("비밀번호가 일치하지 않습니다.");
      isValid = false;
      if (!firstErrorRef) firstErrorRef = pwcRef;
    }

    // 모든 검사 통과 시
    if (isValid) {
      alert("비밀번호가 성공적으로 변경되었습니다.");
      navigate("/mypage"); // 메인 또는 로그인 페이지로 이동
    } else if (firstErrorRef) {
      // 첫 번째 에러가 발생한 곳으로 포커스
      firstErrorRef.current?.focus();
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0); // 브라우저 스크롤 초기화
  }, []);

  return (
    <div
      style={{
        padding: "0 16px",
        backgroundColor: "#FFFFFF",
        minHeight: "100%", // 화면 전체 높이 확보
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header title="비밀번호 변경" />

      <div style={{ marginTop: 10 }}>
        {/* 새 비밀번호 입력 */}
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

        {/* 비밀번호 확인 입력 */}
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
        {/* 버튼을 하단에 배치하거나 간격을 주어 저장하기 배치 */}
        <Button label="저장" onClick={pwcheck} />
      </div>
    </div>
  );
}
