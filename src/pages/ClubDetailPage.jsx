import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import ClubDetail from './ClubDetail';
import { recruitApi } from '../api/recruit';

const formatDate = (iso) => {
    if (!iso) return '-';
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}.${m}.${day}`;
};

const toCategory = (field) => (field === 'MAJOR' ? '전공동아리' : '취미동아리');
const toGender = (val) => {
    if (val === 'M') return '남자';
    if (val === 'F') return '여자';
    if (val === 'ANY') return '무관';
    return '무관';
};

const normalizeClub = (data) => {
    // 지원자 정보 계산 (applicants 배열이 있으면 분석)
    const applicants = data?.applicants || [];
    const viewedCount = applicants.filter(a => a?.isRead).length || 0;
    const unviewedCount = applicants.filter(a => !a?.isRead).length || 0;
    const acceptedCount = applicants.filter(a => a?.status === 'PASS').length || 0;
    const rejectedCount = applicants.filter(a => a?.status === 'FAIL').length || 0;
    
    const recruitCountValue = String(data?.people ?? '');
    console.log('📊 normalizeClub - 데이터 변환:', {
        rawData: data,
        applicants: applicants,
        applicantsDetail: applicants.map((a, idx) => ({
            index: idx,
            isRead: a?.isRead,
            status: a?.status,
            name: a?.name,
        })),
        viewedCount: viewedCount,
        unviewedCount: unviewedCount,
        acceptedCount: acceptedCount,
        rejectedCount: rejectedCount,
        people: data?.people,
        peopleType: typeof data?.people,
        recruitCount: recruitCountValue,
    });
    
    return {
        id: data?.recruitId,
        category: toCategory(data?.field),
        title: data?.title,
        recruitCount: recruitCountValue,
        gender: toGender(data?.gender),
        recruitPeriod: `${formatDate(data?.startDate)} - ${formatDate(data?.dueDate)}`,
        announcementDate: formatDate(data?.resultDate),
        posterImage: data?.posterImage || '../public/icons/clubdetailimage.png',
        description: data?.content,
        managerName: data?.userName,
        contact: data?.userPhoneNumber,
        viewCount: data?.viewCount ?? 0,
        totalApplicants: data?.applicantCount ?? applicants.length ?? 0,
        viewedApplicants: viewedCount,
        unviewedApplicants: unviewedCount,
        acceptedApplicants: acceptedCount,
        rejectedApplicants: rejectedCount,
        publisherId: data?.userId,
    };
};

const ClubDetailPage = () => {
    const { id } = useParams();
    const recruitId = useMemo(() => Number(id), [id]);

    const [club, setClub] = useState(null);
    const [isPublisher, setIsPublisher] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let mounted = true;
        const fetchDetail = async () => {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('accessToken');

                // 토큰이 있을 때 게시자 전용 상세 먼저 시도
                if (token) {
                    try {
                        const ownerData = await recruitApi.getOwnerDetail(recruitId);
                        console.log('🔍 게시자 상세 조회 성공:', ownerData);
                        if (!mounted) return;
                        setClub(normalizeClub(ownerData));
                        setIsPublisher(true);
                        setLoading(false);
                        return;
                    } catch (ownerErr) {
                        console.warn('⚠️ 게시자 상세 조회 실패, 일반 상세로 대체:', ownerErr.message);
                    }
                }

                // 일반 상세 조회 (토큰 없거나 게시자 아님)
                const data = await recruitApi.getDetail(recruitId);
                if (!mounted) return;
                const publisherId = Number(data?.userId);
                const isOwner = false;

                console.log('🔍 일반 상세 | publisherId:', publisherId, '| isOwner:', isOwner);

                setClub(normalizeClub(data));
                setIsPublisher(isOwner);
            } catch (err) {
                if (!mounted) return;
                console.error('❌ 상세 조회 오류:', err);
                setError('상세 정보를 불러오지 못했습니다.');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        if (recruitId) fetchDetail();
        return () => {
            mounted = false;
        };
    }, [recruitId]);

    if (loading) return <div style={{ padding: 16 }}>불러오는 중...</div>;
    if (error) return <div style={{ padding: 16 }}>{error}</div>;
    if (!club) return <div style={{ padding: 16 }}>데이터가 없습니다.</div>;

    return <ClubDetail club={club} isPublisher={isPublisher} />;
};

export default ClubDetailPage;