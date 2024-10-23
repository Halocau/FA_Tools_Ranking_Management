
// src/App.jsx
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './layouts/Sidebar.jsx';
import Header from './layouts/Header.jsx';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import RankingGroups from './pages/RankingGroups';
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

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
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
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

