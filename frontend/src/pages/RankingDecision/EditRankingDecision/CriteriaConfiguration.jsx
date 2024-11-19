import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, TextField, Button } from '@mui/material';
import { MdDeleteForever } from 'react-icons/md';

const CriteriaConfiguration = ({ criteria, decisionStatus, page, pageSize, goToNextStep, showErrorMessage }) => {
    const [rows, setRows] = useState([]);

    // Xử lý khi người dùng chỉnh sửa một ô
    const handleCellEditCriteriaCommit = (newRow, oldRow) => {
        const updatedRow = { ...oldRow, ...newRow };
        if (newRow.weight !== oldRow.weight) {
            updatedRow.weight = newRow.weight;
            setRows((prevRows) =>
                prevRows.map((item) =>
                    item.id === updatedRow.id ? updatedRow : item
                )
            );
        }
        return updatedRow;
    };

    // Tính tổng weight
    const calculateTotalWeight = () => {
        const totalWeight = rows.reduce((total, row) => total + Number(row.weight || 0), 0);
        return totalWeight;
    };

    // Hàm lưu dữ liệu
    const handleSaveChanges = () => {
        const totalWeight = calculateTotalWeight();
        if (totalWeight === 100) {
            console.log("Tổng weight hợp lệ. Lưu dữ liệu...");
            goToNextStep();
        } else {
            showErrorMessage('Tổng weight phải bằng 100');
        }
    };

    // Thêm tiêu chí mới
    const handleAddCriteria = () => {
        const newCriteria = {
            id: rows.length + 1,
            criteria_name: 'New Criteria',
            weight: 0,
            max_score: 1,
            num_options: 1,
        };
        setRows([...rows, newCriteria]);
    };

    // Xóa một dòng
    const handleDeleteRowData = (id) => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    };

    // Map dữ liệu criteria thành rows
    useEffect(() => {
        if (criteria) {
            const mappedRows = criteria.map((item, index) => ({
                id: item.criteriaId,
                index: index + 1 + (page - 1) * pageSize,
                criteria_name: item.criteriaName,
                weight: item.weight || 0,
                num_options: item.numOptions < 1 ? "0" : item.numOptions,
                max_score: item.maxScore == null ? "" : item.maxScore,
            }));
            setRows(mappedRows);
        }
    }, [criteria, page, pageSize]);

    // Cột của DataGrid
    const columnsCriteria = [
        { field: 'criteria_name', headerName: 'Criteria Name', width: 500 },
        {
            field: 'weight',
            headerName: 'Weight',
            width: 150,
            editable: decisionStatus === 'Draft',
            renderCell: (params) =>
                decisionStatus === 'Draft' ? (
                    <TextField
                        value={params.value || ''}
                        onChange={(e) =>
                            handleCellEditCriteriaCommit(
                                { id: params.row.id, weight: e.target.value },
                                params.row
                            )
                        }
                        variant="outlined"
                        size="small"
                        fullWidth
                        type="number"
                        inputMode="numeric"
                    />
                ) : (
                    params.value
                ),
        },
        { field: 'num_options', headerName: 'No of Options', width: 150 },
        { field: 'max_score', headerName: 'Max Score', width: 150 },
        {
            field: 'action',
            headerName: 'Action',
            width: 200,
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

    return (
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
            overflow: 'hidden', // Loại bỏ thanh cuộn bên ngoài
        }}>
            <Box>
                <DataGrid
                    rows={rows}
                    columns={columnsCriteria}
                    pageSize={pageSize}
                    autoHeight
                    disableSelectionOnClick
                />
                {/* Button criteria */}
                {decisionStatus === 'Draft' && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, marginTop: '20px' }}>
                        {/* Nút Add Criteria ở bên trái */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <Button variant="contained" color="success" onClick={handleAddCriteria}>
                                Add Criteria
                            </Button>
                        </Box>
                        {/* Nút Save và Cancel ở bên phải */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button
                                variant="contained"
                                color="error"
                            // onClick={handleCancelChanges}
                            // disabled={!hasChanges} // Bật/tắt dựa trên trạng thái
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSaveChanges}
                            // disabled={!isSaveButtonEnabled} // Bật/tắt dựa trên trạng thái
                            >
                                Save
                            </Button>


                        </Box>
                    </Box>

                )}
            </Box>
        </Box >
    );
};

export default CriteriaConfiguration;
