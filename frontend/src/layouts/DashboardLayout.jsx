// src/layouts/DashboardLayout.jsx
import React from "react";
import { Row, Col } from "react-bootstrap";
import Header from "./Header";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
    return (
        <>
            <Row>
                <Header />
            </Row>
            <Row>
                <Col md={2}>
                    <Sidebar />
                </Col>
                <Col md={10}>
                    {children}
                </Col>
            </Row>
        </>
    );
};

export default DashboardLayout;
