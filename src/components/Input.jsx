import React, { forwardRef, useState } from "react";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      placeholder,
      height = 60,
      customWidth = "100%",
      value,
      onChange,
      focusColor,
      borderColor,
      error,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    // 1. 내부 포커스 상태 관리 (배경색/테두리용)
    const [isInternalFocused, setIsInternalFocused] = useState(false);

    // 2. 포커스 이벤트 핸들러 합치기
    const handleFocus = (e) => {
      setIsInternalFocused(true); // 내 배경색 바꿈
      if (onFocus) onFocus(e); // 부모의 아이콘 색 바꿈 로직 실행
    };

    const handleBlur = (e) => {
      setIsInternalFocused(false); // 내 배경색 원래대로
      if (onBlur) onBlur(e); // 부모의 아이콘 색 원래대로 로직 실행
    };

    return (
      <div style={{ width: customWidth, marginBottom: "16px" }}>
        {label && (
          <p
            style={{
              fontSize: "16px",
              fontWeight: "400",
              color: "#212121",
              marginBottom: "8px",
            }}
          >
            {label}
          </p>
        )}
        <input
          ref={ref}
          onFocus={handleFocus} // 합쳐진 핸들러 연결
          onBlur={handleBlur} // 합쳐진 핸들러 연결
          style={{
            width: "100%",
            height: height,
            borderRadius: 16,
            border: error
              ? "1px solid #FF383C"
              : isInternalFocused
              ? `1px solid ${borderColor}`
              : "1px solid #D9D9D9",

            backgroundColor: error
              ? "#FF383C33"
              : isInternalFocused
              ? focusColor
              : "#ffffff",
            padding: "0 20px",
            fontSize: "16px",
            boxSizing: "border-box",
            outline: "none",
            transition: "all 0.2s ease", // 부드러운 변화 추가
          }}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...props} // 나머지 속성 전달
        />
      </div>
    );
  }
);

export default Input;
