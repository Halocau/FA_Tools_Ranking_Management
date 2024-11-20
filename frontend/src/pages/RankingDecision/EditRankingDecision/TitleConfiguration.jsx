import React, { useEffect, useState } from 'react';
import { MdDeleteForever } from 'react-icons/md';
// MUI
import {
    InputAdornment, Box, Button, Typography, TextField, Modal, IconButton, Select, MenuItem, Table, TableHead, TableBody, TableCell, TableRow
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import CircleIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Stepper, Step, StepButton } from '@mui/material';

const TitleConfiguration = ({ criteria, title, rankTitle, decisionStatus, page, pageSize, goToNextStep, showErrorMessage }) => {
    const [columnsTitle, setColumnsTitle] = useState([]);
    const [rows, setRows] = useState([]);

    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        // Kiểm tra xem có bất kỳ ô nào đã được thay đổi không
        const hasAnyChanges = rows.some((row) => {
            return Object.keys(row).some((key) => {
                if (key !== 'id' && key !== 'titleName' && row[key] !== '') {
                    return true; // Nếu có ô nào không rỗng thì có thay đổi
                }
                return false;
            });
        });

        setHasChanges(hasAnyChanges);
    }, [rows]); // Theo dõi sự thay đổi của rows

    // Tạo cấu hình cột và hàng
    useEffect(() => {
        if (criteria && title) {
            // Cột từ tiêu chí
            const criteriaColumns = criteria.map((criteria) => ({
                field: criteria.criteriaName,
                headerName: criteria.criteriaName,
                width: 140,
                editable: true,
                renderCell: (params) => (
                    <Select
                        value={params.value || ''}
                        onChange={(e) => handleCellEditTitleCommit({ id: params.row.id, field: params.field, value: e.target.value })}
                        fullWidth
                        sx={{
                            height: '30px', // Chiều cao của box
                            '.MuiSelect-select': {
                                padding: '4px', // Padding trong box
                            },
                        }}
                    >
                        {rankTitle.map((title, index) => (
                            <MenuItem key={index} value={title}>
                                {title}
                            </MenuItem>
                        ))}
                    </Select>
                ),
            }));

            // Cột cố định
            const fixedColumns = [
                { field: 'titleName', headerName: 'Title Name', width: 100 },
                {
                    field: 'rankScore',
                    headerName: 'Rank Score',
                    width: 100,
                    editable: decisionStatus === 'Draft',
                    align: 'center',
                    headerAlign: 'center',
                }
            ]
            const actionColumn = [
                {
                    field: 'action', headerName: 'Action', width: 130,
                    renderCell: (params) =>
                        decisionStatus === 'Draft' && (
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => handleDeleteRowData(params.row.id)}
                            >
                                <MdDeleteForever />
                            </Button>
                        ),
                },
            ];

            // Tạo hàng dữ liệu
            const updatedRows = title.map((title) => ({
                id: title.titleId,
                titleName: title.titleName,
                rankScore: '',
                ...criteria.reduce((acc, criteria) => {
                    acc[criteria.criteriaName] = '';
                    return acc;
                }, {}),
            }));

            // Cập nhật cột và hàng
            setColumnsTitle([...fixedColumns, ...criteriaColumns, ...actionColumn]);
            setRows(updatedRows);
        }
    }, [criteria, title, decisionStatus]);

    const calculateRankScore = (row) => {
        return criteria.reduce((score, criteria) => {
            const chosenValue = parseInt(row[criteria.criteriaName]) || 0;
            const weight = criteria.weight;
            const numOptions = criteria.numOptions;

            return score + (chosenValue * (weight / numOptions));
        }, 0);
    };

    const handleCellEditTitleCommit = ({ id, field, value }) => {
        setRows((prevRows) => {
            const updatedRows = [...prevRows];
            const rowIndex = updatedRows.findIndex((row) => row.id === id);

            if (rowIndex !== -1) {
                updatedRows[rowIndex][field] = value;

                const currentRow = updatedRows[rowIndex];
                const allCriteriaFilled = criteria.every((criteria) => currentRow[criteria.criteriaName]);

                if (allCriteriaFilled) {
                    updatedRows[rowIndex].rankScore = calculateRankScore(currentRow).toFixed(2);
                } else {
                    updatedRows[rowIndex].rankScore = '';
                }
            }
            return updatedRows;
        });
    };


    // Hàm thêm tiêu chí mới
    const handleAddTitle = () => {
        const newTitle = {
            id: rows.length + 1,
            titleName: 'New Title',
            rankScore: '',
            ...title.reduce((acc, title) => {
                acc[title.titleName] = '';  // Chỗ này sẽ là ô trống cho mỗi tiêu chí mới
                return acc;
            }, {}),
        };
        setRows([...rows, newTitle]);
    };

    const handleDeleteRowData = (id) => {
        setRows((prevRows) => {
            // Tìm chỉ số của hàng cần xóa giá trị
            const rowIndex = prevRows.findIndex((row) => row.id === id);

            if (rowIndex !== -1) {
                // Tạo một bản sao của hàng hiện tại
                const updatedRow = { ...prevRows[rowIndex] };

                // Xóa các giá trị trong các ô, giữ lại id và các thuộc tính cố định
                Object.keys(updatedRow).forEach((key) => {
                    if (key !== 'id' && key !== 'titleName') { // Giữ lại id và titleName (hoặc các cột cố định khác)
                        updatedRow[key] = ''; // Đặt lại giá trị ô
                    }
                });

                // Cập nhật lại hàng trong mảng
                const updatedRows = [...prevRows];
                updatedRows[rowIndex] = updatedRow;

                return updatedRows;
            }

            return prevRows;
        });
    };
    const handleCancelChanges = () => {
        // Đặt lại tất cả các ô trong bảng về giá trị mặc định
        setRows((prevRows) => {
            // Duyệt qua tất cả các hàng và reset giá trị ô (giữ lại id và titleName)
            const resetRows = prevRows.map((row) => {
                const updatedRow = { ...row };
                Object.keys(updatedRow).forEach((key) => {
                    if (key !== 'id' && key !== 'titleName') { // Giữ lại id và titleName (hoặc các cột cố định khác)
                        updatedRow[key] = ''; // Đặt lại giá trị ô
                    }
                });
                return updatedRow;
            });

            return resetRows;
        });
    };

    const handleSaveChanges = () => {
        // Kiểm tra xem tất cả rankScore đã được tính toán chưa
        const allRankScoresCalculated = rows.every(row => row.rankScore && row.rankScore !== '');
        console.log(rows)
        if (!allRankScoresCalculated) {
            showErrorMessage('Tất cả Rank Score phải được tính toán');
            return; // Dừng hàm nếu có hàng chưa tính toán rankScore
        }

        console.log("Tổng weight hợp lệ và tất cả Rank Score đã được tính toán. Lưu dữ liệu...");
        goToNextStep(); // Tiến hành lưu dữ liệu và chuyển sang bước tiếp theo
    };

    return (
        <div>
            <Box sx={{
                width: "100%",
                height: 500,
                marginTop: '10px',
                border: '2px solid black',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                overflow: 'hidden',
            }}>
                <Box sx={{ width: '100%', height: 400, marginTop: '10px' }}>
                    <DataGrid
                        rows={rows}
                        columns={columnsTitle}
                        getRowId={(row) => row.id}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                    />
                    {decisionStatus === 'Draft' && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, marginTop: '20px' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <Button variant="contained" color="success" onClick={handleAddTitle}>
                                    Add Criteria
                                </Button>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                {hasChanges && (
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={handleCancelChanges} // Gọi hàm hủy thay đổi
                                    >
                                        Cancel
                                    </Button>
                                )}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSaveChanges} // Gọi hàm lưu thay đổi
                                >
                                    Save
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>
        </div>
    );
};

export default TitleConfiguration;
