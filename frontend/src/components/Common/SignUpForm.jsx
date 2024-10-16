// src/Signup.js
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const SignupForm = () => {
    const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add signup logic here
        console.log("Signing up with:", { username, email, password });
    };

    return (
        <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={6}>
          <Form onSubmit={handleSubmit}>
            <h3 className="text-center mb-4">Register</h3>

            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formConfirmBasicPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter confirm password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Register
            </Button>

            <p className="text-center mt-3">
              Already have an account? <a href="/login">Login here</a>
            </p>
          </Form>
        </Col>
      </Row>
    </Container>
    );
};

export default SignupForm;
