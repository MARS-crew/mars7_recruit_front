import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/header";

export default function TermsDetail() {
  const containerRef = useRef(null); // 1. 최상단 div를 위한 Ref 추가
  const location = useLocation();

  //회원가입 페이지로 뒤로가기 버튼 클릭 시 데이터 전달
  const signupData = location.state?.fromSignUp;
  // 2. 페이지 로딩 시 스크롤 최상단 이동 로직
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0; // 내부 스크롤 초기화
    }
    window.scrollTo(0, 0); // 브라우저 스크롤 초기화
  }, []);
  const sections = [
    {
      title: "제1조 (목적)",
      content:
        "본 약관은 마스외전(이하 “운영자”)이 운영 하는 동미동락 서비스의 이용과 관련하여 운영자와 이용자 간의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.",
    },
    {
      title: "제2조 (서비스 정의)",
      content:
        "동미동락은 동양미래대학교 학생을 대상으로 동아리 리크루팅 및 관리를 지원하는 모바일 기반 서비스입니다.",
    },
    {
      title: "제3조 (이용자의 권리 및 의무)",
      content:
        "이용자는 본 서비스를 관련 법령 및 서비스 운영 정책에 따라 이용해야 하며 타인의 권리를 침해하거나 서비스 운영을 방해하는 행위를 해서는 안 됩니다.",
    },
    {
      title: "제4조 (서비스 제공 및 변경)",
      content:
        "운영자는 서비스 운영상 필요에 따라 서비스의 일부 또는 전부를 변경하거나 일시적으로 중단할 수 있습니다.",
    },
    {
      title: "제5조 (책임의 제한)",
      content:
        "운영자는 서비스 이용 과정에서 발생하는 결과에 대해 고의 또는 중대한 과실이 없는 한 책임을 지지 않습니다.",
    },
    {
      title: "제6조 (분쟁 해결)",
      content:
        "서비스 이용과 관련하여 발생한 분쟁은 대한민국 법을 따르며, 관할 법원에 따릅니다.",
    },
  ];

  return (
    <div>
      <Header title="이용약관 동의" backData={signupData} backPath="/signUp" />

      <div
        ref={containerRef}
        style={{
          padding: "0 16px",
          height: "100vh", // 화면 전체 높이 고정
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          backgroundColor: "#FFFFFF",
        }}
      >
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

        {/* 스크롤이 발생하는 핵심 본문 영역 */}
        <div
          style={{
            marginTop: 16,
            flex: 1, // 남은 공간을 모두 차지
            overflowY: "auto", // 내용이 많아지면 자동으로 세로 스크롤 생성
            paddingBottom: "40px", // 최하단 조항이 가려지지 않게 여유 공간 추가
            WebkitOverflowScrolling: "touch", // iOS에서 부드러운 스크롤 적용
          }}
        >
          <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
            {sections.map((section, index) => (
              <div key={index} style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    fontWeight: "500", // Medium
                    color: "#212121", // 색상 #212121
                    marginBottom: "4px",
                  }}
                >
                  {section.title}
                </div>
                <div
                  style={{
                    fontWeight: "500", // Medium
                    color: "#212121", // 색상 #212121
                    whiteSpace: "pre-line",
                    textIndent: "4px", // 첫 글자 들여쓰기
                  }}
                >
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
