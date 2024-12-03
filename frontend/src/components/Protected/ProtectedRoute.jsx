import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './../../contexts/AuthContext'; // Adjust the path as needed

const ProtectedRoute = ({ children }) => {

    const user = localStorage.getItem("user");

    return user ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;