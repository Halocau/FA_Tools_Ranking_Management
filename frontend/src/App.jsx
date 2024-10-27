import "./App.css";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
import ForgetPasswordPage from "./pages/Auth/ForgetPasswordPage";
import Sidebar from "./layouts/Sidebar";
import Header from "./layouts/Header";
import RankingGroups from "./pages/RankingGroupsPage.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { AuthProvider } from "./contexts/AuthContext";
import { Col, Row } from "react-bootstrap";
import NotFound from "./pages/404NotFound.jsx";
import Slider from "./layouts/Slider.jsx";
import TestComponent from "./components/TestComponent.jsx";
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
          <Route path="/test" element={<TestComponent />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
