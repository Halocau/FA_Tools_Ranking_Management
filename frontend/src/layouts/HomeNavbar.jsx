import React from "react";
import PropTypes from 'prop-types';
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MessageIcon from "@mui/icons-material/Message";
import SettingsIcon from "@mui/icons-material/Settings";
import RefreshIcon from "@mui/icons-material/Refresh";
import logo from '../assets/image/logo.png';
import { useNavigate } from "react-router-dom"; // If you're using react-router

const HomeNavbar = ({ user }) => {
    const navigate = useNavigate();

    const handleRedirect = (path) => {
        navigate("/login");
    };

    return (
        <Navbar bg="primary" variant="dark" expand="lg" className="custom-navbar">
            <Container fluid>
                {/* Left Section: Logo and Title */}
                <Navbar.Brand onClick={() => navigate("/")} className="d-flex align-items-center">
                    <img
                        src={logo}
                        alt="Logo"
                        width="30"
                        height="30"
                        className="d-inline-block align-top me-2"
                    />
                    FA Management
                </Navbar.Brand>

                {/* Right Section: Conditionally render based on `user` prop */}
                <Nav className="ml-auto d-flex align-items-center">
                    {user ? (
                        <>
                            <span className="navbar-text me-3">
                                Welcome {user.username} ({user.role})
                            </span>
                            <Nav.Link href="#notifications" className="text-white">
                                <NotificationsIcon />
                            </Nav.Link>
                            <Nav.Link href="#messages" className="text-white">
                                <MessageIcon />
                            </Nav.Link>
                            <Nav.Link href="#settings" className="text-white">
                                <SettingsIcon />
                            </Nav.Link>
                            <Nav.Link href="#refresh" className="text-white">
                                <RefreshIcon />
                            </Nav.Link>
                            <Navbar.Text className="ms-3">uniGate</Navbar.Text>
                        </>
                    ) : (
                        <Button variant="light" onClick={handleRedirect}>
                            Login
                        </Button>
                    )}
                </Nav>
            </Container>
        </Navbar>
    );
};

// Prop validation
HomeNavbar.propTypes = {
    user: PropTypes.shape({
        uid: PropTypes.number,
        username: PropTypes.string,
        role: PropTypes.string
    })
};

export default HomeNavbar;
