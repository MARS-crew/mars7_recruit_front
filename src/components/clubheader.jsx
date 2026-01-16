import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import arrow from "../icon/arrow.png";
import menuIcon from "../icon/menu.png";

function Header({ title, showArrow = true, menu = true, onEdit, onDelete }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMenuOpen]);

  const handleMenuToggle = () => setIsMenuOpen((prev) => !prev);

  const handleEditClick = () => {
    setIsMenuOpen(false);
    if (onEdit) {
      onEdit();
    }
  };

  const handleDeleteClick = () => {
    setIsMenuOpen(false);
    if (onDelete) {
      onDelete();
    }
  };

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
        padding: "0 16px",
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
            marginLeft: "-12px",
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

      {menu && (
        <div
          ref={menuRef}
          style={{
            position: "absolute",
            right: 6,
            top: 14,
            display: "flex",
            alignItems: "center",
            zIndex: 2,
          }}
        >
          <div
            style={{
              height: 27,
              width: 27,
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={handleMenuToggle}
          >
            <img
              src={menuIcon}
              alt="메뉴"
              style={{ width: "100%", height: "auto" }}
            />
          </div>

          {isMenuOpen && (
            <div
              style={{
                position: "absolute",
                top: 36,
                right: 0,
                backgroundColor: "#FFFFFF",
                borderRadius: 6,
                boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.12)",
                border: "1px solid #E6E8EB",
                overflow: "hidden",
                width: 103,
              }}
            >
              <button
                type="button"
                onClick={handleEditClick}
                style={{
                  width: "100%",
                  height: 30,
                  padding: "0 16px",
                  background: "none",
                  border: "none",
                  textAlign: "center",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#1D1F23",
                  cursor: "pointer",
                  outline: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                글 수정
              </button>
              <button
                type="button"
                onClick={handleDeleteClick}
                style={{
                  width: "100%",
                  height: 30,
                  padding: "0 16px",
                  background: "none",
                  border: "none",
                  textAlign: "center",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#1D1F23",
                  cursor: "pointer",
                  outline: "none",
                  borderTop: "1px solid #E6E8EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                글 삭제
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Header;
