// src/layouts/Header.jsx
import React from "react";
import "../assets/css/Header.css";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <span
          className="web-title"
          onClick={() => (window.location.href = "/ranking_group")}
          style={{ cursor: "pointer" }}
        >
          {" "}
          FPT Software{" "}
        </span>
      </div>
      <div className="header-right">
        <span className="welcome-text">Welcome </span>
        <img
          src="https://via.placeholder.com/30"
          alt="UniGate Logo"
          className="logo"
        />
        <FaUserCircle size={30} className="user-icon" />
      </div>
    </header>
  );
};

export default Header;
