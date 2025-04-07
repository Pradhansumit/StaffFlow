import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor to handle token expiry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry // prevent infinite loop
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refresh_token: refreshToken },
        );

        const newAccessToken = res.data.access_token;

        // Save new access token
        localStorage.setItem("access_token", newAccessToken);

        // Update Authorization header & retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token invalid. Logging out.");
        localStorage.clear(); // Or selectively remove tokens
        window.location.href = "/login"; // or navigate
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
