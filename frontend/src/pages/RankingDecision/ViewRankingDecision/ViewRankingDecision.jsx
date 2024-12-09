import React, { useState, useEffect } from "react";
import { FaAngleRight } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
// MUI
import {
    InputAdornment, Box, Button, Typography, TextField, Modal, IconButton,
} from "@mui/material";
import { Stepper, Step, StepButton } from '@mui/material';
// Css 
import "../../../assets/css/RankingGroups.css"
// API
import RankingDecisionAPI from "../../../api/rankingDecisionAPI.js";
// Hooks
import useNotification from "../../../hooks/useNotification.jsx";
//Steper
import CriteriaConfiguration from "../ViewRankingDecision/CriteriaConfiguration.jsx";
import TitleConfiguration from "../ViewRankingDecision/TitleConfiguration.jsx";
import TaskandPriceConfiguration from "../ViewRankingDecision/TaskandPriceConfiguration.jsx";

const ViewDecision = () => {
    const role = localStorage.getItem('userRole');
    console.log(role)
    // const navigate = useNavigate(); // To navigate between pages
    const { id } = useParams(); // Get the ID from the URL
    // Edit
    const [viewDecision, setViewDecision] = useState({ decisionName: '', status: '' });
    // Step
    const [activeStep, setActiveStep] = useState(0);
    const [decisionStatus, setDecisionStatus] = useState('');
    const steps = ['Criteria Configuration', 'Title Configuration', 'Task & Price Configuration'];
    // State saves data for each step
    const [isCriteriaSaved, setIsCriteriaSaved] = useState(false);
    const [isTitleSaved, setIsTitleSaved] = useState(false);
    const [isTaskSaved, setIsTaskSaved] = useState(false);
    // Use hook notification
    const [showSuccessMessage, showErrorMessage] = useNotification();

    //////////////////////////////////////////////////////////////////////////// Edit ////////////////////////////////////////////////////////////////////////////
    // Ranking Decision Edit
    const EditRankingDecision = async () => {
        try {
            const decisionData = await RankingDecisionAPI.getRankingDecisionById(id);
            // Ensure no undefined values are passed
            setViewDecision({
                decisionName: decisionData.decisionName || "",
                status: decisionData.status || "",
            });
            setDecisionStatus(decisionData.status)
        } catch (error) {
            console.error("Error fetching group:", error);
        }
    };
    // Fetch Ranking Decision on id change
    useEffect(() => {
        EditRankingDecision();
    }, [id]);

    //////////////////////////////////////////////////////////////////////////// Stepp /////////////////////////////////////////////////////////////////////////
    // Completion status of each step
    const [completed, setCompleted] = useState({
        0: isCriteriaSaved,
        1: isTitleSaved,
        2: isTaskSaved,
    });
    useEffect(() => {
        if (['Finalized', 'Confirmed', 'Submitted'].includes(decisionStatus)) {
            setIsCriteriaSaved(true);
            setIsTitleSaved(true);
            setIsTaskSaved(true);
            setCompleted({ 0: true, 1: true, 2: true });
        }
    }, [decisionStatus]);

    // The function checks to see if it is possible to move to another step
    const canMoveToNextStep = (step) => {
        if (decisionStatus === 'Submitted' || decisionStatus === 'Confirmed' || decisionStatus === 'Finalized') {
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

    //////////////////////////////////////////////////////////////////////////// Confirm ////////////////////////////////////////////////////////////////////////////
    const handleConfirm = async () => {
        try {
            const updatedDecision = {
                decisionId: id,
                status: 'Confirmed'
            };
            await RankingDecisionAPI.updateRankingDecisionStatus(updatedDecision);
        } catch (error) {
            console.error("Error updating decision:", error);
            showErrorMessage("Error occurred updating decision info. Please try again.");
        }
        setViewDecision({ status: 'Confirm' })
        setDecisionStatus('Confirm')
        showSuccessMessage('Confirm successfully ');
    };
    const handleReject = async () => {
        try {
            const updatedDecision = {
                decisionId: id,
                status: 'Draft'
            };
            await RankingDecisionAPI.updateRankingDecisionStatus(updatedDecision);
        } catch (error) {
            console.error("Error updating decision:", error);
            showErrorMessage("Error occurred updating decision info. Please try again.");
        }
        setViewDecision({ status: 'Draft' })
        setDecisionStatus('Draft')
        showSuccessMessage('Rejected successfully ');
    };
    //////////////////////////////////////////////////////////////////////////// Finalized ////////////////////////////////////////////////////////////////////////////

    const handleFinalized = async () => {
        try {
            const updatedDecision = {
                decisionId: id,
                status: 'Finalized',
            };
            await RankingDecisionAPI.updateRankingDecisionStatus(updatedDecision);
        } catch (error) {
            console.error("Error updating decision:", error);
            showErrorMessage("Error occurred updating decision info. Please try again.");
        }
        setViewDecision({ status: 'Finalized' })
        setDecisionStatus('Finalized')
        showSuccessMessage('Finalized successfully ');
    };
    return (
        <div style={{ marginTop: "60px" }}>
            <Box sx={{ marginTop: 4, padding: 2 }}>
                {/* Link */}
                <Typography variant="h6">
                    <a href="/ranking-decision">Ranking Decision List</a>{" "}
                    <FaAngleRight />
                    View Ranking Decision
                </Typography>
                {/* Box Decision Info */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center', // Căn giữa theo chiều dọc
                        justifyContent: 'space-between',
                        gap: 2,
                        marginTop: 2
                    }}
                >
                    {/* Ranking Decision Name */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            ustifyContent: 'flex-start',
                            width: '40%'
                        }}
                    >
                        <Typography sx={{ marginRight: 1 }}>Ranking Decision Name:</Typography>
                        <TextField
                            variant="outlined"
                            fullWidth
                            value={viewDecision.decisionName}
                            disabled
                            sx={{ width: '60%' }}
                            InputProps={{
                                sx: { height: '30px' }
                            }}
                        />
                    </Box>

                    {/* Status */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            width: '20%'
                        }}
                    >
                        <Typography sx={{ marginRight: 1 }}>Status:</Typography>
                        <TextField
                            variant="outlined"
                            value={viewDecision.status}
                            disabled
                            sx={{
                                width: '60%',
                            }}
                            InputProps={{
                                sx: { height: '30px' }
                            }}
                        />
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            width: '40%'
                        }}
                    >
                        {/* Button role và decisionStatus */}
                        {(role === 'MANAGER' || role === 'ADMIN') && decisionStatus === 'Submitted' && (
                            <>
                                {/* Confirm Button */}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleConfirm}
                                    sx={{
                                        width: '120px',
                                    }}
                                >
                                    Confirm
                                </Button>

                                {/* Reject Button */}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleReject}
                                    sx={{
                                        width: '120px',
                                    }}
                                >
                                    Reject
                                </Button>
                            </>
                        )}
                        {role === 'ADMIN' && decisionStatus === 'Confirmed' && (
                            <>
                                {/* Finalized Button */}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleFinalized}
                                    sx={{
                                        width: '120px',
                                    }}
                                >
                                    Finalized
                                </Button>
                                {/* Reject Button */}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleReject}
                                    sx={{
                                        width: '120px',
                                    }}
                                >
                                    Reject
                                </Button>
                            </>
                        )}
                    </Box>

                </Box>


                {/* Stepper */}
                <Box sx={{ width: '100%', marginTop: 2 }}>
                    <Stepper
                        activeStep={activeStep}
                        alternativeLabel={true}
                        nonLinear={['Finalized', 'Confirmed', 'Submitted'].includes(decisionStatus)}
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
            </Box >
        </div >

    );
};
export default ViewDecision;

