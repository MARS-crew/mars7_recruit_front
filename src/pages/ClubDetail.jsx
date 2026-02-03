import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ClubDetail.css';
import Clubheader from '../components/clubheader';
import Header from '../components/header';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import recruitApi from '../api/recruit';

const ClubDetail = ({ club, isPublisher }) => {
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        // 게시자용 지원 정보 디버깅
        if (isPublisher) {
            console.log('🔍 ClubDetail - 게시자 정보:', {
                club: club,
                viewCount: club?.viewCount,
                totalApplicants: club?.totalApplicants,
                viewedApplicants: club?.viewedApplicants,
                unviewedApplicants: club?.unviewedApplicants,
                acceptedApplicants: club?.acceptedApplicants,
                rejectedApplicants: club?.rejectedApplicants,
            });
        }
    }, [club, isPublisher]);

    const handleDeleteConfirm = async () => {
        try {
            await recruitApi.delete(club.id);
            setShowDeleteModal(false);
            navigate('/clubs', { state: { showDeleteToast: true, refresh: Date.now() } });
        } catch (error) {
            alert(error.message || '모집글 삭제에 실패했습니다.');
        }
    };

    const descriptionParagraphs = (club.description || '동아리 소개 내용이 여기에 표시됩니다.')
        .split(/\n+/)
        .filter(Boolean);

    return (
        <div>
                {/* Header: 게시자 전용 헤더 vs 기본 헤더 */}
        {isPublisher ? (
            <Clubheader
                title="동아리 모집"
                onEdit={() => navigate('/recruit', { state: { recruitId: club.id, club } })}
                onDelete={() => setShowDeleteModal(true)}
            />
        ) : (
            <Header title="동아리 모집" />
        )}
        <div style={{
        padding: "0 16px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        backgroundColor: "#FFFFFF",
      }}>
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
                        <span className="condition-value">
                            {club.recruitCount !== undefined && club.recruitCount !== null && club.recruitCount !== ''
                                ? (Number(club.recruitCount) < 10 ? "0명" : "00명")
                                : '미정'}
                        </span>
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

                <div className="section-divider" />

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
                                <span className="stat-value">{club.viewCount }</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">총 지원자</span>
                                <span className="stat-value">{club.totalApplicants }명</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">열람한 지원자</span>
                                <span className="stat-value">{club.viewedApplicants }명</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">미열람 지원자</span>
                                <span className="stat-value">{club.unviewedApplicants }명</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">합격자</span>
                                <span className="stat-value">{club.acceptedApplicants }명</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">불합격자</span>
                                <span className="stat-value">{club.rejectedApplicants }명</span>
                            </div>
                        </div>
                    </section>
                )}
            </div>

            {/* 하단 버튼 */}
            <div className="bottom-button-container">
                {isPublisher ? (
                    <button 
                        className="action-button publisher-button"
                        onClick={() =>
                            navigate(`/applicants?recruitId=${club.id}`, {
                                state: { recruitId: club.id },
                            })
                        }
                    >
                        지원자 조회하기
                    </button>
                ) : (
                    <button 
                        className="action-button applicant-button"
                        onClick={() => navigate(`/applications/new?recruitId=${club.id}`)}
                    >
                        지원하기
                    </button>
                )}
            </div>

            {/* 삭제 확인 모달 */}
            <Modal
                isOpen={showDeleteModal}
                title="글을 삭제하시겠습니까?"
                content={
                    <>
                        삭제한 글은 영구 삭제되어
                        <br />
                        복구할 수 없습니다.
                    </>
                }
                lBtn="취소"
                rBtn="삭제"
                rBtnColor="#FF383C"
                onClose={() => setShowDeleteModal(false)}
                onRightClick={handleDeleteConfirm}
                showIcon={true}
            />

            {/* 토스트 팝업 */}
            <Toast
                message="삭제되었습니다."
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />
        </div>
    </div>
    );
};

export default ClubDetail;