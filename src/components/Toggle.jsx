import React, { useState } from "react";

// id를 props로 받으면 한 페이지에 여러 개를 써도 충돌하지 않습니다.
function Toggle({ id = "toggle-1", checked, onChange }) {
  return (
    <div style={{ display: "inline-block", verticalAlign: "middle" }}>
      {/* 1. 숨겨진 체크박스 */}
      <input
        type="checkbox"
        id={id}
        hidden
        checked={checked}
        onChange={onChange}
      />

      {/* 2. 토글 배경 (label) */}
      <label
        htmlFor={id} // for 대신 htmlFor 사용 (React 표준)
        style={{
          width: "50px",
          height: "26px",
          display: "block",
          position: "relative",
          borderRadius: "30px",
          backgroundColor: checked ? "#FFC100" : "#CCC",
          cursor: "pointer", // 반드시 따옴표 "" 를 붙여야 합니다!
          transition: "all 0.2s ease-in",
        }}
      >
        {/* 3. 토글 버튼 (흰색 원) */}
        <span
          style={{
            width: "20px",
            height: "20px",
            position: "absolute",
            top: "50%",
            left: checked ? "calc(100% - 23px)" : "3px",
            transform: "translateY(-50%)",
            borderRadius: "50%",
            background: "#FFF",
            transition: "all 0.2s ease-in",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        ></span>
      </label>
    </div>
  );
}

export default Toggle;
