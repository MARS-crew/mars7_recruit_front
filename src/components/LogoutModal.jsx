import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  // 하단 네비게이션 바 제어
  useEffect(() => {
    const nav = document.querySelector(".bottom-nav-bar");
    if (!nav) return;
    if (isOpen) {
      nav.style.opacity = "0.5";
      nav.style.pointerEvents = "none";
    } else {
      nav.style.opacity = "1";
      nav.style.pointerEvents = "auto";
    }
    return () => {
      if (nav) {
        nav.style.opacity = "1";
        nav.style.pointerEvents = "auto";
      }
    };
  }, [isOpen]);

  const handleConfirm = () => {
    // 로그아웃 로직 (예: 세션 삭제 등)
    navigate("/");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        className="modal-container"
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "17px 20px",
          maxWidth: "600px",
          width: "85%",
          justifyContent: "center",
          alignItems: "center",
          height: 192,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          textAlign: "center",
        }}
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫힘 방지
      >
        {/* 아이콘 (!) */}
        <div
          className="modal-icon"
          style={{
            width: "29px",
            height: "29px",
            backgroundColor: "rgba(255, 56, 60, 0.2)",
            border: "none",
            borderRadius: "50%",
            fontSize: "16px",
            fontWeight: "bold",
            color: "#ff383c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 8px",
          }}
        >
          !
        </div>

        {/* 타이틀 */}
        <div style={{ minHeight: 30, marginTop: 10 }}>
          <h2
            className="modal-title"
            style={{
              fontSize: "20px",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "500",
              color: "#000",
            }}
          >
            정말로 로그아웃 하시겠습니까?
          </h2>
        </div>
        <div style={{ marginTop: 30 }}>
          <button
            style={{
              minWidth: 141,
              height: 48,
              border: "1px solid #eaeaea",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "400",
              cursor: "pointer",
              minWidth: "141px",
              backgroundColor: "#fff",
              color: "#212121",
              transition: "all 0.3s ease",
              marginRight: 7,
            }}
            onClick={onClose}
          >
            취소
          </button>
          <button
            style={{
              minWidth: 141,
              height: 48,

              border: "1px solid #eaeaea",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "400",
              cursor: "pointer",
              minWidth: "141px",
              backgroundColor: "#FF383C",
              color: "#fff",
              transition: "all 0.3s ease",
            }}
            onClick={handleConfirm}
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
