import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Col, Row } from "react-bootstrap";

// Import LoginPage
import LoginPage from "./pages/Auth/LoginPage";
//Import Loading
import Loading from "./components/Common/LazyLoading";

// Lazy load components
const HomePage = React.lazy(() => import("./pages/HomePage"));
const SignupPage = React.lazy(() => import("./pages/Auth/SignupPage"));
const ForgetPasswordPage = React.lazy(() =>
  import("./pages/Auth/ForgetPasswordPage")
);
const NotFound = React.lazy(() => import("./pages/Auth/Page404"));
const ForbiddenPage = React.lazy(() => import("./pages/Auth/Page403"));
const Page500 = React.lazy(() => import("./pages/Auth/Page500"));
const Sidebar = React.lazy(() => import("./layouts/Sidebar"));
const Header = React.lazy(() => import("./layouts/Header"));
const RankingGroups = React.lazy(() =>
  import("./pages/RankingGroup/RankingGroupsPage")
);
const EditRankingGroup = React.lazy(() =>
  import("./pages/RankingGroup/EditRankingGroups")
);

const BulkRankingGroup = React.lazy(() =>
  import("./pages/RankingGroup/BulkRankingGroup/BulkRankingGroup")
);
const RankingDecision = React.lazy(() =>
  import("./pages/RankingDecision/RankingDecisionPage")
);
const EditRankingDecision = React.lazy(() =>
  import("./pages/RankingDecision/EditRankingDecision/EditRankingDecision")
);
const TaskManagement = React.lazy(() =>
  import("./pages/TaskManagement/TaskManagementPage")
);
const CriteriaManagement = React.lazy(() =>
  import("./pages/CriteriaManagement/CriteriaManagementPage")
);
const EditCriteria = React.lazy(() =>
  import("./pages/CriteriaManagement/EditCriterial")
);
const CriteriaConfiguration = React.lazy(() =>
  import("./pages/RankingDecision/EditRankingDecision/CriteriaConfiguration")
);
const ProtectedRoutes = React.lazy(() =>
  import("./components/Protected/ProtectedRoute")
);

const LayoutWrapper = ({ children }) => (
  <>
    <Row>
      <Suspense>
        <Header />
      </Suspense>
    </Row>
    <Row>
      <Col md={2}>
        <Suspense>
          <Sidebar />
        </Suspense>
      </Col>
      <Col md={10}>{children}</Col>
    </Row>
  </>
);

function AppRoutes() {
  return (
    <Routes>
      {/* Trang Login */}
      <Route path="/" element={<LoginPage />} />

      {/* Trang chính (HomePage) */}
      <Route
        path="/homepage"
        element={
          <Suspense fallback={<Loading />}>
            <ProtectedRoutes>
              <HomePage />
            </ProtectedRoutes>
          </Suspense>
        }
      />

      {/* Đăng ký */}
      <Route
        path="/register"
        element={
          <Suspense fallback={<Loading />}>
            <SignupPage />
          </Suspense>
        }
      />

      {/* Quên mật khẩu */}
      <Route
        path="/forgetpassword"
        element={
          <Suspense fallback={<Loading />}>
            <ForgetPasswordPage />
          </Suspense>
        }
      />

      {/* Quản lý nhóm xếp hạng */}
      <Route
        path="/ranking-group"
        element={
          <Suspense fallback={<Loading />}>
            <ProtectedRoutes>
              <LayoutWrapper>
                <RankingGroups />
              </LayoutWrapper>
            </ProtectedRoutes>
          </Suspense>
        }
      />
      <Route
        path="/ranking-group/edit/:id"
        element={
          <Suspense fallback={<Loading />}>
            <ProtectedRoutes>
              <LayoutWrapper>
                <EditRankingGroup />
              </LayoutWrapper>
            </ProtectedRoutes>
          </Suspense>
        }
      />
      <Route
        path="/ranking-group/bulk/:id"
        element={
          <Suspense fallback={<Loading />}>
            <ProtectedRoutes>
              <LayoutWrapper>
                <BulkRankingGroup />
              </LayoutWrapper>
            </ProtectedRoutes>
          </Suspense>
        }
      />

      {/* Quản lý quyết định xếp hạng */}
      <Route
        path="/ranking-decision"
        element={
          <Suspense fallback={<Loading />}>
            <ProtectedRoutes>
              <LayoutWrapper>
                <RankingDecision />
              </LayoutWrapper>
            </ProtectedRoutes>
          </Suspense>
        }
      />
      <Route
        path="/ranking-decision/edit/:id"
        element={
          <Suspense fallback={<Loading />}>
            <ProtectedRoutes>
              <LayoutWrapper>
                <EditRankingDecision />
              </LayoutWrapper>
            </ProtectedRoutes>
          </Suspense>
        }
      />
      <Route
        path="/ranking-decision/criteria/configuration"
        element={
          <Suspense fallback={<Loading />}>
            <ProtectedRoutes>
              <LayoutWrapper>
                <CriteriaConfiguration />
              </LayoutWrapper>
            </ProtectedRoutes>
          </Suspense>
        }
      />

      {/* Quản lý tác vụ */}
      <Route
        path="/task-management"
        element={
          <Suspense fallback={<Loading />}>
            <ProtectedRoutes>
              <LayoutWrapper>
                <TaskManagement />
              </LayoutWrapper>
            </ProtectedRoutes>
          </Suspense>
        }
      />

      {/* Quản lý tiêu chí */}
      <Route
        path="/criteria-management"
        element={
          <Suspense fallback={<Loading />}>
            <ProtectedRoutes>
              <LayoutWrapper>
                <CriteriaManagement />
              </LayoutWrapper>
            </ProtectedRoutes>
          </Suspense>
        }
      />
      <Route
        path="/criteria/edit/:id"
        element={
          <Suspense fallback={<Loading />}>
            <ProtectedRoutes>
              <LayoutWrapper>
                <EditCriteria />
              </LayoutWrapper>
            </ProtectedRoutes>
          </Suspense>
        }
      />

      {/* Các trang lỗi */}
      <Route
        path="/403"
        element={
          <Suspense fallback={<Loading />}>
            <ForbiddenPage />
          </Suspense>
        }
      />
      <Route
        path="/500"
        element={
          <Suspense fallback={<Loading />}>
            <Page500 />
          </Suspense>
        }
      />
      <Route
        path="*"
        element={
          <Suspense fallback={<Loading />}>
            <NotFound />
          </Suspense>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
