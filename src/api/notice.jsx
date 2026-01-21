import axios from "axios";
import { axiosInstance } from "./axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const extractList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.notices)) return payload.notices;
  return [];
};

export const noticeApi = {
  /**
   * 알림 목록 조회 API (미읽음 알림만)
   */
  getList: async () => {
    try {
      const response = await axiosInstance.get(
        `${API_BASE_URL}/api/notices`,
      );
      return extractList(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            "알림을 불러오지 못했습니다.",
        );
      }
      throw error;
    }
  },

  /**
   * 알림 읽음 처리 API
   */
  markAsRead: async (noticeId) => {
    try {
      const response = await axiosInstance.patch(
        `${API_BASE_URL}/api/notices/${noticeId}/read`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            "알림 읽음 처리에 실패했습니다.",
        );
      }
      throw error;
    }
  },
};

export default noticeApi;
