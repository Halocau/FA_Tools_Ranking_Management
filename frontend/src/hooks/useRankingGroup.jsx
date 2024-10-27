import { useState } from 'react';
import http from '../api/apiClient';
import authClient from '../api/baseapi/AuthorAPI';
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
            const response = await authClient.get('/ranking-group');
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
            const response = await authClient.get(`/ranking-group/get/${id}`);
            setData(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // HTTP POST request to add a ranking group
    const addRankingGroup = async (newGroup) => {
        setLoading(true);
        try {
            const response = await authClient.post(`/ranking-group/add`, newGroup);
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
            const response = await authClient.put(`/ranking-group/update/${id}`, updatedGroup);
            setData(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // HTTP DELETE request to delete a ranking group by ID
    const deleteRankingGroup = async (id) => {
        try {
            await authClient.delete(`/ranking-group/delete/${id}`);
            setData(groups.filter((dt1) => dt1.id !== id));
        } catch (error) {
            console.error("Error deleting employee:", error);
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
