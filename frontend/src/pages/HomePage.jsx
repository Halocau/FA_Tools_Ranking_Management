// src/Login.js
import React, { useState } from 'react';
import '../assets/css/LoginPage.css';
import Image from "../assets/image/image.png";
import Logo from "../assets/image/logo.png";
import GoogleSvg from "../assets/image/icons8-google.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của form
        try {
            const response = await axios.post("http://localhost:9999/login", { username, password });
            if (response.data.success) {
                navigate('/ranking-group'); // Chuyển hướng đến trang ranking group
            } else {
                setError('Invalid username or password');
            }
        } catch (err) {
            console.log(err);
            setError('An error occurred. Please try again.');
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
                        <form onSubmit={handleLogin}>
                            <input type="text" placeholder="UserName" onChange={(e) => setUsername(e.target.value)} value={username} />
                            <div className="pass-input-div">
                                <input type={showPassword ? "text" : "password"} placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} />
                                {showPassword ? <FaEyeSlash onClick={() => { setShowPassword(!showPassword) }} /> : <FaEye onClick={() => { setShowPassword(!showPassword) }} />}
                            </div>
                            {error && <p className="error" style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
                            <div className="login-center-options">
                                <div className="remember-div">
                                    <input type="checkbox" id="remember-checkbox" />
                                    <label htmlFor="remember-checkbox">
                                        Remember for 30 days
                                    </label>
                                </div>
                                <a href="#" className="forgot-pass-link">
                                    <Link to={`/forgotpassword`}>Forgot password</Link>
                                </a>
                            </div>
                            <div className="login-center-buttons">
                                <button type="button">Log In</button>
                                <button type="button">
                                    <img src={GoogleSvg} alt="" />
                                    Log In with Google
                                </button>
                            </div>
                        </form>
                    </div>
                    <p className="login-bottom-p">
                        Don't have an account? <Link to={`/sigup`}>Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
