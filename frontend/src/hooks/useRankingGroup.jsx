import { useState } from "react";
import http from "../api/apiClient";
import { useNavigate } from "react-router-dom";
import authClient from "../api/baseapi/AuthorAPI";

// Custom hook to manage Ranking Group API interactions
const useRankingGroup = () => {
  const navigate = useNavigate(); // Initialize navigation
  // State variables for data, loading status, and error handling
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageInfo, setPageInfo] = useState({
    page: 1, // Default page is 1
    size: 5, // size of page 5
    total: 0, // All records
  });

  // Function to handle errors, including redirects if unauthorized
  const handleError = (err) => {
    if (err.response && err.response.status === 403) {
      navigate("/403");
    } else {
      setError(
        err.response?.data || "An error occurred while fetching ranking groups."
      );
    }
  };

  //  Fetches all ranking groups from the API
  const fetchAllRankingGroups = async (page = 1, size = 5) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authClient.get("/ranking-group", {
        params: {
          page,
          size,
        },
      });

      setData(response.data);
      setPageInfo({
        page: response.data.pageInfo.page,
        size: response.data.pageInfo.size,
        total: response.data.pageInfo.total,
      });
      return response.data;
    } catch (err) {
      setError(err);
      console.error("An error occurred while fetching ranking groups.", err);
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
    setError(null);
    try {
      const response = await authClient.post(`/ranking-group/add`, newGroup);
      await fetchAllRankingGroups(); // Refresh list after adding
      return response.data;
    } catch (err) {
      handleError(err, "An error occurred while adding the ranking group.");
    } finally {
      setLoading(false);
    }
  };

  // Update a ranking group by ID
  const updateRankingGroup = async (id, updatedGroup) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authClient.put(
        `/ranking-group/update/${id}`,
        updatedGroup
      );
      setData((prevData) =>
        prevData.map((group) =>
          group.id === id ? { ...group, ...response.data } : group
        )
      );
      return response.data;
    } catch (err) {
      handleError(err, "An error occurred while updating the ranking group.");
    } finally {
      setLoading(false);
    }
  };

  // Deletes a ranking group and updates the data state
  const deleteRankingGroup = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await authClient.delete(`/ranking-group/delete/${id}`);
      setData((prevData) => prevData.filter((group) => group.id !== id));
    } catch (err) {
      handleError(err, "An error occurred while deleting the ranking group.");
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    pageInfo,
    fetchAllRankingGroups,
    fetchRankingGroupById,
    addRankingGroup,
    updateRankingGroup,
    deleteRankingGroup,
  };
};

export default useRankingGroup;
