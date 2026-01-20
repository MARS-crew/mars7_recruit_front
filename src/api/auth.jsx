import axios from "axios";
import { axiosInstance } from "./axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const authApi = {
  /**
   * 회원가입 API
   */
  signup: async (data) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/auth/signup`,
        data,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "회원가입 중 오류가 발생했습니다.",
        );
      }
      throw error;
    }
  },

  /**
   * 로그인 API
   */
  login: async (data) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/auth/login`,
        data,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "로그인 중 오류가 발생했습니다.",
        );
      }
      throw error;
    }
  },

  /**
   * 비밀번호 변경 API
   */
  changePassword: async (password, token) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/v1/mypage/password`,
        {
          password,
          resetToken: token,
        },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            "비밀번호 변경 중 오류가 발생했습니다.",
        );
      }
      throw error;
    }
  },

  /**
   * 회원탈퇴 API
   */
  deleteAccount: async () => {
    try {
      const response = await axiosInstance.delete("/api/v1/user");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "회원탈퇴 중 오류가 발생했습니다.",
        );
      }
      throw error;
    }
  },
};

export default authApi;
