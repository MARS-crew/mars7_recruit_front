import axios from "axios";
import { axiosInstance } from "./axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const extractList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.recruits)) return payload.recruits;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

export const recruitApi = {
  /**
   * 모집글 전체 조회 API (분야별 필터링)
   */
  getList: async (field = "ALL") => {
    try {
      const params = field && field !== "ALL" ? { field } : undefined;
      const response = await axiosInstance.get(
        `${API_BASE_URL}/api/v1/recruits`,
        { params },
      );
      return extractList(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            "모집글을 불러오지 못했습니다.",
        );
      }
      throw error;
    }
  },

  /**
   * 모집글 키워드 검색 API
   */
  search: async (keyword = "") => {
    try {
      const params = keyword ? { keyword } : undefined;
      const response = await axiosInstance.get(
        `${API_BASE_URL}/api/v1/recruits/search`,
        { params },
      );
      return extractList(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            "모집글을 검색하지 못했습니다.",
        );
      }
      throw error;
    }
  },

  /**
   * 모집글 작성 API
   */
  create: async (data) => {
    try {
      const response = await axiosInstance.post(
        `${API_BASE_URL}/api/v1/recruits`,
        data,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            "모집글 작성에 실패했습니다.",
        );
      }
      throw error;
    }
  },
  /**
   * 모집글 상세 조회 (지원자용)
   */
  getDetail: async (recruitId) => {
    try {
      const response = await axiosInstance.get(
        `${API_BASE_URL}/api/v1/recruits/${recruitId}`,
      );
      return response.data?.data ?? response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "상세 정보를 불러오지 못했습니다.",
        );
      }
      throw error;
    }
  },
  /**
   * 모집글 상세 조회 (게시자용)
   */
  getOwnerDetail: async (recruitId) => {
    try {
      const response = await axiosInstance.get(
        `${API_BASE_URL}/api/v1/recruits/${recruitId}/owner`,
      );
      return response.data?.data ?? response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "게시자 상세 조회에 실패했습니다.",
        );
      }
      throw error;
    }
  },
};

export default recruitApi;