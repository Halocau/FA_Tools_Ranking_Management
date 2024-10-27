import { useState } from 'react';
import http from '../api/apiClient';

// Custom hook for Ranking Group API
const useRankingGroup = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAllRankingGroups = async () => {
        setLoading(true);
        try {
            const response = await http.get('/ranking-group');
            setData(response.data);
        } catch (err) {
            setError(err.response?.data || "An error occurred while fetching ranking groups.");
        } finally {
            setLoading(false);
        }
    };

    const fetchRankingGroupById = async (id) => {
        setLoading(true);
        try {
            const response = await http.get(`/ranking-group/get/${id}`);
            return response.data; // Return data to the calling component
        } catch (err) {
            setError(err.response?.data || "An error occurred while fetching the ranking group.");
        } finally {
            setLoading(false);
        }
    };

    const addRankingGroup = async (newGroup) => {
        setLoading(true);
        try {
            const response = await http.post('/ranking-group/add', newGroup);
            await fetchAllRankingGroups(); // Refresh the list after adding
            return response.data;
        } catch (err) {
            setError(err.response?.data || "An error occurred while adding the ranking group.");
        } finally {
            setLoading(false);
        }
    };

    const updateRankingGroup = async (id, updatedGroup) => {
        setLoading(true);
        try {
            const response = await http.put(`/ranking-group/update/${id}`, updatedGroup);
            setData((prevData) =>
                prevData.map(group => (group.id === id ? response.data : group))
            );
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data || "An error occurred while updating the ranking group.";
            setError(errorMsg);
            console.error("Update error:", errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const deleteRankingGroup = async (id) => {
        setLoading(true);
        try {
            await http.delete(`/ranking-group/delete/${id}`);
            setData(prevData => prevData.filter((dt) => dt.id !== id));
        } catch (error) {
            setError(error.response?.data || "An error occurred while deleting the ranking group.");
            console.error("Error deleting group:", error);
        } finally {
            setLoading(false);
        }
    };

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
