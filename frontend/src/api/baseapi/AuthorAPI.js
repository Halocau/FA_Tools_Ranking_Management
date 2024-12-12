import axios from "axios";
import AuthAPI from "../AuthAPI";

// Base URL for the backend API
const API_URL = "http://localhost:8080/api";

// Axios instance for authenticated requests
const authClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable cookies if needed
});

// Interceptor to add the Authorization header for authenticated requests
authClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle responses globally
authClient.interceptors.response.use(
  (response) => {
    // You can add any global response handling logic here
    return response; // Pass the successful response back
  },
  async (error) => {
    // Handle specific response errors globally
    const originalRequest = error.config;
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        try {
          console.log("Refreshing token...");
          console.log("Original request:", originalRequest);
          const data = await AuthAPI.refreshToken();
          console.log(data);
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          return authClient(originalRequest);
        } catch (error) {
          console.log("Error refreshing token:", error);
          return Promise.reject(error);
        }
        // return authClient(originalRequest);
      }

      // Forbidden
      if (status === 403) {
        console.error("Access forbidden - Redirecting to 403 page.");
        window.location.href = "/403";
      }

      // Internal Server Error
      if (status === 500) {
        console.error("Server error - Redirecting to 500 page.");
        window.location.href = '/500';
      }
    }

    // Return the error for further handling by the caller
    return Promise.reject(error);
  }
);

export default authClient;
