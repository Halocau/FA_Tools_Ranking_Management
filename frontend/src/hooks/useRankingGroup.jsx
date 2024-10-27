import { useState } from 'react';
import http from '../api/apiClient';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
// import http from '../api/apiClient';
import authClient from '../api/baseapi/AuthorAPI';


// Custom hook for Ranking Group API
const useRankingGroup = () => {
    const navigate = useNavigate(); // Initialize navigate

    // State for API data, loading, and error handling
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to handle the API error response
    const handleError = (err) => {
        if (err.response && err.response.status === 403) {
            navigate('/403'); // Redirect to 403 page
        } else {
            setError(err); // Set other errors
        }
    };

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
            const response = await authClient.get(`/ranking-group/get/${id}`);
            // return response.data; // Return data to the calling component
            setData(response.data);
        } catch (err) {
            setError(err.response?.data || "An error occurred while fetching the ranking group.");
        } finally {
            setLoading(false);
        }
    };

    const addRankingGroup = async (newGroup) => {
        setLoading(true);
        try {
            const response = await authClient.post(`/ranking-group/add`, newGroup);
            await fetchAllRankingGroups(); // Refresh the list after adding
            // return response.data;
            setData(response.data);
        } catch (err) {
            setError(err.response?.data || "An error occurred while adding the ranking group.");
        } finally {
            setLoading(false);
        }
    };

    const updateRankingGroup = async (id, updatedGroup) => {
        setLoading(true);
        try {
            const response = await authClient.put(`/ranking-group/update/${id}`, updatedGroup);
            setData((prevData) =>
                prevData.map(group => (group.id === id ? response.data : group))
            );
            // return response.data;
            setData(response.data);
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
            await authClient.delete(`/ranking-group/delete/${id}`);
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
