import { axiosInstance } from "./axios";

// 지원자 목록 조회 (게시자)
export const getApplicants = (recruitId) =>
  axiosInstance.get(`/api/resumes/${recruitId}/applicants`);

// 지원자 지원서 상세 조회 (게시자)
export const getResumeDetail = (resumeId) =>
  axiosInstance.get(`/api/resumes/${resumeId}/detail`);

// 내 지원서 목록 조회
export const getMyResumes = () =>
  axiosInstance.get("/api/resumes/my");

// 내 지원서 상세 조회
export const getMyResumeDetail = (resumeId) =>
  axiosInstance.get(`/api/resumes/my/${resumeId}`);

// 지원서 작성
export const createResume = (recruitIdOrData, maybeData) => {
  const isObj =
    recruitIdOrData != null &&
    typeof recruitIdOrData === "object" &&
    !Array.isArray(recruitIdOrData);

      const data = isObj ? recruitIdOrData : maybeData || {};
  const recruitId = isObj ? recruitIdOrData.recruitId : recruitIdOrData;

  return axiosInstance.post("/api/resumes", {
    ...data,
    recruitId: Number(recruitId),
  });
};

// 합격 / 불합격 처리
export const updateResumeStatus = (recruitId, resumeId, status) =>
  axiosInstance.patch(
    `/api/v1/recruits/${recruitId}/resumes/${resumeId}/status`,
    { status }
  );

// 모집글 상세 조회 (모집글 제목)
export const getRecruitDetail = (recruitId) =>
  axiosInstance.get(`/api/v1/recruits/${recruitId}`);

  // 마이페이지 정보 조회
export const getMyPageInfo = () => {
  return axiosInstance.get("/api/v1/mypage");
};

