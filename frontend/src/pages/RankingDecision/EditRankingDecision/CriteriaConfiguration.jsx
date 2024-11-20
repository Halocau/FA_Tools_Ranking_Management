import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, TextField, Button } from '@mui/material';
import { MdDeleteForever } from 'react-icons/md';
// API
import RankingDecisionAPI from "../../../api/rankingDecisionAPI.js";
import DecisionCriteriaAPI from "../../../api/DecisionCriteriaAPI.js";

const CriteriaConfiguration = ({ criteria, decisionStatus, page, pageSize, goToNextStep, showErrorMessage }) => {
    const [rows, setRows] = useState([]);
    const [hasChanges, setHasChanges] = useState(false);
    const [originalRows, setOriginalRows] = useState([]);  // Lưu dữ liệu gốc

    useEffect(() => {
        if (criteria) {
            const mappedRows = criteria.map((criteria, index) => ({
                id: criteria.criteriaId,
                index: index + 1 + (page - 1) * pageSize,
                criteria_name: criteria.criteriaName,
                weight: criteria.weight || 0,
                num_options: criteria.numOptions < 1 ? "0" : criteria.numOptions,
                max_score: criteria.maxScore == null ? "" : criteria.maxScore,
            }));
            setRows(mappedRows);
            setOriginalRows(mappedRows);  // Lưu lại dữ liệu gốc
        }
    }, [criteria, page, pageSize]);

    // Xử lý khi người dùng chỉnh sửa một ô
    const handleCellEditCriteriaCommit = (newRow) => {
        const updatedRow = { ...newRow };
        setRows((prevRows) => {
            const updatedRows = prevRows.map((row) =>
                row.id === updatedRow.id ? updatedRow : row
            );
            return updatedRows;
        });

        // Kiểm tra sự thay đổi và cập nhật `hasChanges`
        const hasAnyChanges = rows.some((row, index) => row.weight !== originalRows[index]?.weight);
        setHasChanges(hasAnyChanges);
    };

    // Kiểm tra sự thay đổi của `rows` và `originalRows` trong useEffect
    useEffect(() => {
        const hasAnyChanges = rows.some((row, index) => row.weight !== originalRows[index]?.weight);
        setHasChanges(hasAnyChanges);
    }, [rows, originalRows]);  // Theo dõi sự thay đổi của rows và originalRows


    useEffect(() => {
        // Kiểm tra xem có bất kỳ ô nào đã được thay đổi không
        const hasAnyChanges = rows.some((row, index) => {
            return row.weight !== originalRows[index]?.weight;  // Chỉ kiểm tra cột weight
        });

        setHasChanges(hasAnyChanges);
    }, [rows, originalRows]); // Theo dõi sự thay đổi của rows và originalRows

    // Hàm hủy thay đổi, đặt lại cột weight về giá trị ban đầu
    const handleCancelChanges = () => {
        setRows(originalRows);  // Đặt lại dữ liệu cũ
    };

    // Tính tổng weight
    const calculateTotalWeight = () => {
        const totalWeight = rows.reduce((total, row) => total + Number(row.weight || 0), 0);
        console.log(totalWeight)
        return totalWeight;
    };

    const handleSaveChanges = () => {
        const totalWeight = calculateTotalWeight();
        if (totalWeight === 100) {
            console.log("Tổng weight hợp lệ. Lưu dữ liệu...");
            goToNextStep();
        } else {
            showErrorMessage('Tổng weight phải bằng 100');
        }
    };

    const handleAddCriteria = async () => {
        const newRow = {
            id: rows.length + 1,
            criteria_name: 'New Criteria',
            weight: 0,
            max_score: 1,
            num_options: 1,
        };

        try {
            const response = await DecisionCriteriaAPI.addDecisionCriteria(newRow);
            if (response.status === 200) {
                setRows([...rows, newRow]);
                console.log("Tiêu chí mới đã được thêm thành công!");
            } else {
                throw new Error('Không thể thêm tiêu chí');
            }
        } catch (error) {
            console.error('Lỗi khi thêm tiêu chí:', error);
        }
    };

    const handleDeleteRowData = (id) => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    };

    const columnsCriteria = [
        { field: 'criteria_name', headerName: 'Criteria Name', width: 500 },
        {
            field: 'weight',
            headerName: 'Weight',
            width: 150,
            align: 'center',
            editable: decisionStatus === 'Draft',  // Chỉ cho phép chỉnh sửa khi status là 'Draft'
            renderCell: (params) =>
                decisionStatus === 'Draft' ? (
                    <TextField
                        sx={{
                            marginTop: '7px',
                            textAlign: 'center',  // Căn giữa giá trị trong TextField
                        }}
                        value={params.value || ''}  // Hiển thị giá trị mặc định là 0
                        onChange={(e) => {
                            const newWeight = e.target.value;
                            // Cập nhật chỉ ô hiện tại thay vì toàn bộ bảng
                            setRows((prevRows) =>
                                prevRows.map((row) =>
                                    row.id === params.row.id
                                        ? { ...row, weight: newWeight }  // Chỉ thay đổi row có id khớp
                                        : row
                                )
                            );
                        }}
                        onBlur={() => {
                            // Đảm bảo giá trị được lưu khi người dùng rời khỏi ô
                            const currentRow = rows.find((row) => row.id === params.row.id);
                            setRows((prevRows) =>
                                prevRows.map((row) =>
                                    row.id === params.row.id
                                        ? { ...row, weight: currentRow.weight }  // Lưu giá trị
                                        : row
                                )
                            );
                        }}
                        onFocus={(e) => {
                            e.target.select(); // Tự động chọn toàn bộ giá trị khi người dùng nhấp vào
                        }}
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
        { field: 'num_options', headerName: 'No of Options', width: 150, align: 'center', headerAlign: 'center' },
        { field: 'max_score', headerName: 'Max Score', width: 150, align: 'center', headerAlign: 'center' },
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
            overflow: 'hidden',
        }}>
            <Box>
                <DataGrid
                    rows={rows}
                    columns={columnsCriteria}
                    pageSize={pageSize}
                    getRowId={(row) => row.id}
                // processRowUpdate={(newRow) => handleCellEditCriteriaCommit(newRow, rows.find((row) => row.id === newRow.id))}
                />
                {/* Button criteria */}
                {decisionStatus === 'Draft' && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, marginTop: '20px' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <Button variant="contained" color="success" onClick={handleAddCriteria}>
                                Add Criteria
                            </Button>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            {hasChanges && (
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleCancelChanges}
                                >
                                    Cancel
                                </Button>
                            )}
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSaveChanges}
                            >
                                Save
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default CriteriaConfiguration;