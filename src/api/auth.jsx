import axios from "axios";
import { axiosInstance } from "./axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const authApi = {
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
        const errorMessage =
          error.response?.data?.error?.message || "회원가입 실패";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  /**
   * 회원가입 사진 저장 API
   */
  signupImage: async (formData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/images/signup/profile`,
        formData,
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
  /**
   * 아이디 중복확인 API
   */
  checkId: async (data) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/auth/check-id?usersId=${data.usersId}`,
      );
      return response.data;
    } catch (error) {
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
      throw error;
    }
  },
  /**
   * 로그아웃
   */
  // src/api/auth.jsx
  logout: async () => {
    try {
      const response = await axiosInstance.post(`/api/v1/auth/logout`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 비밀번호 변경 API
   */
  changePassword: async (data) => {
    try {
      const response = await axiosInstance.patch(
        `/api/v1/mypage/password`,
        data,
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
   * 토큰 재발급
   */
refreshToken: async (refreshToken) => {
  try {
   
    const response = await axios.post(`${API_BASE_URL}/api/v1/auth/reissue`, {
      refreshToken: refreshToken,
    });
    return response.data.data; 
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || '토큰 갱신 중 오류가 발생했습니다.'
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
      const response = await axiosInstance.delete("/api/v1/auth");
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
