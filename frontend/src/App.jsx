// App.jsx
import "./App.css";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./contexts/AuthContext";
import AppRoutes from "./AppRoutes";
import { NotyfProvider } from "./contexts/NotyfContext";
<<<<<<< HEAD
import 'notyf/notyf.min.css';
=======
// Layouts
import DashboardLayout from "./layouts/DashboardLayout";
// Pages
//RankingGroups
import RankingGroups from "./pages/RankingGroup/RankingGroupsPage.jsx";
import EditRankingGroup from "./pages/RankingGroup/EditRankingGroups.jsx";
import ViewRankingGroup from "./pages/RankingGroup/ViewRankingGroup.jsx";
import BulkRankingGroup from "./pages/RankingGroup/BulkRankingGroup.jsx";
//RankingDecision
import RankingDecision from "./pages/RankingDecision/RankingDecisionPage.jsx";
import EditRankingDecision from "./pages/RankingDecision/EditRankingDecision.jsx";
import EditDecision from "./pages/RankingDecision/EditRankingDecision.jsx";
import TaskManagement from "./pages/TaskManagement/TaskManagementPage.jsx";
import CriteriaManagement from "./pages/CriteriaManagement/CriteriaManagementPage.jsx";
import EditCriteria from "./pages/CriteriaManagement/EditCriterial.jsx";
>>>>>>> parent of e264893 (Update Edit Decision v3)

function App() {
  return (
    <NotyfProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </NotyfProvider>
  );
}

export default App;
