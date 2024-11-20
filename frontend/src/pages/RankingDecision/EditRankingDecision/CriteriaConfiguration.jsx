import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, TextField, Button } from '@mui/material';
import { MdDeleteForever } from 'react-icons/md';
import { useNavigate, useParams } from "react-router-dom";

import Select from "react-select";

// API
import DecisionCriteriaAPI from "../../../api/DecisionCriteriaAPI.js";
import CriteriaAPI from "../../../api/CriteriaAPI.js";

const CriteriaConfiguration = ({ decisionStatus, goToNextStep, showErrorMessage }) => {
    // Data 
    const { id } = useParams(); // Get the ID from the URL
    const [criteria, setCriteria] = useState([]);
    const [selectedCriteria, setSelectedCriteria] = useState(null);

    // Row table
    const [originalCriteria, setOriginalCriteria] = useState([]);  // Lưu dữ liệu gốc
    const [rows, setRows] = useState([]);

    // State Cancel and Save
    const [hasChanges, setHasChanges] = useState(false); // kiểm tra thay đổi

    //Select to Add a new Criteria
    const [listcriteria, setListCriteria] = useState([]);

    // Pagination for data grid
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(20);

    const [filter, setFilter] = useState('');
    //size of list
    const [size, setSize] = useState(20);
    //// Load data getCriteriaConfiguration
    const getCriteriaConfiguration = async () => {
        try {
            const response = await DecisionCriteriaAPI.getDecisionCriteriaByDecisionId(id);
            console.log(response)
            setCriteria(response.result);
            setOriginalCriteria(response.result);
        } catch (error) {
            console.error("Error fetching criteria:", error);
        }
    };

    useEffect(() => {
        getCriteriaConfiguration();
    }, []);

    const getCriteriaList = async () => {
        try {
            const response = await CriteriaAPI.searchCriteria(
                filter,
                0,
                size
            );
            setListCriteria(response.result);
        } catch (error) {
            console.error("Error fetching criteria:", error);
        }
    }

    useEffect(() => {
        getCriteriaList();
    }, [filter, size]);

    ///////////////////////////// Hàm cập nhập thay đổi ///////////////////////////
    // Hàm cập nhập thay đổi weight
    const handleCellEditCriteriaCommit = (newRow) => {
        console.log(newRow)
        const updatedRow = { ...newRow };

        setRows((prevRows) => {
            const updatedRows = prevRows.map((row) =>
                row.id === updatedRow.id ? updatedRow : row
            );

            const hasAnyChanges = updatedRows.some(
                (row, index) => row.weight !== originalCriteria[index]?.weight
            );
            setHasChanges(hasAnyChanges);

            return updatedRows;
        });
    };
    console.log(criteria);

    //////////////////////////////////// Remove ////////////////////////////////////
    const handleDeleteRowData = (id) => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    };

    //////////////////////////////////// Cancel ////////////////////////////////////
    useEffect(() => {
        const hasAnyChanges = rows.some((row, index) => row.weight !== originalCriteria[index]?.weight);

        setHasChanges(hasAnyChanges);
    }, [rows, originalCriteria]);


    const handleCancelChanges = () => {
        setRowData(originalCriteria);
    };

    //////////////////////////////////// Save ////////////////////////////////////
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

    //////////////////////////////////// Select to Add a new Criteria ////////////////////////////////////
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
        console.log(addedCriteria);
        setSelectedCriteria(null);
    };

    //////////////////////////////////// Column Criteria ////////////////////////////////////
    const columnsCriteria = [
        { field: 'criteria_name', headerName: 'Criteria Name', width: 500 },
        {
            field: 'weight',
            headerName: 'Weight',
            width: 150,
            align: 'center',
            editable: decisionStatus === 'Draft',
            renderCell: (params) =>
                decisionStatus === 'Draft' ? (
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

    useEffect(() => {
        if (criteria) {
            const mappedRows = criteria.map((criteria, index) => ({
                id: criteria.criteriaId,
                index: index + 1,
                criteria_name: criteria.criteriaName,
                weight: criteria.weight || 0,
                num_options: criteria.numOptions < 1 ? "0" : criteria.numOptions,
                max_score: criteria.maxScore == null ? "" : criteria.maxScore,
            }));
            setRows(mappedRows);
        }
    }, [criteria]);

    return (
        <Box sx={{
            width: "100%",
            height: 600,
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
                    getRowId={(row) => row.id}
                    processRowUpdate={(newRow) => {
                        handleCellEditCriteriaCommit(newRow);
                        return newRow;
                    }}
                    experimentalFeatures={{ newEditingApi: true }}
                    style={{ height: 400, width: '100%' }}
                />
                {decisionStatus === 'Draft' && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, marginTop: '20px' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <Select
                                isSearchable={true}
                                placeholder="Add New Criteria ..."
                                options={listcriteria
                                    .filter(
                                        (criteria) => !rows.some((row) => row.id === criteria.criteriaId)
                                    )
                                    .map((criteria) => ({
                                        value: criteria.criteriaId,
                                        label: criteria.criteriaName,
                                    }))}
                                styles={{
                                    menu: (provided) => ({
                                        ...provided,
                                        zIndex: 2000,
                                        maxHeight: 300,
                                        overflowY: 'auto',
                                        width: 300,
                                    }),
                                }}
                                menuPlacement="top"
                                value={selectedCriteria} // Bind the selected option to the state
                                onChange={(option) => setSelectedCriteria(option)} // Update state on selection
                            />
                            <Button variant="contained" color="success" onClick={handleAddCriteria}>
                                Add Criteria
                            </Button>
                        </Box>
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
                                color="success"
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
