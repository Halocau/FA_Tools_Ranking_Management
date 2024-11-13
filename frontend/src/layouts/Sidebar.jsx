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
import { FaRankingStar } from "react-icons/fa6";
import { MdBookmarkAdded } from "react-icons/md";
import { BiTask } from "react-icons/bi";
import { FaMedal } from "react-icons/fa6";

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
<<<<<<< HEAD
            <Nav.Link href="/ranking_group">
              <FaRankingStar />
              Ranking Group List
            </Nav.Link>
            <Nav.Link href="/ranking_decision">
              <MdBookmarkAdded />
              Ranking Decision List
            </Nav.Link>
            <Nav.Link href="/task_management">
              <BiTask />
              Task Management
            </Nav.Link>
            <Nav.Link href="/criteria_management">
              {" "}
              <FaMedal />
              Criteria Management
            </Nav.Link>
=======
            <Nav.Link href="/ranking-group">Ranking Group List</Nav.Link>
            <Nav.Link href="/ranking-decision">Ranking Decision List</Nav.Link>
            <Nav.Link href="/task-management">Task Managerment</Nav.Link>
            <Nav.Link href="/criteria-management">Criteria Managerment</Nav.Link>
>>>>>>> quatbt
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
