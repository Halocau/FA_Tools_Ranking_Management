import React, { useEffect, useState } from "react";

//Layout
import { Box, Button, Typography, TextField, Modal } from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import Slider from "../../layouts/Slider.jsx";
import SearchComponent from "../../components/Common/Search.jsx";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
//Hooks
import { useNavigate } from "react-router-dom";
import useNotification from "../../hooks/useNotification.jsx";

//API
import CriteriaAPI from "../../api/CriteriaAPI.js";

//Filter Query Builder
import { sfLike } from 'spring-filter-query-builder';

const CriteriaManagement = () => {
    //Use for navigation
    const navigate = useNavigate();
    //Use for table
    const apiRef = useGridApiRef();
    //Use for control form add criteria
    const [showAddCriteriaModal, setShowAddCriteriaModal] = useState(false);
    //Use for save criteria name for add criteria
    const [criteriaName, setCriteriaName] = useState("");

    const [validationMessage, setValidationMessage] = useState("");

    //Use to show notification
    const [showSuccessMessage, showErrorMessage] = useNotification();
    //Use for save data of criteria
    const [criteria, setCriteria] = useState([]);
    //Use for pagination
    const [pageSize, setpageSize] = useState(5);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    //Use for pass data in data grid
    const [rows, setRows] = useState([]);

    //Use for get all criteria with pagination and filter
    const getAllCriteria = async () => {
        try {
            const data = await CriteriaAPI.searchCriteria(
                filter,
                page,
                pageSize
            );
            setCriteria(data.result);
            setTotalPages(data.pageInfo.total);
            setTotalElements(data.pageInfo.element);
        } catch (error) {
            console.error("Failed to fetch criteria:", error);
        }
    }

    //Use to get all criteria when first load and when page or pageSize or filter change.
    useEffect(() => {
        getAllCriteria();
    }, [page, pageSize, filter]);


    //Use for map data in data grid
    useEffect(() => {
        if (criteria) {
            const mappedRows = criteria.map((criteria, index) => ({
                id: criteria.criteriaId,
                index: index + 1 + (page - 1) * 5,
                criteriaName: criteria.criteriaName,
                noOfOption: criteria.numOptions ? criteria.numOptions : 0,
                maxScore: criteria.maxScore ? criteria.maxScore : 0,
            }));
            setRows(mappedRows);
        }
    }, [criteria]);

    //Use for open form add criteria
    const handleOpenAddCriteriaModal = () => {
        setShowAddCriteriaModal(true);
        setCriteriaName("");
        setValidationMessage("");
    };

    //Use for close form add criteria
    const handleCloseAddCriteriaModal = () => {
        setShowAddCriteriaModal(false);
        setCriteriaName("");
        setValidationMessage("");
    };

    //Use for search
    const handleSearch = (event) => {
        if (event) {
            setFilter(sfLike("criteriaName", event).toString());
        } else {
            setFilter("");
        }
        setPage(1);
    };

    //Use for add criteria
    const handleAddCriteria = async () => {
        setValidationMessage("");
        let trimmedName = criteriaName.trim();

        if (!trimmedName) {
            setValidationMessage("Criteria name cannot be empty.");
            return;
        }

        if (trimmedName.length < 3 || trimmedName.length > 20) {
            setValidationMessage("Criteria name must be between 3 and 20 characters.");
            return;
        }

        const nameRegex = /^[a-zA-Z0-9 ]+$/;
        if (!nameRegex.test(trimmedName)) {
            setValidationMessage("Criteria name can only contain letters, numbers, and spaces.");
            return;
        }

        trimmedName = trimmedName.replace(/\b\w/g, (char) => char.toUpperCase());

        try {
            const newCriteria = await CriteriaAPI.createCriteria({ criteriaName: trimmedName, createdBy: localStorage.getItem("userId") });
            handleCloseAddCriteriaModal();
            setTotalElements(totalElements + 1);
            if (criteria.length < pageSize) {
                setCriteria(prevCriteria => [...prevCriteria, newCriteria]);

            } else {
                setTotalPages(totalPages + 1);
            }
            showSuccessMessage("Criteria added successfully!");
        } catch (error) {
            showErrorMessage("Failed to add criteria. Please try again.");
        }
    };

    //Use for delete criteria
    const handleDeleteCriteria = async (criteriaId) => {
        try {
            const response = await CriteriaAPI.deleteCriteria(criteriaId);
            console.log("Response:", response);
            setCriteria(criteria.filter((criteria) => criteria.criteriaId !== criteriaId));
            if (criteria.length === 5) {
                getAllCriteria();
            }
            if (criteria.length === 1) {
                setPage(page - 1);
            }
            setTotalElements(totalElements - 1);
            showSuccessMessage("Criteria deleted successfully!");
        } catch (error) {
            showErrorMessage("Failed to delete criteria. Please try again.");
        }
    };

    //Use for map data header in data grid
    const columns = [
        { field: "index", headerName: "ID", width: 80 },
        { field: "criteriaName", headerName: "Criteria Name", width: 300 },
        { field: "noOfOption", headerName: "No Of Option", width: 150 },
        { field: "maxScore", headerName: "Max Score", width: 150 },
        {
            field: "action", headerName: "Action", width: 200, renderCell: (params) => (
                <>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            navigate(`/criteria/edit/${params.row.id}`);
                        }}
                    >
                        <EditIcon />
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteCriteria(params.row.id)}
                        sx={{ marginLeft: 1 }}
                    >
                        <DeleteIcon />
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div style={{ marginTop: "60px" }}>
            <Slider />
            <Box sx={{ marginTop: 4, padding: 2 }}>
                <Typography variant="h6">
                    <a href="/ranking_decision">Ranking Decision List</a> {'>'} Criteria List
                </Typography>
                <Box sx={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <Typography variant="h5">Criteria List</Typography>
                    <SearchComponent onSearch={handleSearch} />
                    <Button variant="contained" color="primary" onClick={handleOpenAddCriteriaModal} >
                        Add New Criteria
                    </Button>
                </Box>

                <Box sx={{ width: "100%", height: "50vh" }}>
                    <DataGrid
                        apiRef={apiRef}
                        rows={rows}
                        columns={columns}
                        checkboxSelection
                        pagination
                        pageSizeOptions={[5, 10, 20]}
                        getRowId={(row) => row.id}
                        rowCount={totalElements}
                        paginationMode="server" // Kích hoạt phân trang phía server
                        paginationModel={{
                            page: page - 1,  // Adjusted for 0-based index
                            pageSize: pageSize,
                        }}
                        onPaginationModelChange={(model) => {
                            setPage(model.page + 1);  // Set 1-based page for backend
                            setpageSize(model.pageSize);
                        }}
                        disableNextButton={page >= totalPages}
                        disablePrevButton={page <= 1}
                        disableRowSelectionOnClick
                    />
                </Box>

                <Modal open={showAddCriteriaModal} onClose={handleCloseAddCriteriaModal}>
                    <Box sx={{
                        padding: 2, backgroundColor: "white", borderRadius: 1, maxWidth: 400, margin: "auto", marginTop: "20vh"
                    }}>
                        <Typography variant="h6">Add New Criteria</Typography>
                        <TextField
                            label="Criteria Name"
                            variant="outlined"
                            fullWidth
                            value={criteriaName}
                            onChange={(e) => {
                                setCriteriaName(e.target.value);
                                setValidationMessage("");
                            }}
                            error={!!validationMessage}
                            helperText={validationMessage}
                            sx={{ marginTop: 2 }}
                        />
                        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                            <Button variant="outlined" onClick={handleCloseAddCriteriaModal}>Cancel</Button>
                            <Button variant="contained" color="success" onClick={handleAddCriteria} >Add</Button>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        </div>
    );
};

export default CriteriaManagement;
