import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
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
      const { id, email, role, fullName, token, refreshToken } = response.data;

      // Store the token and other user details in local storage
      localStorage.setItem('accessToken', token);
      localStorage.setItem('userId', id);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userFullName', fullName);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('user', response.data);
      localStorage.setItem('refreshToken', refreshToken);
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

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userFullName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    window.location.href = "/";
  }

  return {
    data,
    loading,
    error,
    login,
    logout
  };
};

export default useLogin;
