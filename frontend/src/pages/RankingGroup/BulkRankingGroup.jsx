// react
import React, { useEffect, useState } from "react";
import { FaEdit, FaAngleRight } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
// css 
import "../../assets/css/RankingGroups.css"
// Mui
import {
    InputAdornment, Box, Button, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Modal, IconButton, Switch, FormControlLabel, Alert, FormHelperText
} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import EditIcon from '@mui/icons-material/Edit';
// import CloseIcon from '@mui/icons-material/Close';
import Autocomplete from '@mui/material/Autocomplete';
// Source code
import ModalCustom from "../../components/Common/Modal.jsx";
import useRankingGroup from "../../hooks/useRankingGroup.jsx";
import useRankingDecision from "../../hooks/useRankingDecision.jsx";
import Slider from "../../layouts/Slider.jsx";
// acountID
import { useAuth } from "../../contexts/AuthContext.jsx";

const BulkRankingGroup = () => {
    const navigate = useNavigate(); // To navigate between pages
    const { id } = useParams(); // Get the ID from the URL

    // State 
    // Edit
    const [editGroup, setEditGroup] = useState({ groupName: '', currentRankingDecision: '' });
    const [originalGroupName, setOriginalGroupName] = useState('');
    const [showEditGroupInfoModal, setShowEditGroupInfoModal] = useState(false); // Display group editing modal
    const [newGroupName, setNewGroupName] = useState(""); // New Group Name
    const [selectedDecision, setSelectedDecision] = useState(""); // Current rating decision
    const [rankingDecisions, setRankingDecisions] = useState([]); // List of ranking decisions
    // Add
    const [showAddModal, setShowAddModal] = useState(false); // Show modal add decision
    const [newDecisionName, setnewDecisionName] = useState(""); // New decision name
    const [clone, setClone] = useState(false); // Clone state decides
    const [selectedCloneDecision, setSelectedCloneDecision] = useState(""); // Decided to clone
    // Delele
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [DecisionToDelete, setDecisionToDelete] = useState(null);
    // Status
    const [message, setMessage] = useState(""); // Status notification
    const [messageType, setMessageType] = useState("success"); // Message type (success/error)
    const [validationMessage, setValidationMessage] = useState(""); // Validation error message
    // Destructuring from useRankingGroup custom hook
    const {
        data: groups,
        fetchAllRankingGroups,
        fetchRankingGroupById,
        updateRankingGroup,
    } = useRankingGroup();
    // // Destructuring from useRankingDecision custom hook
    const {
        data: decisions,
        fetchAllRankingDecisions,
        deleteRankingDecision,
        addRankingDecision,
        addDecisionWithClone,
    } = useRankingDecision();
    // Get the list of ranking decisions
    useEffect(() => {
        fetchAllRankingDecisions();
    }, []);
    useEffect(() => {
        console.log('Decisions:', decisions);
    }, [decisions]);
    useEffect(() => {
        const loadGroup = async () => {
            try {
                const groupData = await fetchRankingGroupById(id);
                setEditGroup({
                    groupName: groupData.groupName,
                    currentRankingDecision: groupData.currentRankingDecision,
                });
                setOriginalGroupName(groupData.groupName);
                setNewGroupName(groupData.groupName);
                setSelectedDecision(groupData.currentRankingDecision);
                setRankingDecisions(groupData.rankingDecisions || []);
            } catch (error) {
                console.error("Error fetching group:", error);
            }
        };
        loadGroup();
    }, [id]);



    //// Handlers to open/close modals for editing of the group info
    const handleOpenEditGroupInfoModal = () => {
        setShowEditGroupInfoModal(true);
        setValidationMessage("");
    };
    const handleEditGroupInfo = async () => {
        setValidationMessage("");
        let trimmedName = newGroupName.trim();
        // Validation for the group name
        if (!trimmedName) {
            setValidationMessage("Group name cannot be empty.");
            return;
        }
        if (trimmedName.length < 3 || trimmedName.length > 20) {
            setValidationMessage("Group name must be between 3 and 20 characters.");
            return;
        }
        const nameRegex = /^[a-zA-Z0-9 ]+$/;
        if (!nameRegex.test(trimmedName)) {
            setValidationMessage("Group name can only contain letters, numbers, and spaces.");
            return;
        }
        // Check if the group name already exists, excluding the current group name
        const existingGroups = await fetchAllRankingGroups();
        const groupExists = existingGroups.some(group =>
            group.groupName.toLowerCase() === trimmedName.toLowerCase() && group.groupName !== editGroup.groupName
        );
        if (groupExists) {
            setValidationMessage("Group name already exists. Please choose a different name.");
            return;
        }
        // Prevent changing the name of the trainer group
        if (editGroup.groupName === "Trainer" && trimmedName !== "Trainer") {
            setValidationMessage("Cannot change the name of the Trainer group.");
            return;
        }
        // Capitalize the first letter of each word
        trimmedName = trimmedName.replace(/\b\w/g, (char) => char.toUpperCase());
        // Prepare the updated group object
        try {
            const updatedGroup = {
                groupName: trimmedName,
                currentRankingDecision: selectedDecision || editGroup.currentRankingDecision,
            };
            await updateRankingGroup(id, updatedGroup);
            setOriginalGroupName(trimmedName);
            setMessageType("success");
            setMessage("Group Info successfully updated");
            setTimeout(() => setMessage(null), 2000);
            setShowEditGroupInfoModal(false);
        } catch (error) {
            console.error("Error updating group:", error);
            setMessageType("error");
            setMessage("Error occurred updating Group Info. Please try again.”.");
            setTimeout(() => setMessage(null), 2000);
        }
    };
    const handleCloseEditGroupInfoModal = () => {
        setShowEditGroupInfoModal(false);
        setValidationMessage("");
    };
    // Handlers to open/close modals for adding Decision
    // Open the modal
    const handleOpenAddRankingDecisionModal = () => {
        setShowAddModal(true);
        setClone(false);
        setSelectedCloneDecision("");
        setValidationMessage("");
    };
    // Close the modal
    const handleCloseAddRankingDecisionModal = () => {
        setShowAddModal(false);
        setnewDecisionName("");
        setValidationMessage("");
    };

    const handleAddDecision = async () => {
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
            const newDecision = {
                decisionName: trimmedName,
                createdBy: localStorage.getItem('userId'), // Get the account ID as the ID of the user creating the decision
                status: "Draft",
            };
            // Check if clone is selected
            if (clone) {
                await addDecisionWithClone(newDecision, selectedCloneDecision);
            } else {
                await addRankingDecision(newDecision);
            }
            setRankingDecisions([...rankingDecisions, newDecision]);
            setMessageType("success");
            setMessage("Ranking Decision successfully added.”");
            setTimeout(() => setMessage(null), 2000);
            handleCloseAddRankingDecisionModal();
            await fetchAllRankingDecisions()
        } catch (error) {
            console.error("Failed to add decision:", error);
            setMessageType("danger");
            setMessage("Error occurred adding Ranking Decision. Please try again.”.");
            setTimeout(() => setMessage(null), 2000);
        }
    };


    // Handlers to open/close modals for deleting Decision
    // Modal Delete
    const handleOpenDeleteModal = (decisionId) => {
        setDecisionToDelete(decisionId); // Set decisionToDelete as the ID of the currently selected decision
        setShowDeleteModal(true);
    };
    const handleCloseDeleteModal = () => setShowDeleteModal(false);
    // Function to delete a selected Decision
    const handledeleteRankingDecision = async () => {
        try {
            if (DecisionToDelete) {
                await deleteRankingDecision(DecisionToDelete);
                setMessageType("success");
                setMessage("Decision deleted successfully!");
                setTimeout(() => setMessage(null), 2000);
                setDecisionToDelete(null);
                handleCloseDeleteModal();
                await fetchAllRankingDecisions();
            }
        } catch (error) {
            console.error("Failed to delete group:", error);
            setMessageType("danger");
            setMessage("Failed to delete group. Please try again.");
            setTimeout(() => setMessage(null), 2000);
            handleCloseDeleteModal();
        }
    };

    /// Columns configuration for the DataGrid
    // const columns = [
    //     { field: "index", headerName: "File Name", width: 200 },
    //     { field: "rankingdicision", headerName: "Ranking Decision", width: 300 },
    //     { field: "uploadedAt", headerName: "Uploaded At", width: 130 },
    //     { field: "uploadedBy", headerName: "Uploaded By", width: 130 },
    //     { field: "status", headerName: "Status", width: 130 },
    //     { field: "note", headerName: "Note", width: 300 }
    // ];

    // // Map decision data to rows for DataGrid
    // const rows = decisions
    //     ? decisions.map((decision, index) => ({
    //         id: decision.decisionId,
    //         index: index + 1,
    //         dicisionname: decision.decisionName,
    //         finalizedAt: decision.status === 'Finalized' ? decision.finalizedAt : '-',
    //         finalizedBy: decision.status === 'Finalized' ? (decision.finalizedBy == null ? "N/A" : decision.finalizedBy) : '-',
    //         status: decision.status
    //     }))
    //     : [];
    return (
        <div style={{ marginTop: "60px" }}>
            <Slider />
            {/* Group Info */}
            <Box sx={{ marginTop: 4, padding: 2 }}>
                <Typography variant="h6">
                    <a href="/ranking-group">Ranking Group List</a>{" "}
                    {<FaAngleRight />}
                    Bulk Ranking Group
                </Typography>
                <Box sx={{
                    border: '1px solid black',
                    borderRadius: '4px',
                    padding: '16px',
                    marginTop: '16px'
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ width: '48%' }}>
                            <Typography>Group Name:</Typography>
                            <TextField variant="outlined" fullWidth value={originalGroupName} disabled />
                        </Box>
                        <Box sx={{ width: '48%' }}>
                            <Typography>Current Ranking Decision:</Typography>
                            <TextField variant="outlined" fullWidth value={editGroup.currentRankingDecision} disabled />
                        </Box>
                    </Box>
                </Box>
                {/* Displaying messages after when add/delete decision*/}
                {message && (
                    <Alert severity={messageType} sx={{ marginTop: 2 }}>
                        {message}
                    </Alert>
                )}

                <Box sx={{
                    marginTop: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px'
                }}>
                    <Typography variant="h5">Bulk Ranking History</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}> {/* Sử dụng gap để tạo khoảng cách giữa các nút */}
                        <Button variant="contained" color="primary" onClick={handleOpenAddRankingDecisionModal}>
                            Export Template
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleOpenAddRankingDecisionModal}>
                            Bulk Ranking
                        </Button>
                    </Box>
                </Box>

                {/* Table Show Ranking Decision List */}
                {/* <Box sx={{ width: "100%", height: 350 }}>
                    <DataGrid
                        className="custom-data-grid"
                        rows={rows}
                        columns={columns}
                        // checkboxSelection
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
                        // disableRowSelectionOnClick
                        autoHeight={false}
                        sx={{
                            height: '100%',
                            overflow: 'auto',
                            '& .MuiDataGrid-virtualScroller': {
                                overflowY: 'auto',
                            },
                        }}
                    />
                </Box> */}
                {/* Modal for editing group info */}
                <Modal open={showEditGroupInfoModal} onClose={handleCloseEditGroupInfoModal}>
                    <Box sx={{
                        padding: 2,
                        backgroundColor: 'white',
                        borderRadius: 1,
                        maxWidth: 400,
                        margin: 'auto',
                        marginTop: '100px'
                    }}>
                        <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            Edit Group Info
                            <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseEditGroupInfoModal}></button>
                        </Typography>
                        <TextField
                            label="Group Name"
                            variant="outlined"
                            fullWidth
                            value={newGroupName}
                            onChange={(e) => {
                                setNewGroupName(e.target.value);
                                setValidationMessage("");
                            }}
                            error={!!validationMessage}
                            helperText={validationMessage}
                            sx={{ marginTop: 2 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => {
                                                setNewGroupName('');
                                                setValidationMessage("");
                                            }}
                                            size="small"
                                        >
                                            <ClearIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {/* <Autocomplete
                            disablePortal
                            options={decisions ? decisions.filter(decision => decision.status === 'Finalized') : []}
                            getOptionLabel={(option) => option.decisionName || ''}
                            onChange={(event, value) => {
                                setSelectedDecision(value ? value.id : null);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Current Ranking Decision"
                                    variant="outlined"
                                    fullWidth
                                    sx={{ marginTop: 2 }}
                                />
                            )}
                        /> */}
                        <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
                            <Button variant="outlined" onClick={handleCloseEditGroupInfoModal}>Cancel</Button>
                            <Button variant="contained" onClick={handleEditGroupInfo}>Save</Button>
                        </Box>
                    </Box>
                </Modal>
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
                                options={decisions}
                                getOptionLabel={(option) => option.decisionName || ''}
                                onChange={(event, value) => {
                                    setSelectedDecision(value ? value.id : null);
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
                            <Button variant="contained" onClick={handleAddDecision}>Save</Button>
                        </Box>
                    </Box>
                </Modal>
                {/* Modal for deleting a Decision */}
                <ModalCustom
                    show={showDeleteModal}
                    handleClose={handleCloseDeleteModal}
                    title="Delete Decision"
                    bodyContent="Are you sure you want to delete this Decision?"
                    footerContent={
                        <>
                            <Button variant="outlined" onClick={handleCloseDeleteModal}>
                                Cancel
                            </Button>
                            <Button variant="contained" color="error" onClick={handledeleteRankingDecision}>
                                Delete
                            </Button>
                        </>
                    }
                />
            </Box>
        </div>
    );
};

export default BulkRankingGroup;
