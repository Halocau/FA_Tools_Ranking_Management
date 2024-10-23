import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

const CustomButton = ({ variant, size, content, onClick, className }) => {
    return (
        <Button
            variant={variant}
            size={size}
            onClick={onClick}
            className={className}
        >
            {content}
        </Button>
    );
};

CustomButton.propTypes = {
    variant: PropTypes.string,  // To define button variant like 'primary', 'danger', etc.
    size: PropTypes.oneOf(['sm', 'md', 'lg']),  // Button size can be 'sm', 'md', or 'lg'
    content: PropTypes.string.isRequired,  // The text or content inside the button
    onClick: PropTypes.func,  // Function to handle button clicks
    className: PropTypes.string  // Optional additional CSS classes
};

CustomButton.defaultProps = {
    variant: 'primary',
    size: 'md',
    content: 'Click Me',
    onClick: null,
    className: ''
};

export default CustomButton;
