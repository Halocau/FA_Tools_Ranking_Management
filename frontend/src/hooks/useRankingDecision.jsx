import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authClient from '../api/baseapi/AuthorAPI';

const useRankingDecision = () => {
    const navigate = useNavigate();

    const [data, setData] = useState(null);  // Holds the decision data retrieved from the API
    const [loading, setLoading] = useState(false);  // Indicates loading state during API requests
    const [error, setError] = useState(null);  // Stores error messages if any errors occur

    // Handles errors, including redirecting if unauthorized access occurs
    const handleError = (err) => {
        if (err.response && err.response.status === 403) {
            navigate('/403');  // Redirects to a 403 error page if access is forbidden
        } else {
            setError(err.response?.data || "An error occurred while processing your request.");
        }
    };

    // Fetches all decisions from the API and updates the data state
    const fetchListAllRankingDecisions = async () => {
        setLoading(true);
        try {
            const response = await authClient.get('/ranking-decision');  // API call to get all decisions
            setData(response.data);
            return response.data;
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    // Fetches a specific decision by ID from the API
    const fetchRankingDecisionById = async (id) => {
        setLoading(true);
        try {
            const response = await authClient.get(`/ranking-decision/get/${id}`);  // API call to get decision by ID
            return response.data;  // Returns fetched decision data to the caller
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    const addRankingDecision = async (newDecision) => {
        setLoading(true);
        // console.log(newDecision)
        try {
            const response = await authClient.post(`/ranking-decision/add`, newDecision);
            await fetchListAllRankingDecisions();  // Refresh the decision list
            return response.data;
        } catch (err) {
            // In ra lỗi chi tiết
            console.error("Error adding ranking decision:", err.response.data);
            setError(err.response?.data || "An error occurred while adding the ranking decision.");
        } finally {
            setLoading(false);
        }
    };


    // Updates a specific decision by ID and updates the data state
    const updateRankingDecision = async (id, updatedDecision) => {
        setLoading(true);
        try {
            const response = await authClient.put(`/ranking-decision/update/${id}`, updatedDecision);  // API call to update decision
            setData(prevData =>
                prevData.map(decision => (decision.id === id ? response.data : decision))  // Updates specific decision in data state
            );
            return response.data;  // Returns the updated decision data to the caller
        } catch (err) {
            const errorMsg = err.response?.data || "An error occurred while updating the ranking decision.";
            setError(errorMsg); // Set error state if update fails
            console.error("Update error:", errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Deletes a decision by ID and removes it from the data state
    const deleteRankingDecision = async (id) => {
        setLoading(true);
        try {
            await authClient.delete(`/ranking-decision/delete/${id}`);  // API call to delete decision
            setData(prevData => prevData.filter((dt) => dt.id !== id));  // Filters out the deleted decision from data state
        } catch (error) {
            setError(error.response?.data || "An error occurred while deleting the ranking decision.");
            console.error("Error deleting group:", error); // Log delete error
        } finally {
            setLoading(false); // Stop loading after response
        }
    };

    return {
        data,
        loading,
        error,
        fetchListAllRankingDecisions,
        fetchRankingDecisionById,
        addRankingDecision,
        updateRankingDecision,
        deleteRankingDecision,
    };
};

export default useRankingDecision;