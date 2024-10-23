import React from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

const CustomInput = ({
    type,
    value,
    onChange,
    placeholder,
    backgroundColor,
    textColor,
    borderRadius,
    className,
}) => {
    return (
        <Form.Control
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={className}
            style={{
                backgroundColor,
                color: textColor,
                borderRadius,
                border: '1px solid #ced4da', // Optional: customize border if needed
            }}
        />
    );
};

// Define prop types for the component
CustomInput.propTypes = {
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    backgroundColor: PropTypes.string,
    textColor: PropTypes.string,
    borderRadius: PropTypes.string,
    className: PropTypes.string,
};

// Set default props if needed
CustomInput.defaultProps = {
    placeholder: '',
    backgroundColor: '#f0f0f0',
    textColor: '#333',
    borderRadius: '8px',
    className: '',
};

export default CustomInput;
