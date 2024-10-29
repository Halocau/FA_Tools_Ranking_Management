import { useState } from 'react';
import http from '../api/apiClient';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation on error responses
import authClient from '../api/baseapi/AuthorAPI';

// Custom hook to manage Decision API interactions
const useDecision = () => {
    const navigate = useNavigate(); // Initialize navigation

    // State variables for data, loading status, and error handling
    const [data, setData] = useState(null); // Holds decision data
    const [loading, setLoading] = useState(false); // Tracks loading state
    const [error, setError] = useState(null); // Holds error messages, if any

    // Function to handle errors, including redirects if unauthorized
    const handleError = (err) => {
        if (err.response && err.response.status === 403) {
            navigate('/403'); // Redirect to 403 error page if access is forbidden
        } else {
            setError(err.response?.data || "An error occurred while fetching decisions."); // Set error message
        }
    };

    // Fetches all decisions from the API
    const fetchAllDecisions = async () => {
        setLoading(true);
        try {
            const response = await authClient.get('/decision'); // Adjust API endpoint as needed
            setData(response.data); // Update data state with fetched decisions
            return response.data; // Return data for validation check
        } catch (err) {
            handleError(err); // Handle and log errors
        } finally {
            setLoading(false); // Stop loading after response
        }
    };

    // Fetches a specific decision by ID
    const fetchDecisionById = async (id) => {
        setLoading(true);
        try {
            const response = await authClient.get("/decision/get/${id}"); // Adjust API endpoint as needed
            return response.data; // Returns data directly to calling component
        } catch (err) {
            setError(err.response?.data || "An error occurred while fetching the decision."); // Set error state
        } finally {
            setLoading(false); // Stop loading after response
        }
    };

    // Adds a new decision and refreshes the decision list
    const addDecision = async (newDecision) => {
        setLoading(true);
        try {
            const response = await authClient.post(/decision/add, newDecision); // Adjust API endpoint as needed
            await fetchAllDecisions(); // Refresh list to include new decision
            return response.data; // Returns new decision data to the caller
        } catch (err) {
            setError(err.response?.data || "An error occurred while adding the decision."); // Set error state
        } finally {
            setLoading(false);
        }
    };

    // Updates a specific decision and updates the data state
    const updateDecision = async (id, updatedDecision) => {
        setLoading(true);
        try {
            const response = await authClient.put("/decision/update/${id}, updatedDecision"); // Adjust API endpoint as needed
            setData((prevData) =>
                prevData.map(decision => (decision.id === id ? response.data : decision)) // Update specific decision in state
            );
        } catch (err) {
            const errorMsg = err.response?.data || "An error occurred while updating the decision.";
            setError(errorMsg); // Set error state if update fails
            console.error("Update error:", errorMsg);
        } finally {
            setLoading(false); // Stop loading after response
        }
    };

    // Deletes a decision and updates the data state
    const deleteDecision = async (id) => {
        setLoading(true);
        try {
            await authClient.delete("/decision/delete/${id}"); // Adjust API endpoint as needed
            setData(prevData => prevData.filter((dt) => dt.id !== id)); // Remove deleted decision from state
        } catch (error) {
            setError(error.response?.data || "An error occurred while deleting the decision.");
            console.error("Error deleting decision:", error); // Log delete error
        } finally {
            setLoading(false); // Stop loading after response
        }
    };

    return {
        data, // Contains fetched decision data
        loading, // Indicates loading state
        error, // Contains error messages
        fetchAllDecisions, // Fetches all decisions
        fetchDecisionById, // Fetches a specific decision by ID
        addDecision, // Adds a new decision
        updateDecision, // Updates an existing decision
        deleteDecision, // Deletes a decision
    };
};

export default useDecision;