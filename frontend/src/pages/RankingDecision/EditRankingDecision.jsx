import React, { useEffect, useState } from "react";
import { FaEdit, FaAngleRight } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
// CSS
import "../../assets/css/RankingGroups.css";
// MUI
import {
    InputAdornment, Box, Button, Typography, TextField, Modal, IconButton, Select, MenuItem, Table, TableHead, TableBody, TableCell, TableRow
} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import CircleIcon from '@mui/icons-material/RadioButtonUnchecked';
// Source code
import ModalCustom from "../../components/Common/Modal.jsx";
import ActionButtons from "../../components/Common/ActionButtons.jsx";
import useRankingDecision from "../../hooks/useRankingDecision.jsx";
import useNotification from "../../hooks/useNotification";

const EditRankingDecision = () => {
    const navigate = useNavigate(); // To navigate between pages
    const { id } = useParams(); // Get the ID from the URL

    // Edit
    const [editDecision, setEditDecision] = useState({ decisionName: '', currentRankingDecision: '' });
    const [originalDecisionName, setOriginalDecisionName] = useState('');
    const [showEditDecisionInfoModal, setShowEditDecisionInfoModal] = useState(false); // Display decision editing modal
    const [newDecisionName, setNewDecisionName] = useState(""); // New decision Name
    const [status, setStatus] = useState("");

    // Use hook notification
    const [showSuccessMessage, showErrorMessage] = useNotification();
    // Validation error message
    const [validationMessage, setValidationMessage] = useState("");

    // Destructuring from useRankingDecision custom hook
    const {
        data: decisions,
        fetchAllRankingDecisions,
        fetchRankingDecisionById,
        updateRankingDecision,
    } = useRankingDecision();

    // Get the list of ranking decisions
    useEffect(() => {
        fetchAllRankingDecisions();
    }, []);

    useEffect(() => {
        const loadGroup = async () => {
            try {
                const decisionData = await fetchRankingDecisionById(id);
                console.log("API DecisionData:", decisionData);

                // Check if decisionData exists and has required fields
                if (decisionData && decisionData.decisionName) {
                    setEditDecision({
                        decisionName: decisionData.decisionName,
                        decisionStatus: decisionData.status
                    });
                    setOriginalDecisionName(decisionData.decisionName);
                    setNewDecisionName(decisionData.decisionName);
                    setStatus(decisionData.status);
                } else {
                    console.error("decisionData is undefined or missing decisionName");
                }
            } catch (error) {
                console.error("Error fetching group:", error);
            }
        };
        loadGroup();
    }, [id]);

    // Handlers to open/close modals for editing of the decision info
    const handleOpenEditRankingDecisionInfoModal = () => {
        setShowEditDecisionInfoModal(true);
        setValidationMessage("");
    };

    const handleEditRankingDecisionInfo = async () => {
        setValidationMessage("");
        let trimmedName = newDecisionName.trim();

        // Validation for the decision name
        if (!trimmedName) {
            setValidationMessage("Decision name cannot be empty.");
            return;
        }
        if (trimmedName.length < 3 || trimmedName.length > 20) {
            setValidationMessage("Decision name must be between 3 and 20 characters.");
            return;
        }
        // Check if the decision name already exists, excluding the current decision name
        const existingDecisions = await fetchAllRankingDecisions();
        const decisionExists = existingDecisions.some(decision =>
            decision.decisionName.toLowerCase() === trimmedName.toLowerCase() && decision.decisionName !== editDecision.decisionName
        );
        if (decisionExists) {
            setValidationMessage("Decision name already exists. Please choose a different name.");
            return;
        }

        // Capitalize the first letter of each word
        trimmedName = trimmedName.replace(/\b\w/g, (char) => char.toUpperCase());

        // Prepare the updated decision object
        try {
            const updatedDecision = {
                decisionName: trimmedName,
                createBy: localStorage.getItem('userId')
            };
            await updateRankingDecision(id, updatedDecision);
            setOriginalDecisionName(trimmedName);
            showSuccessMessage("Decision info successfully updated");
            setShowEditDecisionInfoModal(false);
        } catch (error) {
            console.error("Error updating decision:", error);
            showErrorMessage("Error occurred updating decision info. Please try again.");
        }
    };

    const handleCloseEditRankingDecisionInfoModal = () => {
        setShowEditDecisionInfoModal(false);
        setValidationMessage("");
    };

    const [activeStep, setActiveStep] = useState(1);
    const [data, setData] = useState([
        { id: 1, rankTitle: 'Title 1', rankScore: 0, criteriaScores: {} },
        { id: 2, rankTitle: 'Title 2', rankScore: 0, criteriaScores: {} },
    ]);
    const criteria = ['Criteria 1', 'Criteria 2', 'Criteria 3']; // Các tiêu chí từ bước cấu hình

    const handleStepChange = (step) => setActiveStep(step);

    const handleRankTitleChange = (id, newTitle) => {
        setData(prevData =>
            prevData.map(row => row.id === id ? { ...row, rankTitle: newTitle } : row)
        );
    };

    const handleCriteriaScoreChange = (id, criterion, newScore) => {
        setData(prevData =>
            prevData.map(row =>
                row.id === id
                    ? { ...row, criteriaScores: { ...row.criteriaScores, [criterion]: newScore } }
                    : row
            )
        );
    };

    return (
        <div style={{ marginTop: "60px" }}>
            <Box sx={{ marginTop: 4, padding: 2 }}>
                <Typography variant="h6">
                    <a href="/ranking_decision">Ranking Decision List</a>{" "}
                    {<FaAngleRight />}
                    Edit Ranking Decision
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, marginTop: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '48%' }}>
                        <Typography sx={{ marginRight: 1 }}>Ranking Decision Name:</Typography>
                        <TextField
                            variant="outlined"
                            fullWidth
                            value={originalDecisionName}
                            disabled
                            sx={{ width: '60%' }}
                            InputProps={{
                                sx: { height: '30px' }
                            }}
                        />
                        <IconButton size="small" aria-label="edit" onClick={handleOpenEditRankingDecisionInfoModal}>
                            <EditIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '48%' }}>
                        <Typography sx={{ marginRight: 1 }}>Status:</Typography>
                        <TextField
                            variant="outlined"
                            fullWidth
                            value={status}
                            disabled
                            sx={{ width: '60%' }}
                            InputProps={{
                                sx: { height: '30px' }
                            }}
                        />
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 2 }}>
                    {[1, 2, 3].map((step) => (
                        <Box key={step} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Button
                                variant={activeStep === step ? 'contained' : 'outlined'}
                                onClick={() => handleStepChange(step)}
                                sx={{ width: '50px', height: '50px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            >
                                <CircleIcon sx={{ fontSize: '40px', color: activeStep === step ? 'white' : 'primary.main' }} />
                            </Button>
                            <Typography variant="caption" sx={{ marginTop: 1 }}>
                                {step === 1 ? 'Criteria Configuration' : step === 2 ? 'Title Configuration' : 'Task & Price Configuration'}
                            </Typography>
                        </Box>
                    ))}
                </Box>
                {activeStep === 1 && (
                    <Box sx={{ overflowX: 'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Rank Title</TableCell>
                                    <TableCell>Rank Score</TableCell>
                                    {criteria.map((crit, index) => (
                                        <TableCell key={index}>{crit}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>
                                            <TextField
                                                value={row.rankTitle}
                                                onChange={(e) => handleRankTitleChange(row.id, e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                value={row.rankScore}
                                                onChange={(e) => handleCriteriaScoreChange(row.id, '', e.target.value)}
                                            />
                                        </TableCell>
                                        {criteria.map((crit, index) => (
                                            <TableCell key={index}>
                                                <TextField
                                                    type="number"
                                                    value={row.criteriaScores[crit] || ''}
                                                    onChange={(e) => handleCriteriaScoreChange(row.id, crit, e.target.value)}
                                                />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                )}
            </Box>

            {/* Modal for Editing Decision Info */}
            <Modal open={showEditDecisionInfoModal} onClose={handleCloseEditRankingDecisionInfoModal}>
                <Box sx={{
                    padding: 2,
                    backgroundColor: 'white',
                    borderRadius: 1,
                    maxWidth: 400,
                    margin: 'auto',
                    marginTop: '100px'
                }}>
                    <Typography variant="h6">Edit Decision Info</Typography>
                    <TextField
                        label="Decision Name"
                        variant="outlined"
                        fullWidth
                        value={newDecisionName}
                        onChange={(e) => setNewDecisionName(e.target.value)}
                        error={!!validationMessage}
                        helperText={validationMessage}
                        sx={{ marginTop: 2 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setNewDecisionName('')}
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
        </div>
    );
};

export default EditRankingDecision;
