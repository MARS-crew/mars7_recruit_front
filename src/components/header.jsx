import React from "react";
import { useNavigate } from "react-router-dom";
import arrow from "../icon/arrow.png";

function Header({ title, showArrow = true }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: 56,
        display: "flex",
        alignItems: "center",
        position: "relative",
        width: "100%",
        backgroundColor: "#FFFFFF",
        boxSizing: "border-box",
      }}
    >
      {showArrow && (
        <div
          style={{
            height: 24,
            width: 24,
            display: "flex",
            alignItems: "center",
            zIndex: 1,
            cursor: "pointer",
          }}
          onClick={() => navigate(-1)}
        >
          <img
            src={arrow}
            alt="뒤로가기"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      )}

      <p
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: "20px",
          fontWeight: "600",
          margin: 0,
          color: "#000000",
          pointerEvents: "none",
        }}
      >
        {title}
      </p>
    </div>
  );
}

export default Header;
