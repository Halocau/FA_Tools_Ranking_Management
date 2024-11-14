import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import http from "../api/apiClient";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth from AuthContext

const useLogin = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const { saveUserInfo } = useAuth();

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await http.post('/account/login', {
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

      setData(response.data); // Store the response data in the component state
      saveUserInfo(response.data); // Save user data in the AuthContext
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
