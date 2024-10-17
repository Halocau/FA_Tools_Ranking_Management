// src/hooks/useLogin.js
import { useState } from 'react';
import http from '../api/apiClient';

const useLogin = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (username, password) => {
        setLoading(true);
        try {
            const response = await http.get('/account/user-and-pass', {
                params: {
                    username,
                    password,
                },
            });
            setData(response.data); // Store the response data
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
