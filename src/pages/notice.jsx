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
  const defaultIcons = [
    "../public/icons/notice1.png",
    "../public/icons/notice2.png",
    "../public/icons/notice3.png",
    "../public/icons/notice4.png",
  ];

  const getIconForNotice = (notification, index) => {
    const content = notification.noticeContent || '';
    
    // noticeContent 키워드 기반 매핑 (우선순위: 발표일 > 불합격 > 합격 > 지원)
    if (content.includes('발표일')) return defaultIcons[1];
    if (content.includes('불합격')) return defaultIcons[3];
    if (content.includes('합격')) return defaultIcons[2];
    if (content.includes('지원')) return defaultIcons[0];
    
    // 키워드 없으면 noticeId 기반 매핑
    const noticeId = notification.noticeId;
    const mapping = {
      1: defaultIcons[0],
      4: defaultIcons[0],
      2: defaultIcons[1],
      5: defaultIcons[1],
      8: defaultIcons[1],
      3: defaultIcons[2],
      6: defaultIcons[3],
      7: defaultIcons[3],
    };

    if (mapping[noticeId]) return mapping[noticeId];
    return defaultIcons[index % defaultIcons.length];
  };

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

      // 조회된 알림을 읽음 처리 (화면은 그대로 유지)
      if (unreadNotices.length > 0) {
        console.log('🔔 알림 읽음 처리 시작...');
        Promise.all(
          unreadNotices.map(notice => 
            noticeApi.markAsRead(notice.noticeId).catch(err => 
              console.log(`알림 ${notice.noticeId} 읽음 처리 실패:`, err)
            )
          )
        ).then(() => {
          console.log('✅ 알림 읽음 처리 완료 (다음 방문 시 사라집니다)');
        });
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
          notifications.map((notification, index) => (
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
                  src={notification.iconPath || getIconForNotice(notification, index)} 
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
                {notification.noticeContent || (
                  <>
                    {notification.prefix}
                    {notification.nickname && (
                      <span style={{ fontWeight: "700" }}>{notification.nickname}</span>
                    )}
                    {notification.middle}
                    <span style={{ fontWeight: "700" }}>{notification.recruitTitle}</span>
                    {notification.suffix}
                  </>
                )}
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
