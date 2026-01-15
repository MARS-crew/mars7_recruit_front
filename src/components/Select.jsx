import React, { useState, useRef, useEffect } from "react";
import upArrow from "../icon/upArrow.png";
import downArrow from "../icon/downArrow.png";

const Select = ({
  label,
  value,
  error,
  width = "100%",
  options,
  placeholder,
  onChange,
  customHeight,
}) => {
  // 1. 내부 포커스 상태 관리 (배경색/테두리용)
  const [isInternalFocused, setIsInternalFocused] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ position: "relative", width: width }} ref={selectRef}>
      {label && (
        <label
          style={{
            fontSize: "16px",
            fontWeight: "regular",
            display: "block",
            marginBottom: "8px",
            marginLeft: "8px",
          }}
        >
          {label}
          <span style={{ color: "red" }}>*</span>
        </label>
      )}

      {/* 선택창 본체 */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          height: "60px",
          borderRadius: "16px",
          border: `1px solid ${isOpen ? "#FFC100" : "#D9D9D9"}`,
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
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxSizing: "border-box",
          color: value ? "#000" : "#D9D9D9",
        }}
      >
        <span style={{ fontSize: "16px" }}>{value || placeholder}</span>
        <img
          src={isOpen ? upArrow : downArrow}
          alt="arrow"
          style={{ width: "10px", height: "6px" }}
        />
      </div>

      {/* 리스트 부분 */}
      {isOpen && (
        <ul
          style={{
            position: "absolute",
            top: "100px",
            left: 0,
            width: "100%",
            backgroundColor: "#FFFFFF",
            border: "1px solid #D9D9D9",
            borderRadius: "16px",
            listStyle: "none",
            zIndex: 100,
            overflow: "hidden",
            maxHeight: customHeight,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {options.map((option, index) => {
            const isActive = hoveredIndex === index || option === value;

            return (
              <li
                key={option}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                style={{
                  // 1. 가장자리 흰색 여백을 위해 margin 사용
                  margin: "8px 12px",
                  display: "flex",
                  alignItems: "center", // 상하 가운데
                  height: "60px", // 배경 박스의 높이
                  fontSize: "16px",
                  borderRadius: "8px", // 배경 박스의 둥근 모서리
                  boxSizing: "border-box",

                  padding: "8px 16px",
                  // 3. 활성화 상태에 따른 색상 변경
                  backgroundColor: isActive ? "#FFF9E6" : "transparent",
                  color: isActive ? "#B18D1B" : "#A9A9A9",
                  transition: "all 0.1s ease",
                }}
              >
                {option}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Select;
