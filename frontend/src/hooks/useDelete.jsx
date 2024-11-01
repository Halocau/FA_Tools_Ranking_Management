import { useState } from 'react';
import http from './apiClient'; // Adjust the import path as necessary

const useDelete = (url) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const deleteData = async () => {
        setLoading(true);
        try {
            const response = await http.delete(url);
            setData(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return { data, error, loading, deleteData };
};

export default useDelete;
