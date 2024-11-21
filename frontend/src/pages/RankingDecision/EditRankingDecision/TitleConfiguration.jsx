import React, { useEffect, useState } from 'react';
import { MdDeleteForever } from 'react-icons/md';
import { useNavigate, useParams } from "react-router-dom";
// MUI
import {
    InputAdornment, Box, Button, Typography, TextField, Modal, IconButton, Select, MenuItem, Table, TableHead, TableBody, TableCell, TableRow
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import CircleIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Stepper, Step, StepButton } from '@mui/material';
import { DataGridPro } from '@mui/x-data-grid-pro';
// API
import RankingDecisionAPI from "../../../api/rankingDecisionAPI.js";
import DecisionCriteriaAPI from "../../../api/DecisionCriteriaAPI.js";
import DecisionTitleAPI from "../../../api/DecisionTitleAPI.js";

const TitleConfiguration = ({ decisionStatus, goToNextStep, showErrorMessage }) => {
    // // Data 
    const { id } = useParams(); // Get the ID from the URL
    const [originalTitle, setOriginalTitle] = useState([]);  // Lưu dữ liệu gốc
    const [criteria, setCriteria] = useState([]);
    const [columnsTitle, setColumnsTitle] = useState([]);
    // Row table
    const [rows, setRows] = useState([]);
    // State Cancel and Save
    // const [hasChanges, setHasChanges] = useState(false); // kiểm tra thay đổi

    // Load data getCriteriaConfiguration 
    const getCriteriaConfiguration = async () => {
        try {
            const response = await DecisionCriteriaAPI.optionCriteria(id);
            setCriteria(response);
        } catch (error) {
            console.error("Error fetching criteria:", error);
        }
    };
    // Load data getTitleConfiguration
    const getTitleConfiguration = async () => {
        try {
            const response = await DecisionTitleAPI.getDecisionTitleByDecisionId(id);
            setOriginalTitle(response);
        } catch (error) {
            console.error("Error fetching criteria:", error);
        }
    };
    useEffect(() => {
        getCriteriaConfiguration()
        getTitleConfiguration();
    }, [id]);


    ///////////////////////////// Hàm cập nhập thay đổi ///////////////////////////
    // Hàm cập nhập thay đổi data
    const handleCellEditTitleCommit = ({ id, field, value }) => {
        console.log('Đang cập nhật hàng:', { id, field, value });
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
    //////////////////////////////////// Remove ////////////////////////////////////
    // Hàm xóa hàng 
    const handleDeleteRowData = (id) => {
        console.log('delete', id)
        setRows((prevRows) => {
            const rowIndex = prevRows.findIndex((row) => row.id === id);
            if (rowIndex !== -1) {
                const updatedRows = prevRows.filter((row) => row.id !== id);  // Lọc ra hàng cần xóa
                return updatedRows;
            }
            return prevRows;
        });
    };

    //////////////////////////////////// Cancel ////////////////////////////////////
    //// Hàm hủy thay đổi, đặt lại  giá trị ban đầu của tất cả
    const handleCancelChanges = () => {
        console.log('cancel')
        setRowData(originalTitle);
    };


    //////////////////////////////////// Save ///////////////////////////////////////
    const calculateRankScore = (row) => {
        if (!row || !criteria) {
            console.warn("Dữ liệu không hợp lệ:", { row, criteria });
            return 0;
        }
        console.log("Tính toán RankScore cho hàng:", row);
        return criteria.reduce((totalScore, criteriaItem) => {
            const currentValue = row[criteriaItem.criteriaName]; // Lấy giá trị từ row theo tên tiêu chí
            // Tìm option trong criteria tương ứng với giá trị hiện tại
            const selectedOption = criteriaItem.options?.find(
                (option) => option.optionName === currentValue
            );

            if (selectedOption) {
                const { score } = selectedOption;
                const { weight, maxScore } = criteriaItem;
                // Công thức tính RankScore
                const calculatedScore = (score * weight) / (maxScore || 1); // Tránh chia 0
                console.log(`Tiêu chí: ${criteriaItem.criteriaName}, score: ${score}, weight: ${weight}, maxScore: ${maxScore} `)
                return totalScore + calculatedScore;
            }
            console.warn(`Không tìm thấy option phù hợp cho tiêu chí: ${criteriaItem.criteriaName}`);
            return totalScore; // Không có option phù hợp, giữ nguyên điểm
        }, 0);

    };

    // 
    const handleSaveChanges = () => {
        // Nếu trạng thái là Finalized, bỏ qua kiểm tra
        if (decisionStatus === 'Finalized') {
            console.log("Finalized: Lưu dữ liệu và chuyển bước...");
            goToNextStep();
            return;
        }
        // Kiểm tra xem tất cả rankScore đã được tính toán
        const allRankScoresCalculated = rows.every((row) => row.rankScore != null && row.rankScore !== '' && row.rankScore !== 0);

        if (!allRankScoresCalculated) {
            showErrorMessage('Tất cả Rank Score phải được tính toán.');
            return; // Dừng lại nếu có lỗi
        }
        showErrorMessage('Title Configuration successfully updated.');
        console.log("Title Configuration successfully updated.”");
        goToNextStep(); // Chuyển bước tiếp theo
    };


    //////////////////////////////////// Select to Add a new Title //////////////////
    const handleAddTitle = () => {
        const newTitle = {
            id: rows.length + 1,
            titleName: 'New Title',
            rankScore: '',
        };
        setRows([...rows, newTitle]);
    };
    //////////////////////////////////// Column Title ////////////////////////////////////
    const ColumnsTitle = (criteria, decisionStatus) => {
        if (!Array.isArray(criteria)) {
            console.error("Invalid criteria data:", criteria);
            return [];
        }
        // Column Criteria
        const criteriaColumns = criteria.map((criteriaItem) => ({
            field: criteriaItem.criteriaName,
            headerName: criteriaItem.criteriaName,
            width: 200,
            editable: decisionStatus === 'Draft',
            renderCell: (params) => {
                const currentCriteria = criteria.find(
                    (c) => c.criteriaName === params.field
                );

                if (!currentCriteria || !Array.isArray(currentCriteria.options)) {
                    console.warn(`No options found for criteria: ${params.field}`);
                    return null;
                }

                return (
                    <Select
                        value={params.value || ''}
                        onChange={(e) =>
                            handleCellEditTitleCommit({
                                id: params.row.id,
                                field: params.field,
                                value: e.target.value,
                            })
                        }
                        fullWidth
                        sx={{
                            height: '30px',
                            '.MuiSelect-select': { padding: '4px' },
                        }}
                    >
                        {currentCriteria.options.map((option) => (
                            <MenuItem key={option.optionId} value={option.optionName}>
                                {`${option.score} - ${option.optionName}`} {/* Tên kèm score */}
                            </MenuItem>
                        ))}
                    </Select>
                );
            },
        }));
        // Column Title
        const fixedColumns = [
            { field: 'titleName', headerName: 'Title Name', width: 100, pinned: 'left' },
            {
                field: 'rankScore', headerName: 'Rank Score', width: 100, pinned: 'left',
                editable: decisionStatus === 'Draft', align: 'center', headerAlign: 'center',
            },
        ];
        // Column Action
        const actionColumn = [
            {
                field: 'action',
                headerName: 'Action',
                width: 90,
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

        return [...fixedColumns, ...criteriaColumns, ...actionColumn];
    };
    //////////////////////////////////// Row Title ////////////////////////////////////
    const setRowData = (title, criteria) => {
        const mappedRows = title.map((title, index) => {
            // Tạo các trường từ tiêu chí
            const criteriaFields = criteria.reduce((acc, criteriaItem) => {
                // Tìm option đã chọn tương ứng với criteriaId
                const matchingOption = title.options?.find(
                    (option) => option.criteriaId === criteriaItem.criteriaId
                );

                // Lưu giá trị optionName hoặc để trống nếu không tìm thấy
                acc[criteriaItem.criteriaName] = matchingOption
                    ? matchingOption.optionName // Tên của option đã chọn
                    : ""; // Giá trị mặc định
                return acc;
            }, {});

            return {
                id: title.rankingTitleId,
                index: index + 1,
                titleName: title.rankingTitleName,
                rankScore: title.totalScore || 0,
                ...criteriaFields,
            };
        });

        setRows(mappedRows); // Cập nhật state
    };
    useEffect(() => {
        if (originalTitle) {
            // Tạo cột
            const columns = ColumnsTitle(criteria, decisionStatus);
            setColumnsTitle(columns);
            // Tạo hàng
            setRowData(originalTitle, criteria);
        }
    }, [originalTitle, decisionStatus]);

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
                        // initialState={{ pinnedColumns: { left: ['titleName', 'rankScore'], right: ['action'] } }}
                        getRowId={(row) => row.id}
                        sx={{
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#f4f4f4',
                            },
                            overflowX: 'auto',  // Cho phép cuộn ngang cho các cột cuộn
                            '.MuiDataGrid-virtualScroller': {
                                overflowX: 'auto', // Cho phép cuộn ngang trong phần cuộn
                                overflowY: 'auto', // Ẩn cuộn dọc trong vùng cuộn
                            },
                        }}
                    />
                    {/* Button */}
                    {decisionStatus === 'Draft' && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, marginTop: '20px' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <Button variant="contained" color="success" onClick={handleAddTitle}>
                                    Add Title
                                </Button>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleCancelChanges} // Gọi hàm hủy thay đổi
                                >
                                    Cancel
                                </Button>
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
