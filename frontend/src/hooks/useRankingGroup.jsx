import { useState } from 'react';
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

    // HTTP GET request to fetch all ranking groups
    const fetchAllRankingGroups = async () => {
        setLoading(true);
        try {
            const response = await authClient.get('/ranking-group');
            setData(response.data);
        } catch (err) {
            handleError(err); // Handle error
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
            handleError(err); // Handle error
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
            handleError(err); // Handle error
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
            handleError(err); // Handle error
        } finally {
            setLoading(false);
        }
    };

    // HTTP DELETE request to delete a ranking group by ID
    const deleteRankingGroup = async (id) => {
        setLoading(true);
        try {
            await authClient.delete(`/ranking-group/delete/${id}`);
            setData((prevData) => prevData.filter((dt1) => dt1.id !== id)); // Update state after deletion
        } catch (err) {
            handleError(err); // Handle error
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
