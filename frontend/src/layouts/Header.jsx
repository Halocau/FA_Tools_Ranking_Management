// src/layouts/Header.jsx
import React from 'react';
import './Header.css';
import { FaUserCircle } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <span className="web-title">FA Management</span>
      </div>
      <div className="header-right">
        <span className="welcome-text">Welcome Nguyen Minh Cuong (PMBA)</span>
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
