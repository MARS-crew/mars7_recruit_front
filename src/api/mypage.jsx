import axios from "axios";
import { axiosInstance } from "./axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const mypageApi = {
  /**
   * 마이 페이지 데이터 조회
   */
  mypage: async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/mypage`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            "데이터를 불러오는 중 오류가 발생했습니다.",
        );
      }
      throw error;
    }
  },
  mypageUpdate: async (data) => {
    try {
      const response = await axiosInstance.patch(`/api/v1/mypage/update`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            "데이터를 불러오는 중 오류가 발생했습니다.",
        );
      }
      throw error;
    }
  },
  uploadImage: async (formData) => {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/images/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("에러 데이터:", error.response?.data);
        throw new Error(error.response?.data?.message);
      }
      throw error;
    }
  },
  // api/mypage.js 수정
  mypageUpdatePush: async () => {
    try {
      const response = await axiosInstance.patch(`/api/v1/mypage/push`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "푸시 상태 변경 실패");
      }
      throw error;
    }
  },
};

export default mypageApi;
