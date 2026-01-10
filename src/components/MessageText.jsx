import React from "react";

const MessageText = ({
  message,
  color,
  fontSize = "12px",
  isVisible = true,
}) => {
  // 메세지가 없으면 아예 렌더링하지 않음
  if (!isVisible || !message) return null;

  return (
    <div style={{ marginTop: -10, marginLeft: 8 }}>
      <p
        style={{
          color: color,
          fontSize: fontSize,
          fontWeight: "400",
          margin: 0,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {message}
      </p>
    </div>
  );
};

export default MessageText;
