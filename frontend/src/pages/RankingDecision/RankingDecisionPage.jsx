// react
import React, { useEffect, useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaEye } from 'react-icons/fa';
// css 
import "../../assets/css/RankingGroups.css"
// Mui
import { Box, Button, TextField, Menu, MenuItem, IconButton, Alert } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
// Source code
// Common
import ModalCustom from "../../components/Common/Modal.jsx";
import ActionButtons from "../../components/Common/ActionButtons.jsx";
// Hooks
import useRankingDecision from "../../hooks/useRankingDecision.jsx";
import Slider from "../../layouts/Slider.jsx";
// acountID
import { useAuth } from "../../contexts/AuthContext.jsx";
// Import hook Notification
import useNotification from "../../hooks/useNotification";

const RankingDecision = () => {
    const navigate = useNavigate(); //  // Initialize the useNavigate hook to navigate between pages in the application
    const handleTaskManagementClick = () => {
        navigate('/task_management'); // Navigate Page Task Management
    };
    const handleCriteriaManagementClick = () => {
        navigate('/criteria_management'); // Navigate Page CriteriaManagement
    };
    // State 
    // Add
    const [showAddModal, setShowAddModal] = useState(false); // State to determine whether the additional decision modal is displayed or not
    const [newDecisionName, setnewDecisionName] = useState(""); // State to store the new decison name that the user enters
    // Delete
    const [showDeleteModal, setShowDeleteModal] = useState(false); // State to determine whether the delete decision modal is displayed or not
    const [DecisionToDelete, setDecisionToDelete] = useState(null); // State to store the ID of the decision to be deleted
    const [selectedRows, setSelectedRows] = useState([]); // State to save a list of IDs of selected rows in the DataGrid
    // delete select
    const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
    const handleOpenBulkDeleteModal = () => setShowBulkDeleteModal(true);
    const handleCloseBulk_DeleteRankingModal = () => setShowBulkDeleteModal(false);
    // Use hook notification
    const [showSuccessMessage, showErrorMessage] = useNotification();
    // Validation error message
    const [validationMessage, setValidationMessage] = useState("");
    const apiRef = useGridApiRef(); // Create apiRef to select multiple groups to delete
    // Status
    const [anchorEl, setAnchorEl] = useState(null);
    // Function Onclick Menu
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    // Function Close Menu
    const handleClose = () => {
        setAnchorEl(null);
    };
    // User `useRankingDecision` 
    const {
        data: decisions,
        error,
        loading,
        fetchAllRankingDecisions,
        deleteRankingDecision,
        addRankingDecision,
    } = useRankingDecision();
    // Fetch all ranking decisions when component mounts
    useEffect(() => {
        fetchAllRankingDecisions();
    }, []);

    // Log state changes for debugging purposes
    useEffect(() => {
        console.log("Decisions:", decisions);
        console.log("Loading:", loading);
        console.log("Error:", error);

    }, [decisions, loading, error]);

    //// Handlers to open/close modals for adding or deleting decisions
    // Modal Add
    const handleOpenAddRankingDecisionModal = () => setShowAddModal(true);
    const handleCloseAddRankingDecisionModal = () => {
        setShowAddModal(false);
        setnewDecisionName("");
        setValidationMessage("");
    };
    // Function to add a new decision with validation checks
    const handleAddRankingDecision = async () => {
        setValidationMessage("");
        let trimmedName = newDecisionName.trim();
        if (!trimmedName) {
            setValidationMessage("Ranking Decision Name is required.");
            return;
        }
        const isDuplicate = decisions.some((decision) => {
            return decision.decisionName && decision.decisionName.toLowerCase() === trimmedName.toLowerCase();
        });
        if (isDuplicate) {
            setValidationMessage("Ranking Decision Name already exists.");
            return;
        }
        try {
            const newdecision = {
                decisionName: trimmedName,
                createdBy: localStorage.getItem('userId'), // Get the account ID as the ID of the user creating the decision
                status: "Draft",
            };
            await addRankingDecision(newdecision); // Call API to add new decision
            showSuccessMessage("Ranking Decision successfully added !");
            handleCloseAddRankingDecisionModal();
            // await fetchAllRankingDecisions();
        } catch (error) {
            console.error("Failed to add decision:", error);
            showErrorMessage("Error occurred adding Ranking Decision. Please try again.");

        }
    };


    // Modal Delete
    const handleOpenDeleteRnkingDecisionModal = (decisionId) => {
        setDecisionToDelete(decisionId);
        setShowDeleteModal(true);
    };
    const handleCloseDeleteRankingDecisionModal = () => setShowDeleteModal(false);
    // Function to delete a row ranking decision
    const handledeleteRankingDecision = async () => {
        try {
            if (DecisionToDelete) {
                await deleteRankingDecision(DecisionToDelete);
                showSuccessMessage("Ranking Decision successfully removed!");
                setDecisionToDelete(null);
                handleCloseDeleteRankingDecisionModal();
                await fetchAllRankingDecisions();
            }
        } catch (error) {
            console.error("Failed to delete decision:", error);
            showErrorMessage("Error occurred removing Ranking Decision. Please try again.");
            handleCloseDeleteRankingDecisionModal();
        }
    };
    // Function to delete a selected ranking decisions
    const handleBulkDeleteRankingDecision = async () => {
        // List ID of Row choice
        const selectedIDs = Array.from(apiRef.current.getSelectedRows().keys());
        if (selectedIDs.length === 0) {
            showErrorMessage("Please select decisions to delete.");
            handleCloseBulk_DeleteRankingModal()
            return;
        }
        try {
            await Promise.all(selectedIDs.map(id => deleteRankingDecision(id)));
            showSuccessMessage("Ranking Decision successfully removed.");
            await fetchAllRankingDecisions();
            setSelectedRows([]);
            handleCloseBulk_DeleteRankingModal();
        } catch (error) {
            console.error("Failed to delete selected decisions:", error);
            showErrorMessage("Error occurred removing Ranking Decision. Please try again.");
            handleCloseBulk_DeleteRankingModal();
        }
    };

    // Columns configuration for the DataGrid
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
                    <IconButton
                        color="gray"
                        onClick={() => {
                            console.log(`Viewing group with ID: ${params.row.id}`);
                            navigate(`/ranking-group/view/${params.row.id}`);
                        }}
                    >
                        <FaEye />
                    </IconButton>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            console.log(`Navigating to edit decision with ID: ${params.row.id}`);
                            navigate(`/ranking-decision/edit/${params.row.id}`);
                        }}
                    >
                        <FaEdit />
                    </Button>
                    {params.row.status !== 'Finalized' && (
                        <Button
                            variant="outlined"
                            color="error"
                            sx={{ marginLeft: 1 }} // 
                            onClick={() => handleOpenDeleteRnkingDecisionModal(params.row.id)}
                        >
                            <MdDeleteForever />
                        </Button>
                    )}
                </>
            ),
        },
    ];


    // Map decision data to rows for DataGrid
    const rows = decisions
        ? decisions.map((decision, index) => ({
            id: decision.decisionId,
            index: index + 1,
            dicisionname: decision.decisionName,
            finalizedAt: decision.status === 'Finalized' ? decision.finalizedAt : '-',
            finalizedBy: decision.status === 'Finalized' ? (decision.finalizedBy == null ? "N/A" : decision.finalizedBy) : '-',
            status: decision.status,
        }))
        : [];

    return (
        <div style={{ marginTop: "60px" }}>
            <Slider />
            <div>
                <h2 onClick={handleClick} style={{ cursor: 'pointer' }}>
                    <IconButton onClick={handleClick} style={{ cursor: 'pointer' }}>
                        <MenuIcon />
                    </IconButton>
                    Ranking Decision List
                </h2>
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

                <Box sx={{ width: "100%", height: 370 }}>
                    <DataGrid
                        className="custom-data-grid"
                        apiRef={apiRef}
                        rows={rows}
                        columns={columns}
                        checkboxSelection
                        pagination
                        pageSizeOptions={[5, 10, 25]}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                    page: 0,
                                },
                            },
                        }}
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
                </Box>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <Button variant="contained" color="success" onClick={handleOpenAddRankingDecisionModal}>
                        Add New Decision
                    </Button>
                    <Button variant="contained" color="error" onClick={handleOpenBulkDeleteModal}>
                        Delete Selected Decision
                    </Button>
                </div>

                {/* Modal for adding a new decision */}
                <ModalCustom
                    show={showAddModal}
                    handleClose={handleCloseAddRankingDecisionModal}
                    title="Add New decision"
                    bodyContent={
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
                        />
                    }
                    footerContent={
                        <ActionButtons
                            onCancel={handleCloseAddRankingDecisionModal}
                            onConfirm={handleAddRankingDecision}
                            confirmText="Add"
                            cancelText="Cancel"
                            color="success"
                        />
                    }
                />

                {/* Modal for deleting a decision */}
                <ModalCustom
                    show={showDeleteModal}
                    handleClose={handleCloseDeleteRankingDecisionModal}
                    title="Delete decision"
                    bodyContent="Are you sure you want to delete this decision?"
                    footerContent={
                        <ActionButtons
                            onCancel={handleCloseDeleteRankingDecisionModal}
                            onConfirm={handledeleteRankingDecision}
                            confirmText="Delete"
                            cancelText="Cancel"
                            color="error"
                        />
                    }
                />
                {/* Modal for deleting select group */}
                <ModalCustom
                    show={showBulkDeleteModal}
                    handleClose={handleCloseBulk_DeleteRankingModal}
                    title="Delete Selected Groups"
                    bodyContent="Are you sure you want to delete the selected groups?"
                    footerContent={
                        <ActionButtons
                            onCancel={handleCloseBulk_DeleteRankingModal}
                            onConfirm={handleBulkDeleteRankingDecision}
                            confirmText="Delete"
                            cancelText="Cancel"
                            color="error"
                        />
                    }
                />
            </div>
        </div>
    );
};

export default RankingDecision;
