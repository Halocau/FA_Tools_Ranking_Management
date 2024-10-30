import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authClient from "../api/baseapi/AuthorAPI";

const TaskList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false); // Indicates loading state during API requests
  const [error, setError] = useState(null);

  // Handles errors, including redirecting if unauthorized access occurs
  const handleError = (err) => {
    if (err.response && err.response.status === 403) {
      navigate("/403");
    } else {
      setError(
        err.response?.data || "An error occurred while processing your request."
      );
    }
  };

  // Fetches all task from the API
  const fetchAllTasks = async () => {
    setLoading(true); // Sets loading state to true during the request
    try {
      const response = await authClient.get("/api/task");
      setData(response.data);
      return response.data;
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetches a specific Task by ID from the API
  const fetchTaskById = async (id) => {
    setLoading(true);
    try {
      const response = await authClient.get(`/api/task/get/${id}`);
      return response.data;
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    data, // Fetched decision data
    loading,
    error,
    fetchAllTasks,
    fetchTaskById,
  };
};

export default TaskList;
