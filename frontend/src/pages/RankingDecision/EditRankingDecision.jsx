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
import ActionButtons from "../../components/Common/ActionButtons.jsx";
import useRankingDecision from "../../hooks/useRankingDecision.jsx";
import Slider from "../../layouts/Slider.jsx";
// acountID
import { useAuth } from "../../contexts/AuthContext.jsx";
// Import hook Notification
import useNotification from "../../hooks/useNotification";

const EditRankingDecision = () => {
    const navigate = useNavigate(); // To navigate between pages
    const { id } = useParams(); // Get the ID from the URL
    // Edit
    const [editDecision, setEditDecision] = useState({ decisionName: '', currentRankingDecision: '' });
    const [originalDecisionName, setOriginalDecisionName] = useState('');
    const [showEditdecisionInfoModal, setShowEditDecisionInfoModal] = useState(false); // Display decision editing modal
    const [newDecisionName, setnewDecisionName] = useState(""); // New decision Name
    const [Status, setStatus] = useState(""); //
    // Use hook notification
    const [showSuccessMessage, showErrorMessage] = useNotification();
    // Validation error message
    const [validationMessage, setValidationMessage] = useState("");

    // // Destructuring from useRankingDecision custom hook
    const {
        data: decisions,
        fetchAllRankingDecisions,
        fetchRankingDecisionById,
        updateRankingDecison,
    } = useRankingDecision();
    // Get the list of ranking decisions
    useEffect(() => {
        fetchAllRankingDecisions();
    }, []);
    useEffect(() => {
        const loadGroup = async () => {
            try {
                const DecisionData = await fetchRankingDecisionById(id);
                console.log("API DecisionData:", DecisionData); // Kiểm tra dữ liệu trả về

                // Kiểm tra xem DecisionData có tồn tại và có các trường cần thiết
                if (DecisionData && DecisionData.decisionName) {
                    setEditDecision({
                        DecisionName: DecisionData.decisionName,
                        DecisionStatus: DecisionData.status
                    });
                    setOriginalDecisionName(DecisionData.decisionName);
                    setnewDecisionName(DecisionData.decisionName);
                    setStatus(DecisionData.status);
                } else {
                    console.error("DecisionData is undefined or missing decisionName");
                }
            } catch (error) {
                console.error("Error fetching group:", error);
            }
        };
        loadGroup();
    }, [id]);

    //// Handlers to open/close modals for editing of the decision info
    const handleOpenEditRankingDecisionInfoModal = () => {
        setShowEditDecisionInfoModal(true);
        setValidationMessage("");
    };
    const handleEditRankingDecisionInfo = async () => {
        setValidationMessage("");
        let trimmedName = newDecisionName.trim();
        // Validation for the decision name
        if (!trimmedName) {
            setValidationMessage("decision name cannot be empty.");
            return;
        }
        if (trimmedName.length < 3 || trimmedName.length > 20) {
            setValidationMessage("decision name must be between 3 and 20 characters.");
            return;
        }
        const nameRegex = /^[a-zA-Z0-9 ]+$/;
        if (!nameRegex.test(trimmedName)) {
            setValidationMessage("decision name can only contain letters, numbers, and spaces.");
            return;
        }
        // Check if the decision name already exists, excluding the current decision name
        const existingDecisions = await fetchAllRankingDecisions();
        const decisionExists = existingDecisions.some(decision =>
            decision.decisionName.toLowerCase() === trimmedName.toLowerCase() && decision.decisionName !== existingDecisions.decisionName
        );
        if (decisionExists) {
            setValidationMessage("decision name already exists. Please choose a different name.");
            return;
        }
        // Capitalize the first letter of each word
        trimmedName = trimmedName.replace(/\b\w/g, (char) => char.toUpperCase());
        // Prepare the updated decision object
        try {
            const updateddecision = {
                decisionName: trimmedName,
                createBy: localStorage.getItem('userId')
            };
            await updateRankingDecison(id, updateddecision);
            setOriginalDecisionName(trimmedName);
            showSuccessMessage("decision Info successfully updated");
            setShowEditDecisionInfoModal(false);
        } catch (error) {
            console.error("Error updating decision:", error);
            showErrorMessage("Error occurred updating decision Info. Please try again.”.");
        }
    };
    const handleCloseEditRankingDecisionInfoModal = () => {
        setShowEditDecisionInfoModal(false);
        setValidationMessage("");
    };

    /// Columns configuration for the DataGrid
    const columns = [
        { field: "index", headerName: "ID", width: 80 },
        { field: "dicisionname", headerName: "Ranking Decision Name", width: 350 },
        { field: "finalizedAt", headerName: "Finalized At", width: 200 },
        { field: "finalizedBy", headerName: "Finalized By", width: 180 },
        { field: "status", headerName: "Status", width: 150 },

    ];

    // Map decision data to rows for DataGrid
    const rows = decisions
        ? decisions.map((decision, index) => ({
            id: decision.decisionId,
            index: index + 1,
            dicisionname: decision.decisionName,
            finalizedAt: decision.status === 'Finalized' ? decision.finalizedAt : '-',
            finalizedBy: decision.status === 'Finalized' ? (decision.finalizedBy == null ? "N/A" : decision.finalizedBy) : '-',
            status: decision.status
        }))
        : [];
    return (
        <div style={{ marginTop: "60px" }}>
            <Slider />
            {/* Ranking Decision  Info */}
            <Box sx={{ marginTop: 4, padding: 2 }}>
                <div>
                    <a href="/ranking_decision">Ranking decision List</a> <FaAngleRight />
                    <a>Edit Ranking decision</a>
                </div>
                <Box sx={{
                    border: '1px solid black',
                    borderRadius: '4px',
                    padding: '16px',
                    marginTop: '16px'
                }}>

                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                        <Typography variant="h6" style={{ marginRight: '8px' }}>Group Info</Typography>
                        <IconButton size="small" aria-label="edit" onClick={handleOpenEditRankingDecisionInfoModal}>
                            <EditIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ width: '48%' }}>
                            <Typography>Group Name:</Typography>
                            <TextField variant="outlined" fullWidth value={originalDecisionName} disabled />
                        </Box>
                        <Box sx={{ width: '48%' }}>
                            <Typography>Status</Typography>
                            <TextField variant="outlined" fullWidth value={Status} disabled />
                        </Box>
                    </Box>
                </Box>

                {/* Table Show Ranking Decision List */}
                <Box sx={{ width: "100%", height: 350 }}>
                    <DataGrid
                        className="custom-data-grid"
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
                {/* Modal for editing decision info */}
                <Modal>
                    <Box sx={{
                        padding: 2,
                        backgroundColor: 'white',
                        borderRadius: 1,
                        maxWidth: 400,
                        margin: 'auto',
                        marginTop: '100px'
                    }}>
                        <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            Edit decision Info
                            <button type="button" className="btn-close" aria-label="Close" onClick={handleOpenEditRankingDecisionInfoModal}></button>
                        </Typography>
                        <TextField
                            label="Decision Name"
                            variant="outlined"
                            fullWidth
                            value={newDecisionName}
                            onChange={(e) => {
                                // setnewDecisionName(e.target.value);
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
                                                // setnewDecisionName('');
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
                        <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
                            <Button variant="outlined" onClick={handleCloseEditRankingDecisionInfoModal}>Cancel</Button>
                            <Button variant="contained" onClick={handleEditRankingDecisionInfo}>Save</Button>
                        </Box>
                    </Box>
                </Modal>

            </Box>
        </div>
    );
};

export default EditRankingDecision;
