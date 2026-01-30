import axios from "axios";
import authApi from "./auth";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 토큰 갱신 중인지 확인하는 플래그
let isRefreshing = false;
// 갱신 대기 중인 요청들을 저장하는 배열
let failedQueue = [];

// 대기 중인 요청들을 처리하는 함수
const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// 요청 인터셉터 설정
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터 설정
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 403 Forbidden이지만 로그인 모달 표시를 스킵해야 하는 요청이면 그대로 실패 처리
    if (error.response?.status === 403 && originalRequest?.skipAuthRequired) {
      return Promise.reject(error);
    }

    // 401 Unauthorized 또는 403 Forbidden 에러 처리 및 재시도하지 않은 요청인 경우
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      if (isRefreshing) {
        // 이미 토큰 갱신 중이면 Promise를 생성하여 대기열에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        // refresh token이 없으면 로그아웃 처리
        processQueue(error, null);
        isRefreshing = false;

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        // 로그인 모달을 띄우기 위한 커스텀 이벤트 발생
        window.dispatchEvent(new CustomEvent('auth:required'));
        return Promise.reject(error);
      }

      try {
        // refresh token으로 새로운 access token 발급 요청
        // 서버 응답 구조에 따라 { data: { accessToken, ... } } 형식이면 수정 필요
        const response = await authApi.refreshToken(refreshToken);
        const { accessToken, refreshToken: newRefreshToken } = response;

        // 새로운 토큰들을 저장
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // 현재 요청의 헤더 업데이트
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // 대기 중인 다른 요청들 모두 처리
        processQueue(null, accessToken);
        isRefreshing = false;

        // 원래 실패했던 요청 재시도
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // refresh token도 만료된 경우 모든 정보 삭제 후 로그인 모달 표시
        processQueue(refreshError, null);
        isRefreshing = false;

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        // 로그인 모달을 띄우기 위한 커스텀 이벤트 발생
        window.dispatchEvent(new CustomEvent('auth:required'));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
