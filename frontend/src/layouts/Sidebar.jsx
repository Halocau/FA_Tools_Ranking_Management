import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import {
  Settings,
  Report,
  Work,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import "../assets/css/Sidebar.css";

const Sidebar = () => {
  const [openLogWork, setOpenLogWork] = useState(false);
  const [openRankingDecision, setOpenRankingDecision] = useState(false);

  const toggleLogWork = () => {
    setOpenLogWork(!openLogWork);
  };

  const toggleRankingDecision = () => {
    setOpenRankingDecision(!openRankingDecision);
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
            
            {/* Ranking Decision List with expandable submenu */}
            <Nav.Link onClick={toggleRankingDecision}>
              Ranking Decision List {openRankingDecision ? <ExpandLess /> : <ExpandMore />}
            </Nav.Link>
            {openRankingDecision && (
              <div className="submenu ms-4">
                <Nav.Link href="/task_management">Task Management</Nav.Link>
                <Nav.Link href="/criteria_management">Criteria Management</Nav.Link>
              </div>
            )}
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
