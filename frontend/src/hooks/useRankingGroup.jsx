import { useState } from 'react';
import http from '../api/apiClient';
import { useNavigate } from 'react-router-dom';
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
            setError(err.response?.data || "An error occurred while fetching ranking groups.");
        }
    };
    // Fetches all ranking groups from the API
    const fetchAllRankingGroups = async () => {
        setLoading(true);
        try {
            const response = await authClient.get('/ranking-group');
            setData(response.data);
            return response.data;
        } catch (err) {
            handleError(err);
        }
        finally {
            setLoading(false);
        }
    };
    // Fetches a specific ranking group by ID
    const fetchRankingGroupById = async (id) => {
        setLoading(true);
        try {
            const response = await authClient.get(`/ranking-group/get/${id}`);
            return response.data;
        } catch (err) {
            setError(err.response?.data || "An error occurred while fetching the ranking group.");
        } finally {
            setLoading(false);
        }
    };

    // Adds a new ranking group and refreshes the group list
    const addRankingGroup = async (newGroup) => {
        setLoading(true);
        try {
            const response = await authClient.post(`/ranking-group/add`, newGroup);
            await fetchAllRankingGroups();
            return response.data;
        } catch (err) {
            setError(err.response?.data || "An error occurred while adding the ranking group.");
        } finally {
            setLoading(false);
        }
    };

    const updateRankingGroup = async (id, newGroup) => {
        setLoading(true);
        try {
            console.log(newGroup)
            const response = await authClient.put(`/ranking-group/update/${id}`, newGroup);
            setData((prevData) =>
                prevData.map((group) =>
                    group.id === id ? { ...group, ...response.data } : group
                )
            );
        } catch (err) {
            const errorMsg = err.response?.data || "An error occurred while updating the ranking group.";
            setError(errorMsg);
            console.error("Update error:", errorMsg);
        } finally {
            setLoading(false);
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


// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import authClient from '../api/baseapi/AuthorAPI';

// const useRankingGroup = () => {
//     const navigate = useNavigate();
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     // Function to handle errors with optional redirection if unauthorized
//     const handleError = (err, defaultMessage) => {
//         if (err.response?.status === 403) {
//             navigate('/403');
//         } else {
//             setError(err.response?.data || defaultMessage);
//         }
//     };

//     // Fetches all ranking groups from the API
//     const fetchAllRankingGroups = async () => {
//         setLoading(true);
//         setError(null);  // Reset previous errors
//         try {
//             const response = await authClient.get('/ranking-group');
//             setData(response.data);
//             return response.data;
//         } catch (err) {
//             handleError(err, "An error occurred while fetching ranking groups.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Fetches a specific ranking group by ID
//     const fetchRankingGroupById = async (id) => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await authClient.get(`/ranking-group/get/${id}`);
//             return response.data;
//         } catch (err) {
//             handleError(err, "An error occurred while fetching the ranking group.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Adds a new ranking group
//     const addRankingGroup = async (newGroup) => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await authClient.post(`/ranking-group/add`, newGroup);
//             await fetchAllRankingGroups();  // Refresh group list after adding new group
//             return response.data;
//         } catch (err) {
//             handleError(err, "An error occurred while adding the ranking group.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Updates a specific ranking group by ID
//     const updateRankingGroup = async (id, updatedGroup) => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await authClient.put(`/ranking-group/update/${id}`, updatedGroup);
//             setData((prevData) =>
//                 prevData.map((group) => group.id === id ? { ...group, ...response.data } : group)
//             );
//             return response.data;
//         } catch (err) {
//             handleError(err, "An error occurred while updating the ranking group.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Deletes a specific ranking group by ID
//     const deleteRankingGroup = async (id) => {
//         setLoading(true);
//         setError(null);
//         try {
//             await authClient.delete(`/ranking-group/delete/${id}`);
//             setData((prevData) => prevData.filter((group) => group.id !== id));
//         } catch (err) {
//             handleError(err, "An error occurred while deleting the ranking group.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return {
//         data,
//         loading,
//         error,
//         fetchAllRankingGroups,
//         fetchRankingGroupById,
//         addRankingGroup,
//         updateRankingGroup,
//         deleteRankingGroup,
//     };
// };
    
// export default useRankingGroup;
