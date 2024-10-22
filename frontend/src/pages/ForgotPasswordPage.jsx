import React, { useState } from 'react';
import '../assets/css/LoginPage.css';
import Image from "../assets/image/image.png";
import Logo from "../assets/image/logo.png";
import GoogleSvg from "../assets/image/icons8-google.svg";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState(""); // State lưu email
  const [showPassword, setShowPassword] = useState(false);
  const [codeSent, setCodeSent] = useState(false); // Kiểm tra mã đã được gửi
  const [code, setCode] = useState(""); // State lưu mã
  const [showNewPasswordInput, setShowNewPasswordInput] = useState(false); // Kiểm tra xem có hiển thị nhập mật khẩu mới không
  const [resendMessage, setResendMessage] = useState(""); // Thông báo gửi mã

  const handleSendCode = () => {
    // Logic gửi mã ở đây (nếu cần)
    setCodeSent(true); // Cập nhật trạng thái khi gửi mã
    setResendMessage("Mã đã được gửi thành công!"); // Hiển thị thông báo
  };

  const handleResendCode = () => {
    // Logic gửi lại mã ở đây (nếu cần)
    setResendMessage("Mã đã được gửi lại thành công!"); // Hiển thị thông báo gửi lại mã
  };

  const handleSaveCode = () => {
    if (code) {
      setShowNewPasswordInput(true); // Hiển thị trường nhập mật khẩu mới
      setResendMessage(""); // Bỏ thông báo mã đã được gửi
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
            <h2>Welcome back!</h2>
            <p>Please enter your details</p>
            <form>
              {!codeSent && ( // Nếu chưa gửi mã thì hiển thị trường nhập email
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Cập nhật giá trị email
                />
              )}
              {!codeSent && ( // Hiện liên kết gửi mã chỉ khi chưa gửi mã
                <button type="button" className="forgot-pass-link" onClick={handleSendCode}>
                  Send Code
                </button>
              )}
              {codeSent && resendMessage && ( // Hiển thị thông báo gửi mã thành công
                <p>{resendMessage}</p>
              )}
              {codeSent && !showNewPasswordInput && ( // Hiển thị trường nhập mã khi mã đã được gửi
                <div className="pass-input-div">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)} // Cập nhật giá trị mã
                  />
                  {showPassword ? (
                    <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />
                  ) : (
                    <FaEye onClick={() => setShowPassword(!showPassword)} />
                  )}
                </div>
              )}
              {codeSent && !showNewPasswordInput && ( // Nút resend code
                <div className="login-center-options">
                  <Link to="#" onClick={handleResendCode} className="resend-code-link">
                    Resend Code
                  </Link>
                </div>
              )}
              {codeSent && !showNewPasswordInput && ( // Hiển thị nút lưu mã
                <div className="login-center-buttons">
                  <button type="button" onClick={handleSaveCode}>
                    Save Code
                  </button>
                </div>
              )}
              {showNewPasswordInput && ( // Hiển thị trường nhập mật khẩu mới
                <>
                  <div className="pass-input-div">
                    <input type={showPassword ? "text" : "password"} placeholder="New Password" />
                    {showPassword ? (
                      <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />
                    ) : (
                      <FaEye onClick={() => setShowPassword(!showPassword)} />
                    )}
                  </div>
                  <div className="login-center-buttons">
                    <Link to={`/`}>
                      <button type="button">Save Password</button>
                    </Link>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
