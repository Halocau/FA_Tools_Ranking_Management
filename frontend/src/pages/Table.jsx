import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

const CustomTable = ({ headers, data, striped = true, bordered = true, hover = true, className = '' }) => {
    return (
        <Table striped={striped} bordered={bordered} hover={hover} className={className}>
            <thead>
                <tr>
                    {headers.map((header, index) => (
                        <th key={index}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {Object.values(row).map((cell, cellIndex) => (
                            <td key={cellIndex}>{cell}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

CustomTable.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string).isRequired,  // Array of column header strings
    data: PropTypes.arrayOf(PropTypes.object).isRequired,    // Array of objects for rows
    striped: PropTypes.bool,  // Option for striped rows
    bordered: PropTypes.bool,  // Option for bordered table
    hover: PropTypes.bool,  // Option for hover effects on rows
    className: PropTypes.string  // Optional custom className
};

CustomTable.defaultProps = {
    striped: true,
    bordered: true,
    hover: true,
    className: ''
};

export default CustomTable;
