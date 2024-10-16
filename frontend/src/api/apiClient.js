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

// Export the instance
export default http;