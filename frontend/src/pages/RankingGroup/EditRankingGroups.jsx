// react
import React, { useEffect, useState } from "react";
import { FaEdit, FaAngleRight, FaEye } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
//Filter Query Builder
import { sfLike } from 'spring-filter-query-builder';
// Mui
import {
    InputAdornment, Box, Button, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Modal, IconButton, Switch, FormControlLabel, Alert, FormHelperText
} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import EditIcon from '@mui/icons-material/Edit';
import Autocomplete from '@mui/material/Autocomplete';
// Css 
import "../../assets/css/RankingGroups.css"
// API
import RankingGroupAPI from "../../api/RankingGroupAPI.js";
import RankingDecisionAPI from "../../api/RankingDecisionAPI.js";
//Common
import ModalCustom from "../../components/Common/Modal.jsx";
import ActionButtons from "../../components/Common/ActionButtons.jsx";
import SearchComponent from "../../components/Common/Search.jsx";

// Contexts
import { useAuth } from "../../contexts/AuthContext.jsx";
// Hooks
import useNotification from "../../hooks/useNotification";

// Layouts
import Slider from "../../layouts/Slider.jsx";

const EditRankingGroup = () => {
    const navigate = useNavigate(); // To navigate between page
    const { id } = useParams(); // Get the ID from the URL
    //// State
    // Table  List Ranking Decision (page, size) 
    const [rows, setRows] = useState([]); // Initialize with empty array
    const [rankingDecisions, setRankingDecisions] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    // ApiRef   
    const apiRef = useGridApiRef(); // Create apiRef to select multiple decisions to delete
    // Edit
    const [editGroup, setEditGroup] = useState({ groupName: '', currentRankingDecision: '' });
    const [originalGroupName, setOriginalGroupName] = useState('');
    const [showEditGroupInfoModal, setShowEditGroupInfoModal] = useState(false); // Display group editing modal
    const [newGroupName, setNewGroupName] = useState(""); // New Group Name
    const [originalDecisionName, setOriginalDecisionName] = useState('');
    const [selectedCurrentDecision, setselectedCurrentDecision] = useState(null); // Current rating decision
    // Add
    const [showAddModal, setShowAddModal] = useState(false); // State to determine whether the additional decision modal is displayed or not
    const [newDecisionName, setnewDecisionName] = useState(""); // State to store the new decison name that the user enters
    const [clone, setClone] = useState(false); // Clone state decides
    const [selectedCloneDecision, setSelectedCloneDecision] = useState(null);
    const [listDecisionSearchClone, setlistDecisionSearchClone] = useState([]);
    // Delete
    const [showDeleteModal, setShowDeleteModal] = useState(false); // State to determine whether the delete decision modal is displayed or not
    const [decisionToDelete, setDecisionToDelete] = useState(null); // State to store the ID of the decision to be deleted
    // Search Decision
    const [filter, setFilter] = useState("");
    // Use hook notification
    const [showSuccessMessage, showErrorMessage] = useNotification();
    // Validation error message
    const [validationMessage, setValidationMessage] = useState("");

    // Ranking Group Edit
    const RankingGroupEdit = async () => {
        try {
            const groupData = await RankingGroupAPI.getRankingGroupById(id);
            // Ensure no undefined values are passed
            setEditGroup({
                groupName: groupData.groupName || "",
                currentRankingDecision: groupData.currentRankingDecision || "",
            });
            console.log(groupData)
            setOriginalGroupName(groupData.groupName || "Group Name");
            setNewGroupName(groupData.groupName || "");
            setOriginalDecisionName(groupData.currentRankingDecision || "Decision Name");
            setselectedCurrentDecision(groupData.currentRankingDecision || "");
        } catch (error) {
            console.error("Error fetching group:", error);
        }
    };

    console.log("Rows:", rows);
    //// Fetch Ranking Group on id change
    useEffect(() => {
        RankingGroupEdit();
    }, [id]);

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
            console.error("Failed to fetch criteria:", error);
        }
    }

    //// Fetch all ranking decisions when component mounts
    useEffect(() => {
        fetchAllRankingDecisions();
    }, [id, page, pageSize, filter]);
    ;


    /////////////////////////////////////////////////////////// Handlers to open/close modals for editing of the group info ///////////////////////////////////////////////////////////
    // Open the modal
    const handleOpenEditGroupInfoModal = () => {
        setNewGroupName(editGroup.groupName);
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
        // Validate group name length and character requirements
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
        // Capitalize the first letter of each word in the group name
        trimmedName = trimmedName.replace(/\b\w/g, (char) => char.toUpperCase());
        // Check for duplicate group name
        try {
            const updatedGroup = {
                groupName: trimmedName,
                currentRankingDecision: selectedCurrentDecision ? rankingDecisions.find(decision => decision.decisionName === selectedCurrentDecision).decisionId : '',
                createBy: localStorage.getItem('userId')
            };
            console.log("Selected Current decision:", selectedCurrentDecision);
            await RankingGroupAPI.updateRankingGroup(id, updatedGroup);
            setOriginalGroupName(trimmedName);
            setOriginalDecisionName(selectedCurrentDecision ? selectedCurrentDecision : editGroup.currentRankingDecision);
            showSuccessMessage("Group Info successfully updated");

            setShowEditGroupInfoModal(false);
        } catch (error) {
            if (error.response.data.detailMessage.includes("already exists")) {
                setValidationMessage("Ranking Group Name already exists.");
            } else {
                setValidationMessage("Error occurred updating Group Info. Please try again.");
            }
            console.error("Error updating group:", error);
            // showErrorMessage("Error occurred updating Group Info. Please try again.");
        }
    };

    //// Handlers to open/close modals for adding decisions
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
    //  list ranking decision to choose from for clone
    const fetchlistRankingDecisionsClone = async () => {
        try {
            const data = await RankingDecisionAPI.getAllRankingDecisions();
            setlistDecisionSearchClone(data.result)
            console.log('setlistDecisionSearchClone', data)
        } catch (error) {
            console.error("Failed to fetch criteria:", error);
        }
    }
    useEffect(() => {
        fetchlistRankingDecisionsClone();
    }, [id])

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
            console.error("Failed to add group:", error);
            if (error.response && error.response.data) {
                const detailMessage = error.response.data.detailMessage;
                if (detailMessage && detailMessage.includes("RankingGroup name exists already!")) {
                    setValidationMessage("RankingGroup name exists already!");
                } else {
                    showErrorMessage("Error occurred adding Ranking Decision. Please try again");
                }
            } else {
                showErrorMessage("Error occurred adding Ranking Decision. Please try again");
            }
        }
    };



    //// Handlers to open/close modals for delete decision
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

    /////////////////////////////////////////////////////////// Search Decision ///////////////////////////////////////////////////////////
    ///// Search Decision 
    const handleSearch = (event) => {
        // console
        console.log(event)
        if (event) {
            setFilter(sfLike("decisionName", event).toString());
        } else {
            setFilter("")
        }
        setPage(1);
    };

    /////////////////////////////////////////////////////////// Table Ranking Decision List ///////////////////////////////////////////////////////////
    //Columns configuration for the DataGrid
    const columns = [
        { field: "index", headerName: "ID", width: 80 },
        { field: "dicisionname", headerName: "Ranking Decision Name", width: 350 },
        { field: "finalizedAt", headerName: "Finalized At", width: 200 },
        { field: "finalizedBy", headerName: "Finalized By", width: 150 },
        { field: "status", headerName: "Status", width: 130 },
        {
            field: "action",
            headerName: "Action",
            width: 240,
            renderCell: (params) => (
                <>
                    {(params.row.status !== 'Draft') && (
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
                    {(params.row.status === 'Draft' || params.row.status === 'Rejected') && (
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
                finalizedBy: decision.status === 'Finalized' ? (decision.finalizedByName == null ? "N/A" : decision.finalizedByName) : '-',
                status: decision.status
            }));
            setRows(mappedRows); // Update rows with data from decisions
        }
    }, [rankingDecisions]);

    return (
        <div style={{ marginTop: "60px" }}>
            <Slider />
            {/* Group Info */}
            <Box sx={{ marginTop: 1, padding: 2 }}>
                <Typography variant="h6">
                    <a href="/ranking-group">Ranking Group List</a>{" "}
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
                <SearchComponent onSearch={handleSearch} placeholder=" Sreach Decision" />

                {/* Table show Ranking Decision */}
                <Box sx={{ width: "100%", height: 370, marginTop: '10px' }}>
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
                            page: page - 1,
                            pageSize: pageSize,
                        }}
                        onPaginationModelChange={(model) => {
                            setPage(model.page + 1);
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
                {/* Add new Ranking Decision */}
                <Box sx={{ marginTop: '0px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
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
                            value={newGroupName || ""} // Default to empty string if undefined
                            onChange={(e) =>
                                setNewGroupName(e.target.value)
                            }
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
                            options={listDecisionSearchClone ? listDecisionSearchClone.filter(decision => decision.status === 'Finalized') : []}
                            getOptionLabel={(option) => option.decisionName || ''}
                            value={listDecisionSearchClone.find(decision => decision.decisionName === (selectedCurrentDecision || originalDecisionName)) || null}
                            onChange={(event, value) => {
                                setselectedCurrentDecision(value ? value.decisionName : originalDecisionName);
                                console.log(selectedCurrentDecision);
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
                                options={listDecisionSearchClone}
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
