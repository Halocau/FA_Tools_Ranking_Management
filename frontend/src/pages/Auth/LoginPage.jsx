// src/Login.js
import React, { useState } from "react";
import "../../assets/css/LoginForm.css";
import Image from "../../assets/image/fsoft_2.jpg";
import Logo from "../../assets/image/logo.png";
import GoogleSvg from "../../assets/image/icons8-google.svg";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { data, error, loading, login } = useLogin();

  const handleLogin = async (e) => {
    try {
      await login(username, password);
    } catch (err) {
      console.log(err);
    }
  };

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
            <h2>RANKING MANAGEMENT</h2>
            <p>Please enter your details</p>
            <form>
              <input
                type="username"
                placeholder="UserName"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
                {showPassword ? (
                  <FaEyeSlash
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  />
                ) : (
                  <FaEye
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  />
                )}
              </div>
              {error && (
                <p className="error" style={{ color: "red", fontSize: "12px" }}>
                  Invalid username or password
                </p>
              )}
              <div className="login-center-options">
                <div className="remember-div">
                  <input type="checkbox" id="remember-checkbox" />
                  <label htmlFor="remember-checkbox">
                    Remember for 30 days
                  </label>
                </div>
                <a href="#" className="forgot-pass-link">
                  <Link to={`/forgetpassword`}>Forget password</Link>
                </a>
              </div>
              <div className="login-center-buttons">
                <button type="button" onClick={() => handleLogin()}>
                  Log In
                </button>
                <button type="button">
                  <img src={GoogleSvg} alt="" />
                  Log In with Google
                </button>
              </div>
            </form>
          </div>
          <p className="login-bottom-p">
            Don't have an account? <Link to={`/register`}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
