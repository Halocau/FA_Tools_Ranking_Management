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

const TitleConfiguration = ({ decisionStatus, goToNextStep, showErrorMessage, showSuccessMessage, activeStep }) => {
    const role = localStorage.getItem('userRole');
    // Data 
    const { id } = useParams(); // Get the ID from the URL
    const [originalTitle, setOriginalTitle] = useState([]);  // Lưu dữ liệu gốc
    const [criteria, setCriteria] = useState([]);
    const [columnsTitle, setColumnsTitle] = useState([]);

    // Row table
    const [rows, setRows] = useState([]);

    const [errorMessage, setErrorMessage] = useState(null);

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
    }, [activeStep]);

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
        const decisionTitleForms = []; // Batch forms for updateDecisionTitle

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
            if (
                !original ||
                original.rankingTitleName !== row.titleName ||
                (original.totalScore || 0).toString() !== (row.rankScore || 0).toString()
            ) {
                newTitle = await upsertRankingTitle(rankingTitleForm);
            }
            const originalOptionsMap = new Map(
                (original?.options || []).map((opt) => [opt.criteriaId, opt])
            );

            for (const option of row.options) {
                const originalOption = originalOptionsMap.get(option.criteriaId);

                if (!originalOption) {
                    decisionTitleForms.push({
                        newRankingTitleId: newTitle ? newTitle.rankingTitleId : row.id,
                        newOptionId: option.optionId,
                    });
                } else if (originalOption.optionId !== option.optionId) {
                    decisionTitleForms.push({
                        rankingTitleId: row.id,
                        optionId: originalOption.optionId,
                        newRankingTitleId: row.id,
                        newOptionId: option.optionId,
                    });
                }
                originalOptionsMap.delete(option.criteriaId);
            }
            for (const [criteriaId, opt] of originalOptionsMap) {
                await deleteDecisionTitle(row.id, opt.optionId);
            }
            processedIds.add(row.id);
        }
        for (const original of originalTitle) {
            if (!processedIds.has(original.rankingTitleId)) {
                await deleteRankingTitle(original.rankingTitleId);
            }
        }

        if (decisionTitleForms.length > 0) {
            await updateDecisionTitle(decisionTitleForms);
        }
    };

    const handleAddTitle = async () => {
        const decisionId = id;
        if (!decisionId) {
            console.error("decisionId không hợp lệ");
            return;
        }

        if (newTitleName.length < 3) {
            setErrorMessage('Title must be larger or equals 3 characters.');
            setNewTitleName('');
            setstatusAddTitle(null);
            return;
        }
        if (newTitleName.length > 100) {
            setErrorMessage('Title must be smaller or equals 100 characters.');
            setNewTitleName('');
            setstatusAddTitle(null);
            return;
        }

        const newTitle = {
            id: null,
            index: rows.length + 1,
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
            const rowIndex = updatedRows.findIndex((row) => row.index === id);

            if (rowIndex !== -1) {
                const currentRow = updatedRows[rowIndex];
                currentRow[field] = value;
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
    const handleDeleteRowData = (index) => {
        console.log('delete', index)
        setRows((prevRows) => {
            const rowIndex = prevRows.findIndex((row) => row.index === index);
            if (rowIndex !== -1) {
                const updatedRows = prevRows.filter((row) => row.index !== index);
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
            return 0;
        }
        return criteria.reduce((totalScore, criteriaItem) => {
            const currentValue = row[criteriaItem.criteriaName];
            const selectedOption = criteriaItem.options?.find(
                (option) => option.optionName === currentValue
            );

            if (selectedOption) {
                const { score } = selectedOption;
                const { weight, maxScore } = criteriaItem;
                const calculatedScore = (score * weight) / (maxScore || 1);
                return totalScore + calculatedScore;
            }
            return totalScore;
        }, 0);
    };

    // End 
    const handleSaveChanges = async () => {
        console.log(rows);
        if (rows.length === 0) {
            return showErrorMessage('You need to have at least one title in the table.');
        }
        const allRankScoresCalculated = rows.every((row) => row.rankScore != null && row.rankScore !== '' && row.rankScore !== 0);
        if (!allRankScoresCalculated) {
            showErrorMessage('All field is required.');
            return;
        }
        const rankScoreSet = new Set(rows.map((row) => row.rankScore));
        if (rankScoreSet.size !== rows.length) {
            showErrorMessage('Every Rank Score must be unique.');
            return;
        }
        await syncDecisionTitle(rows, originalTitle);
        showSuccessMessage('Title Configuration successfully updated.');
        getTitleConfiguration();
        goToNextStep();
    };

    // End 
    ///////////////////////////////// Column Title ///////////////////////////////////
    const ColumnsTitle = (criteria, decisionStatus) => {
        if (!Array.isArray(criteria)) {
            console.error("Invalid criteria data:", criteria);
            return [];
        }
        const isEditable = decisionStatus === 'Draft' || decisionStatus === 'Rejected';
        const criteriaColumns = criteria.map((criteriaItem) => ({
            field: criteriaItem.criteriaName,
            headerName: criteriaItem.criteriaName,
            width: 200,
            editable: isEditable,
            renderCell: (params) => {
                const currentCriteria = criteria.find(
                    (c) => c.criteriaName === params.field
                );
                if (!currentCriteria || !Array.isArray(currentCriteria.options)) {
                    console.warn(`No options found for criteria: ${params.field}`);
                    return null;
                }
                return isEditable ? (
                    <Select
                        value={params.value || ''}
                        onChange={(e) =>
                            handleCellEditTitleCommit({
                                id: params.row.index,
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
                                {`${option.score} - ${option.optionName}`}
                            </MenuItem>
                        ))}
                    </Select>
                ) : (
                    <span>{params.value || ''}</span>
                );
            },
        }));
        // Column Title
        const fixedColumns = [
            { field: 'titleName', headerName: 'Title Name', width: 100, pinned: 'left' },
            {
                field: 'rankScore', headerName: 'Rank Score', width: 100, pinned: 'left',
                editable: (decisionStatus === 'Draft' || decisionStatus === 'Rejected'), align: 'center', headerAlign: 'center',
            },
        ];
        // Column Action
        const actionColumn = [
            {
                field: 'action',
                headerName: 'Action',
                width: 90,
                renderCell: (params) =>
                    (decisionStatus === 'Draft' || decisionStatus === 'Rejected') && (
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleDeleteRowData(params.row.index)}
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
            const criteriaFields = criteria.reduce((acc, criteriaItem) => {
                const matchingOption = titleItem.options?.find(
                    (option) => option.criteriaId === criteriaItem.criteriaId
                );
                acc[criteriaItem.criteriaName] = matchingOption ? matchingOption.optionName : "";
                acc[`${criteriaItem.criteriaName}_id`] = criteriaItem.criteriaId;

                return acc;
            }, {});
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

            const tempData = {
                id: titleItem.rankingTitleId,
                index: index + 1,
                titleName: titleItem.rankingTitleName,
                rankScore: titleItem.totalScore || 0,
                ...criteriaFields,
                options: normalizedOptions,
            };

            return {
                id: titleItem.rankingTitleId,
                index: index + 1,
                titleName: titleItem.rankingTitleName,
                rankScore: calculateRankScore(tempData).toFixed(2) ? calculateRankScore(tempData).toFixed(2) : titleItem.totalScore,
                ...criteriaFields,
                options: normalizedOptions,
            };
        });

        setRows(mappedRows);
    };
    // End 
    useEffect(() => {
        if (originalTitle) {
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
                    {(decisionStatus === 'Draft' || decisionStatus === 'Rejected') && (
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
                                    onClick={(e) => {
                                        setErrorMessage('');
                                    }
                                    }
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
                            {/* Display error message if present */}
                            {errorMessage && errorMessage.length > 0 && (
                                <span style={{ color: 'red', marginTop: '8px', fontSize: '14px' }}>
                                    {errorMessage}
                                </span>
                            )}
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
