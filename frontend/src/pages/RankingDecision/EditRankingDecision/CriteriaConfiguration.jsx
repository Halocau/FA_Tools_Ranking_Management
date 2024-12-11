// React
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { MdDeleteForever } from 'react-icons/md';
import { FaPlusCircle } from 'react-icons/fa';
// Mui
import { Box, TextField, Button, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddCircleIcon from '@mui/icons-material/AddCircle';

// API
import DecisionCriteriaAPI from "../../../api/DecisionCriteriaAPI.js";

const CriteriaConfiguration = ({ decisionStatus, goToNextStep, showErrorMessage, showSuccessMessage }) => {
    // Data
    const { id } = useParams(); // Get the ID from the URL
    const [originalCriteria, setOriginalCriteria] = useState([]);  // Lưu dữ liệu gốc
    // Row table
    const [rows, setRows] = useState([]);
    //Select to Add a new Criteria
    const [selectedCriteria, setSelectedCriteria] = useState(null);
    const [listcriteria, setListCriteria] = useState([]);

    console.log(decisionStatus);

    // Load data getCriteriaConfiguration
    const getCriteriaConfiguration = async () => {
        try {
            const response = await DecisionCriteriaAPI.getDecisionCriteriaByDecisionId(id);
            setOriginalCriteria(response)
        } catch (error) {
            console.error("Error fetching criteria:", error);
        }
    };

    useEffect(() => {
        getCriteriaConfiguration();
    }, [id]);

    //////////////////////////////////// Xử Lý backend /////////////////////////////////
    const updateDecisionCriteria = async (form) => {
        console.log(form)
        try {
            await DecisionCriteriaAPI.updateDecisionCriteria(
                form, id, form.criteriaId);
        } catch (error) {
            console.error("Error updating decision criteria:", error);
        }
    }
    const deleteDecisionCriteria = async (criteriaId) => {
        try {
            await DecisionCriteriaAPI.deleteDecisionCriteria(id, criteriaId);
        } catch (error) {
            console.error("Error deleting decision criteria:", error);
        }
    }
    const syncDecisionCriteria = async (rows, originalCriteria) => {
        try {
            // Create a map of original criteria for quick lookup
            const originalCriteriaMap = new Map(
                originalCriteria.map((item) => [item.criteriaId, item])
            );

            // Iterate through rows to handle updates and additions
            for (const row of rows) {
                const original = originalCriteriaMap.get(row.id);
                if (original) {
                    // If the row exists in originalCriteria but has a different weight, update it
                    if (original.weight !== row.weight) {
                        updateDecisionCriteria({
                            decisionId: id,
                            criteriaId: row.id,
                            weight: row.weight
                        });
                    }
                    // Remove the item from the map to track items already processed
                    originalCriteriaMap.delete(row.id);
                }
                else {
                    // If the row is new, add it
                    updateDecisionCriteria({
                        decisionId: id,
                        criteriaId: row.id,
                        weight: row.weight
                    });
                }
            }

            // Remaining items in originalCriteriaMap are to be deleted
            for (const [criteriaId] of originalCriteriaMap) {
                deleteDecisionCriteria(criteriaId);
            }
        } catch (error) {
            console.error("Error syncing decision criteria:", error);
        }
    };
    // End 
    ///////////////////////////// The update function changes //////////////////////////
    const handleCellEditCriteriaCommit = (newRow) => {
        const updatedRow = { ...newRow };
        setRows((prevRows) => {
            const updatedRows = prevRows.map((row) =>
                row.id === updatedRow.id ? updatedRow : row
            );
            return updatedRows;
        });
    };
    //////////////////////////////////// Remove row ///////////////////////////////////
    const handleDeleteRowData = (id) => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    };
    // End 
    //////////////////////////////// Select to Add a new Criteria ////////////////////
    const getCriteriaList = async () => {
        try {
            const response = await DecisionCriteriaAPI.getAllCriteria();
            setListCriteria(response);
        } catch (error) {
            console.error("Error fetching criteria:", error);
        }
    }
    // Load list criteria
    useEffect(() => {
        getCriteriaList();
    }, [id]);
    const handleAddCriteria = async () => {
        const addedCriteria = listcriteria.find(
            (criteria) => criteria.criteriaId === selectedCriteria.value
        );
        const newRows = {
            id: addedCriteria.criteriaId,
            criteria_name: addedCriteria.criteriaName,
            weight: addedCriteria.weight || 0,
            num_options: addedCriteria.numOptions < 1 ? "0" : addedCriteria.numOptions,
            max_score: addedCriteria.maxScore == null ? "" : addedCriteria.maxScore,
        }
        setRows((prevCriteria) => [...prevCriteria, newRows]);
        setSelectedCriteria(null);
    };
    // End 
    //////////////////////////////////// Cancel ///////////////////////////////////////
    const handleCancelChanges = () => {
        setRowData(originalCriteria);
        setSelectedCriteria(null)
    };
    // End 
    //////////////////////////////////// Save ////////////////////////////////////////
    const calculateTotalWeight = () => {
        const totalWeight = rows.reduce((total, row) => total + Number(row.weight || 0), 0);
        return totalWeight;
    };
    // End
    const handleSaveChanges = async () => {
        const checkWeight = rows.some((row) => row.weight <= 0);
        if (checkWeight) {
            showErrorMessage('Weight must be greater than 0');
        } else {
            const totalWeight = calculateTotalWeight();
            if (totalWeight === 100) {
                await syncDecisionCriteria(rows, originalCriteria);
                showSuccessMessage("Criteria Configuration saved successfully!");
                getCriteriaList();
                goToNextStep();
            } else {
                showErrorMessage('Tổng weight phải bằng 100');
            }
        }
    };

    //////////////////////////////////// Column Criteria //////////////////////////////////
    const columnsCriteria = [
        { field: 'criteria_name', headerName: 'Criteria Name', width: 500 },
        {
            field: 'weight',
            headerName: 'Weight',
            width: 150,
            align: 'center',
            headerAlign: 'center',
            editable: decisionStatus === 'Draft' || decisionStatus === 'Rejected',
            renderCell: (params) =>
                decisionStatus === 'Draft' || decisionStatus === 'Rejected' ? (
                    <TextField
                        sx={{
                            marginTop: '7px',
                            textAlign: 'center',
                        }}
                        value={params.value || ''}
                        onChange={(e) => {
                            const updatedValue = e.target.value;
                            setRows((prevRows) =>
                                prevRows.map((row) =>
                                    row.id === params.row.id ? { ...row, weight: updatedValue } : row
                                )
                            );
                        }}

                        onBlur={(e) => {
                            const updatedRow = { ...params.row, weight: e.target.value };
                            handleCellEditCriteriaCommit(updatedRow);
                        }}
                        onFocus={(e) => {
                            e.target.select();
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
            width: 150,
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
    // End 
    ///////////////////////////////////// Row Criteria ////////////////////////////////////
    const setRowData = (data) => {
        const mappedRows = data.map((data, index) => ({
            id: data.criteriaId,
            index: index + 1,
            criteria_name: data.criteriaName,
            weight: data.weight || 0,
            num_options: data.numOptions < 1 ? "0" : data.numOptions,
            max_score: data.maxScore == null ? "" : data.maxScore,
        }));
        setRows(mappedRows);
    }
    // End 
    useEffect(() => {
        if (originalCriteria) {
            setRowData(originalCriteria);
        }
    }, [originalCriteria]);

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
            }}>
                <Box sx={{ width: '100%', height: 400, marginTop: '10px' }}>
                    {/* Table DataGrid */}
                    <DataGrid
                        rows={rows}
                        columns={columnsCriteria}
                        getRowId={(row) => row.id}
                        processRowUpdate={(newRow) => {
                            handleCellEditCriteriaCommit(newRow);
                            return newRow;
                        }}
                        experimentalFeatures={{ newEditingApi: true }}
                    />
                    {/* Button */}
                    {(decisionStatus === 'Draft' || decisionStatus === 'Rejected') && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, marginTop: '20px' }}>
                            {/* Select to Add a new Criteria */}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Select
                                    isSearchable={true}
                                    placeholder="Select to Add a new Criteria "
                                    options={listcriteria
                                        .filter((criteria) => !rows.some((row) => row.id === criteria.criteriaId))
                                        .map((criteria) => ({ value: criteria.criteriaId, label: criteria.criteriaName, }))}
                                    styles={{
                                        container: (provided) => ({ ...provided, width: '300px', }),
                                        control: (provided) => ({ ...provided, height: '40px', fontSize: '16px', display: 'flex', alignItems: 'center', }),
                                        placeholder: (provided) => ({ ...provided, color: '#888', }),
                                        menu: (provided) => ({ ...provided, maxHeight: 300, overflowY: 'auto', }),
                                    }}
                                    menuPlacement="top"
                                    value={selectedCriteria}
                                    onChange={(option) => setSelectedCriteria(option)}
                                />
                                <IconButton
                                    onClick={handleAddCriteria}
                                    color={selectedCriteria ? 'primary' : 'default'}
                                    disabled={!selectedCriteria}
                                    sx={{ marginLeft: 1, height: '30px', display: 'flex', alignItems: 'center', }}
                                >
                                    <AddCircleIcon sx={{ fontSize: 30 }} /> {/* Điều chỉnh kích thước của icon */}
                                </IconButton>
                            </Box>
                            {/* Cancel and Save */}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                {/* Cancel*/}
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleCancelChanges}
                                >
                                    Cancel
                                </Button>
                                {/* Save*/}
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

export default CriteriaConfiguration;
