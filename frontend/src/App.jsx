import "./App.css";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
import ForgetPasswordPage from "./pages/Auth/ForgetPasswordPage";
import Sidebar from "./layouts/Sidebar";
import Header from "./layouts/Header";
import RankingGroups from "./pages/RankingGroupsPage.jsx";
import EditRankingGroup from './pages/EditRankingGroups'; // Import EditRankingGroup
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { AuthProvider } from "./contexts/AuthContext";
import { Col, Row } from "react-bootstrap";
import NotFound from "./pages/404NotFound.jsx";
import ForbiddenPage from "./pages/403Forbidden.jsx"; // Thêm import cho trang 403

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/forgetpassword" element={<ForgetPasswordPage />} />
          <Route
            path="/ranking_group"
            element={
              <>
                <Row>
                  <Header />
                </Row>
                <Row></Row>
                <Row>
                  <Col md={2}>
                    <Sidebar />
                  </Col>
                  <Col md={10}>
                    <RankingGroups className="ml-2" />
                  </Col>
                </Row>
              </>
            }
          />
          {/* Thêm route cho trang chỉnh sửa */}
          <Route
            path="/ranking-group/edit/:id"
            element={
              <>
                <Row>
                  <Header />
                </Row>
                <Row>
                  <Col md={2}>
                    <Sidebar />
                  </Col>
                  <Col md={10}>
                    <EditRankingGroup /> {/* Chuyển sang sử dụng EditRankingGroup */}
                  </Col>
                </Row>
              </>
            }
          />
          <Route path="403" element={<ForbiddenPage />} /> {/* Route cho trang 403 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
