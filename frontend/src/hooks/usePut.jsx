import { useState } from 'react';
import http from './apiClient'; // Adjust the import path as necessary

const usePut = (url) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const putData = async (body) => {
        setLoading(true);
        try {
            const response = await http.put(url, body);
            setData(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return { data, error, loading, putData };
};

export default usePut;
