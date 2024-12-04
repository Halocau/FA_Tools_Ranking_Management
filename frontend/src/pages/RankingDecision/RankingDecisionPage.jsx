// react
import React, { useEffect, useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaEye } from 'react-icons/fa';
//Filter Query Builder
import { sfLike } from 'spring-filter-query-builder';
// Mui
import { Box, Button, Menu, MenuItem, InputAdornment, Typography, TextField, FormControl, InputLabel, Select, Modal, IconButton, Switch, FormControlLabel, Alert, FormHelperText } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import Autocomplete from '@mui/material/Autocomplete';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
// Css
import "../../assets/css/RankingGroups.css"
// Source code
// API
import RankingDecisionAPI from "../../api/RankingDecisionAPI.js";
//Common
import ModalCustom from "../../components/Common/Modal.jsx";
import ActionButtons from "../../components/Common/ActionButtons.jsx";
import SearchComponent from "../../components/Common/Search.jsx";
// Contexts
import { useAuth } from "../../contexts/AuthContext.jsx";
// Hooks
import useNotification from "../../hooks/useNotification";
import useRankingDecision from "../../hooks/useRankingDecision"

// Layouts
import Slider from "../../layouts/Slider.jsx";

const RankingDecision = () => {
    const navigate = useNavigate(); //  // Initialize the useNavigate hook to navigate between pages in the application
    //
    const handleTaskManagementClick = () => {
        navigate('/task-management'); // Navigate Page Task Management
    };
    const handleCriteriaManagementClick = () => {
        navigate('/criteria-management'); // Navigate Page CriteriaManagement
    };

    const { user } = useAuth();
    console.log(user);
    //// State
    // Table  List Ranking decision (page, size)
    const [rows, setRows] = useState([]); // Initialize with empty array
    const [rankingDecisions, setRankingDecisions] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    // ApiRef   
    const apiRef = useGridApiRef(); // Create apiRef to select multiple decisions to delete

    // Add
    const [showAddModal, setShowAddModal] = useState(false); // State to determine whether the additional decision modal is displayed or not
    const [newDecisionName, setnewDecisionName] = useState(""); // State to store the new decison name that the user enters
    const [clone, setClone] = useState(false); // Clone state decides
    const [selectedCloneDecision, setSelectedCloneDecision] = useState(null);
    const [listDecisionSearchClone, setlistDecisionSearchClone] = useState([]);
    // Delete
    const [showDeleteModal, setShowDeleteModal] = useState(false); // State to determine whether the delete decision modal is displayed or not
    const [decisionToDelete, setDecisionToDelete] = useState(null); // State to store the ID of the decision to be deleted
    // delete select
    const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
    // Search Decision
    const [filter, setFilter] = useState("");
    // Use hook notification
    const [showSuccessMessage, showErrorMessage] = useNotification();
    // Validation error message
    const [validationMessage, setValidationMessage] = useState(""); setRows
    // Status menu
    const [anchorEl, setAnchorEl] = useState(null);
    // Function Onclick Menu
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    // Function Close Menu
    const handleClose = () => {
        setAnchorEl(null);
    };

    //  Destructuring from RankingdecisionAPI custom API
    const fetchAllRankingDecisions = async () => {
        try {
            const data = await RankingDecisionAPI.searchRankingDecisions(
                filter,
                page,
                pageSize
            );
            setRankingDecisions(data.result);
            setTotalPages(data.pageInfo.total);
            setTotalElements(data.pageInfo.element);
        } catch (error) {
            console.error("Failed to fetch decision:", error);
        }
    }
    // Fetch all ranking decisions when component mounts
    useEffect(() => {
        fetchAllRankingDecisions();
    }, [page, pageSize, filter]);
    ;

    /////////////////////////////////////////////////////// Add Ranking Decision //////////////////////////////////////////////////////////////////////
    //  list ranking decision to choose from for clone
    const fetchlistRankingDecisionsClone = async () => {
        try {
            const data = await RankingDecisionAPI.searchRankingDecisions(
                filter,
                1,
                totalElements,
            );
            setlistDecisionSearchClone(data.result)
        } catch (error) {
            console.error("Failed to fetch decision:", error);
        }
    }
    useEffect(() => {
        fetchlistRankingDecisionsClone();
    }, [totalElements, filter])
    // Open the modal
    const handleOpenAddRankingDecisionModal = () => setShowAddModal(true);
    // Close the modal
    const handleCloseAddRankingDecisionModal = () => {
        setShowAddModal(false);
        setnewDecisionName("");
        setValidationMessage("");
        setSelectedCloneDecision(null);
        setClone(false);
    };
    // Function to adding Ranking Decision
    const handleAddRankingDecision = async () => {
        setValidationMessage("");
        let trimmedName = newDecisionName.trim();
        if (!trimmedName) {
            setValidationMessage("Ranking Decision Name is required.");
            return;
        }
        const isDuplicate = rankingDecisions.some(
            decision => decision.decisionName.toLowerCase() === trimmedName.toLowerCase()
        );
        if (isDuplicate) {

            setValidationMessage("Decision name already exists.");
            return;
        }
        try {
            let newDecision = {
                decisionName: trimmedName,
                createdBy: localStorage.getItem('userId'),
            };
            // Check condision Clone
            if (clone && selectedCloneDecision) {
                newDecision = {
                    ...newDecision,
                    CloneDecision: selectedCloneDecision.decisionId
                };
                await RankingDecisionAPI.addRankingDecision(newDecision);
            } else {
                newDecision = {
                    ...newDecision,
                    CloneDecision: null
                };
                await RankingDecisionAPI.addRankingDecision(newDecision);
            }
            // setRankingDecisions([...rankingDecisions, newDecision]);
            setTotalElements(totalElements + 1);
            if (rankingDecisions.length < pageSize) {
                fetchAllRankingDecisions();
            } else {
                setTotalPages(totalPages + 1);
            }
            handleCloseAddRankingDecisionModal();
            showSuccessMessage("Ranking Decision successfully added.");
        } catch (error) {
            console.error("Failed to add decision:", error);
            if (error.response && error.response.data) {
                // Check and get the error message from the exception section
                if (error.response.data.exception && error.response.data.exception.decisionName) {
                    setValidationMessage(error.response.data.exception.decisionName);
                } else if (error.response.data.detailMessage) {
                    setValidationMessage(error.response.data.detailMessage);
                } else if (error.response.data.message) {
                    setValidationMessage(error.response.data.message);
                } else {
                    showErrorMessage("Error occurred adding Ranking Decision. Please try again");
                }
            } else {
                showErrorMessage("Error occurred adding Ranking Decision. Please try again");
            }
        }
    };

    /////////////////////////////////////////////////////// Delete Ranking Decision //////////////////////////////////////////////////////////////////////
    // Open the modal
    const handleOpenDeleteRankingDecisionModal = (decisionId) => {
        setDecisionToDelete(decisionId);
        setShowDeleteModal(true);
    };
    // Close the modal
    const handleCloseDeleteRankingDecisionModal = () => setShowDeleteModal(false);
    // Function to delete a  ranking decision
    const handleDeleteRankingDecision = async () => {
        try {
            if (decisionToDelete) {
                await RankingDecisionAPI.deleteRankingDecision(decisionToDelete);
                setRankingDecisions(rankingDecisions.filter((decision) => decision.decisionId !== decisionToDelete))
                if (rankingDecisions.length === 5) {
                    fetchAllRankingDecisions();
                }
                if (rankingDecisions.length === 1) {
                    setPage(page - 1)
                }
            }
            setTotalElements(totalElements - 1);
            showSuccessMessage("Ranking Decision successfully removed.");
            setDecisionToDelete(null);
            handleCloseDeleteRankingDecisionModal();
        } catch (error) {
            console.error("Failed to delete decison:", error);
            showErrorMessage("Error occurred removing Ranking Decision. Please try again.");
            handleCloseDeleteRankingDecisionModal();
        }
    };
    /////////////////////////////////////////////////////// Bulk Delete Ranking Decision /////////////////////////////////////////////////////////////////
    // Open the modal
    const handleOpenBulkDeleteModal = () => setShowBulkDeleteModal(true);
    // Close the modal
    const handleCloseBulkDeleteModal = () => setShowBulkDeleteModal(false);
    const handleBulkDeleteRankingDecision = async () => {
        const selectedIDs = Array.from(apiRef.current.getSelectedRows().keys());
        if (selectedIDs.length === 0) {
            showErrorMessage("Please select decisions to delete.");
            handleCloseBulkDeleteModal();
            return;
        }
        try {
            await Promise.all(selectedIDs.map((id) => RankingDecisionAPI.deleteRankingDecision(id)));
            showSuccessMessage("Selected decision deleted successfully!");
            const updatedRankingDecisions = rankingDecisions.filter(
                (decision) => !selectedIDs.includes(decision.decisionId)
            );
            setRankingDecisions(updatedRankingDecisions);
            if (rankingDecisions.length === 5) {
                await fetchAllRankingDecisions();
            }
            if (rankingDecisions.length === 1) {
                setPage(page - 1);
            }
            await fetchAllRankingDecisions();
            handleCloseBulkDeleteModal();
        } catch (error) {
            console.error("Error during bulk delete:", error);
            showErrorMessage("An error occurred while deleting decisions.");
        }
    };

    /////////////////////////////////////////////////////// Search Ranking Decision /////////////////////////////////////////////////////////////////////
    const handleSearch = (event) => {
        // console
        console.log("Search", event)
        if (event) {
            setFilter(sfLike("decisionName", event).toString());
        } else {
            setFilter("")
        }
        setPage(1);
    };

    ///////////////////////////////////////////////////////// Table Ranking Decision ////////////////////////////////////////////////////////////////////////
    //// Define columns for DataGrid
    const columns = [
        { field: "index", headerName: "ID", width: 80 },
        { field: "dicisionname", headerName: "Ranking Decision Name", width: 350 },
        { field: "finalizedAt", headerName: "Finalized At", width: 200 },
        { field: "finalizedBy", headerName: "Finalized By", width: 180 },
        { field: "status", headerName: "Status", width: 150 },
        {
            field: "action",
            headerName: "Action",
            width: 200,
            renderCell: (params) => (
                <>
                    {(params.row.status === 'Finalized' || params.row.status === 'Confirm') && (
                        <Button
                            variant="outlined"
                            color="gray"
                            sx={{ marginLeft: 1 }}
                            onClick={() => {
                                console.log(`Viewing decision with ID: ${params.row.id}`);
                                navigate(`/ranking-decision/view/${params.row.id}`);
                            }}
                        >
                            <FaEye />
                        </Button>
                    )}
                    {(params.row.status !== 'Confirm') && (
                        <Button
                            variant="outlined"
                            sx={{ marginLeft: 1 }}
                            onClick={() => {
                                console.log(`Navigating to edit decision with ID: ${params.row.id}`);
                                navigate(`/ranking-decision/edit/${params.row.id}`);
                            }}
                        >
                            <FaEdit />
                        </Button>
                    )}
                    {(params.row.status === 'Draft') && (
                        <Button
                            variant="outlined"
                            color="error"
                            sx={{ marginLeft: 1 }}
                            onClick={() => handleOpenDeleteRankingDecisionModal(params.row.id)}
                        >
                            <MdDeleteForever />
                        </Button>
                    )}
                </>
            ),
        },
    ];
    // Map decision data to rows for DataGrid when rows are fetched
    useEffect(() => {
        if (rankingDecisions) {
            const mappedRows = rankingDecisions.map((decision, index) => ({
                id: decision.decisionId,
                index: index + 1 + (page - 1) * pageSize,
                dicisionname: decision.decisionName,
                finalizedAt: decision.status === 'Finalized' ? decision.finalizedAt : '-',
                finalizedBy: decision.status === 'Finalized' ? (decision.finalizedBy == null ? "N/A" : decision.finalizedBy) : '-',
                status: decision.status
            }));
            setRows(mappedRows); // Update rows with data from decisions
        }
    }, [rankingDecisions]);

    /////////////////////////////////////////////////////////// Return ///////////////////////////////////////////////////////////
    return (
        <div style={{ marginTop: "60px" }}>
            <Slider />
            <h2 onClick={handleClick} style={{ cursor: 'pointer' }}>
                <IconButton onClick={handleClick} style={{ cursor: 'pointer' }}>
                    <MenuIcon />
                </IconButton>
                Ranking Decision List
            </h2>
            {/* Menu list task and criteria */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {/* Task Management */}
                <MenuItem onClick={handleTaskManagementClick}>
                    Task Management
                </MenuItem>
                {/* Criteria Management */}
                <MenuItem onClick={handleCriteriaManagementClick}>
                    Criteria Management
                </MenuItem>
            </Menu>
            {/* Search Decision */}
            <SearchComponent onSearch={handleSearch} placeholder=" Sreach Decision" />
            {/* Table show Ranking Decision */}
            <Box sx={{ width: "100%", height: 370, marginTop: '50px' }}>
                {/* {loading ? <CircularProgress /> : ( */}
                <DataGrid
                    className="custom-data-grid"
                    apiRef={apiRef}
                    rows={rows}
                    columns={columns}
                    checkboxSelection
                    pagination
                    pageSizeOptions={[5, 10, 25]}
                    getRowId={(row) => row.id}
                    rowCount={totalElements}
                    paginationMode="server"
                    paginationModel={{
                        page: page - 1,  // Adjusted for 0-based index
                        pageSize: pageSize,
                    }}
                    onPaginationModelChange={(model) => {
                        setPage(model.page + 1);  // Set 1-based page for backend
                        setPageSize(model.pageSize);
                    }}
                    disableNextButton={page >= totalPages}
                    disablePrevButton={page <= 1}
                    disableRowSelectionOnClick
                    autoHeight={false}
                    sx={{
                        height: '100%',
                        overflow: 'auto',
                        '& .MuiDataGrid-virtualScroller': {
                            overflowY: 'auto',
                        },
                    }}
                />
                {/* )} */}
            </Box>

            {/* Button Add new Group and Delete Selected Decision */}
            <Box style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <Button variant="contained" color="success" onClick={handleOpenAddRankingDecisionModal}>
                    Add New Decision
                </Button>
                <Button variant="contained" color="error" onClick={handleOpenBulkDeleteModal}>
                    Delete Selected Decision
                </Button>
            </Box>

            {/* Modal for adding new ranking decision */}
            <Modal open={showAddModal} onClose={handleCloseAddRankingDecisionModal}>
                <Box sx={{
                    padding: 2,
                    backgroundColor: 'white',
                    borderRadius: 1,
                    maxWidth: 400,
                    margin: 'auto',
                    marginTop: '100px'
                }}>

                    <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Add New Ranking Decision
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseAddRankingDecisionModal}></button>
                    </Typography>

                    <TextField
                        label="Decision Name"
                        variant="outlined"
                        fullWidth
                        value={newDecisionName}
                        onChange={(e) => {
                            setnewDecisionName(e.target.value);
                            setValidationMessage("");
                        }}
                        error={!!validationMessage}
                        helperText={validationMessage}
                        sx={{ marginTop: 2 }}
                    />
                    <FormControlLabel
                        control={<Switch checked={clone} onChange={() => setClone(!clone)} />}
                        label="Clone from other decision"
                    />
                    {clone && (
                        <Autocomplete
                            disablePortal
                            options={listDecisionSearchClone}
                            getOptionLabel={(option) => option.decisionName || ''}
                            value={selectedCloneDecision}
                            onChange={(event, value) => {
                                setSelectedCloneDecision(value || null);
                                console.log(selectedCloneDecision)

                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Choice Decision"
                                    variant="outlined"
                                    fullWidth
                                    sx={{ marginTop: 2 }}
                                />
                            )}
                        />
                    )}
                    <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="outlined" onClick={handleCloseAddRankingDecisionModal}>Cancel</Button>
                        <Button variant="contained" onClick={handleAddRankingDecision}>Save</Button>
                    </Box>
                </Box>
            </Modal>
            {/* Modal for deleting a decision */}
            <ModalCustom
                show={showDeleteModal}
                handleClose={handleCloseDeleteRankingDecisionModal}
                title="Delete decision"
                bodyContent="Are you sure you want to delete this decision?"
                footerContent={
                    <ActionButtons
                        onCancel={handleCloseDeleteRankingDecisionModal}
                        onConfirm={handleDeleteRankingDecision}
                        confirmText="Delete"
                        cancelText="Cancel"
                        color="error"
                    />
                }
            />
            {/* Modal for deleting select decision */}
            <ModalCustom
                show={showBulkDeleteModal}
                handleClose={handleCloseBulkDeleteModal}
                title="Delete Selected decisions"
                bodyContent="Are you sure you want to delete the selected decisions?"
                footerContent={
                    <ActionButtons
                        onCancel={handleCloseBulkDeleteModal}
                        onConfirm={handleBulkDeleteRankingDecision}
                        confirmText="Delete"
                        cancelText="Cancel"
                        color="error"
                    />
                }
            />
        </div>
    );
};

export default RankingDecision;
