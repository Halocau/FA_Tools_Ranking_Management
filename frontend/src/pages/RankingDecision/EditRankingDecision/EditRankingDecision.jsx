import React, { useState, useEffect } from "react";
import { FaAngleRight } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
// MUI
import {
    InputAdornment, Box, Button, Typography, TextField, Modal, IconButton,
} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import { Stepper, Step, StepButton } from '@mui/material';
// Css 
import "../../../assets/css/RankingGroups.css"
// API
import RankingDecisionAPI from "../../../api/rankingDecisionAPI.js";
// Hooks
import useNotification from "../../../hooks/useNotification.jsx";
//Steper
import CriteriaConfiguration from "./CriteriaConfiguration.jsx";
import TitleConfiguration from "./TitleConfiguration.jsx";
import TaskandPriceConfiguration from "./TaskandPriceConfiguration.jsx";

const EditDecision = () => {
    // const navigate = useNavigate(); // To navigate between pages
    const { id } = useParams(); // Get the ID from the URL
    // Edit
    const [editDecision, setEditDecision] = useState({ decisionName: '', status: '' });
    const [originalDecisionName, setOriginalDecisionName] = useState('');
    const [showEditDecisionInfoModal, setShowEditDecisionInfoModal] = useState(false); // Display decision editing modal
    const [newDecisionName, setNewDecisionName] = useState(""); // New decision Name
    // Step
    const [activeStep, setActiveStep] = useState(2);
    const [decisionStatus, setDecisionStatus] = useState('');
    const steps = ['Criteria Configuration', 'Title Configuration', 'Task & Price Configuration'];
    // State saves data for each step
    const [isCriteriaSaved, setIsCriteriaSaved] = useState(false);
    const [isTitleSaved, setIsTitleSaved] = useState(false);
    const [isTaskSaved, setIsTaskSaved] = useState(false);
    // Use hook notification
    const [showSuccessMessage, showErrorMessage] = useNotification();
    // Validation error message
    const [validationMessage, setValidationMessage] = useState("");

    //////////////////////////////////////////////////////////////////////////// Edit ////////////////////////////////////////////////////////////////////////////
    // Ranking Decision Edit
    const EditRankingDecision = async () => {
        try {
            const decisionData = await RankingDecisionAPI.getRankingDecisionById(id);
            // Ensure no undefined values are passed
            setEditDecision({
                decisionName: decisionData.decisionName || "",
                status: decisionData.status || "",
            });
            console.log(decisionData)
            setOriginalDecisionName(decisionData.decisionName || "Decision Name");
            setNewDecisionName(decisionData.decisionName || "");
            setDecisionStatus(decisionData.status)
        } catch (error) {
            console.error("Error fetching group:", error);
        }
    };
    // Fetch Ranking Decision on id change
    useEffect(() => {
        EditRankingDecision();
    }, [id]);

    ////Handlers to open/close modals for editing of the decision info 
    // Open modal
    const handleOpenEditRankingDecisionInfoModal = () => {
        setShowEditDecisionInfoModal(true);
        setValidationMessage("");
    };
    // Close modal
    const handleCloseEditRankingDecisionInfoModal = () => {
        setShowEditDecisionInfoModal(false);
        setValidationMessage("");
    };
    // Function
    const handleEditRankingDecisionInfo = async () => {
        setValidationMessage("");
        let trimmedName = newDecisionName.trim();

        if (!trimmedName) {
            setValidationMessage("Decision name cannot be empty.");
            return;
        }
        if (trimmedName.length < 3 || trimmedName.length > 20) {
            setValidationMessage("Decision name must be between 3 and 20 characters.");
            return;
        }
        // Capitalize the first letter of each word
        trimmedName = trimmedName.replace(/\b\w/g, (char) => char.toUpperCase());
        try {
            const updatedDecision = {
                decisionName: trimmedName,
                createBy: localStorage.getItem('userId')
            };
            await RankingDecisionAPI.updateRankingDecision(id, updatedDecision);
            setOriginalDecisionName(trimmedName);
            showSuccessMessage("Decision info successfully updated");
            setShowEditDecisionInfoModal(false);
        } catch (error) {
            console.error("Error updating decision:", error);
            showErrorMessage("Error occurred updating decision info. Please try again.");
        }
    };

    //////////////////////////////////////////////////////////////////////////// Stepp /////////////////////////////////////////////////////////////////////////
    // Completion status of each step
    const [completed, setCompleted] = useState({
        0: isCriteriaSaved,
        1: isTitleSaved,
        2: isTaskSaved,
    });
    useEffect(() => {
        if (decisionStatus === 'Finalized') {
            setIsCriteriaSaved(true);
            setIsTitleSaved(true);
            setIsTaskSaved(true);
            setCompleted({
                0: true,
                1: true,
                2: true,
            });
        }
    }, [decisionStatus]);
    // The function checks to see if it is possible to move to another step
    const canMoveToNextStep = (step) => {
        if (decisionStatus === 'Finalized') {
            return true;
        } else if (decisionStatus === 'Draft') {
            if (step === 1 && !isCriteriaSaved) return false;
            if (step === 2 && !isTitleSaved) return false;
        }
        return true;
    };
    // The function handles when the user clicks on a step
    const handleStepChange = (step) => {
        console.log(step)
        if (step < activeStep || canMoveToNextStep(step)) {
            setActiveStep(step);
        }
    };
    // The function moves to the next step
    const goToNextStep = ({ stayOnCurrentStep = false } = {}) => {
        if (decisionStatus === 'Draft') {
            if (activeStep === 0 && !isCriteriaSaved) {
                setIsCriteriaSaved(true);
                setCompleted((prev) => ({ ...prev, 0: true }));
            }
            if (activeStep === 1 && !isTitleSaved) {
                setIsTitleSaved(true);
                setCompleted((prev) => ({ ...prev, 1: true }));
            }
            if (activeStep === 2 && !isTaskSaved) {
                setIsTaskSaved(true);
                setCompleted((prev) => ({ ...prev, 2: true }));
            }
        } else if (decisionStatus === 'Finalized') {
            setIsCriteriaSaved(true);
            setIsTitleSaved(true);
            setIsTaskSaved(true);
            setCompleted({ 0: true, 1: true, 2: true });
        }
        // If `stayOnCurrentStep` is false, skip the step
        if (!stayOnCurrentStep) {
            setActiveStep((prevStep) => prevStep + 1);
        }
    };

    //////////////////////////////////////////////////////////////////////////// RenderStepContent /////////////////////////////////////////////////////////////////
    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <CriteriaConfiguration
                        decisionStatus={decisionStatus}
                        goToNextStep={goToNextStep}
                        showErrorMessage={showErrorMessage}
                        showSuccessMessage={showSuccessMessage}
                    />
                );
            case 1:
                return (
                    <TitleConfiguration
                        decisionStatus={decisionStatus}
                        goToNextStep={goToNextStep}
                        showErrorMessage={showErrorMessage}
                        showSuccessMessage={showSuccessMessage}
                    />
                );
            case 2:
                return (
                    <TaskandPriceConfiguration
                        decisionStatus={decisionStatus}
                        goToNextStep={goToNextStep}
                        showErrorMessage={showErrorMessage}
                        showSuccessMessage={showSuccessMessage}
                    />
                );
            default:
                return <div>No Step</div>;
        }
    };

    //////////////////////////////////////////////////////////////////////////// Submit ////////////////////////////////////////////////////////////////////////////

    const handleSubmit = async () => {
        try {
            const updatedDecision = {
                decisionName: editDecision.decisionName,
                decisionStatus: 'Finalized',
                createBy: localStorage.getItem('userId')
            };
            await RankingDecisionAPI.updateRankingDecision(id, updatedDecision);
        } catch (error) {
            console.error("Error updating decision:", error);
            showErrorMessage("Error occurred updating decision info. Please try again.");
        }
        setEditDecision({ status: 'Finalized' })
        setDecisionStatus('Finalized')
        showSuccessMessage('Submit successfully ');
    };
    return (
        <div style={{ marginTop: "60px" }}>
            <Box sx={{ marginTop: 4, padding: 2 }}>
                {/* Link */}
                <Typography variant="h6">
                    <a href="/ranking-decision">Ranking Decision List</a>{" "}
                    <FaAngleRight />
                    Edit Ranking Decision
                </Typography>
                {/* Box Decision Info */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, marginTop: 2 }}>
                    {/* Ranking Decision Name */}
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

                    {/* Status */}
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '48%', justifyContent: 'flex-end' }}>
                        <Typography sx={{ marginRight: 1 }}>Status:</Typography>
                        <TextField
                            variant="outlined"
                            fullWidth
                            value={editDecision.status}
                            disabled
                            sx={{ width: '60%' }}
                            InputProps={{
                                sx: { height: '30px' }
                            }}
                        />
                    </Box>

                    {/* Submit */}
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '48%', justifyContent: 'flex-start ' }}>
                        {isCriteriaSaved && isTitleSaved && isTaskSaved && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                sx={{
                                    visibility: decisionStatus === 'Draft' ? 'visible' : 'hidden',
                                }}
                            >
                                Submit
                            </Button>
                        )}
                    </Box>

                </Box>

                {/* Stepper */}
                <Box sx={{ width: '100%', marginTop: 2 }}>
                    <Stepper
                        activeStep={activeStep}
                        alternativeLabel={true}
                        nonLinear={decisionStatus === 'Finalized'}
                    >
                        {steps.map((label, index) => (
                            <Step key={label} completed={completed[index]}>
                                <StepButton
                                    onClick={() => handleStepChange(index)}
                                    sx={{
                                        textAlign: 'center',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}
                                >
                                    {label}
                                </StepButton>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
                <Box>{renderStepContent(activeStep)}</Box>

                {/* Modal for editing group info */}
                <Modal open={showEditDecisionInfoModal} onClose={handleCloseEditRankingDecisionInfoModal}>
                    <Box sx={{
                        padding: 2,
                        backgroundColor: 'white',
                        borderRadius: 1,
                        maxWidth: 400,
                        margin: 'auto',
                        marginTop: '100px'
                    }}>
                        <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            Edit Decision Info
                            <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseEditRankingDecisionInfoModal}></button>
                        </Typography>
                        <TextField
                            label="Decision Name"
                            variant="outlined"
                            fullWidth
                            value={newDecisionName || ""} // Default to empty string if undefined
                            onChange={(e) =>
                                setNewDecisionName(e.target.value)
                            }
                            error={!!validationMessage}
                            helperText={validationMessage}
                            sx={{ marginTop: 2 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => {
                                                console.log(newDecisionName)
                                                setNewDecisionName('');
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
            </Box >
        </div >

    );
};
export default EditDecision;

