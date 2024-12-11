// src/layouts/Header.jsx
import React from "react";
import "../assets/css/Header.css";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import useLogin from "../hooks/useLogin";
const Header = () => {
  // console.log("Name" + localStorage.getItem("userFullName"));
  const userFullName = localStorage.getItem("userFullName") == "null" ? "User" : localStorage.getItem("userFullName");

  const { logout } = useLogin();
  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="header-left">
        <span className="web-title" onClick={() => window.location.href = "/ranking-group"} style={{ cursor: "pointer" }}> FPT Software </span>
      </div>
      <div className="header-right">
        <span className="welcome-text">Welcome, {userFullName}</span>
        {/* <img
          src="https://via.placeholder.com/30"
          alt="UniGate Logo"
          className="logo"
        /> */}
        <FaUserCircle size={30} className="user-icon" />
        <FaSignOutAlt
          size={30}
          className="logout-icon"
          onClick={handleLogout}
          style={{ cursor: "pointer", marginLeft: "20px" }}
        />
      </div>
    </header>
  );
};

export default Header;
