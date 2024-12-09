import React from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import Header from "../../layouts/Header";
import Sidebar from "../../layouts/Sidebar";

const Loading = () => {
  return (
    <>
      {/* Header */}
      <Header />

      {/* Main Content with Sidebar */}
      <Row>
        {/* Sidebar */}
        <Col>
          <Sidebar />
        </Col>

        {/* Loading Animation in the Body */}
        <Col
          md={10}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <div>
            <Spinner
              animation="border"
              role="status"
              style={{ width: "4rem", height: "4rem" }}
            />
            <p
              style={{
                marginTop: "10px",
                fontSize: "1.2rem",
                color: "#6c757d",
              }}
            >
              Loading, please wait...
            </p>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Loading;
