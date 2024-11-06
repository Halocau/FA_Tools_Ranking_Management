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
import Autocomplete from '@mui/material/Autocomplete';
// Source code
import ModalCustom from "../../components/Common/Modal.jsx";
import ActionButtons from "../../components/Common/ActionButtons.jsx";
// acountID
import { useAuth } from "../../contexts/AuthContext.jsx";
import useRankingGroup from "../../hooks/useRankingGroup.jsx";
import useRankingDecision from "../../hooks/useRankingDecision.jsx";
import Slider from "../../layouts/Slider.jsx";

// Import hook Notification
import useNotification from "../../hooks/useNotification";

const EditRankingGroup = () => {
    const navigate = useNavigate(); // To navigate between pages
    const { id } = useParams(); // Get the ID from the URL

    // Edit
    const [editGroup, setEditGroup] = useState({ groupName: '', currentRankingDecision: '' });
    const [originalGroupName, setOriginalGroupName] = useState('');
    const [showEditGroupInfoModal, setShowEditGroupInfoModal] = useState(false); // Display group editing modal
    const [newGroupName, setNewGroupName] = useState(""); // New Group Name
    const [originalDecisionName, setOriginalDecisionName] = useState('');
    // const [selectedCurrentDecision, setselectedCurrentDecision] = useState(''); // Current rating decision
    const [selectedCurrentDecision, setselectedCurrentDecision] = useState(null); // Current rating decision
    const [rankingDecisions, setRankingDecisions] = useState([]); // List of ranking decisions
    // Add
    const [showAddModal, setShowAddModal] = useState(false); // Show modal add decision
    const [newDecisionName, setnewDecisionName] = useState(""); // New decision name
    const [clone, setClone] = useState(false); // Clone state decides
    // const [selectedCloneDecision, setSelectedCloneDecision] = useState(""); // Decided to clone
    const [selectedCloneDecision, setSelectedCloneDecision] = useState(null);
    // Delele
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [DecisionToDelete, setDecisionToDelete] = useState(null);
    // Search Decision
    const [rows, setRows] = useState([]); // Initialize with empty array
    const [filteredRows, setFilteredRows] = useState([]); // Initialize with empty array
    const [searchValue, setSearchValue] = useState(''); // State to store search value
    // Use hook notification
    const [showSuccessMessage, showErrorMessage] = useNotification();
    // Validation error message
    const [validationMessage, setValidationMessage] = useState("");

    // Destructuring from useRankingGroup custom hook
    const {
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
        addRankingDecisionWithClone,
    } = useRankingDecision();
    // Get the list of ranking decisions
    useEffect(() => {
        fetchAllRankingDecisions();
    }, []);
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
                setOriginalDecisionName(groupData.currentRankingDecision)
                setselectedCurrentDecision(groupData.currentRankingDecision);
                setRankingDecisions(groupData.rankingDecisions || []);
            } catch (error) {
                console.error("Error fetching group:", error);
            }
        };
        loadGroup();
    }, [id]);



    /////////////////////////////////////////////////////////// Handlers to open/close modals for editing of the group info ///////////////////////////////////////////////////////////
    // Open the modal
    const handleOpenEditGroupInfoModal = () => {
        setShowEditGroupInfoModal(true);
        setValidationMessage("");
    };
    // Close the modal
    const handleCloseEditGroupInfoModal = () => {
        setShowEditGroupInfoModal(false);
        setValidationMessage("");
    };
    // Function to editing of the group info
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

        // Check if the group name has changed
        if (trimmedName === editGroup.groupName) {
            // If the name hasn't changed, skip the existing group check
            setValidationMessage("");  // Clear any previous validation messages
        } else {
            // Check if the group name already exists, excluding the current group name
            const existingGroups = await fetchAllRankingGroups();
            const groupExists = existingGroups.some(group =>
                group.groupName.toLowerCase() === trimmedName.toLowerCase() && group.groupName !== editGroup.groupName
            );
            if (groupExists) {
                setValidationMessage("Group name already exists. Please choose a different name.");
                return;
            }
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
                currentRankingDecision: selectedCurrentDecision.decisionId || editGroup.currentRankingDecision,
                createBy: localStorage.getItem('userId')
            };
            await updateRankingGroup(id, updatedGroup);
            setOriginalGroupName(trimmedName);
            setOriginalDecisionName(selectedCurrentDecision ? selectedCurrentDecision.decisionName : editGroup.currentRankingDecision);
            showSuccessMessage("Group Info successfully updated");

            setShowEditGroupInfoModal(false);
        } catch (error) {
            console.error("Error updating group:", error);
            showErrorMessage("Error occurred updating Group Info. Please try again.");
        }
    };

    //////////////////////////////////////////////////////////// Handlers to open/close modals for adding Decision ///////////////////////////////////////////////////////////
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
    // Function to adding Ranking Decision
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
            let newDecision = {
                decisionName: trimmedName,
                createdBy: localStorage.getItem('userId'), // ID của người tạo
            };
            // Check condision Clone
            if (clone && selectedCloneDecision) {
                newDecision = {
                    ...newDecision,
                    CloneDecision: selectedCloneDecision.decisionId
                };
                console.log(newDecision);
                await addRankingDecision(newDecision);
            } else {
                newDecision = {
                    ...newDecision,
                    CloneDecision: null
                };
                console.log(newDecision);
                await addRankingDecision(newDecision);
            }
            setRankingDecisions([...rankingDecisions, newDecision]);
            showSuccessMessage("Ranking Decision successfully added.");

            handleCloseAddRankingDecisionModal();
            await fetchAllRankingDecisions();
        } catch (error) {
            console.error("Failed to add decision:", error);
            showErrorMessage("Error occurred adding Ranking Decision. Please try again.");
        }
    };


    /////////////////////////////////////////////////////////// Handlers to open/close modals for deleting Decision ///////////////////////////////////////////////////////////
    // Open the modal
    const handleOpenDeleteRankingDecisionModal = (decisionId) => {
        setDecisionToDelete(decisionId); // Set decisionToDelete as the ID of the currently selected decision
        setShowDeleteModal(true);
        setValidationMessage("");
    };
    // Close the modal
    const handleCloseDeleteRankingDecisionModal = () => {
        setShowDeleteModal(false);
        setValidationMessage("");
    }
    // Function to delete a selected Decision
    const handleDeleteRankingDecision = async () => {
        try {
            if (DecisionToDelete) {
                await deleteRankingDecision(DecisionToDelete);
                showSuccessMessage("Ranking Decision successfully removed");

                setDecisionToDelete(null);
                handleCloseDeleteRankingDecisionModal();
                await fetchAllRankingDecisions();
            }
        } catch (error) {
            console.error("Failed to delete group:", error);
            showErrorMessage("Error occurred removing Ranking Decision. Please try again.");
            handleCloseDeleteRankingDecisionModal();
        }
    };

    /////////////////////////////////////////////////////////// Search Decision ///////////////////////////////////////////////////////////
    ///// Table Ranking Decision List
    //Columns configuration for the DataGrid
    const columns = [
        { field: "index", headerName: "ID", width: 80 },
        { field: "dicisionname", headerName: "Ranking Decision Name", width: 350 },
        { field: "finalizedAt", headerName: "Finalized At", width: 200 },
        { field: "finalizedBy", headerName: "Finalized By", width: 180 },
        { field: "status", headerName: "Status", width: 150 },
        {
            field: "action",
            headerName: "Action",
            width: 150,
            renderCell: (params) => (
                <>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            console.log(`Navigating to edit decision with ID: ${params.row.id}`);
                            navigate(`/ranking-decision/edit/${params.row.id}`);
                        }}
                    >
                        <FaEdit />
                    </Button>
                    {/* Only show delete button if status is 'Finalized' */}
                    {params.row.status !== 'Finalized' && (
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleOpenDeleteRankingDecisionModal(params.row.id)}
                        >
                            <MdDeleteForever />
                        </Button>
                    )}
                </>
            ),
        },
    ];
    // Map decision data to rows for DataGrid when decisions are fetched
    useEffect(() => {
        if (decisions) {
            const mappedRows = decisions.map((decision, index) => ({
                id: decision.decisionId,
                index: index + 1,
                dicisionname: decision.decisionName,
                finalizedAt: decision.status === 'Finalized' ? decision.finalizedAt : '-',
                finalizedBy: decision.status === 'Finalized' ? (decision.finalizedBy == null ? "N/A" : decision.finalizedBy) : '-',
                status: decision.status
            }));
            setRows(mappedRows); // Update rows with data from decisions
            setFilteredRows(mappedRows); // Update filteredRows with original data
        }
    }, [decisions]);
    const handleInputChange = (event, value) => {
        setSearchValue(value);
        const filtered = value
            ? rows.filter(row => row.dicisionname.toLowerCase().includes(value.toLowerCase()))
            : rows;
        setFilteredRows(filtered);
    };

    return (
        <div style={{ marginTop: "60px" }}>
            <Slider />
            {/* Group Info */}
            <Box sx={{ marginTop: 4, padding: 2 }}>
                <Typography variant="h6">
                    <a href="/ranking_group">Ranking Group List</a>{" "}
                    {<FaAngleRight />}
                    Edit Ranking Group
                </Typography>

                <Box sx={{ border: '1px solid black', borderRadius: '4px', padding: '16px', marginTop: '16px', marginBottom: '30px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                        <Typography variant="h6" style={{ marginRight: '8px' }}>Group Info</Typography>
                        <IconButton size="small" aria-label="edit" onClick={handleOpenEditGroupInfoModal}>
                            <EditIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ width: '48%' }}>
                            <Typography>Group Name:</Typography>
                            <TextField variant="outlined" fullWidth value={originalGroupName} disabled />
                        </Box>
                        <Box sx={{ width: '48%' }}>
                            <Typography>Current Ranking Decision:</Typography>
                            <TextField variant="outlined" fullWidth value={originalDecisionName} disabled />
                        </Box>
                    </Box>
                </Box>
                <Typography variant="h5" sx={{ flexShrink: 0, marginRight: '16px' }}>Ranking Decision List</Typography>
                {/* Search Decision */}
                <Box sx={{ marginTop: '0px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Autocomplete
                        disablePortal
                        options={decisions}
                        getOptionLabel={option => option.decisionName || ''}
                        onInputChange={handleInputChange}
                        value={{ decisionName: searchValue }}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label="Search Decision"
                                variant="outlined"
                                fullWidth
                                sx={{
                                    marginTop: 2,
                                    height: '40px', // Đảm bảo chiều cao bằng với button
                                    '& .MuiInputBase-root': { height: '130%' }, // Đảm bảo chiều cao của input là 100%
                                }}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <InputAdornment position="end" sx={{ marginRight: '-50px' }}>
                                            <IconButton
                                                onClick={() => {
                                                    setFilteredRows(rows);
                                                    setSearchValue('');
                                                    params.inputProps.onChange({ target: { value: '' } });
                                                }}
                                                size="small"
                                                sx={{ padding: '0' }}
                                            >
                                                <ClearIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                        sx={{ flexGrow: 1, marginRight: '16px', maxWidth: '600px' }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenAddRankingDecisionModal}
                        sx={{
                            marginLeft: '0px',
                            marginTop: 2,
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        Add New Ranking Decision
                    </Button>
                </Box>
                {/* The table displays the Decision List */}
                <Box sx={{ width: "100%", height: 350, marginTop: '30px' }}>
                    <DataGrid
                        className="custom-data-grid"
                        rows={filteredRows.length > 0 ? filteredRows : rows}
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
                        <Autocomplete
                            disablePortal
                            options={decisions ? decisions.filter(decision => decision.status === 'Finalized') : []}
                            getOptionLabel={(option) => option.decisionName || ''}
                            value={selectedCurrentDecision}
                            onChange={(event, value) => {
                                setselectedCurrentDecision(value || null);
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
                        />

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
                                value={selectedCloneDecision}  // Tìm đối tượng quyết định
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
                {/* Modal for deleting a Decision */}
                <ModalCustom
                    show={showDeleteModal}
                    handleClose={handleCloseDeleteRankingDecisionModal}
                    title="Delete Decision"
                    bodyContent="Are you sure you want to delete this Decision?"
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
            </Box >
        </div >
    );
};

export default EditRankingGroup;
