// src/Signup.js
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Image from "../../assets/image/image.png";
import Logo from "../../assets/image/logo.png";
import GoogleSvg from "../../assets/image/icons8-google.svg";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import { Link } from "react-router-dom";

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Thêm trạng thái cho Confirm Password

  return (
    <div className="login-main">
      <div className="login-left">
        <img src={Image} alt="" />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src={Logo} alt="" />
          </div>
          <div className="login-center">
            <h2>Welcome back!</h2>
            <p>Please enter your details</p>
            <form>
              <input type="username" placeholder="Username" />
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                />
                {showPassword ? (
                  <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <FaEye onClick={() => setShowPassword(!showPassword)} />
                )}
              </div>
              <div className="pass-input-div">
                <input
                  type={showConfirmPassword ? "text" : "password"} // Sử dụng trạng thái riêng cho Confirm Password
                  placeholder="Confirm Password"
                />
                {showConfirmPassword ? (
                  <FaEyeSlash onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                ) : (
                  <FaEye onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                )}
              </div>
              <div className="login-center-buttons">
                <Link to={`/`}>
                  <button type="button">Sign up</button>
                </Link>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignupForm;
