import React, { useEffect, useState } from 'react';
import { MdDeleteForever } from 'react-icons/md';
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

// MUI
import {
    Box, Button, Typography, TextField, IconButton,
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import AddCircleIcon from '@mui/icons-material/AddCircle'; // Dấu + icon
// API
import DecisionTitleAPI from "../../../api/DecisionTitleAPI.js";
import DecisionTaskAPI from "../../../api/DecisionTaskAPI.js";
import TaskWageAPI from '../../../api/TaskWageAPI.js';
import taskApi from '../../../api/TaskAPI.js';


const TaskandPriceConfiguration = ({ decisionStatus, goToNextStep, showErrorMessage, showSuccessMessage }) => {
    // Data
    const { id } = useParams(); // Get the ID from the URL
    const [originalTask, setOriginalTask] = useState([]);  // Lưu dữ liệu gốc
    const [title, setTitle] = useState([]);  // Lưu dữ liệu gốc
    // Row table
    const [rows, setRows] = useState([]);
    // State để lưu trữ giá trị đang chỉnh sửa của từng ô
    const [editedWages, setEditedWages] = useState({});
    //Select to Add a new Task
    const [selectedTask, setSelectedTask] = useState(null);
    // Sử dụng useState để lưu danh sách tên task
    const [listtask, setListTask] = useState([]);

    const getListTask = async () => {
        try {
            const response = await taskApi.getAllTaskWihtOutPagination();
            setListTask(response);
            console.log('list', response)
        } catch (error) {
            console.error("Error fetching task:", error);
        }
    }

    useEffect(() => {
        getListTask();
    }, [id]);

    // Load data getTaskConfiguration
    const getTaskConfiguration = async () => {
        try {
            const response = await DecisionTaskAPI.getDecisionTaskByDecisionId(id);
            console.log(response)
            setOriginalTask(response);
        } catch (error) {
            console.error("Error fetching task:", error);
        }
    };
    // Load data getTitleConfiguration
    const getTitleConfiguration = async () => {
        try {
            const response = await DecisionTitleAPI.getDecisionTitleByDecisionId(id);
            // console.log(response)
            setTitle(response);
        } catch (error) {
            console.error("Error fetching task:", error);
        }
    };
    // Load update
    useEffect(() => {
        getTaskConfiguration()
        getTitleConfiguration();
    }, [id]);

    //////////////////////////////////// Xử Lý backend /////////////////////////////////
    const upsertDecisionTask = async (data) => {
        try {
            const response = await DecisionTaskAPI.updateDecisionTask(data);
            return response;
        } catch (error) {
            console.error("Error fetching task:", error);
        }
    }
    const deleteDecisionTask = async (decisionId, taskId) => {
        try {
            const response = await DecisionTaskAPI.deleteDecisionTask(decisionId, taskId);
            return response;
        } catch (error) {
            console.error("Error fetching task:", error);
        }
    }
    const upsertTaskWage = async (data) => {
        try {
            const response = await TaskWageAPI.upsertTaskWage(data);
            return response;
        } catch (error) {
            console.error("Error fetching task:", error);
        }
    }
    const deleteTaskWage = async (taskId, rankingTitleId) => {
        try {
            const response = await TaskWageAPI.deleteTaskWage(taskId, rankingTitleId);
            return response;
        } catch (error) {
            console.error("Error fetching task:", error);
        }
    }
    const synsDecisionTask = async (rows, originalTask) => {
        const originalTaskMap = new Map(originalTask.map(task => [task.taskId, task]));
        const rowsMap = new Map(rows.map(task => [task.taskId, task]));

        // Task-level operations
        for (const [taskId, original] of originalTaskMap) {
            if (!rowsMap.has(taskId)) {
                // Task deleted
                await deleteDecisionTask(original.decisionId, original.taskId);
            }
        }

        for (const [taskId, current] of rowsMap) {
            if (!originalTaskMap.has(taskId)) {
                // Task added
                await upsertDecisionTask({ decisionId: current.decisionId, taskId: current.taskId });
            } else {
                // Task exists, check for updates
                const original = originalTaskMap.get(taskId);
                if (original.taskName !== current.taskName) {
                    await upsertDecisionTask({ decisionId: current.decisionId, taskId: current.taskId });
                }
            }
        }

        // Task Wage-level operations
        for (const [taskId, current] of rowsMap) {
            const currentWages = new Map(current.taskWages.map(wage => [wage.rankingTitleId, wage]));
            const originalWages = originalTaskMap.has(taskId)
                ? new Map(originalTaskMap.get(taskId).taskWages.map(wage => [wage.rankingTitleId, wage]))
                : new Map();
            const upsertWages = [];
            for (const [rankingTitleId, currentWage] of currentWages) {
                if (!originalWages.has(rankingTitleId)) {
                    upsertWages.push({
                        rankingTitleId: currentWage.rankingTitleId,
                        taskId: taskId,
                        workingHourWage: Number(currentWage.workingHourWage),
                        overtimeWage: Number(currentWage.overtimeWage),
                    });
                } else {
                    const originalWage = originalWages.get(rankingTitleId);
                    if (
                        originalWage.workingHourWage != currentWage.workingHourWage ||
                        originalWage.overtimeWage != currentWage.overtimeWage
                    ) {
                        upsertWages.push({
                            rankingTitleId: currentWage.rankingTitleId,
                            taskId: taskId,
                            workingHourWage: Number(currentWage.workingHourWage),
                            overtimeWage: Number(currentWage.overtimeWage),
                        });
                    }
                }
            }
            if (upsertWages.length > 0) {
                await upsertTaskWage(upsertWages);
            }
            for (const [rankingTitleId] of originalWages) {
                if (!currentWages.has(rankingTitleId)) {
                    await deleteTaskWage(taskId, rankingTitleId);
                }
            }
        }
    }

    ///////////////////////////// The update function changes //////////////////////////
    const handleCellEditTaskCommit = (taskId, rankingTitleId, wageType, value) => {
        setEditedWages({
            ...editedWages,
            [`${taskId}-${rankingTitleId}-${wageType}`]: value
        });
        setRows((prevRows) =>
            prevRows.map((row) => {
                if (row.taskId === taskId) {
                    const updatedTaskWages = row.taskWages.map((wage) => {
                        if (wage.rankingTitleId === rankingTitleId) {
                            return {
                                ...wage,
                                [wageType]: value,
                            };
                        }
                        return wage;
                    });

                    return {
                        ...row,
                        taskWages: updatedTaskWages,
                    };
                }
                return row;
            })
        );
    };
    // End 

    //////////////////////////////////// Remove row ///////////////////////////////////////
    const handleDeleteRowData = (taskId) => {
        setRows((prevRows) => {
            const taskName = taskId;
            const updatedRows = prevRows.filter((row) => row.taskId !== taskName);
            return updatedRows;
        });
    };
    // End 

    //////////////////////////////////// Select to Add a new Task //////////////////////
    const handleAddTask = () => {
        const addedTask = listtask.find(
            (task) => task.taskId === selectedTask.value
        );
        const newRow = {
            decisionId: id,
            taskId: addedTask.taskId,
            taskName: addedTask.taskName,
            taskWages: title.map((titleItem) => ({
                rankingTitleId: titleItem.rankingTitleId,
                titleName: titleItem.rankingTitleName,
                workingHourWage: '',
                overtimeWage: '',
            })),
        };
        setRows((prevRows) => normalizeRows([...prevRows, newRow], allTitle));
        setSelectedTask(null);
    };
    // End 

    //////////////////////////////////// Cancel ///////////////////////////////////////
    const handleCancelChanges = () => {
        console.log('cancel');
        setRows(originalTask)
        setSelectedTask(null)
    };
    // End 

    //////////////////////////////////// Save ///////////////////////////////////////
    const handleSaveChanges = () => {
        console.log(rows)
        const isRowValid = (row) => {
            return Object.keys(row).every((key) => {
                if (['taskId', 'taskName', 'taskType'].includes(key)) {
                    return true;
                }
                const value = row[key];
                if (value === '') {
                    console.log(`Ô thiếu dữ liệu: ${key}, Dòng: ${JSON.stringify(row)}`);
                    return false;
                }
                return true;
            });
        };
        const allFieldsFilled = rows.every(isRowValid);
        if (!allFieldsFilled) {
            showErrorMessage('Tất cả các ô phải được điền đầy đủ');
            console.log('Có ô chưa điền dữ liệu');
            return;
        }
        synsDecisionTask(rows, originalTask);
        showSuccessMessage('Task & Price Configuration successfully updated.');
        goToNextStep({ stayOnCurrentStep: true });
    };

    //////////////////////////////////// Column Task//////////////////////////////////
    // Get the list of titleNames from rankingTitles
    const allTitle = title.map((title) => ({
        rankingTitleId: title.rankingTitleId,
        titleName: title.rankingTitleName,
    }));
    const normalizeRows = (rows, allTitles) => {
        return rows.map((row) => {
            const updatedRow = { ...row };
            const existingTitleIds = new Set((updatedRow.taskWages || []).map((wage) => wage.rankingTitleId));
            allTitles.forEach(({ rankingTitleId, titleName }) => {
                if (!existingTitleIds.has(rankingTitleId)) {
                    updatedRow.taskWages.push({
                        rankingTitleId,
                        titleName,
                        workingHourWage: null,
                        overtimeWage: null,
                    });
                }
            });
            updatedRow.taskWages = updatedRow.taskWages.sort((a, b) => a.titleName.localeCompare(b.titleName));
            return updatedRow;
        });
    };
    useEffect(() => {
        const normalized = normalizeRows(originalTask, allTitle);
        setRows(normalized);
    }, [originalTask]);

    //////////////////////////////////// Return //////////////////////////////////////
    return (
        <div>
            {/* Surrounding border */}
            <Box
                sx={{
                    width: "100%",
                    height: 500,
                    marginTop: '10px',
                    border: '2px solid black',
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}>
                <Box sx={{ width: '100%', height: 400, marginTop: '10px' }}>
                    {/* Table  */}
                    <TableContainer component={Paper} sx={{ minWidth: 400, maxHeight: 400, height: 400, overflowX: 'auto', overflowY: 'auto' }}>
                        <Table sx={{}} aria-label="task table">
                            <TableHead>
                                <TableRow>
                                    {/* Task Name */}
                                    <TableCell
                                        style={{
                                            position: 'sticky', left: 0, backgroundColor: '#e0e0e0', boxSizing: 'border-box',
                                            width: '120px',
                                            maxWidth: '120px',
                                            minWidth: '120px',
                                            overflow: 'hidden',
                                            zIndex: 2,
                                        }} >
                                        Task
                                    </TableCell>
                                    {/* Task Type */}
                                    <TableCell
                                        style={{
                                            position: 'sticky', backgroundColor: '#e0e0e0', left: 120, zIndex: 2, boxSizing: 'border-box',
                                            width: '120px',
                                            maxWidth: '120px',
                                            minWidth: '120px',
                                            overflow: 'hidden',
                                        }} rowSpan={2}
                                    >Task Type
                                    </TableCell>

                                    {/* Column title*/}
                                    {allTitle.map((title, index) => (
                                        <TableCell
                                            key={`wh-${index}`}
                                            style={{
                                                backgroundColor: '#e0e0e0',
                                                width: '120px',
                                                maxWidth: '120px',
                                                minWidth: '120px',
                                                zIndex: 1,
                                                boxSizing: 'border-box',
                                            }}
                                        >
                                            {title.titleName}
                                        </TableCell>
                                    ))}
                                    {/* Column action*/}
                                    <TableCell
                                        style={{
                                            position: 'sticky',
                                            // right: 0,
                                            backgroundColor: '#e0e0e0',
                                            zIndex: 1,
                                            boxSizing: 'border-box',
                                        }}
                                        rowSpan={2}
                                    >
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {rows.map((task) => {
                                    return (
                                        <>
                                            {/* Row for In Working Hour */}
                                            <TableRow key={`task-${task.taskId}-wh`}>
                                                {/* Column Task Name */}
                                                <TableCell
                                                    style={{
                                                        position: 'sticky', left: 0, background: '#fff', zIndex: 2, boxSizing: 'border-box',
                                                        width: '120px',
                                                        maxWidth: '120px',
                                                        minWidth: '120px',
                                                        overflow: 'hidden',
                                                    }}
                                                    rowSpan={2}
                                                >
                                                    {task.taskName}
                                                </TableCell>
                                                {/* Row task type Working Hour */}
                                                <TableCell style={{
                                                    position: 'sticky', left: 120, background: '#fff', zIndex: 2, boxSizing: 'border-box',
                                                    width: '120px',
                                                    maxWidth: '120px',
                                                    minWidth: '120px',
                                                    overflow: 'hidden',
                                                }}>In Working Hour</TableCell>
                                                {/* Rows Title for Working Hour */}
                                                {allTitle.map((title, index) => {
                                                    const titleData = task.taskWages.find(
                                                        (wage) => wage.rankingTitleId === title.rankingTitleId
                                                    ) || { rankingTitleId: title.rankingTitleId, workingHourWage: '' };

                                                    const workingHourWage = titleData ? titleData.workingHourWage : "";
                                                    return (
                                                        <TableCell key={`wh-${index}`}>
                                                            <TextField
                                                                value={editedWages[`${task.taskId}-${title.rankingTitleId}-workingHourWage`] || workingHourWage}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    if (/^\d*$/.test(value)) {
                                                                        handleCellEditTaskCommit(task.taskId, title.rankingTitleId, "workingHourWage", value);
                                                                    }
                                                                }}
                                                                onKeyDown={(e) => {
                                                                    const invalidKeys = ["e", "E", "+", "-", ".", ","];
                                                                    if (invalidKeys.includes(e.key)) {
                                                                        e.preventDefault();
                                                                    }
                                                                }}

                                                                size="small"
                                                                variant="outlined"
                                                                fullWidth
                                                                type="number"
                                                                inputMode="numeric"
                                                            />
                                                        </TableCell>
                                                    );
                                                })}
                                                {/* Row Action */}
                                                <TableCell
                                                    style={{
                                                        position: 'sticky',
                                                        // right: 0,
                                                        background: '#fff',
                                                        zIndex: 2,
                                                        boxSizing: 'border-box',
                                                    }}
                                                    rowSpan={2}
                                                >
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        onClick={() => handleDeleteRowData(task.taskId)} // Gọi hàm xóa khi nhấn nút
                                                    >
                                                        <MdDeleteForever />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                            {/* Row for Overtime ( ở type Ovrertime thì không cần tablecell cho taskname và action vì lấy ở type In Working Hour */}
                                            <TableRow key={`task-${task.taskId}-ot`}>
                                                {/* Row task type Overtime */}
                                                <TableCell style={{
                                                    position: 'sticky', background: '#fff', left: 120, zIndex: 2, boxSizing: 'border-box',
                                                    width: '120px',
                                                    maxWidth: '120px',
                                                    minWidth: '120px',
                                                    overflow: 'hidden',
                                                }}>Overtime</TableCell>
                                                {/* Rows Title for cho Overtime */}
                                                {allTitle.map((title, index) => {
                                                    const titleData = task.taskWages.find(wage => wage.rankingTitleId === title.rankingTitleId);
                                                    const overtimeWage = titleData ? titleData.overtimeWage : "";
                                                    return (
                                                        <TableCell key={`ot-${index}`}>
                                                            <TextField
                                                                value={editedWages[`${task.taskId}-${title.rankingTitleId}-overtimeWage`] || overtimeWage}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    // Chỉ cho phép số dương (hoặc rỗng)
                                                                    if (/^\d*$/.test(value)) {
                                                                        handleCellEditTaskCommit(task.taskId, title.rankingTitleId, "overtimeWage", value);
                                                                    }
                                                                }}
                                                                onKeyDown={(e) => {
                                                                    // Chặn các ký tự không phải số (trừ phím điều khiển)
                                                                    const invalidKeys = ["e", "E", "+", "-", ".", ","];
                                                                    if (invalidKeys.includes(e.key)) {
                                                                        e.preventDefault();
                                                                    }
                                                                }}
                                                                size="small"
                                                                variant="outlined"
                                                                fullWidth
                                                                type="text"
                                                                inputMode="numeric"
                                                            />
                                                        </TableCell>

                                                    );
                                                })}
                                            </TableRow>
                                        </>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, marginTop: '20px' }}>
                        {/* Select to Add a new Task */}
                        <Box>
                            {decisionStatus === 'Draft' && (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <Select
                                        isSearchable={true}
                                        placeholder="Select to Add a new Task"
                                        options={listtask
                                            .filter((task) => !rows.some((row) => row.taskId === task.taskId))
                                            .map((task) => ({ value: task.taskId, label: task.taskName }))}
                                        styles={{
                                            container: (provided) => ({ ...provided, width: '300px' }),
                                            control: (provided) => ({
                                                ...provided,
                                                height: '40px',
                                                fontSize: '16px',
                                                display: 'flex',
                                                alignItems: 'center',
                                            }),
                                            placeholder: (provided) => ({ ...provided, color: '#888' }),
                                            menu: (provided) => ({
                                                ...provided,
                                                maxHeight: 300,
                                                overflowY: 'auto',
                                                zIndex: 9999,
                                            }),
                                        }}
                                        menuPlacement="top"
                                        value={selectedTask}
                                        onChange={(option) => {
                                            setSelectedTask(option)
                                        }}
                                    />
                                    <IconButton
                                        onClick={handleAddTask}
                                        color={selectedTask ? 'primary' : 'default'}
                                        sx={{
                                            marginLeft: 1,
                                            height: '30px',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <AddCircleIcon sx={{ fontSize: 30 }} />
                                    </IconButton>
                                </Box>
                            )}
                        </Box>
                        {/* Cancel and Save */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
                            {/* Cancel*/}
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleCancelChanges}
                            >
                                Cancel
                            </Button>
                            {/* Save */}
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSaveChanges}
                            >
                                Save
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </div>
    );
};

export default TaskandPriceConfiguration;