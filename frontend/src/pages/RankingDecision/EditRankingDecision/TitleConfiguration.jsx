import React, { useEffect, useState } from 'react';
import { MdDeleteForever } from 'react-icons/md';
import { useNavigate, useParams } from "react-router-dom";
// MUI
import {
    Box, Button, Typography, TextField, IconButton, Select, MenuItem
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import AddCircleIcon from '@mui/icons-material/AddCircle'; // Dấu + icon

// API
import DecisionCriteriaAPI from "../../../api/DecisionCriteriaAPI.js";
import DecisionTitleAPI from "../../../api/DecisionTitleAPI.js";
import RankingTitleAPI from '../../../api/RankingTitleAPI.js';

const TitleConfiguration = ({ decisionStatus, goToNextStep, showErrorMessage, showSuccessMessage }) => {
    // Data 
    const { id } = useParams(); // Get the ID from the URL
    const [originalTitle, setOriginalTitle] = useState([]);  // Lưu dữ liệu gốc
    const [criteria, setCriteria] = useState([]);
    const [columnsTitle, setColumnsTitle] = useState([]);

    // Row table
    const [rows, setRows] = useState([]);

    // Add Title 
    const [statusAddTitle, setstatusAddTitle] = useState(null);
    const [newTitleName, setNewTitleName] = useState(''); // State lưu tên tiêu đề mới
    const [newAddedTitle, setNewAddedTitle] = useState(null); // State lưu tên tiêu đề mới
    // Load data of table header
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

    // Load update
    useEffect(() => {
        getCriteriaConfiguration()
        getTitleConfiguration();
    }, [id]);

    /////////////////////////////////// Xử Lý backend //////////////////////////////////
    const upsertRankingTitle = async (form) => {
        try {
            const response = await RankingTitleAPI.upsertRankingTitle(form);
            setNewAddedTitle(response);
            return response;
        } catch (error) {
            console.error("Error adding new ranking title:", error);
        }
    }

    const deleteRankingTitle = async (id) => {
        try {
            await RankingTitleAPI.deleteRankingTitle(id);
        } catch (error) {
            console.error("Error deleting ranking title:", error);
        }
    }

    const upsertDecisionTitle = async (form) => {
        // console.log(form, decisionId, titleId);
        try {
            await DecisionTitleAPI.upsertDecisionTitle(form);
        } catch (error) {
            console.error("Error updating decision title:", error);
        }
    };

    const updateDecisionTitle = async (form) => {
        try {
            await DecisionTitleAPI.updateDecisionTitleOption(form);
        } catch (error) {
            console.error("Error updating decision title:", error);
        }
    };

    const deleteDecisionTitle = async (decisionId, titleId) => {
        try {
            await DecisionTitleAPI.deleteDecisionTitle(decisionId, titleId);
        } catch (error) {
            console.error("Error deleting decision title:", error);
        }
    };

    const syncDecisionTitle = async (rows, originalTitle) => {
        const originalMap = new Map(originalTitle.map((item) => [item.rankingTitleId, item]));
        const processedIds = new Set(); // Track processed titles

        // Process rows
        for (const row of rows) {
            const original = originalMap.get(row.id);

            // Prepare data for upsertRankingTitle
            const rankingTitleForm = {
                id: row.id,
                decisionId: id,
                titleName: row.titleName,
                totalScore: parseFloat(row.rankScore) || 0,
            };

            let newTitle;
            // Handle ranking title
            if (
                !original ||
                original.rankingTitleName !== row.titleName ||
                (original.totalScore || 0).toString() !== (row.rankScore || 0).toString()
            ) {
                newTitle = await upsertRankingTitle(rankingTitleForm);
            }
            console.log("New ranking title:", newTitle);

            // Compare and update options
            const originalOptionsMap = new Map(
                (original?.options || []).map((opt) => [opt.criteriaId, opt])
            );

            for (const option of row.options) {
                const originalOption = originalOptionsMap.get(option.criteriaId);

                if (!originalOption) {
                    // Add new option
                    await upsertDecisionTitle({
                        newRankingTitleId: newTitle ? newTitle.rankingTitleId : row.id,
                        newOptionId: option.optionId,
                    });
                    console.log("Add new option:", { newRankingTitleId: row.id, newOptionId: option.optionId });
                } else if (originalOption.optionId !== option.optionId) {
                    // Update existing option
                    console.log("Update option:", { rankingTitleId: row.id, optionId: originalOption.optionId, newRankingTitleId: row.id, newOptionId: option.optionId });
                    await upsertDecisionTitle({
                        rankingTitleId: row.id,
                        optionId: originalOption.optionId,
                        newRankingTitleId: row.id,
                        newOptionId: option.optionId,
                    });
                }

                // Remove processed options
                originalOptionsMap.delete(option.criteriaId);
            }

            // Handle deleted options
            for (const [criteriaId, opt] of originalOptionsMap) {
                await deleteDecisionTitle(row.id, opt.optionId); // Modified to include rankingTitleId and optionId
            }

            // Mark title as processed
            processedIds.add(row.id);
        }

        // Handle deleted titles
        for (const original of originalTitle) {
            if (!processedIds.has(original.rankingTitleId)) {
                console.log("Delete ranking title:", original.rankingTitleId);
                await deleteRankingTitle(original.rankingTitleId);
            }
        }
    };

    const handleAddTitle = async () => {
        const decisionId = id;  // Ensure this id is valid
        if (!decisionId) {
            console.error("decisionId không hợp lệ");
            return;
        }

        const newTitle = {
            id: null,  // Or get the real ID from the server
            index: rows.length + 1,  // Or get the real ID from the server
            titleName: newTitleName,
            rankScore: 0,
            options: criteria.map((criteriaItem) => ({
                criteriaId: criteriaItem.criteriaId,
                optionName: "",
                score: 0,
                optionId: null,
            })),
        };

        setRows([...rows, newTitle]);
        setNewTitleName('');
        setstatusAddTitle(null);
    };

    ///////////////////////////// The update function changes //////////////////////////
    const handleCellEditTitleCommit = ({ id, field, value }) => {
        console.log('Updating row:', { id, field, value });

        setRows((prevRows) => {
            const updatedRows = [...prevRows];
            const rowIndex = updatedRows.findIndex((row) => row.id === id);

            if (rowIndex !== -1) {
                const currentRow = updatedRows[rowIndex];

                // Update the value for the criteria field
                currentRow[field] = value;

                // Find the corresponding criteria and update its option in the options array
                const criteriaIndex = criteria.findIndex(
                    (criteriaItem) => criteriaItem.criteriaName === field
                );

                if (criteriaIndex !== -1) {
                    const matchingOption = criteria[criteriaIndex].options.find(
                        (option) => option.optionName === value
                    );

                    if (matchingOption) {
                        currentRow.options[criteriaIndex] = {
                            criteriaId: criteria[criteriaIndex].criteriaId,
                            optionName: matchingOption.optionName,
                            score: matchingOption.score,
                            optionId: matchingOption.optionId,
                        };
                    }
                }

                // Recalculate the rankScore if all criteria are filled
                const allCriteriaFilled = criteria.every(
                    (criteriaItem) => currentRow[criteriaItem.criteriaName]
                );

                if (allCriteriaFilled) {
                    currentRow.rankScore = calculateRankScore(currentRow).toFixed(2);
                } else {
                    currentRow.rankScore = '';
                }
            }

            return updatedRows;
        });
    };

    // End 
    //////////////////////////////////// Remove row ////////////////////////////////////
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
    // End 
    //////////////////////////////////// Cancel ///////////////////////////////////////
    const handleCancelChanges = () => {
        console.log('cancel');
        if (originalTitle && criteria) {
            setRowData(originalTitle, criteria);
        } else {
            console.error("Không có dữ liệu ban đầu để load lại.");
        }
    };
    // End 
    //////////////////////////////////// Save ////////////////////////////////////////
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

    // End 
    const handleSaveChanges = () => {
        // Kiểm tra xem tất cả rankScore đã được tính toán
        const allRankScoresCalculated = rows.every((row) => row.rankScore != null && row.rankScore !== '' && row.rankScore !== 0);
        // console.log("Original Title:", originalTitle);
        // console.log("Rows:", rows);
        if (!allRankScoresCalculated) {
            showErrorMessage('Tất cả Rank Score phải được tính toán.');
            return; // Dừng lại nếu có lỗi
        }
        syncDecisionTitle(rows, originalTitle);

        showSuccessMessage('Title Configuration successfully updated.');
        console.log("Title Configuration successfully updated.”");
        // goToNextStep(); // Chuyển bước tiếp theo
    };

    // console.log("Rows:", rows);
    // console.log("Original Title:", originalTitle);
    // End 
    ///////////////////////////////// Column Title ///////////////////////////////////
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
    // End 
    //////////////////////////////////// Row Title ////////////////////////////////////
    const setRowData = (title, criteria) => {
        const mappedRows = title.map((titleItem, index) => {
            // Create fields for criteria columns, ensuring every criteria is included
            const criteriaFields = criteria.reduce((acc, criteriaItem) => {
                // Find the option corresponding to this criteria
                const matchingOption = titleItem.options?.find(
                    (option) => option.criteriaId === criteriaItem.criteriaId
                );

                // Set the field value to the matched optionName or an empty string if not found
                acc[criteriaItem.criteriaName] = matchingOption ? matchingOption.optionName : "";
                acc[`${criteriaItem.criteriaName}_id`] = criteriaItem.criteriaId;

                return acc;
            }, {});

            // Ensure all criteria are represented in the options array
            const normalizedOptions = criteria.map((criteriaItem) => {
                const matchingOption = titleItem.options?.find(
                    (option) => option.criteriaId === criteriaItem.criteriaId
                );

                return matchingOption || {
                    criteriaId: criteriaItem.criteriaId,
                    optionName: "",
                    score: 0,
                    optionId: null,
                };
            });

            return {
                id: titleItem.rankingTitleId,
                index: index + 1, // Row index
                titleName: titleItem.rankingTitleName, // Title name
                rankScore: titleItem.totalScore || 0, // Total score
                ...criteriaFields, // Dynamic criteria fields with criteriaId
                options: normalizedOptions, // All options, with defaults for missing ones
            };
        });

        // Update the state with the new rows
        setRows(mappedRows);
    };


    // End 
    useEffect(() => {
        if (originalTitle) {
            // Tạo cột
            const columns = ColumnsTitle(criteria, decisionStatus);
            setColumnsTitle(columns);
            setRowData(originalTitle, criteria);
        }
    }, [originalTitle, criteria, decisionStatus]);

    return (
        <div>
            {/* Surrounding border */}
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
                    {/* Table DataGrid */}
                    <DataGrid
                        rows={rows}
                        columns={columnsTitle}
                        getRowId={(row) => row.index}
                    />
                    {/* Button */}
                    {decisionStatus === 'Draft' && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, marginTop: '20px' }}>
                            {/* Add a new Title */}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <input
                                    type="text"
                                    value={newTitleName}
                                    onChange={(e) => {
                                        setstatusAddTitle(e.target.value);
                                        setNewTitleName(e.target.value);
                                    }}
                                    placeholder="Input name for new Ranking Title"
                                    style={{ height: '30px', width: '300px', padding: '5px', fontSize: '16px', borderRadius: '5px' }}
                                />
                                <IconButton
                                    onClick={handleAddTitle}
                                    color={statusAddTitle ? 'primary' : 'default'}
                                    disabled={!statusAddTitle}
                                    sx={{ marginLeft: 1, height: '30px', display: 'flex', alignItems: 'center' }}
                                >
                                    <AddCircleIcon sx={{ fontSize: 30 }} />
                                </IconButton>
                            </Box>
                            {/* Cancel and Save */}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleCancelChanges}
                                >
                                    Cancel
                                </Button>
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
        </div>
    );
};

export default TitleConfiguration;
