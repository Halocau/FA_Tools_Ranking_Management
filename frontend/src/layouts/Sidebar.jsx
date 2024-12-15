import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import {
  Home,
  Settings,
  Group,
  People,
  Report,
  Work,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import { useLocation } from "react-router-dom"; // Dùng để lấy đường dẫn hiện tại
import "../assets/css/Sidebar.css";

const Sidebar = () => {
  const [openLogWork, setOpenLogWork] = useState(true); // Mặc định mở menu
  const location = useLocation(); // Lấy đường dẫn hiện tại

  const toggleLogWork = () => {
    setOpenLogWork(!openLogWork);
  };

  // Kiểm tra mục con nào đang được chọn
  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar d-flex flex-column bg-light">
      <Nav defaultActiveKey="/home" className="flex-column">
        {/* Log Work with expandable submenu */}
        <Nav.Link onClick={toggleLogWork}>
          <Work className="me-2" />
          Ranking Management {openLogWork ? <ExpandLess /> : <ExpandMore />}
        </Nav.Link>
        {openLogWork && (
          <div className="submenu ms-4">
            <Nav.Link
              href="/ranking-group"
              className={isActive("/ranking-group") ? "active" : ""}
            >
              Ranking Group List
            </Nav.Link>
            <Nav.Link
              href="/ranking-decision"
              className={isActive("/ranking-decision") ? "active" : ""}
            >
              Ranking Decision List
            </Nav.Link>
            <Nav.Link
              href="/task-management"
              className={isActive("/task-management") ? "active" : ""}
            >
              Task Management
            </Nav.Link>
            <Nav.Link
              href="/criteria-management"
              className={isActive("/criteria-management") ? "active" : ""}
            >
              Criteria Management
            </Nav.Link>
          </div>
        )}

        <Nav.Link href="#reports">
          <Report className="me-2" /> Reports
        </Nav.Link>
        <Nav.Link href="#settings">
          <Settings className="me-2" /> Settings
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
