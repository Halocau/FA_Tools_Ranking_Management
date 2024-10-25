import { useState } from 'react';
import http from '../api/apiClient';

// Custom hook for Ranking Group API
const useRankingGroup = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAllRankingGroups = async () => {
        setLoading(true);
        try {
            const response = await http.get('/ranking-group');
            setData(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

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

    const addRankingGroup = async (newGroup) => {
        setLoading(true);
        try {
            const response = await http.post(`/ranking-group/add`, newGroup);
            setData(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

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

    const deleteRankingGroup = async (groupId) => {
        setLoading(true);
        try {
            const response = await http.delete(`/ranking-group/delete/${groupId}`);
            return response.data;
        } catch (err) {
            setError(err);
            throw new Error('Failed to delete group');
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
