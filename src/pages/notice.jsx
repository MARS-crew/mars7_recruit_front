import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import noticeApi from '../api/notice'
import Header from '../components/header'
import Modal from '../components/Modal'

const notice = () => {
  const navigate = useNavigate();
  const [LoginOpen, setLoginOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotices = async () => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      setLoginOpen(true);
      return;
    }

    setLoading(true);

    try {
      const rawList = await noticeApi.getList();
      console.log('📬 알림 목록:', rawList);
      
      // 읽지 않은 알림만 필터링
      const unreadNotices = (rawList || []).filter(item => !item.isRead);
      setNotifications(unreadNotices);

      // 조회된 모든 알림을 읽음 처리
      if (unreadNotices.length > 0) {
        console.log('🔔 모든 알림 일괄 읽음 처리 중...');
        await Promise.all(
          unreadNotices.map(notice => 
            noticeApi.markAsRead(notice.noticeId).catch(err => 
              console.log(`알림 ${notice.noticeId} 읽음 처리 실패:`, err)
            )
          )
        );
        console.log('✅ 모든 알림 읽음 처리 완료');
      }
    } catch (err) {
      console.log('❌ 알림 조회 에러:', err);
      
      // 401 에러면 로그인 모달 표시
      if (err.message.includes('401') || err.message.includes('인증')) {
        setLoginOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchNotices();
  }, []);

  return (
    <div>
    <Header title="알림" />
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
      
      
      <div style={{ marginTop: "24px" }}>
        {notifications.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "320px 0px",
            color: "#9EA3B2",
            fontSize: "16px",
            fontWeight: "500"
          }}>
            알림이 없습니다.
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.noticeId}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                height: "84px",
                padding: "8px 0",
                borderBottom: "1px solid #F0F0F0",
              }}
            >
              <div style={{ flexShrink: 0 }}>
                <img 
                  src={notification.iconPath || "../public/icons/notice1.png"} 
                  alt="icon" 
                  style={{ width: "42px", height: "42px", alignItems: "center" }} 
                />
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  lineHeight: "1.6",
                  color: "#000000",
                  fontWeight: "400",
                  height: "auto",
                  minHeight: "26px",
                  fontFamily: "Pretendard",
                  alignItems: "center",
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
          ))
        )}
      </div>

      <Modal
        isOpen={LoginOpen}
        lBtn="취소"
        onClose={() => setLoginOpen(false)}
        onRightClick={() => navigate('/login')}
      />
    </div>
  </div>
  )
}

export default notice
