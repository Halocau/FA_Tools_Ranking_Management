import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router';
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

    const navigate = useNavigate();
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
                        <div style={{ cursor: 'pointer', color: 'black', fontWeight: 'bold', marginBottom: '10px' }} onClick={() => navigate('/ranking-groups')}>Ranking Group List</div>
                        <div style={{ cursor: 'pointer', color: 'black' }} onClick={() => navigate('/ranking-decision')}>Ranking Decision List</div>
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

