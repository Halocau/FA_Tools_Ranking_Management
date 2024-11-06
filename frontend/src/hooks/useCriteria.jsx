import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authClient from '../api/baseapi/AuthorAPI';

const useCriteria = () => {
    const navigate = useNavigate();

    const [criteriaList, setCriteriaList] = useState([]); // Holds the list of criteria
    const [loading, setLoading] = useState(false); // Indicates loading state during API requests
    const [error, setError] = useState(null); // Stores error messages if any errors occur

    // Handles errors, including redirecting if unauthorized access occurs
    const handleError = (err) => {
        if (err.response && err.response.status === 403) {
            navigate('/403'); // Redirects to a 403 error page if access is forbidden
        } else {
            setError(err.response?.data || "An error occurred while processing your request.");
        }
    };

    // Fetches all criteria from the API
    const fetchAllCriteria = async () => {
        setLoading(true);
        try {
            const response = await authClient.get('/criteria'); // API call to get all criteria
            setCriteriaList(response.data);
            return response.data;
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    // Fetches a specific criterion by ID from the API
    const fetchCriteriaById = async (id) => {
        setLoading(true);
        try {
            const response = await authClient.get(`/criteria/${id}`); // API call to get criterion by ID
            return response.data; // Returns fetched criterion data to the caller
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    // Adds a new criterion and refreshes the criteria list
    const addCriteria = async (newCriteria) => {
        setLoading(true);
        try {
            const response = await authClient.post(`/criteria/add`, newCriteria); // Kiểm tra endpoint này
            setData((prevData) => [...prevData, response.data]); // Cập nhật state sau khi thêm thành công
            return response.data;
        } catch (error) {
            setError(error.response?.data || "An error occurred while adding the criteria.");
            console.error("Error adding criteria:", error);
            throw error; // Ném lỗi ra để có thể bắt trong `handleAddCriteria`
        } finally {
            setLoading(false);
        }
    };
    

    // Updates a specific criterion by ID
    const updateCriteria = async (id, updatedCriteria) => {
        setLoading(true);
        try {
            const response = await authClient.put(`/criteria/${id}`, updatedCriteria); // API call to update criterion
            setCriteriaList(prevList =>
                prevList.map(criteria => (criteria.id === id ? response.data : criteria)) // Update specific criterion in state
            );
            return response.data; // Returns the updated criterion data to the caller
        } catch (err) {
            console.error("Error updating criteria:", err.response?.data);
            setError(err.response?.data || "An error occurred while updating the criterion.");
        } finally {
            setLoading(false);
        }
    };

    // Deletes a criterion by ID
    const deleteCriteria = async (criteriaId) => {
        if (!criteriaId) {
            console.error("Criteria ID is undefined");
            return;
        }
        setLoading(true);
        try {
            await authClient.delete(`/criteria/${criteriaId}`);
            setData((prevData) => prevData.filter((criteria) => criteria.criteriaId !== criteriaId));
        } catch (error) {
            setError(error.response?.data || "An error occurred while deleting the criteria.");
            console.error("Error deleting criteria:", error);
        } finally {
            setLoading(false);
        }
    };
    

    return {
        criteriaList,
        loading,
        error,
        fetchAllCriteria,
        fetchCriteriaById,
        addCriteria,
        updateCriteria,
        deleteCriteria,
    };
};

export default useCriteria;
