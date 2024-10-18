// src/Login.js
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import useLogin from '../../hooks/useLogin';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/LoginForm.css';
const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorLogin, setErrorLogin] = useState(null);

    const navigate = useNavigate();
    const { data, loading, error, login } = useLogin();

    const handleLogin = async (e) => {
        try {
            e.preventDefault();
            await login(username, password);
            navigate('/ranking-groups');
        } catch (err) {
            setErrorLogin(err);
        }
    };

    return (
        <>
            <Row className="justify-content-md-center mt-5">
                <Col md={6}>
                    <Form onSubmit={handleSubmit}>
                        <h3 className="text-center mb-4">Login</h3>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
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

                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Remember me" />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100" onClick={handleLogin}>
                            Submit
                        </Button>

                        <p className="forgot-password text-right mt-3">
                            Don't have an account? <a href="/register">Sign Up</a>
                        </p>
                    </Form>
                </Col>
            </Row>
        </>
    );
};

export default LoginForm;
