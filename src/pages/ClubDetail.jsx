import React, { useEffect } from 'react';
import '../styles/ClubDetail.css';
import Clubheader from '../components/clubheader';

const ClubDetail = ({ club, isPublisher }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const descriptionParagraphs = (club.description || '동아리 소개 내용이 여기에 표시됩니다.')
        .split(/\n+/)
        .filter(Boolean);

    return (
        <div style={{
        padding: "0 16px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        backgroundColor: "#FFFFFF",
      }}>
            {/* Header */}
            <Clubheader title="동아리 모집" />

            <div className="club-detail-content">
                {/* 동아리 카테고리 태그 */}
                <div className="club-category-tag">
                    {club.category || '취미동아리'}
                </div>

                {/* 모집 제목 */}
                <h2 className="recruitment-title">{club.title}</h2>

                {/* 모집 조건 */}
                <section className="recruitment-conditions">
                    <h3>모집 조건</h3>
                    <div className="condition-item">
                        <span className="condition-label">모집 인원</span>
                        <span className="condition-value">{club.recruitCount || '00'}명</span>
                    </div>
                    <div className="condition-item">
                        <span className="condition-label">연령대</span>
                        <span className="condition-value">{club.ageRange || '무관'}</span>
                    </div>
                    <div className="condition-item">
                        <span className="condition-label">성별</span>
                        <span className="condition-value">{club.gender || '무관'}</span>
                    </div>
                    <div className="condition-item">
                        <span className="condition-label">모집 기간</span>
                        <span className="condition-value">{club.recruitPeriod || '2025.12.31 - 2026.01.07'}</span>
                    </div>
                    <div className="condition-item">
                        <span className="condition-label">합격자 발표</span>
                        <span className="condition-value">{club.announcementDate || '2026.01.12'}</span>
                    </div>
                </section>

                {/* 포스터 이미지 */}
                <div className="poster-container">
                    <img 
                        src={club.posterImage || '/default-poster.jpg'} 
                        alt="동아리 포스터" 
                        className="poster-image"
                    />
                </div>

                {/* 동아리 소개 */}
                <section className="club-introduction">
                    {descriptionParagraphs.map((line, idx) => (
                        <p key={idx}>{line}</p>
                    ))}
                </section>

                {/* 담당자 정보 */}
                <section className="manager-info">
                    <h3>담당자 정보</h3>
                    <div className="info-item">
                        <span className="info-label">담당자</span>
                        <span className="info-value">{club.managerName || '최예은'}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">연락처</span>
                        <span className="info-value">{club.contact || '010-9017-0806'}</span>
                    </div>
                </section>

                {/* 게시자용: 지원 정보 */}
                {isPublisher && (
                    <section className="application-stats">
                        <h3>지원 정보</h3>
                        <div className="stats-grid">
                            <div className="stat-item">
                                <span className="stat-label">조회수</span>
                                <span className="stat-value">{club.viewCount || 6}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">총 지원자</span>
                                <span className="stat-value">{club.totalApplicants || 2}명</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">열람한 지원자</span>
                                <span className="stat-value">{club.viewedApplicants || 1}명</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">미열람 지원자</span>
                                <span className="stat-value">{club.unviewedApplicants || 1}명</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">합격자</span>
                                <span className="stat-value">{club.acceptedApplicants || 0}명</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">불합격자</span>
                                <span className="stat-value">{club.rejectedApplicants || 0}명</span>
                            </div>
                        </div>
                    </section>
                )}
            </div>

            {/* 하단 버튼 */}
            <div className="bottom-button-container">
                {isPublisher ? (
                    <button className="action-button publisher-button">
                        지원자 조회하기
                    </button>
                ) : (
                    <button className="action-button applicant-button">
                        지원하기
                    </button>
                )}
            </div>
        </div>
    );
};

export default ClubDetail;