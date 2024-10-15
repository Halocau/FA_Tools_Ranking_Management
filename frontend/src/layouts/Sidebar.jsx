import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import {
    Home,
    Settings,
    Group,
    People,
    Report,
    Work,
    ExpandMore,
    ExpandLess
} from '@mui/icons-material';
import './Sidebar.css';  // Optionally, for additional styles

const Sidebar = () => {
    const [openLogWork, setOpenLogWork] = useState(false);

    const toggleLogWork = () => {
        setOpenLogWork(!openLogWork);
    };

    return (
        <div className="sidebar d-flex flex-column bg-light">
            <Nav defaultActiveKey="/home" className="flex-column">
                <Nav.Link href="#class-management">
                    <Group className="me-2" /> Class Management
                </Nav.Link>
                <Nav.Link href="#trainee-management">
                    <People className="me-2" /> Trainee Management
                </Nav.Link>
                <Nav.Link href="#trainer-management">
                    <People className="me-2" /> Trainer Management
                </Nav.Link>
                <Nav.Link href="#candidate-management">
                    <Group className="me-2" /> Candidate Management
                </Nav.Link>
                <Nav.Link href="#intern-management">
                    <Work className="me-2" /> Intern Management
                </Nav.Link>

                {/* Log Work with expandable submenu */}
                <Nav.Link onClick={toggleLogWork}>
                    <Work className="me-2" />
                    Log Work {openLogWork ? <ExpandLess /> : <ExpandMore />}
                </Nav.Link>
                {openLogWork && (
                    <div className="submenu ms-4">
                        <Nav.Link href="#log-task">Log Task</Nav.Link>
                        <Nav.Link href="#log-hours">Log Hours</Nav.Link>
                    </div>
                )}

                <Nav.Link href="#reports">
                    <Report className="me-2" /> Reports
                </Nav.Link>
                <Nav.Link href="#settings">
                    <Settings className="me-2" /> Settings
                </Nav.Link>
                <Nav.Link href="#ranking-management">
                    <Work className="me-2" /> Ranking Management
                </Nav.Link>
            </Nav>
        </div>
    );
};

export default Sidebar;
