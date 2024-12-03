import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import http from "../api/apiClient";
import unauthClient from "../api/baseapi/UnauthorAPI";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth from AuthContext

const useLogin = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await unauthClient.post('/account/login', {
        username,
        password
      });
      const { id, email, role, fullName, token } = response.data;

      // Store the token and other user details in local storage
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('userId', id);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userFullName', fullName);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('user', response.data);
      console.log(response.data);
      setData(response.data); // Store the response data in the component state
      // Navigate to /ranking-groups after successful login
      navigate("/ranking-group");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    login,
  };
};

export default useLogin;
