import React, { useState } from "react";
import { FaAngleRight } from "react-icons/fa";
import { Box, Button, Select, MenuItem, Typography, TextField, Table, TableHead, TableBody, TableCell, TableRow } from "@mui/material";

const rankTitles = [
    "0 - No experience",
    "1 - Low",
    "2 - Normal",
    "3 - Medium",
];
const initialCriteria = [
    { criteria_name: 'Scope of Training Assignments', weight: 10, max_score: 4, num_options: 4 },
    { criteria_name: 'Technical or Professional Skills', weight: 10, max_score: 6, num_options: 6 },
    { criteria_name: 'Courseraware Development', weight: 30, max_score: 4, num_options: 4 },
    { criteria_name: 'Courseware Development', weight: 10, max_score: 3, num_options: 3 },
    { criteria_name: 'Training Certificate', weight: 30, max_score: 4, num_options: 4 },
    { criteria_name: 'Years of Working and Teaching', weight: 10, max_score: 4, num_options: 4 },
];

const initialTitles = [
    { title_name: 'TRN1.1', rank_score: 37 },
    { title_name: 'TRN1.2', rank_score: 45 },
    { title_name: 'TRN1.3', rank_score: 50 },
    { title_name: 'TRN2.1', rank_score: 61 },
    { title_name: 'TRN2.2', rank_score: 63 },
    { title_name: 'TRN2.3', rank_score: 74 },
    { title_name: 'TRN3.1', rank_score: 80 },
    { title_name: 'TRN3.2', rank_score: 86 },
    { title_name: 'TRN3.3', rank_score: 100 },
];

const initialTasks = [
    { task_name: 'Giảng dạy', task_type: 'In Working Hour', scores: initialTitles.reduce((acc, title) => ({ ...acc, [title.title_name]: '' }), {}) },
    { task_name: 'Giảng dạy', task_type: 'Overtime', scores: initialTitles.reduce((acc, title) => ({ ...acc, [title.title_name]: '' }), {}) },
    { task_name: 'Hướng dẫn, hỗ trợ, chấm bài', task_type: 'In Working Hour', scores: initialTitles.reduce((acc, title) => ({ ...acc, [title.title_name]: '' }), {}) },
    { task_name: 'Hướng dẫn, hỗ trợ, chấm bài', task_type: 'Overtime', scores: initialTitles.reduce((acc, title) => ({ ...acc, [title.title_name]: '' }), {}) },
    { task_name: 'Tạo tài liệu', task_type: 'In Working Hour', scores: initialTitles.reduce((acc, title) => ({ ...acc, [title.title_name]: '' }), {}) },
    { task_name: 'Tạo tài liệu', task_type: 'Overtime', scores: initialTitles.reduce((acc, title) => ({ ...acc, [title.title_name]: '' }), {}) },
    { task_name: 'Xem xét tài liệu', task_type: 'In Working Hour', scores: initialTitles.reduce((acc, title) => ({ ...acc, [title.title_name]: '' }), {}) },
    { task_name: 'Xem xét tài liệu', task_type: 'Overtime', scores: initialTitles.reduce((acc, title) => ({ ...acc, [title.title_name]: '' }), {}) },
];
const EditDecision = () => {
    const [activeStep, setActiveStep] = useState(1);
    const [criteriaData, setCriteriaData] = useState(initialCriteria);
    const [titles, setTitles] = useState(initialTitles);
    const [taskRows, setTaskRows] = useState(initialTasks);
    const [decisionStatus, setDecisionStatus] = useState('Draft'); // Trạng thái quyết định

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

    const handleScoreChange = (titleIndex, criterionIndex, value) => {
        const updatedTitles = [...titles];
        updatedTitles[titleIndex].scores[criterionIndex] = value;
        setTitles(updatedTitles);
    };
    return (
        <div style={{ marginTop: "60px" }}>
            <Box sx={{ marginTop: 4, padding: 2 }}>
                <Typography variant="h6">
                    <a href="/ranking_decision">Ranking Decision List</a>{" "}
                    <FaAngleRight />
                    Edit Ranking Decision
                </Typography>

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
                <Box sx={{ overflowX: 'auto', marginTop: 2 }}>
                    {activeStep === 1 && (
                        <Box sx={{ overflowX: 'auto', marginTop: 2 }}>
                            <Table>
                                <TableHead sx={{ backgroundColor: '#FFFAF0', color: '#fff' }}>
                                    <TableRow>
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
                        </Box>
                    )}
                </Box>
                {/* Step 2 - Title Configuration */}
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
        </div >
    );
};

export default EditDecision;
