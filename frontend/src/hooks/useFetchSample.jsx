// src/hooks/useFetchData.js
import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const useFetchData = (endpoint, options = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.get(endpoint, options);
                setData(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint, options]);

    return { data, loading, error };
};

export default useFetchData;
