// CustomTable.jsx
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Select, MenuItem, Button, Typography } from '@mui/material';

const CustomTable = ({ columns, data, handleInputChange, handleActionClick, showActions, isEditable }) => {
    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map((column, index) => (
                            <TableCell key={index} sx={{ backgroundColor: 'gray', color: '#fff' }}>
                                {column.label}
                            </TableCell>
                        ))}
                        {showActions && <TableCell>Action</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {columns.map((column, colIndex) => (
                                <TableCell key={colIndex}>
                                    {isEditable && column.isEditable ? (
                                        <TextField
                                            type={column.type || 'text'}
                                            value={row[column.field] || ''}
                                            onChange={(e) => handleInputChange(rowIndex, column.field, e.target.value)}
                                            sx={{ width: column.width || '150px' }}
                                            InputProps={column.type === 'number' && column.showPercentage ? {
                                                endAdornment: <Typography>%</Typography>
                                            } : {}}
                                        />
                                    ) : (
                                        <Typography>{row[column.field]}</Typography>
                                    )}
                                </TableCell>
                            ))}
                            {showActions && (
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleActionClick(rowIndex)}
                                    >
                                        Xóa
                                    </Button>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CustomTable;
