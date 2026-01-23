import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const mainApi = {
  /**
   * 메인 페이지 데이터 조회
   */
  mainPage: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/mainpage`);
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

export default mainApi;
