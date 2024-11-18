import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authClient from "../api/baseapi/AuthorAPI";

const useTask = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false); 
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
    setLoading(true); 
    try {
      const response = await authClient.get("/task");
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
      const response = await authClient.get(`/task/get/${id}`);
      return response.data;
    } catch (err) {
      setError(
        err.response?.data ||
          "An error occurred while fetching the ranking group."
      );
    } finally {
      setLoading(false); // Stop loading after response
    }
  };

  // Adds a new Task
  const addTask = async (newTask) => {
    setLoading(true);
    try {
      const response = await authClient.post(`/task/add`, newTask);
      await fetchAllTasks(); // Refresh list to include new group
      return response.data; // Returns new group data to the caller
    } catch (err) {
      setError(
        err.response?.data || "An error occurred while adding the task."
      ); // Set error state
    } finally {
      setLoading(false);
    }
  };

  // Updates Task
  const updateTask = async (id, updatedTask) => {
    setLoading(true);
    try {
      const response = await authClient.put(`/task/update/${id}`, updatedTask);
      await fetchAllTasks(); // Refresh task list to include the updated task
      return response.data; // Return updated task data to the caller
    } catch (err) {
      setError(
        err.response?.data || "An error occurred while updating the task."
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
   setLoading(true);
   try {
     await authClient.delete(`/task/delete/${id}`);
     setData((prevData) => (prevData | []).filter((dt) => dt.id !== id));
     showSuccessMessage("Task deleted successfully!"); 
     await fetchAllTasks(); 
   } catch (error) {
     setError(error.response?.data || "An error occurred while deleting task.");
     console.error("Error deleting task:", error); 
     setLoading(false);
   }
  };

  return {
    data, // Fetched decision data
    loading,
    error,
    fetchAllTasks,
    fetchTaskById,
    addTask,
    updateTask,
    deleteTask,
    setLoading,
    setError
  };
};

export default useTask;
