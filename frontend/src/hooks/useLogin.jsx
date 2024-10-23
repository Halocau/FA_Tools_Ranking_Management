import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import http from '../api/apiClient';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth from AuthContext

const useLogin = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize the useNavigate hook

    const { saveUserInfo } = useAuth();

    const login = async (username, password) => {
        if (!username || !password) {
            setError('Username and password are required');
            return;
        }
        setLoading(true);
        try {
            const response = await http.get('/account/user-and-pass', {
                params: { username, password },
            });
<<<<<<< HEAD
            setData(response.data);
            saveUserData(response.data);
=======
            setData(response.data); // Store the response data in the component state
            // saveUserInfo(response.data); // Save user data in the AuthContext
            // Navigate to /ranking-groups after successful login
>>>>>>> HoangMN
            navigate('/ranking-groups');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };
    return {
        data,
        loading,
        error,
        login,
    };
};

export default useLogin;
