import axios from "axios";
import { axiosInstance } from "./axios";

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
};

export default mypageApi;
