import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authClient from "../api/baseapi/AuthorAPI";

// Custom hook to manage Ranking Group API interactions
const useRankingGroup = () => {
  const navigate = useNavigate(); // Initialize navigation
  // State variables for data, loading status, and error handling
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0); // All Pages
  const [element, setElements] = useState(0); //All records
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(7);
  const [filter, setFilter] = useState("");

<<<<<<< HEAD
  // Function to handle errors, including redirects if unauthorized
  const handleError = (err) => {
    if (err.response && err.response.status === 403) {
      navigate("/403"); // Redirect to 403 error page if access is forbidden
    } else {
      setError(
        err.response?.data || "An error occurred while fetching ranking groups."
      );
    }
  };
  // Fetches all ranking groups from the API
  const fetchAllRankingGroups = async (page = 0, size = 7, filter = "") => {
    setLoading(true);
    try {
      const response = await authClient.get("/ranking-group", {
        params: {
          page: page + 1,
          size,
          filter,
        },
      });
=======
    // Function to handle errors, including redirects if unauthorized
    const handleError = (err) => {
        if (err.response && err.response.status === 403) {
            navigate('/403'); // Redirect to 403 error page if access is forbidden
        } else {
            setError(err.response?.data || "An error occurred while fetching ranking groups.");
        }
    };
    // Fetches list ranking groups with page and size from the API 
    const fetchRankingGroups = async (page, size) => {
        setLoading(true); // Set loading state to true before making the request
        try {
            const response = await http.get(`/ranking-group?page=${page}&size=${size}`)
                setData(response.data); // Update data state with the response data
        } catch (err) {
            handleError(err); 
        }finally {
            setLoading(false);
            }       
        };
    //  Fetches all ranking groups from the API
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
>>>>>>> quatbt

      setData(response.data);
      setTotal(response.data);
      console.log(response);
    } catch (err) {
      handleError(err);
    } finally {
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
      setError(
        err.response?.data ||
          "An error occurred while fetching the ranking group."
      );
    } finally {
      setLoading(false);
    }
  };

  // Adds a new ranking group and refreshes the group list
  const addRankingGroup = async (newGroup) => {
    setLoading(true);
    try {
      const response = await authClient.post(`/ranking-group/add`, newGroup);
      await fetchAllRankingGroups(page, size, filter);
      return response.data;
    } catch (err) {
      setError(
        err.response?.data ||
          "An error occurred while adding the ranking group."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateRankingGroup = async (id, newGroup) => {
    setLoading(true);
    try {
      console.log(newGroup);
      const response = await authClient.put(
        `/ranking-group/update/${id}`,
        newGroup
      );
      setData((prevData) =>
        prevData.map((group) =>
          group.id === id ? { ...group, ...response.data } : group
        )
      );
    } catch (err) {
      const errorMsg =
        err.response?.data ||
        "An error occurred while updating the ranking group.";
      setError(errorMsg);
      console.error("Update error:", errorMsg);
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  // Deletes a ranking group and updates the data state
  const deleteRankingGroup = async (id) => {
    setLoading(true);
    try {
      await authClient.delete(`/ranking-group/delete/${id}`);
      setData((prevData) => prevData.filter((dt) => dt.id !== id)); // Remove deleted group from state
    } catch (error) {
      setError(
        error.response?.data ||
          "An error occurred while deleting the ranking group."
      );
      console.error("Error deleting group:", error); // Log delete error
    } finally {
      setLoading(false); // Stop loading after response
    }
  };

  return {
    data,
    loading,
    error,
    total,
    page,
    size,
    total,
    filter,
    setTotal,
    setPage,
    setSize,
    setFilter,
    fetchAllRankingGroups,
    fetchRankingGroupById,
    addRankingGroup,
    updateRankingGroup,
    deleteRankingGroup,
  };
=======
    return {
        data, // Contains fetched ranking group data
        loading, // Indicates loading state
        error, // Contains error messages
        fetchRankingGroups,
        fetchAllRankingGroups, // Fetches all ranking groups
        fetchRankingGroupById, // Fetches a specific ranking group by ID
        addRankingGroup, // Adds a new ranking group
        updateRankingGroup, // Updates an existing ranking group
        deleteRankingGroup, // Deletes a ranking group
    };
>>>>>>> quatbt
};

export default useRankingGroup;
