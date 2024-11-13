// hooks/useCriteria.js
import { useState } from "react";
import axios from 'axios';

const useCriteria = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAllCriteria = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/criteria');
            return response.data;
        } catch (err) {
            setError("Failed to fetch criteria.");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const addCriteria = async (newCriteria) => {
        setLoading(true);
        try {
            await axios.post('/api/criteria', newCriteria);
        } catch (err) {
            setError("Failed to add criteria.");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteCriteria = async (criteriaId) => {
        setLoading(true);
        try {
            await axios.delete(`/api/criteria/${criteriaId}`);
        } catch (err) {
            setError("Failed to delete criteria.");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        fetchAllCriteria,
        addCriteria,
        deleteCriteria,
    };
};

export default useCriteria;
