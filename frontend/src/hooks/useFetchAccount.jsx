import { useState, useEffect } from 'react';
import http from '../api/apiClient'; // Ensure this points to the correct apiClient.js file

const useFetchAccounts = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAccounts = async () => {
            setLoading(true);
            try {
                const response = await http.get('/account/all');
                setData(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    return { data, loading, error };
};

export default useFetchAccounts;
