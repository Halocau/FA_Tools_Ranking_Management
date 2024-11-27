// App.jsx
import "./App.css";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./contexts/AuthContext";
import AppRoutes from "./AppRoutes";
import { NotyfProvider } from "./contexts/NotyfContext";
import 'notyf/notyf.min.css';


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
