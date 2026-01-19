import { useEffect } from "react";

export default function Modal({
  title = (
    <>
      로그인이 필요한
      <br />
      콘텐츠 입니다.
      <br />
      로그인하시겠습니까?
    </>
  ),
  content,
  lBtn,
  rBtn = "확인",
  rBtnColor = "#2572B9",
  onRightClick,
  isOpen,
  padding = "15px",
  height = "213px",
  onClose,
  showIcon = true,
  //기본 값 로그인 모달
  spacing = {
    iconToTitle: 8,
    titleToContent: 13,
    contentToBtn: 20,
  },
}) {
  const { iconToTitle, titleToContent, contentToBtn } = spacing;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        WebkitBackdropFilter: "blur(5px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: padding,
          maxWidth: "400px",
          width: "85%",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          textAlign: "center",
          height: height,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          boxSizing: "border-box",
        }}
      >
        {showIcon && (
          <div
            style={{
              width: "29px",
              height: "29px",
              backgroundColor: "rgba(255, 56, 60, 0.2)",
              borderRadius: "50%",
              fontSize: "16px",
              fontWeight: "bold",
              color: "#ff383c",
              display: "flex",
              flexShrink: 0,
              alignItems: "center",
              justifyContent: "center",
              margin: `0 auto ${iconToTitle}px`,
            }}
          >
            !
          </div>
        )}

        <div
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#000",
            lineHeight: "26px",
            lineHeight: "1.4",
            marginBottom: `${titleToContent}px`,
          }}
        >
          {title}
        </div>

        {content && (
          <div
            style={{
              fontSize: "14px",
              fontWeight: "regular",
              lineHeight: "22px",
              color: "#000000",
              marginBottom: `${contentToBtn}px`, // 설명에서 버튼까지의 마진 적용
            }}
          >
            {content}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "8px",

            marginTop: "0px",
          }}
        >
          {lBtn && (
            <button
              onClick={onClose}
              style={{
                flex: 1,
                height: "48px",
                backgroundColor: "#fff",
                color: "#212121",
                border: "1px solid #eaeaea",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {lBtn}
            </button>
          )}

          <button
            onClick={onRightClick}
            style={{
              flex: 1,
              height: "48px",
              backgroundColor: rBtnColor,
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {rBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
