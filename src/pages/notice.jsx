import React from 'react'
import Header from '../components/header'

const notice = () => {
  const notifications = [
    {
      id: 1,
      iconPath: "../public/icons/notice1.png",
      nickname: "널 좋아한다 말하고",
      recruitTitle: "축구동아리 공차 신입...",
      prefix: "",
      middle: " 님이 ",
      suffix: "에 지원하였습니다."
    },
    {
      id: 2,
      iconPath: "../public/icons/notice2.png",
      recruitTitle: "2026 ONE 신규 부원 모집...",
      prefix: "오늘은 ",
      suffix: " 의 합격 발표일입니다."
    },
    {
      id: 3,
      iconPath: "../public/icons/notice3.png",
      recruitTitle: "2026 ONE 신규 부원 모집...",
      prefix: "",
      suffix: " 에 합격하였습니다"
    },
    {
      id: 4,
      iconPath: "../public/icons/notice4.png",
      recruitTitle: "2026년도 컴퓨터 동아리",
      prefix: "",
      suffix: ".. 에 불합격하였습니다"
    }
  ]

  return (
    <div
      style={{
        padding: "0 16px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Header title="알림" />
      
      <div style={{ marginTop: "20px" }}>
        {notifications.map((notification) => (
          <div
            key={notification.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              height: "72px",
              padding: "0",
              borderBottom: "1px solid #F0F0F0",
            }}
          >
            <div style={{ flexShrink: 0 }}>
              <img 
                src={notification.iconPath} 
                alt="icon" 
                style={{ width: "36px", height: "36px" }} 
              />
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                lineHeight: "1.5",
                color: "#000000",
                fontWeight: "400",
              }}
            >
              {notification.prefix}
              {notification.nickname && (
                <span style={{ fontWeight: "700" }}>{notification.nickname}</span>
              )}
              {notification.middle}
              <span style={{ fontWeight: "700" }}>{notification.recruitTitle}</span>
              {notification.suffix}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default notice
