import { useState } from 'react';
import http from '../api/apiClient';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation on error responses
import authClient from '../api/baseapi/AuthorAPI';

// Custom hook to manage Ranking Group API interactions
const useRankingGroup = () => {
    const navigate = useNavigate(); // Initialize navigation

    // State variables for data, loading status, and error handling
    const [data, setData] = useState(null); // Holds ranking group data
    const [loading, setLoading] = useState(false); // Tracks loading state
    const [error, setError] = useState(null); // Holds error messages, if any

    // Function to handle errors, including redirects if unauthorized
    const handleError = (err) => {
        if (err.response && err.response.status === 403) {
            navigate('/403'); // Redirect to 403 error page if access is forbidden
        } else {
            setError(err.response?.data || "An error occurred while fetching ranking groups."); // Set error message
        }
    };

    // Fetches all ranking groups from the API
    const fetchAllRankingGroups = async () => {
        setLoading(true);
        try {
            const response = await authClient.get('/ranking-group');
            setData(response.data); // Update data state with fetched groups
            return response.data; // Return data for validation check
        } catch (err) {
            handleError(err); // Handle and log errors
        } finally {
            setLoading(false); // Stop loading after response
        }
    };

    // Fetches a specific ranking group by ID
    const fetchRankingGroupById = async (id) => {
        setLoading(true);
        try {
            const response = await authClient.get(`/ranking-group/get/${id}`);
            return response.data; // Returns data directly to calling component
        } catch (err) {
            setError(err.response?.data || "An error occurred while fetching the ranking group."); // Set error state
        } finally {
            setLoading(false); // Stop loading after response
        }
    };

    // Adds a new ranking group and refreshes the group list
    const addRankingGroup = async (newGroup) => {
        setLoading(true);
        try {
            const response = await authClient.post(`/ranking-group/add`, newGroup);
            await fetchAllRankingGroups(); // Refresh list to include new group
            return response.data; // Returns new group data to the caller
        } catch (err) {
            setError(err.response?.data || "An error occurred while adding the ranking group."); // Set error state
        } finally {
            setLoading(false);
        }
    };

    // Updates a specific ranking group and updates the data state
    const updateRankingGroup = async (id, updatedGroup) => {
        setLoading(true);
        try {
            const response = await authClient.put(`/ranking-group/update/${id}`, updatedGroup);
            setData((prevData) =>
                prevData.map(group => (group.id === id ? response.data : group)) // Update specific group in state
            );
            setData(response.data); // Sets updated data directly
        } catch (err) {
            const errorMsg = err.response?.data || "An error occurred while updating the ranking group.";
            setError(errorMsg); // Set error state if update fails
            console.error("Update error:", errorMsg);
        } finally {
            setLoading(false); // Stop loading after response
        }
    };

    // Deletes a ranking group and updates the data state
    const deleteRankingGroup = async (id) => {
        setLoading(true);
        try {
            await authClient.delete(`/ranking-group/delete/${id}`);
            setData(prevData => prevData.filter((dt) => dt.id !== id)); // Remove deleted group from state
        } catch (error) {
            setError(error.response?.data || "An error occurred while deleting the ranking group.");
            console.error("Error deleting group:", error); // Log delete error
        } finally {
            setLoading(false); // Stop loading after response
        }
    };

    return {
        data, // Contains fetched ranking group data
        loading, // Indicates loading state
        error, // Contains error messages
        fetchAllRankingGroups, // Fetches all ranking groups
        fetchRankingGroupById, // Fetches a specific ranking group by ID
        addRankingGroup, // Adds a new ranking group
        updateRankingGroup, // Updates an existing ranking group
        deleteRankingGroup, // Deletes a ranking group
    };
};

export default useRankingGroup;
