import axios from 'axios';

// Base URL for the backend API
const API_URL = 'http://localhost:8080/api';

// Axios instance for unauthenticated requests
export const unauthClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Enable cookies if needed
});


// Interceptor to handle responses globally
unauthClient.interceptors.response.use(
    (response) => {
        return response; // Pass the successful response back
    },
    (error) => {
        // Handle specific response errors globally
        if (error.response) {
            const { status } = error.response;

            // Internal Server Error
            if (status === 500) {
                console.error('Server error - Redirecting to 500 page.');
                window.location.href = '/500';
            }
        }

        // Return the error for further handling by the caller
        return Promise.reject(error);
    }
);
