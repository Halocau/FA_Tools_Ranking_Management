import { useState } from 'react';
import http from '../api/apiClient';

// Custom hook for Ranking Group API
const useRankingGroup = () => {
    // State for API data, loading, and error handling
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // HTTP GET request to fetch all ranking groups
    const fetchAllRankingGroups = async () => {
        setLoading(true);
        try {
            const response = await http.get('/ranking-group/get');
            setData(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // HTTP GET request to fetch a ranking group by ID
    const fetchRankingGroupById = async (id) => {
        setLoading(true);
        try {
            const response = await http.get(`/ranking-group/get/${id}`);
            setData(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // HTTP POST request to add a ranking group
    const addRankingGroup = async (id, newGroup) => {
        setLoading(true);
        try {
            const response = await http.post(`/ranking-group/add/${id}`, newGroup);
            setData(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // HTTP PUT request to update a ranking group by ID
    const updateRankingGroup = async (id, updatedGroup) => {
        setLoading(true);
        try {
            const response = await http.put(`/ranking-group/update/${id}`, updatedGroup);
            setData(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // HTTP DELETE request to delete a ranking group by ID
    const deleteRankingGroup = async (id) => {
        setLoading(true);
        try {
            await http.delete(`/ranking-group/delete/${id}`);
            setData(null); // Optionally, you can clear the data after deleting
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // Return the data and functions to be used in components
    return {
        data,
        loading,
        error,
        fetchAllRankingGroups,
        fetchRankingGroupById,
        addRankingGroup,
        updateRankingGroup,
        deleteRankingGroup,
    };
};

export default useRankingGroup;
