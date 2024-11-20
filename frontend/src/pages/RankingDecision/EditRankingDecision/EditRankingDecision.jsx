import React, { useState, useEffect } from "react";
import { FaAngleRight } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
// MUI
import {
    InputAdornment, Box, Button, Typography, TextField, Modal, IconButton, Select, MenuItem, Table, TableHead, TableBody, TableCell, TableRow
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import CircleIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Stepper, Step, StepButton } from '@mui/material';
// Css 
import "../../../assets/css/RankingGroups.css"
import '../../../assets/css/Table.css';
// API
import RankingDecisionAPI from "../../../api/rankingDecisionAPI.js";
import DecisionCriteriaAPI from "../../../api/DecisionCriteriaAPI.js";
//Common
import ModalCustom from "../../../components/Common/Modal.jsx";
import ActionButtons from "../../../components/Common/ActionButtons.jsx";
import SearchComponent from "../../../components/Common/Search.jsx";
// Contexts
import { useAuth } from "../../../contexts/AuthContext.jsx";
// Hooks
import useNotification from "../../../hooks/useNotification.jsx";
//Data
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
    const [status, setStatus] = useState("");

    // Step
    const [activeStep, setActiveStep] = useState(0);
    // Data
    const [criteria, setCriteria] = useState([]);
    const [title, setTitle] = useState([]);
    const [task, setTask] = useState([]);
    const [decisionStatus, setDecisionStatus] = useState('Draft');
    // 'Criteria Configuration', 'Title Configuration', 'Task & Price Configuration'
    const steps = ['Criteria Configuration', 'Title Configuration', 'Task & Price Configuration'];
    // Trạng thái lưu dữ liệu cho từng bước
    const [isCriteriaSaved, setIsCriteriaSaved] = useState(false);
    const [isTitleSaved, setIsTitleSaved] = useState(false);
    const [isTaskSaved, setIsTaskSaved] = useState(false);

    // Table  List  (page, size) 
    // const [rows, setRows] = useState([]);
    // const [filter, setFilter] = useState('');
    // const [page, setPage] = useState(1);
    // const [pageSize, setPageSize] = useState(5);
    // const [totalElements, setTotalElements] = useState(0);
    // const [totalPages, setTotalPages] = useState(0);
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
            setStatus(decisionData.status || "");
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
        if (step === 1 && !isCriteriaSaved) return false;  // Không chuyển sang Title Configuration nếu Criteria chưa lưu
        if (step === 2 && !isTitleSaved) return false;  // Không chuyển sang Task & Price Configuration nếu Title chưa lưu
        return true;
    };
    // Hàm xử lý khi người dùng nhấn vào một bước
    const handleStepChange = (step) => {
        if (step < activeStep || canMoveToNextStep(step)) {  // Người dùng chỉ có thể quay lại các bước trước hoặc tiến tới bước sau nếu dữ liệu đã lưu
            setActiveStep(step);
        }
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
        if (index === activeStep) {
            return 'primary';  // Bước hiện tại sẽ có màu chính
        }
        if (index === 0 && !isCriteriaSaved) {
            return 'default';  // Criteria chưa lưu thì không có tick mark
        }
        if (index === 1 && !isTitleSaved) {
            return 'default';  // Title chưa lưu thì không có tick mark
        }
        if (index === 2 && !isTaskSaved) {
            return 'default';  // Task chưa lưu thì không có tick mark
        }
        return 'secondary'; // Các bước đã lưu sẽ có tick mark
    };
    // Hàm chuyển sang bước tiếp theo và cập nhật decisionStatus
    const goToNextStep = () => {
        // Cập nhật decisionStatus tùy thuộc vào bước hiện tại
        if (activeStep === 0) {
            // setDecisionStatus('In Progress'); // Bước 0: Đang tiến hành
        } else if (activeStep === 1) {
            // setDecisionStatus('In Progress'); // Bước 1: Tiến hành
        } else if (activeStep === 2) {
            setDecisionStatus('Finalize'); // Bước 2: Hoàn thành

        }

        // Chuyển sang bước tiếp theo
        setActiveStep(prevStep => prevStep + 1);
    };


    //////////////////////////////////////////////////////////////////////////// Criteria Configuration ////////////////////////////////////////////////////////////////////////////
    const getCriteriaConfiguration = async () => {
        try {
            const response = await DecisionCriteriaAPI.getDecisionCriteriaByDecisionId(id);
            console.log(response)
            setCriteria(response.result);
            // setTotalElements(response.pageInfo.element);
            // setTotalPages(response.pageInfo.total);
        } catch (error) {
            console.error("Error fetching criteria:", error);
        }
    };

    useEffect(() => {
        getCriteriaConfiguration();
        console.log(criteria);
    }, []);


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
                        criteria={criteria}
                        decisionStatus={decisionStatus}
                        goToNextStep={goToNextStep}
                        showErrorMessage={showErrorMessage}
                    />
                );
            case 1:
                return (
                    <TitleConfiguration
                        criteria={initialCriteria}
                        title={initialTitle}
                        rankTitle={rankTitle}
                        decisionStatus={decisionStatus}
                        goToNextStep={goToNextStep}
                        showErrorMessage={showErrorMessage}
                    />
                );
            case 2:
                return (
                    <TaskandPriceConfiguration
                        criteria={initialCriteria}
                        title={initialTitle}
                        rankTitle={rankTitle}
                        task={initialTask}
                        decisionStatus={decisionStatus}
                        goToNextStep={goToNextStep}
                        showErrorMessage={showErrorMessage}
                    />
                );
            default:
                return <div>No Step</div>;
        }
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

