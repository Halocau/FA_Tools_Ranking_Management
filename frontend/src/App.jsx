import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Css
import "bootstrap/dist/css/bootstrap.min.css";
import 'notyf/notyf.min.css';
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
import { NotyfProvider } from "./contexts/NotyfContext";
// Layouts
import DashboardLayout from "./layouts/DashboardLayout";
// Pages
//RankingGroups
import RankingGroups from "./pages/RankingGroup/RankingGroupsPage.jsx";
import EditRankingGroup from './pages/RankingGroup/EditRankingGroups.jsx';
import ViewRankingGroup from './pages/RankingGroup/ViewRankingGroup.jsx';
import BulkRankingGroup from './pages/RankingGroup/BulkRankingGroup.jsx';
//RankingDecision
import RankingDecision from "./pages/RankingDecision/RankingDecisionPage.jsx";
import EditRankingDecision from "./pages/RankingDecision/EditRankingDecision.jsx";
import TaskManagement from './pages/TaskManagement/TaskManagementPage.jsx';
import CriteriaManagement from './pages/CriteriaManagement/CriteriaManagementPage.jsx';

function App() {
  return (
    <NotyfProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/register" element={<SignupPage />} />
            <Route path="/forgetpassword" element={<ForgetPasswordPage />} />

            {/* Ranking Group Routes */}
            <Route
              path="/ranking_group"
              element={
                <DashboardLayout>
                  <RankingGroups />
                </DashboardLayout>
              }
            />
            <Route
              path="/ranking-group/view/:id"
              element={
                <DashboardLayout>
                  <ViewRankingGroup />
                </DashboardLayout>
              }
            />
            <Route
              path="/ranking-group/edit/:id"
              element={
                <DashboardLayout>
                  <EditRankingGroup />
                </DashboardLayout>
              }
            />
            <Route
              path="/ranking-group/bulk/:id"
              element={
                <DashboardLayout>
                  <BulkRankingGroup />
                </DashboardLayout>
              }
            />

            {/* Ranking Decision Routes */}
            <Route
              path="/ranking_decision"
              element={
                <DashboardLayout>
                  <RankingDecision />
                </DashboardLayout>
              }
            />
            <Route
              path="/ranking-decision/edit/:id"
              element={
                <DashboardLayout>
                  <EditRankingDecision />
                </DashboardLayout>
              }
            />

            {/* Task and Criteria Management Routes */}
            <Route
              path="/task_management"
              element={
                <DashboardLayout>
                  <TaskManagement />
                </DashboardLayout>
              }
            />
            <Route
              path="/criteria_management"
              element={
                <DashboardLayout>
                  <CriteriaManagement />
                </DashboardLayout>
              }
            />

            {/* Error Routes */}
            <Route path="403" element={<ForbiddenPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </NotyfProvider>
  );
}

export default App;
