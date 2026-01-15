import Header from "../components/Header";
import React, { useEffect, useRef } from "react";
export default function pushTermsDetail() {
  const containerRef = useRef(null); // 1. 최상단 div를 위한 Ref 추가

  // 2. 페이지 로딩 시 스크롤 최상단 이동 로직
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0; // 내부 스크롤 초기화
    }
    window.scrollTo(0, 0); // 브라우저 스크롤 초기화
  }, []);
  return (
    <div
      ref={containerRef} // ★ 이 Ref가 반드시 필요합니다
      style={{
        padding: "0 16px",
        height: "100vh", // 화면 전체 높이 고정
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Header title="이용약관 동의" />
      {/* 약관 소제목 영역 */}
      <div style={{ marginTop: 22, marginBottom: 8 }}>
        <p
          style={{
            color: "#A4A4A4",
            fontWeight: "600",
            fontSize: "16px",
            margin: 0,
          }}
        >
          동미동락 서비스 이용약관
        </p>
      </div>
      <hr />
      <div
        style={{
          marginTop: 16,
          flex: 1, // 남은 공간을 모두 차지
          overflowY: "auto", // 내용이 많아지면 자동으로 세로 스크롤 생성
          paddingBottom: "40px", // 최하단 조항이 가려지지 않게 여유 공간 추가
          WebkitOverflowScrolling: "touch", // iOS에서 부드러운 스크롤 적용
        }}
      >
        <div
          style={{
            fontSize: "14px",
            lineHeight: "1.6",
            fontWeight: "500", // Medium
            color: "#212121", // 색상 #212121
            whiteSpace: "pre-line",
            textIndent: "4px", // 첫 글자 들여쓰기
          }}
        >
          <div>
            마스외전은 전자적 전송매체(앱 푸시)를 통해 이용자에게 맞춤형 푸시
            알림을 전송할 수 있습니다.
          </div>
          <div style={{ marginTop: 30 }}>
            푸시 알림에 대한 설정은 동미동락 앱 &gt; 마이 페이지 &gt; 설정 &gt;
            알림 수신 설정에서 언제든지 변경하실 수 있습니다.
          </div>
        </div>
      </div>
    </div>
  );
}
