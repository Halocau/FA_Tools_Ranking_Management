// AppRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Col, Row } from "react-bootstrap";

// Import các component
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
import ForgetPasswordPage from "./pages/Auth/ForgetPasswordPage";
import NotFound from "./pages/Auth/Page404.jsx";
import ForbiddenPage from "./pages/Auth/Page403.jsx";
import Page500 from "./pages/Auth/Page500.jsx";
import Sidebar from "./layouts/Sidebar";
import Header from "./layouts/Header";
import RankingGroups from "./pages/RankingGroup/RankingGroupsPage.jsx";
import EditRankingGroup from './pages/RankingGroup/EditRankingGroups.jsx';
import ViewRankingGroup from './pages/RankingGroup/ViewRankingGroup.jsx';
import BulkRankingGroup from './pages/RankingGroup/BulkRankingGroup.jsx';
import RankingDecision from "./pages/RankingDecision/RankingDecisionPage.jsx";
import EditRankingDecison from "./pages/RankingDecision/EditRankingDecision.jsx";
import TaskManagement from './pages/TaskManagement/TaskManagementPage.jsx';
import CriteriaManagement from './pages/CriteriaManagement/CriteriaManagementPage.jsx';
import EditCriteria from './pages/CriteriaManagement/EditCriterial.jsx';
import CriteriaConfiguration from "./components/Rankingdecision/CriteriaConfiguration.jsx";
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/homepage" element={<HomePage />} />
      <Route path="/register" element={<SignupPage />} />
      <Route path="/forgetpassword" element={<ForgetPasswordPage />} />
      <Route
        path="/ranking-group"
        element={
          <LayoutWrapper>
            <RankingGroups className="ml-2" />
          </LayoutWrapper>
        }
      />
      <Route
        path="/ranking-group/view/:id"
        element={
          <LayoutWrapper>
            <ViewRankingGroup />
          </LayoutWrapper>
        }
      />
      <Route
        path="/ranking-group/edit/:id"
        element={
          <LayoutWrapper>
            <EditRankingGroup />
          </LayoutWrapper>
        }
      />
      <Route
        path="/ranking-group/bulk/:id"
        element={
          <LayoutWrapper>
            <BulkRankingGroup />
          </LayoutWrapper>
        }
      />
      <Route
        path="/ranking-decision"
        element={
          <LayoutWrapper>
            <RankingDecision className="ml-2" />
          </LayoutWrapper>
        }
      />
      <Route
        path="/ranking-decision/edit/:id"
        element={
          <LayoutWrapper>
            <EditRankingDecison />
          </LayoutWrapper>
        }
      />
      <Route
        path="/task-management"
        element={
          <LayoutWrapper>
            <TaskManagement className="ml-2" />
          </LayoutWrapper>
        }
      />
      <Route
        path="/criteria-management"
        element={
          <LayoutWrapper>
            <CriteriaManagement className="ml-2" />
          </LayoutWrapper>
        }
      />
      <Route
        path="/criteria/edit/:id"
        element={
          <LayoutWrapper>
            <EditCriteria className="ml-2" />
          </LayoutWrapper>
        }
      />
      <Route
        path="/criteria-configuration"
        element={
          <LayoutWrapper>
            <CriteriaConfiguration className="ml-2" />
          </LayoutWrapper>
        }
      />
      <Route path="403" element={<ForbiddenPage />} />
      <Route path="500" element={<Page500 />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// Wrapper layout cho các Route có Sidebar và Header
const LayoutWrapper = ({ children }) => (
  <>
    <Row>
      <Header />
    </Row>
    <Row>
      <Col md={2}>
        <Sidebar />
      </Col>
      <Col md={10}>{children}</Col>
    </Row>
  </>
);

export default AppRoutes;
