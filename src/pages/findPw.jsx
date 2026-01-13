import Header from "../components/header";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import MessageText from "../components/MessageText";

export default function Findpw() {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState(""); // 전체적인 에러 메시지
  const [idError, setIdError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [errorLast, setErrorLast] = useState("");
  const navigate = useNavigate();

  const handleFindPw = () => {
    // 1. 상태 초기화
    setIdError(false);
    setNameError(false);
    setError("");

    let isValid = true;

    // 2. 빈 값 체크 (기본 유효성)
    if (!userId) {
      setIdError(true);
      isValid = false;
    }
    if (!userName) {
      setNameError(true);
      isValid = false;
    }

    if (!isValid) {
      setError("필수 정보를 입력해주세요.");
      return; // 빈 값이 있으면 여기서 중단
    }

    //아이디 검사
    const idRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{3,15}$/;
    if (!idRegex.test(userId)) {
      setError("조건은 3-15자 영대소문자, 숫자 포함 후 작성해주세요.");
      setIdError(true);
      return;
    }

    //임시 값
    const isNameInDB = false; // 예시를 위해 false로 설정 (실제론 DB 조회 결과값)
    const isIDInDB = false; // 예시를 위해 true로 설정 (실제론 DB 조회 결과값)
    if (!isNameInDB) {
      setError("존재하지 않는 회원 정보입니다.");
      setNameError(true);
      return;
    }
    if (!isNameInDB && !isIDInDB) {
      setErrorLast("회원 정보가 일치하지 않습니다.");
      setNameError(true);
      return;
    } else {
      setErrorLast("알 수 없는 오류입니다.");
      setNameError(true);
      return;
    }

    navigate("/login");
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
      <Header />

      <div style={{ marginTop: "36px" }}>
        <div style={{ marginBottom: "16px" }}>
          <p
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              textAlign: "center",
              margin: 0,
            }}
          >
            비밀번호 찾기
          </p>
        </div>

        <div>
          <p
            style={{
              fontSize: "14px",
              color: "#9EA3B2",
              textAlign: "center",
              whiteSpace: "pre-wrap",
              lineHeight: "1.5",
              marginTop: "8px",
            }}
          >
            {
              "비밀번호를 잊으셨나요?\n회원가입 시 입력한 아래의 정보를 입력해주세요."
            }
          </p>
        </div>
      </div>

      {/* 아이디 입력 영역 */}
      <div style={{ marginTop: 50 }}>
        <Input
          type="text"
          placeholder="아이디를 입력해주세요"
          label="아이디"
          value={userId}
          error={idError}
          onChange={(e) => setUserId(e.target.value)}
        />
        {/* 아이디 관련 에러일 때만 메시지 노출 */}
        {idError && <MessageText message={error} color="#FF4D4D" />}
      </div>

      {/* 이름 입력 영역 */}
      <div style={{ marginTop: 30 }}>
        <Input
          type="text"
          placeholder="이름을 입력해주세요"
          label="이름"
          error={nameError}
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        {/* 이름 관련 에러일 때만 메시지 노출 */}
        {nameError && <MessageText message={error} color="#FF4D4D" />}
      </div>

      <div style={{ marginTop: 60 }}>
        <Button label="비밀번호 찾기" onClick={handleFindPw} />
      </div>
      <div
        style={{
          marginTop: 16,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <MessageText message={errorLast} color="#FF4D4D" />
      </div>
    </div>
  );
}
