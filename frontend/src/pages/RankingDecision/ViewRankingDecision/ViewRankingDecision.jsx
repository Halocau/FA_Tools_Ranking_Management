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
import FeedbacknAPI from "../../../api/FeedbackAPI.js";
// Hooks
import useNotification from "../../../hooks/useNotification.jsx";
//Steper
import CriteriaConfiguration from "../ViewRankingDecision/CriteriaConfiguration.jsx";
import TitleConfiguration from "../ViewRankingDecision/TitleConfiguration.jsx";
import TaskandPriceConfiguration from "../ViewRankingDecision/TaskandPriceConfiguration.jsx";

const ViewDecision = () => {
    const navigate = useNavigate(); // Khởi tạo hook useNavigate
    const role = localStorage.getItem('userRole');

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
    const [note, setNote] = useState('');
    //////////////////////////////////////////////////////////////////////////// Edit ////////////////////////////////////////////////////////////////////////////
    // Ranking Decision Edit
    const ViewRankingDecision = async () => {
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


    const FeedBack = async () => {
        try {
            const Feedback = await FeedbacknAPI.getFeedbackById(id)
            setNote(Feedback.note)
        } catch (error) {
            console.error("Error fetching group:", error);
        }
    };
    // Fetch Ranking Decision on id change
    useEffect(() => {
        ViewRankingDecision();
        FeedBack();
    }, [id, decisionStatus]);
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

    //////////////////////////////////////////////////////////////////////////// Submit ////////////////////////////////////////////////////////////////////////////
    const handleStatusUpdate = async (status, successMessage, additionalData = {}) => {
        try {
            const updatedFeedback = {
                decisionId: id,
                note: note,
            };
            console.log(updatedFeedback);
            await FeedbacknAPI.updateFeedback(updatedFeedback);
        } catch (error) {
            console.error("Error updating feedback:", error);
        }

        try {
            const updatedDecision = {
                decisionId: id,
                status: status,
                ...additionalData,
            };
            console.log(updatedDecision);
            await RankingDecisionAPI.updateRankingDecisionStatus(updatedDecision);
            setViewDecision({ status: status });
            setDecisionStatus(status);
            showSuccessMessage(successMessage);
        } catch (error) {
            console.error("Error updating decision:", error);
            showErrorMessage("Error occurred updating decision info. Please try again.");
        }
    };

    // Hàm xử lý từng trạng thái
    const handleConfirm = () => {
        handleStatusUpdate('Confirmed', 'Confirm successfully');
        navigate('/ranking-decision')
    };

    const handleReject = () => {
        handleStatusUpdate('Rejected', 'Rejected successfully');
        if (role !== 'admin') {
            navigate('/ranking-decision');
        }
    };

    const handleFinalized = () => {
        handleStatusUpdate('Finalized', 'Finalized successfully', { finalized_by: localStorage.getItem('userId') });
        navigate('/ranking-decision')
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
                        alignItems: 'center',
                        ustifyContent: 'flex-start',
                        gap: 2,
                        marginTop: 2
                    }}
                >
                    {/* Ranking Decision Name */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
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
                            width: '20%'
                        }}
                    >
                        <Typography sx={{ marginRight: 1 }}>Status:</Typography>
                        <TextField
                            variant="outlined"
                            value={viewDecision.status}
                            disabled
                            sx={{ width: '60%' }}
                            InputProps={{ sx: { height: '30px' } }}
                        />
                    </Box>
                </Box>
                {/* Stepper */}
                <Box sx={{ width: '100%', marginTop: 2 }}>
                    <Stepper
                        activeStep={activeStep}
                        alternativeLabel={true}
                        nonLinear={['Rejected', 'Confirmed', 'Submitted', 'Finalized'].includes(decisionStatus)}
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

                {/* Feedback */}


                <Box sx={{ marginTop: '10px' }}>
                    <Typography variant="h6">
                        Note
                    </Typography>
                    {(role === 'MANAGER' || role === 'ADMIN') ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: '5px' }}>
                            <textarea
                                value={note}
                                onChange={(e) => {
                                    setNote(e.target.value);
                                }}
                                style={{
                                    height: '100px',
                                    width: '100%',
                                    padding: '10px',
                                    fontSize: '14px',
                                    borderRadius: '5px',
                                    resize: 'none'
                                }}
                            />
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: '5px' }}>
                            <textarea
                                value={note}
                                readOnly
                                style={{
                                    height: '100px',
                                    width: '100%',
                                    padding: '10px',
                                    fontSize: '14px',
                                    borderRadius: '5px',
                                    resize: 'none',
                                    backgroundColor: '#f5f5f5',
                                    cursor: 'not-allowed'
                                }}
                            />
                        </Box>
                    )}
                </Box>
                {/* Submit */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        ustifyContent: 'flex-end',
                        marginTop: 2,
                        width: '40%',
                        gap: 2,
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
                                    display: 'flex',
                                    alignItems: 'center',
                                    ustifyContent: 'flex-end',
                                    width: '120px',
                                }}
                            >
                                Confirm
                            </Button>

                            {/* Reject Button */}
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleReject}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    ustifyContent: 'flex-end',
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
                                    display: 'flex',
                                    alignItems: 'center',
                                    ustifyContent: 'flex-end',
                                    width: '120px',
                                }}
                            >
                                Finalized
                            </Button>
                            {/* Reject Button */}
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleReject}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'error',
                                    ustifyContent: 'flex-end',
                                    width: '120px',
                                }}
                            >
                                Reject
                            </Button>
                        </>
                    )}
                </Box>
            </Box >
        </div >

    );
};
export default ViewDecision;

