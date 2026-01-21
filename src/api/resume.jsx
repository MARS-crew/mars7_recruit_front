import { axiosInstance } from "./axios";

// 지원자 목록 조회 (게시자)
export const getApplicants = (recruitId) =>
  axiosInstance.get(`/api/resumes/${recruitId}/applicants`);

// 지원서 상세 조회 (게시자)
export const getResumeDetail = (resumeId) =>
  axiosInstance.get(`/api/resumes/${resumeId}/detail`);

// 내 지원서 목록 조회
export const getMyResumes = () =>
  axiosInstance.get("/api/resumes/my");

// 내 지원서 상세 조회
export const getMyResumeDetail = (resumeId) =>
  axiosInstance.get(`/api/resumes/my/${resumeId}`);

// 지원서 작성
export const createResume = (data) =>
  axiosInstance.post("/api/resumes", data);

// 합격 / 불합격 처리
export const updateResumeStatus = (recruitId, resumeId, status) =>
  axiosInstance.patch(
    `/api/v1/recruits/${recruitId}/resumes/${resumeId}/status`,
    { status }
  );