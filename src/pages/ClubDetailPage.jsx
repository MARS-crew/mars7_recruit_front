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
                // 먼저 일반 상세 조회로 게시자 ID 확인
                const data = await recruitApi.getDetail(recruitId);
                if (!mounted) return;
                
                const publisherId = Number(data?.userId);
                const currentUserStr = localStorage.getItem('user');
                console.log('🔍 디버그 | publisherId:', publisherId);
                console.log('🔍 디버그 | currentUserStr:', currentUserStr);
                let isOwner = false;
                
                // 현재 로그인한 사용자가 게시자인지 확인
                if (currentUserStr) {
                    try {
                        const currentUser = JSON.parse(currentUserStr);
                        const currentUserId = Number(currentUser?.userId);
                        console.log('🔍 디버그 | currentUser:', currentUser);
                        console.log('🔍 디버그 | currentUserId:', currentUserId);
                        isOwner = currentUserId === publisherId;
                        console.log('🔍 디버그 | isOwner:', isOwner);
                    } catch (e) {
                        console.error('❌ user 파싱 실패:', e);
                        // user 파싱 실패 시 게시자 아님으로 처리
                        isOwner = false;
                    }
                }

                // 게시자인 경우에만 owner API 호출 (지원자 정보 포함)
                if (isOwner) {
                    try {
                        const ownerData = await recruitApi.getOwnerDetail(recruitId);
                        if (!mounted) return;
                        setClub(normalizeClub(ownerData));
                        setIsPublisher(true);
                        setLoading(false);
                        return;
                    } catch (ownerErr) {
                        // owner API 실패 시 일반 데이터 사용
                        if (!mounted) return;
                    }
                }

                // 일반 사용자 또는 owner API 실패 시 일반 데이터 사용
                setClub(normalizeClub(data));
                setIsPublisher(false);
            } catch (err) {
                if (!mounted) return;
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