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