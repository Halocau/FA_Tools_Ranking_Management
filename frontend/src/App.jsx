import "./App.css";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
import ForgetPasswordPage from "./pages/Auth/ForgetPasswordPage";
import Sidebar from "./layouts/Sidebar";
import Header from "./layouts/Header";
import RankingGroups from "./pages/Auth/RankingGroupsPage.jsx";
import RankingDecision from "./pages/Auth/RankingDecisionPage.jsx";
import EditRankingGroup from './pages/Auth/EditRankingGroups.jsx'; // Import EditRankingGroup
import TaskManagement from './pages/Auth/TaskManagementPage.jsx'
import CriteriaManagement from './pages/Auth/CriteriaManagementPage.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { AuthProvider } from "./contexts/AuthContext";
import { Col, Row } from "react-bootstrap";
import NotFound from "./pages/404NotFound.jsx";
import ForbiddenPage from "./pages/403Forbidden.jsx"; 

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
                    <EditRankingGroup /> 
                  </Col>
                </Row>
              </>
            }
          />
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
          <Route path="403" element={<ForbiddenPage />} /> 
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
