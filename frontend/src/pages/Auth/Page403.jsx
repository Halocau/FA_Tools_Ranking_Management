import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const ForbiddenPage = () => {

    const navigate = useNavigate();
    const handleHome = () => {
        navigate('/');
    }
    return (
        <div style={styles.container}>
            <h1 style={styles.header}>403 Forbidden</h1>
            <p style={styles.message}>You do not have permission to access this page.</p>
            <Link to="/" style={styles.link}>Go Back to Home</Link>
        </div>
    );
};

const styles = {
    container: {
        textAlign: 'center',
        marginTop: '50px',
    },
    header: {
        fontSize: '48px',
        color: '#ff0000',
    },
    message: {
        fontSize: '24px',
    },
    link: {
        fontSize: '20px',
        color: '#007bff',
        textDecoration: 'none',
    },
};

export default ForbiddenPage;
