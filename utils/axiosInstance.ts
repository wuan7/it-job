import axios from "axios";
import { cookies } from "next/headers";
// Hàm lấy accessToken từ cookies
const getAccessToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value || null;
};

// Tạo một instance của Axios
const axiosInstance = axios.create({
  baseURL: process.env.BACKEND_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptors cho request để thêm accessToken
axiosInstance.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const cookieStore = await cookies();
    const originalRequest = error.config;
    if (
      error.response?.status === 401 && // Lỗi Unauthorized
      !originalRequest._retry // Để tránh lặp vô hạn
    ) {
      originalRequest._retry = true; // Đánh dấu đã retry

      try {
        // Gọi API để làm mới accessToken
        const refreshToken = cookieStore.get('refreshToken')?.value;
        const refreshResponse = await axios.post(
          `${process.env.BACKEND_URL || "http://localhost:5000/api/v1"}/auth/refresh-token`, // API refresh token
          {refreshToken},
          { withCredentials: true } // Gửi refreshToken từ cookie
        );

        // Lưu accessToken mới vào cookie
        cookieStore.set('accessToken', refreshResponse.data.accessToken, {
          path: '/',
          httpOnly: true,
        });

        // Gửi lại request ban đầu với accessToken mới
        originalRequest.headers['Authorization'] = `Bearer ${refreshResponse.data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Nếu làm mới thất bại, buộc đăng nhập lại
        cookieStore.delete('accessToken');
        cookieStore.delete('refreshToken');
       
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;
