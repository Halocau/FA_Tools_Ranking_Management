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

  const [page, setPage] = useState(0); // 0-indexed for DataGrid
  const [size, setSize] = useState(7); // Default page size
  const [totalPage, setTotalPage] = useState(0);
  const [totalElement, setTotalElement] = useState(0);

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
  // Fetches list ranking groups with page and size from the API
  const fetchRankingGroupPaging = async (page, size) => {
    setLoading(true);
    try {
      const response = await api.get(
        `/ranking-groups?page=${page + 1}&size=${size}`
      ); // Adjust page to 1-indexed for API
      const data = response.data;
      setGroups(data.result);
      setTotalPage(data.pageInfo.total); // Total number of pages
      setTotalElement(data.pageInfo.element); // Total number of elements in the database
    } catch (error) {
      console.error("Error fetching ranking groups:", error);
    } finally {
      setLoading(false);
    }
  };


  //  Fetches all ranking groups from the API
  const fetchAllRankingGroups = async () => {
    setLoading(true);
    try {
      const response = await authClient.get("/ranking-group");
      setData(response.data);
      return response.data;
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
      await fetchAllRankingGroups();
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

  // Deletes a ranking group and updates the data state
  const deleteRankingGroup = async (id) => {
    setLoading(true);
    try {
      await authClient.delete(`/ranking-group/delete/${id}`);
      setData((prevData) => prevData.filter((dt) => dt.id !== id));
    } catch (error) {
      setError(
        error.response?.data ||
          "An error occurred while deleting the ranking group."
      );
      console.error("Error deleting group:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    page,
    size,
    totalPage,
    totalElement,
    setPage,
    setSize,
    fetchRankingGroupPaging,
    fetchAllRankingGroups,
    fetchRankingGroupById,
    addRankingGroup,
    updateRankingGroup,
    deleteRankingGroup,
  };
};

export default useRankingGroup;
