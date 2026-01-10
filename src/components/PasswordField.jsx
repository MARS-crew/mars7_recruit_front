import React, { useState, forwardRef } from "react";
import Input from "./Input";
import PwCheck from "../icon/PwCheck.png";
import PwChecked from "../icon/PwChecked.png";

const PasswordField = forwardRef(({ error, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  //아이콘 누르면 아이콘 상태 변경
  const handleToggle = (e) => {
    e.stopPropagation();
    setShowPassword(!showPassword);

    if (ref && ref.current) {
      ref.current.focus();
    }
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <Input
        {...props}
        ref={ref}
        error={error}
        type={showPassword ? "text" : "password"}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <div
        onClick={handleToggle}
        style={{
          position: "absolute",
          right: "20px",
          bottom: "18px",
          cursor: "pointer",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src={showPassword ? PwChecked : PwCheck}
          alt="비밀번호 보기"
          style={{
            width: "24px",

            filter:
              error && showPassword
                ? "invert(30%) sepia(80%) saturate(5000%) hue-rotate(345deg) brightness(90%) contrast(110%)" // 에러 시 빨간색 (#FF383C 계열)
                : showPassword && isFocused
                ? "brightness(0) saturate(100%) invert(81%) sepia(61%) saturate(2643%) hue-rotate(354deg) brightness(101%) contrast(101%)" // 노란색 (#FFC100)
                : "invert(20%) grayscale(100%) opacity(0.5)", // 기본 회색
            transition: "filter 0.2s ease",
          }}
        />
      </div>
    </div>
  );
});

export default PasswordField;
