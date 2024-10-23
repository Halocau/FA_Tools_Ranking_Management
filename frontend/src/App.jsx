<<<<<<< HEAD

// src/App.jsx
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './layouts/Sidebar.jsx';
import Header from './layouts/Header.jsx';
import RankingGroups from './pages/RankingGroups';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import TestComponent from './components/TestComponent.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
function LayoutWithSidebar({ children }) {
  return (
    <div className="app-layout">
      <Header /> {/* Header toàn màn hình, đặt bên trên */}
      <div className="layout-body">
        <Sidebar /> {/* Sidebar cố định bên trái */}
        <div className="page-content">{children}</div> {/* Nội dung trang */}
      </div>
    </div>
  );
}

=======
import "./App.css";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
import ForgetPasswordPage from "./pages/Auth/ForgetPasswordPage";
import Sidebar from "./layouts/Sidebar";
import Header from "./layouts/Header";
import RankingGroups from "./pages/RankingGroups";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { AuthProvider } from "./contexts/AuthContext";
import { Col, Row } from "react-bootstrap";
>>>>>>> HoangMN
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
<<<<<<< HEAD
          <Route path="/sigup" element={<SignupPage />} />
          <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
          <Route
            path="/ranking-groups"
            element={
              <LayoutWithSidebar>
                <RankingGroups />
              </LayoutWithSidebar>
            }
          />
          <Route path="/test" element={<TestComponent />} />
=======
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/forgetpassword" element={<ForgetPasswordPage />} />
          <Route path="/ranking_group" element={
            <>
              <Row><Header /></Row>
              <Row>
                <Col md={2}><Sidebar /></Col>

                <Col md={10} ><RankingGroups className="ml-2" /></Col>
              </Row>
            </>} />
>>>>>>> HoangMN
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
