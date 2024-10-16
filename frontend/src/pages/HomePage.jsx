import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Sidebar from '../layouts/Sidebar';

const HomePage = () => {
    return (
        <div>
            <Row >
                <Col md={2} style={{ height: '100vh' }}>
                    <Sidebar />
                </Col>
                <Col md={10}></Col>
            </Row>
        </div>
    )
}

export default HomePage