import axios from "axios";

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
    const token = localStorage.getItem("jwtToken");
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
  (error) => {
    // Handle specific response errors globally
    if (error.response) {
      const { status } = error.response;

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
