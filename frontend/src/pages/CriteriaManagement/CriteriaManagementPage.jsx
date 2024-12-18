import React, { useEffect, useState } from "react";
import { FaEye } from 'react-icons/fa';
import { MdDeleteForever } from "react-icons/md";
import { FaEdit, FaAngleRight } from "react-icons/fa";
//Layout
import { Box, Button, Typography, TextField, Modal } from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import Slider from "../../layouts/Slider.jsx";
import SearchComponent from "../../components/Common/Search.jsx";
import ModalCustom from "../../components/Common/Modal.jsx";
import ActionButtons from "../../components/Common/ActionButtons.jsx";

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
    const [rows, setRows] = useState([]);
    //Use for show delete modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    //Use for save criteria id
    const [selectedCriteriaId, setSelectedCriteriaId] = useState(null);
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

    ///////////////////////////////////////////////////////// Search ////////////////////////////////////////////////////////////////////////
    const handleSearch = (event) => {
        if (event) {
            setFilter(sfLike("criteriaName", event).toString());
        } else {
            setFilter("");
        }
        setPage(1);
    };
    ///////////////////////////////////////////////////////// Add ////////////////////////////////////////////////////////////////////////
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

    const handleOpenDeleteModal = (criteriaId) => {
        setSelectedCriteriaId(criteriaId);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setSelectedCriteriaId(null);
        setShowDeleteModal(false);
    };


    const handleAddCriteria = async () => {
        setValidationMessage("");
        let trimmedName = criteriaName.trim();

        if (!trimmedName) {
            setValidationMessage("Criteria Name is required.");
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
            if (error.exception) {
                if (error.exception.criteriaName.includes("name exists already!")) {
                    console.log(error.exception);
                    setValidationMessage("Criteria Name already existed");
                }
            } else {
                showErrorMessage("Failed to add criteria. Please try again.");
            }
        }
    };

    //Use for delete criteria
    const handleDeleteCriteria = async () => {
        try {
            const response = await CriteriaAPI.deleteCriteria(selectedCriteriaId);
            console.log("Response:", response);
            setCriteria(criteria.filter((criteria) => criteria.criteriaId !== selectedCriteriaId));
            if (criteria.length === 5) {
                getAllCriteria();
            }
            if (criteria.length === 1) {
                setPage(page - 1);
            }
            setTotalElements(totalElements - 1);
            showSuccessMessage("Criteria deleted successfully!");
            handleCloseDeleteModal();
        } catch (error) {
            showErrorMessage("Failed to delete criteria. Please try again.");
        }
    };

    ///////////////////////////////////////////////////////// Table ////////////////////////////////////////////////////////////////////////
    //Use for map data header in data grid
    const columns = [
        { field: "index", headerName: "ID", width: 100 },
        { field: "criteriaName", headerName: "Criteria Name", width: 350 },
        { field: "noOfOption", headerName: "No Of Option", width: 200 },
        { field: "maxScore", headerName: "Max Score", width: 200 },
        {
            field: "action", headerName: "Action", width: 200, renderCell: (params) => (
                <>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            navigate(`/criteria/edit/${params.row.id}`);
                        }}
                    >
                        <FaEdit />
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleOpenDeleteModal(params.row.id)}
                        sx={{ marginLeft: 1 }}
                    >
                        <MdDeleteForever />
                    </Button>
                </>
            ),
        },
    ];
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

    return (
        <div style={{ marginTop: "60px" }}>
            <Slider />
            <Box>
                <Typography variant="h6">
                    <a href="/ranking-decision">Ranking Decision List</a>
                    {<FaAngleRight />}
                    Criteria List
                </Typography>
                <SearchComponent onSearch={handleSearch} />
                {/* Table  */}
                <Box sx={{ width: "100%", height: 370, marginTop: '30px' }}>
                    <DataGrid
                        className="custom-data-grid"
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
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, mb: 2 }}>
                    <Button sx={{ height: 40, width: 200 }} variant="contained" color="primary" onClick={handleOpenAddCriteriaModal} >
                        Add New Criteria
                    </Button>
                </Box>
                {/* Add */}
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

            {/* Delete Modal */}
            <ModalCustom
                show={showDeleteModal}
                handleClose={handleCloseDeleteModal}
                title="Delete Criteria"
                bodyContent="Are you sure you want to remove this criteria?"
                footerContent={
                    <ActionButtons
                        onCancel={handleCloseDeleteModal}
                        onConfirm={handleDeleteCriteria}
                        confirmText="Yes"
                        cancelText="No"
                        color="error"
                    />
                }
            />
        </div>
    );
};

export default CriteriaManagement;
