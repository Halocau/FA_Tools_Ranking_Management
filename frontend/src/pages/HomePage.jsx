import React from "react";
import { Col, Row } from "react-bootstrap";
import Sidebar from "../layouts/Sidebar";
import HomeNavbar from "../layouts/HomeNavbar";

const HomePage = () => {
  return (
    <div>
      <Headers />
      <Row>
        <Col md={2} style={{ height: "100vh" }}>
          <Sidebar />
        </Col>
        <Col md={10}></Col>
      </Row>
    </div>
  );
};

export default HomePage;
