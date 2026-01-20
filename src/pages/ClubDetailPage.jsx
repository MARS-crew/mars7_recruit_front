import React from 'react';
import { useParams } from 'react-router-dom';
import ClubDetail from './ClubDetail';

const ClubDetailPage = () => {
    const { id } = useParams(); // URL에서 동아리 ID를 가져옵니다.
    
    // TODO: 실제로는 API에서 동아리 정보를 가져와야 합니다.
    // 임시 동아리 데이터 (clubs.jsx와 동일한 데이터)
    const clubsData = {
        1: {
            id: 1,
            category: '취미동아리',
            title: '2026년도 전공동아리 ONE 신입 부원 모집',
            recruitCount: '00',
            ageRange: '무관',
            gender: '무관',
            recruitPeriod: '2025.12.31 - 2026.01.07',
            announcementDate: '2026.01.12',
            posterImage: '../public/icons/clubimage.png',
            description: '웹응용소프트웨어공학과 전공 동아리 ONE에서 신입 부원을 모집합니다.\nONE은 각종 세미나 및 스터디 활동, 대회와 동아리페어 expo 활동을 꾸준히 이어오고 있는 전공 동아리입니다!',
            managerName: '최예은',
            contact: '010-9017-0806',
            viewCount: 6,
            totalApplicants: 2,
            viewedApplicants: 1,
            unviewedApplicants: 1,
            acceptedApplicants: 0,
            rejectedApplicants: 0
        },
        2: {
            id: 2,
            category: '취미동아리',
            title: '댄스 동아리 MOVE 신입 모집',
            recruitCount: '20',
            ageRange: '무관',
            gender: '무관',
            recruitPeriod: '2026.01.01 - 2026.01.15',
            announcementDate: '2026.01.20',
            posterImage: '../public/icons/clubimage.png',
            description: '댄스를 사랑하는 사람들의 모임! 초보자도 환영합니다.',
            managerName: '김댄스',
            contact: '010-1234-5678',
            viewCount: 10,
            totalApplicants: 5,
            viewedApplicants: 3,
            unviewedApplicants: 2,
            acceptedApplicants: 0,
            rejectedApplicants: 0
        },
        3: {
            id: 3,
            category: '전공동아리',
            title: 'AI 연구회 신입부원 모집',
            recruitCount: '15',
            ageRange: '무관',
            gender: '무관',
            recruitPeriod: '2026.01.05 - 2026.01.20',
            announcementDate: '2026.01.25',
            posterImage: '../public/icons/clubimage.png',
            description: '인공지능과 머신러닝에 관심있는 학생들의 전공 동아리입니다.',
            managerName: '박AI',
            contact: '010-2345-6789',
            viewCount: 8,
            totalApplicants: 3,
            viewedApplicants: 2,
            unviewedApplicants: 1,
            acceptedApplicants: 0,
            rejectedApplicants: 0
        }
    };

    const club = clubsData[id] || clubsData[1]; // ID에 해당하는 동아리 데이터
    
    // TODO: 로그인한 사용자가 게시자인지 지원자인지 확인하는 로직
    // true 이면 게시자 false이면 지원자 시점으로 화면을 렌더링
    const isPublisher = false;

    return <ClubDetail club={club} isPublisher={isPublisher} />;
};

export default ClubDetailPage;