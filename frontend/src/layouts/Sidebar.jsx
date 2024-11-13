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
import "../assets/css/Sidebar.css";

const Sidebar = () => {
  const [openLogWork, setOpenLogWork] = useState(false);

  const toggleLogWork = () => {
    setOpenLogWork(!openLogWork);
  };

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
            <Nav.Link href="/ranking_group">Ranking Group List</Nav.Link>
            <Nav.Link href="/ranking_decision">Ranking Decision List</Nav.Link>
            <Nav.Link href="/task_management">Task Managerment</Nav.Link>
            <Nav.Link href="/criteria_management">Criteria Managerment</Nav.Link>
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
