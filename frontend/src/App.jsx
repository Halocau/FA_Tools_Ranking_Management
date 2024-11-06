import "./App.css";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Cssss
import "bootstrap/dist/css/bootstrap.min.css";
// Home
import HomePage from "./pages/HomePage";
// Auth
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
import ForgetPasswordPage from "./pages/Auth/ForgetPasswordPage";
import NotFound from "./pages/Auth/Page404.jsx";
import ForbiddenPage from "./pages/Auth/Page403.jsx";
// Contexts
import { AuthProvider } from "./contexts/AuthContext";
// Layouts
import Sidebar from "./layouts/Sidebar";
import Header from "./layouts/Header";
import RankingGroups from "./pages/Auth/RankingGroupsPage.jsx";
import RankingDecision from "./pages/Auth/RankingDecisionPage.jsx";
import EditRankingGroup from "./pages/Auth/EditRankingGroups.jsx"; // Import EditRankingGroup
import TaskManagement from "./pages/Auth/TaskManagementPage.jsx";
import CriteriaManagement from "./pages/Auth/CriteriaManagementPage.jsx";
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
          {/* Ranking Group */}
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
                    <EditRankingGroup />{" "}
                    {/* Chuyển sang sử dụng EditRankingGroup */}
                  </Col>
                </Row>
              </>
            }
          />
          {/* View Ranking Group */}
          <Route
            path="/ranking-group/bulk/:id"
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
                    <BulkRankingGroup />
                  </Col>
                </Row>
              </>
            }
          />
          {/*Ranking Decision */}
          <Route
            path="/ranking_decision"
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
                    <RankingDecision className="ml-2" />
                  </Col>
                </Row>
              </>
            }
          />
          {/* Edit Ranking Group */}
          <Route
            path="/ranking-decision/edit/:id"
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
                    <EditRankingDecison />
                  </Col>
                </Row>
              </>
            }
          />
          {/* Task management */}
          <Route
            path="/task_management"
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
                    <TaskManagement className="ml-2" />
                  </Col>
                </Row>
              </>
            }
          />
          {/* Criteria management */}
          <Route
            path="/criteria_management"
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
                    <CriteriaManagement className="ml-2" />
                  </Col>
                </Row>
              </>
            }
          />
          <Route path="403" element={<ForbiddenPage />} />{" "}
          {/* Route cho trang 403 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
