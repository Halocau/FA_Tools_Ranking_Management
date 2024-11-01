import { API_URL } from "../stores/constants";
import axios from "axios";

// Create an Axios instance with default configurations
const http = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// // Attach the token to each request, except for the login endpoint
// http.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('jwtToken');
//         if (token && config.url !== '/login') { // Adjust '/login' to match your login endpoint
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

export default http;