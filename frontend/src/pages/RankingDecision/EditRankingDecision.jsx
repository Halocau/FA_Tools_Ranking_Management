import React, { useState } from "react";
import { FaAngleRight } from "react-icons/fa";
// MUI
import {
    InputAdornment, Box, Button, Typography, TextField, Modal, IconButton, Select, MenuItem, Table, TableHead, TableBody, TableCell, TableRow
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import CircleIcon from '@mui/icons-material/RadioButtonUnchecked';
import useRankingDecision from "../../hooks/useRankingDecision.jsx";
import useNotification from "../../hooks/useNotification";
//Data
import { rankTitles, initialCriteria, initialTitles, initialTasks } from "../../pages/RankingDecision/Data"
const EditDecision = () => {
    const [activeStep, setActiveStep] = useState(1);
    const [criteriaData, setCriteriaData] = useState(initialCriteria);
    const [titles, setTitles] = useState(initialTitles);
    const [taskRows, setTaskRows] = useState(initialTasks);
    const [tasks, setTasks] = useState(initialTasks);
    const [decisionStatus, setDecisionStatus] = useState('Draft'); // Trạng thái quyết định
    const [criteria, setCriteria] = useState(initialCriteria);
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
    const handleStepChange = (step) => setActiveStep(step);

    const handleNumberInput = (value, index, field, dataSetter, data) => {
        if (!isNaN(value)) {
            const newData = [...data];
            newData[index] = { ...newData[index], [field]: value };
            dataSetter(newData);
        }
    };

    const handleSave = () => {
        console.log('Dữ liệu đã được lưu:', criteriaData, titles, taskRows);
    };

    const handleCancelAllData = () => {
        setCriteriaData(initialCriteria);
        setTitles(initialTitles);
        setTaskRows(initialTasks);
    };

    const handleInputChange = (index, field, value) => {
        const updatedTaskRows = [...taskRows];
        updatedTaskRows[index][field] = value;
        setTaskRows(updatedTaskRows);
    };

    const handleDeleteRowData = (index) => {
        const newRows = [...criteriaData];
        newRows[index] = { ...initialCriteria[index] }; // Đặt lại hàng về giá trị ban đầu từ initialCriteria
        setCriteriaData(newRows);
    };
    const rankScoreCalculation = (scores) => {
        if (!scores) return 0;
        let totalScore = 0;
        const values = { "0 - No experience": 0, "1 - Low": 1, "2 - Normal": 2, "3 - Medium": 3 };

        initialCriteria.forEach((criterion, index) => {
            const score = values[scores[index]] || 0; // Lấy giá trị điểm từ menu
            totalScore += (score * criterion.weight) / (index + 1); // Tính toán theo công thức
        });

        return totalScore;
    };

    const hasChanges = (partIndex) => JSON.stringify(parts[partIndex]) !== JSON.stringify(originalParts[partIndex]);

    // Hàm xử lý khi bấm nút "Quay lại" cho từng phần
    const handleRevertChanges = (partIndex) => {
        const newParts = [...parts];
        newParts[partIndex] = originalParts[partIndex]; // Trả lại dữ liệu gốc cho phần đó
        setParts(newParts);
    };
    const handleScoreChange = (taskIndex, titleName, value) => {
        setTasks((prevTasks) => {
            const updatedTasks = [...prevTasks];
            updatedTasks[taskIndex] = {
                ...updatedTasks[taskIndex],
                scores: {
                    ...updatedTasks[taskIndex].scores,
                    [titleName]: value, // Update the score for the specific title
                },
            };
            return updatedTasks;
        });
    };


    // Hàm xử lý khi thay đổi điểm số
    const handleChangeScore = (partIndex, taskIndex, title, value) => {
        const newParts = [...parts];
        newParts[partIndex][taskIndex].scores[title] = value;
        setParts(newParts);
        const handleScoreChange = (titleIndex, criterionIndex, value) => {
            const updatedTitles = [...titles];
            updatedTitles[titleIndex].scores[criterionIndex] = value;
            setTitles(updatedTitles);
        };
    };
    const handleAddCriteria = () => {
        const newCriteria = {
            criteria_name: 'New Criteria',
            weight: 0,
            max_score: 1,
            num_options: 1,
        };
        console.log(newCriteria)
        setCriteria([...criteria, newCriteria]);
    };
    return (
        <div style={{ marginTop: "60px" }}>
            <Box sx={{ marginTop: 4, padding: 2 }}>
                <Typography variant="h6">
                    <a href="/ranking-decision">Ranking Decision List</a>{" "}
                    <FaAngleRight />
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

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 2 }}>
                    {[1, 2, 3].map((step) => (
                        <Button
                            key={step}
                            variant={activeStep === step ? 'contained' : 'outlined'}
                            onClick={() => handleStepChange(step)}
                            sx={{ width: '50px', height: '50px', borderRadius: '50%' }}
                        >
                            {step}
                        </Button>
                    ))}
                </Box>

                {/* Step 1 - Criteria Configuration */}
                {/* Tạo viền xung quanh */}
                {/* <Box sx={{ border: '2px solid black', borderRadius: '8px', padding: 2, maxWidth: '1300px', margin: 'auto', maxHeight: '800px' }}> */}
                <Box sx={{ overflowX: 'auto' }}>
                    {
                        activeStep === 1 && (
                            <Box sx={{ overflowX: 'auto', marginTop: 2 }}>
                                <Table>
                                    <TableHead sx={{ backgroundColor: 'blue', color: '#fff' }}>
                                        <TableRow sx={{ '& > th': { backgroundColor: 'gray', color: '#fff' } }}>
                                            <TableCell>#</TableCell>
                                            <TableCell>Criteria Name</TableCell>
                                            <TableCell>Weight (%)</TableCell>
                                            <TableCell>Max Score</TableCell>
                                            <TableCell>Num Options</TableCell>
                                            {decisionStatus === 'Draft' && <TableCell>Action</TableCell>}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {criteriaData.map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>
                                                    <TextField
                                                        value={row.criteria_name}
                                                        onChange={(e) => handleInputChange(index, 'criteria_name', e.target.value)}
                                                        sx={{ width: '200px' }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        type="number"
                                                        value={row.weight || ''}
                                                        onChange={(e) => handleNumberInput(e.target.value, index, 'weight', setCriteriaData, criteriaData)}
                                                        sx={{ width: '120px' }}
                                                        InputProps={{ endAdornment: <Typography>%</Typography> }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        type="number"
                                                        value={row.max_score || ''}
                                                        onChange={(e) => handleNumberInput(e.target.value, index, 'max_score', setCriteriaData, criteriaData)}
                                                        sx={{ width: '100px' }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        type="number"
                                                        value={row.num_options || ''}
                                                        onChange={(e) => handleNumberInput(e.target.value, index, 'num_options', setCriteriaData, criteriaData)}
                                                        sx={{ width: '100px' }}
                                                    />
                                                </TableCell>
                                                {decisionStatus === 'Draft' && (
                                                    <TableCell>
                                                        <Button
                                                            variant="contained"
                                                            color="secondary"
                                                            onClick={() => handleDeleteRowData(index)}
                                                        >
                                                            Xóa
                                                        </Button>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <Button variant="contained" color="primary" onClick={handleAddCriteria}>
                                    Add Criteria
                                </Button>
                            </Box>
                        )
                    }
                </Box>
                {/* Step 2 - Title Configuration */}
                {
                    activeStep === 2 && (
                        <Box sx={{ overflowX: 'auto', marginTop: 2 }}>
                            <Table>
                                <TableHead sx={{ backgroundColor: '#b0bec5', color: '#fff' }}>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Rank Title</TableCell>
                                        {initialCriteria.map((criterion) => (
                                            <TableCell key={criterion.criteria_name}>
                                                {criterion.criteria_name}
                                            </TableCell>
                                        ))}
                                        {decisionStatus === 'Draft' && <TableCell>Action</TableCell>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {titles.map((row, titleIndex) => (
                                        <TableRow key={titleIndex}>
                                            <TableCell>{titleIndex + 1}</TableCell>
                                            <TableCell>{row.title_name}</TableCell>
                                            {initialCriteria.map((criterion, criterionIndex) => (
                                                <TableCell key={criterion.criteria_name}>
                                                    <Select
                                                        value={row.scores ? row.scores[criterionIndex] : ''}
                                                        onChange={(e) => handleScoreChange(titleIndex, criterionIndex, e.target.value)}
                                                        sx={{ width: '120px' }}
                                                    >
                                                        <MenuItem value="">
                                                        </MenuItem>
                                                        {rankTitles.map((rank) => (
                                                            <MenuItem key={rank} value={rank}>
                                                                {rank}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </TableCell>
                                            )
                                            )}
                                            {decisionStatus === 'Draft' && (
                                                <TableCell>
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        onClick={() => handleDeleteRowData(index)}
                                                    >
                                                        Xóa
                                                    </Button>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    )
                }

                {/* Step 3 - Task & Price Configuration */}
                {
                    activeStep === 3 && (
                        <Box sx={{ overflowX: 'auto', marginTop: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Tên nhiệm vụ</TableCell>
                                        <TableCell>Loại nhiệm vụ</TableCell>
                                        {initialTitles.map((title) => (
                                            <TableCell key={title.title_name}>{title.title_name}</TableCell>
                                        ))}
                                        {decisionStatus === 'Draft' && <TableCell>Action</TableCell>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {taskRows.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                <TextField
                                                    value={row.task_name}
                                                    onChange={(e) => handleInputChange(index, 'task_name', e.target.value)}
                                                    sx={{ width: '200px' }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    value={row.task_type}
                                                    onChange={(e) => handleInputChange(index, 'task_type', e.target.value)}
                                                    sx={{ width: '150px' }}
                                                />
                                            </TableCell>
                                            {initialTitles.map((title) => (
                                                <TableCell key={title.title_name}>
                                                    <TextField
                                                        type="number"
                                                        value={row.scores[title.title_name] || ''}
                                                        onChange={(e) => handleScoreChange(index, title.title_name, e.target.value)}
                                                        sx={{ width: '80px' }}
                                                        inputProps={{ min: 0 }}
                                                    />
                                                </TableCell>
                                            ))}
                                            {decisionStatus === 'Draft' && (
                                                <TableCell>
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        onClick={() => handleDeleteRowData(index)}
                                                    >
                                                        Xóa
                                                    </Button>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    )
                }

                <Box sx={{ marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="outlined" color="error" onClick={handleCancelAllData}>
                        Hủy tất cả
                    </Button>
                    <Box>
                        <Button variant="outlined" onClick={() => handleStepChange(activeStep > 1 ? activeStep - 1 : activeStep)}>
                            Quay lại
                        </Button>
                        <Button variant="contained" onClick={handleSave}>
                            Lưu
                        </Button>
                    </Box>
                </Box>
            </Box >
            {/* </Box> */}
        </div >

    );
};
export default EditDecision;
