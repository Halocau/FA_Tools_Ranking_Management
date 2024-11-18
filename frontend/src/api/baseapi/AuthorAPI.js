import axios from 'axios';

// Base URL for the backend API
const API_URL = 'http://localhost:8080/api';

// Axios instance for authenticated requests
const authClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Enable cookies if needed
});

// Interceptor to add the Authorization header for authenticated requests
authClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default authClient;
