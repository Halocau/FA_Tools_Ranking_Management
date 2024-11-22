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
import { rankTitle, initialCriteria, initialTitle, initialTask } from "../Data.jsx";
import CriteriaConfiguration from "./CriteriaConfiguration.jsx";
import TitleConfiguration from "./TitleConfiguration.jsx";
import TaskandPriceConfiguration from "./TaskandPriceConfiguration.jsx";

const EditDecision = () => {
    // const navigate = useNavigate(); // To navigate between pages
    const { id } = useParams(); // Get the ID from the URL
    // Edit
    const [editDecision, setEditDecision] = useState({ decisionName: '' });
    const [originalDecisionName, setOriginalDecisionName] = useState('');
    const [showEditDecisionInfoModal, setShowEditDecisionInfoModal] = useState(false); // Display decision editing modal
    const [newDecisionName, setNewDecisionName] = useState(""); // New decision Name
    // Step
    const [activeStep, setActiveStep] = useState(2);
    // Data
    const [decisionStatus, setDecisionStatus] = useState('');
    // 'Criteria Configuration', 'Title Configuration', 'Task & Price Configuration'
    const steps = ['Criteria Configuration', 'Title Configuration', 'Task & Price Configuration'];
    // Trạng thái lưu dữ liệu cho từng bước
    const [isCriteriaSaved, setIsCriteriaSaved] = useState(false);
    const [isTitleSaved, setIsTitleSaved] = useState(false);
    const [isTaskSaved, setIsTaskSaved] = useState(false);
    // Use hook notification
    const [showSuccessMessage, showErrorMessage] = useNotification();
    // Validation error message
    const [validationMessage, setValidationMessage] = useState("");

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



    /////////////////////////////////////////////////////// Stepp /////////////////////////////////////////////////////////////////
    // Hàm kiểm tra xem có thể chuyển sang bước khác không
    const canMoveToNextStep = (step) => {
        // Nếu trạng thái là 'Finalized', cho phép chuyển bước bất chấp trạng thái lưu
        if (decisionStatus === 'Finalized') {
            return true;
        }
        if (step === 1 && !isCriteriaSaved) return false;  // Không chuyển sang Title Configuration nếu Criteria chưa lưu
        if (step === 2 && !isTitleSaved) return false;  // Không chuyển sang Task & Price Configuration nếu Title chưa lưu
        return true;
    };
    // Hàm xử lý khi người dùng nhấn vào một bước
    const handleStepChange = (step) => {
        // Người dùng chỉ có thể quay lại các bước trước hoặc tiến tới bước sau nếu dữ liệu đã lưu, hoặc nếu trạng thái là 'Finalized'
        // if (step < activeStep || canMoveToNextStep(step)) {
        //     setActiveStep(step);
        // }
        setActiveStep(step);
    };
    // Hàm xử lý khi lưu dữ liệu cho từng bước
    const handleSave = () => {
        if (activeStep === 0) {
            setIsCriteriaSaved(true); // Đánh dấu Criteria đã lưu
        } else if (activeStep === 1) {
            setIsTitleSaved(true); // Đánh dấu Title đã lưu
        } else if (activeStep === 2) {
            setIsTaskSaved(true); // Đánh dấu Task đã lưu
        }
    };
    // Màu sắc cho từng bước dựa trên trạng thái
    const getStepColor = (index) => {
        // Nếu trạng thái là 'Finalize', tất cả các bước sẽ có màu xanh
        if (decisionStatus === 'Finalize') {
            setIsTaskSaved(true)
            return 'primary';  // Màu xanh cho tất cả các bước khi trạng thái là 'Finalize'
        }

        // Kiểm tra bước hiện tại và trạng thái 'Draft'
        if (index === activeStep) {
            return 'primary';  // Bước hiện tại có màu chính (xanh)
        }

        // Kiểm tra nếu trạng thái là 'Draft' và bước chưa được lưu
        if (index === 0 && !isCriteriaSaved) {
            return 'default';  // Màu xám cho Criteria nếu chưa lưu
        }
        if (index === 1 && !isTitleSaved) {
            return 'default';  // Màu xám cho Title nếu chưa lưu
        }
        if (index === 2 && !isTaskSaved) {
            return 'default';  // Màu xám cho Task nếu chưa lưu
        }

        return 'secondary';  // Các bước đã lưu có màu phụ (xanh nhẹ)
    };

    // Hàm chuyển sang bước tiếp theo và cập nhật decisionStatus
    const goToNextStep = () => {
        // Chuyển sang bước tiếp theo và cập nhật decisionStatus
        if (activeStep === 0) {
            // setDecisionStatus('In Progress'); // Bước 0: Đang tiến hành
        } else if (activeStep === 1) {
            // setDecisionStatus('In Progress'); // Bước 1: Tiến hành
        } else if (activeStep === 2) {
            // setDecisionStatus('In Progress'); // Bước 2: Tiến hành
        } else if (activeStep === 3) {
            setDecisionStatus('Finalized'); // Bước 3: Hoàn thành
        }

        // Chuyển sang bước tiếp theo
        setActiveStep(prevStep => prevStep + 1);
    };
    //////////////////////////////////////////////////////////////////////////// Criteria Configuration ////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////// End Criteria Configuration ////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////// Title Configuration ////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////// End Title Configuration ////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////// Task and Price Configuration ////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////// End Task and Price Configuration ////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////renderStepContent////////////////////////////////////////////////////////////////////////////
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
    const handleSubmit = () => {
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
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '48%', justifyContent: 'flex-end' }}> {/* Giãn khoảng cách ở đây */}
                        <Typography sx={{ marginRight: 1 }}>Status:</Typography>
                        <TextField
                            variant="outlined"
                            fullWidth
                            value={decisionStatus}
                            disabled
                            sx={{ width: '60%' }}
                            InputProps={{
                                sx: { height: '30px' }
                            }}
                        />
                    </Box>

                    {/* Submit */}
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '48%', justifyContent: 'flex-end' }}>
                        {activeStep === 2 && (  // Chỉ hiển thị nút Submit khi activeStep = 2
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                sx={{
                                    visibility: decisionStatus === 'Draft' ? 'visible' : 'hidden', // Giữ không gian cho nút nếu là Draft
                                }}
                            >
                                Submit
                            </Button>
                        )}
                    </Box>

                </Box>



                {/* Stepper */}
                <Box sx={{ width: '100%', marginTop: 2 }}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label, index) => (
                            <Step key={label}>
                                <StepButton
                                    onClick={() => handleStepChange(index)}
                                    sx={{
                                        color: getStepColor(index),
                                        textAlign: 'center',  // Ensure the label is centered
                                        fontSize: '16px',  // Customize font size as needed
                                        fontWeight: 'bold'  // Optional: Make the label bold
                                    }}
                                >
                                    {label}  {/* Only display the step label */}
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

