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


const TaskandPriceConfiguration = ({ decisionStatus, goToNextStep, showErrorMessage, showSuccessMessage, activeStep }) => {
    const role = localStorage.getItem('userRole');
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
        } catch (error) {
            console.error("Error fetching task:", error);
        }
    }

    useEffect(() => {
        getListTask();
    }, [activeStep]);

    // Load data getTaskConfiguration
    const getTaskConfiguration = async () => {
        try {
            const response = await DecisionTaskAPI.getDecisionTaskByDecisionId(id);
            setOriginalTask(response);
        } catch (error) {
            console.error("Error fetching task:", error);
        }
    };
    // Load data getTitleConfiguration
    const getTitleConfiguration = async () => {
        try {
            const response = await DecisionTitleAPI.getDecisionTitleByDecisionId(id);

            setTitle(response);
        } catch (error) {
            console.error("Error fetching task:", error);
        }
    };
    // Load update
    useEffect(() => {
        getTaskConfiguration()
        getTitleConfiguration();
    }, [activeStep]);

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
                    // New wage added
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
                        // Wage updated
                        upsertWages.push({
                            rankingTitleId: currentWage.rankingTitleId,
                            taskId: taskId,
                            workingHourWage: Number(currentWage.workingHourWage),
                            overtimeWage: Number(currentWage.overtimeWage),
                        });
                    }
                }
            }

            // Perform batch upsert for task wages
            if (upsertWages.length > 0) {
                await upsertTaskWage(upsertWages);
            }

            console.log('upsertWages', upsertWages);

            // Handle wage deletions
            for (const [rankingTitleId] of originalWages) {
                if (!currentWages.has(rankingTitleId)) {
                    await deleteTaskWage(taskId, rankingTitleId);
                }
            }
        }
    }


    ///////////////////////////// The update function changes //////////////////////////
    const handleCellEditTaskCommit = (taskId, rankingTitleId, wageType, value) => {
        setEditedWages((prev) => ({
            ...prev,
            [`${taskId}-${rankingTitleId}-${wageType}`]: value,
        }));

        setRows((prevRows) =>
            prevRows.map((row) => {
                if (row.taskId === taskId) {
                    const updatedTaskWages = row.taskWages.map((wage) =>
                        wage.rankingTitleId === rankingTitleId
                            ? { ...wage, [wageType]: value }
                            : wage
                    );
                    return { ...row, taskWages: updatedTaskWages };
                }
                return row;
            })
        );
    };

    // End 
    //////////////////////////////////// Remove row ///////////////////////////////////////
    const handleDeleteRowData = (taskId) => {
        setRows((prevRows) => {
            // Tìm taskName từ taskId
            const taskName = taskId;
            // Lọc bỏ tất cả các hàng liên quan đến taskName
            const updatedRows = prevRows.filter((row) => row.taskId !== taskName);
            return updatedRows;
        });
    };
    // End 

    //////////////////////////////////// Select to Add a new Task //////////////////////
    const handleAddTask = () => {
        const addedTask = listtask.find(
            (task) => task.taskId === selectedTask.value // Chắc chắn rằng bạn sử dụng đúng key (ở đây là selectedTask.value)
        );
        const newRow = {
            decisionId: id,
            taskId: addedTask.taskId,  // Or get the real ID from the server
            taskName: addedTask.taskName,
            taskWages: title.map((titleItem) => ({

                rankingTitleId: titleItem.rankingTitleId,
                titleName: titleItem.rankingTitleName,
                workingHourWage: '',
                overtimeWage: '',
            })),
        };
        // Thêm object vào mảng rows
        setRows((prevRows) => normalizeRows([...prevRows, newRow], allTitle));
        // Đặt lại selectedTask về null
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
        console.log('Save attempt:', rows);

        // Hàm kiểm tra giá trị từng ô trong hàng
        const isRowValid = (row) => {
            return row.taskWages.every((wage) => {
                // Kiểm tra giá trị hợp lệ cho từng tiêu chí trong `taskWages`
                if (
                    wage.workingHourWage === null ||
                    wage.workingHourWage === undefined ||
                    wage.workingHourWage === '' ||
                    wage.overtimeWage === null ||
                    wage.overtimeWage === undefined ||
                    wage.overtimeWage === ''
                ) {
                    console.log(`Invalid wage detected: ${JSON.stringify(wage)}`);
                    return false;
                }
                return true;
            });
        };

        // Kiểm tra tất cả các dòng dữ liệu
        const allFieldsFilled = rows.every(isRowValid);

        if (!allFieldsFilled) {
            showErrorMessage('Tất cả các ô phải được điền đầy đủ');
            console.error('Có dữ liệu thiếu, không thể lưu.');
            return; // Dừng nếu dữ liệu chưa hợp lệ
        }

        // Nếu tất cả dữ liệu hợp lệ, xử lý tiếp
        console.log('Save successful:', rows);
        showSuccessMessage('Task & Price Configuration successfully updated.');
        synsDecisionTask(rows, originalTask);
        goToNextStep({ stayOnCurrentStep: true });
    };



    //////////////////////////////////// Column Task//////////////////////////////////
    // Lấy danh sách các titleName từ rankingTitles
    const allTitle = title.map((title) => ({
        rankingTitleId: title.rankingTitleId,
        titleName: title.rankingTitleName,
    }));

    const normalizeRows = (rows, allTitles) => {
        return rows.map((row) => {
            const updatedRow = { ...row };
            const taskWagesMap = new Map((updatedRow.taskWages || []).map(wage => [wage.rankingTitleId, wage]));

            allTitles.forEach(({ rankingTitleId, titleName }) => {
                if (!taskWagesMap.has(rankingTitleId)) {
                    taskWagesMap.set(rankingTitleId, {
                        rankingTitleId,
                        titleName,
                        workingHourWage: null,
                        overtimeWage: null,
                    });
                }
            });

            updatedRow.taskWages = Array.from(taskWagesMap.values())
                .sort((a, b) => a.titleName.localeCompare(b.titleName));

            return updatedRow;
        });
    };



    useEffect(() => {
        const normalized = normalizeRows(originalTask, allTitle);
        console.log(normalized);
        setRows(normalized);
    }, [originalTask]);


    //////////////////////////////////// Return //////////////////////////////////////
    return (
        <div>
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
                }}
            >
                <Box sx={{ width: '100%', height: 400 }}>
                    <TableContainer
                        component={Paper}
                        sx={{
                            minWidth: 400,
                            maxHeight: 400,
                            height: 400,
                            overflowX: 'auto',
                            overflowY: 'auto',
                        }}
                    >
                        <Table aria-label="task table">
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        sx={{
                                            position: 'sticky',
                                            left: 0,
                                            backgroundColor: '#e0e0e0',
                                            width: '180px',
                                            zIndex: 2,
                                            boxSizing: 'border-box',
                                        }}
                                    >
                                        Task
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            position: 'sticky',
                                            backgroundColor: '#e0e0e0',
                                            left: 120,
                                            zIndex: 2,
                                            width: '120px',
                                            maxWidth: '120px',
                                            minWidth: '120px',
                                            overflow: 'hidden',
                                        }}
                                        rowSpan={2}
                                    >
                                        Task Type
                                    </TableCell>
                                    {allTitle.map((title, index) => (
                                        <TableCell
                                            key={`wh-${index}`}
                                            sx={{
                                                backgroundColor: '#e0e0e0',
                                                width: '120px',
                                                zIndex: 1,
                                                boxSizing: 'border-box',
                                            }}
                                        >
                                            {title.titleName}
                                        </TableCell>
                                    ))}
                                    {(decisionStatus === 'Draft' || decisionStatus === 'Rejected') && (
                                        <TableCell
                                            sx={{
                                                position: 'sticky',
                                                right: 0,
                                                backgroundColor: '#e0e0e0',
                                                zIndex: 2,
                                                boxSizing: 'border-box',
                                            }}
                                            rowSpan={2}
                                        >
                                            Action
                                        </TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((task) => {
                                    const renderCell = (taskId, rankingTitleId, wageType, defaultValue) => {
                                        const isEditable = (role === 'ADMIN') || (role === 'MANAGER' && (decisionStatus !== 'Finalized')) || (role === 'USER' && ['Draft', 'Rejected'].includes(decisionStatus));
                                        if (role === 'USER' && ['Submitted', 'Confirmed', 'Finalized'].includes(decisionStatus)) {
                                            return <span>{defaultValue || ''}</span>;
                                        }
                                        return (
                                            <TextField
                                                value={editedWages[`${taskId}-${rankingTitleId}-${wageType}`] || defaultValue || ''}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^\d*$/.test(value)) {
                                                        handleCellEditTaskCommit(taskId, rankingTitleId, wageType, value);
                                                    }
                                                }}
                                                onKeyDown={(e) => {
                                                    if (["e", "E", "+", "-", ".", ","].includes(e.key)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                size="small"
                                                variant="outlined"
                                                fullWidth
                                                type="number"
                                                inputMode="numeric"
                                                disabled={!isEditable}
                                            />
                                        );
                                    };

                                    const renderRow = (type, wageKey) => (
                                        <TableRow key={`task-${task.taskId}-${type}`}>
                                            {type === "In Working Hour" && (
                                                <TableCell
                                                    sx={{
                                                        position: 'sticky',
                                                        left: 0,
                                                        background: '#fff',
                                                        zIndex: 2,
                                                        width: '120px',
                                                    }}
                                                    rowSpan={2}
                                                >
                                                    {task.taskName}
                                                </TableCell>
                                            )}
                                            <TableCell
                                                sx={{
                                                    position: 'sticky',
                                                    left: 120,
                                                    background: '#fff',
                                                    zIndex: 2,
                                                    width: '120px',
                                                }}
                                            >
                                                {type}
                                            </TableCell>
                                            {allTitle.map((title, index) => {
                                                const titleData = task.taskWages.find((wage) => wage.rankingTitleId === title.rankingTitleId) || {};
                                                const defaultValue = titleData[wageKey] || '';
                                                return (
                                                    <TableCell key={`${type}-${index}`}>
                                                        {renderCell(task.taskId, title.rankingTitleId, wageKey, defaultValue)}
                                                    </TableCell>
                                                );
                                            })}
                                            {type === "In Working Hour" && (decisionStatus === 'Draft' || decisionStatus === 'Rejected') && (
                                                <TableCell
                                                    sx={{
                                                        position: 'sticky',
                                                        right: 0,
                                                        background: '#fff',
                                                        zIndex: 2,
                                                    }}
                                                    rowSpan={2}
                                                >
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        onClick={() => handleDeleteRowData(task.taskId)}
                                                    >
                                                        <MdDeleteForever />
                                                    </Button>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    );

                                    return (
                                        <>
                                            {renderRow("In Working Hour", "workingHourWage")}
                                            {renderRow("Overtime", "overtimeWage")}
                                        </>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, marginTop: '20px' }}>
                        <Box>
                            {/* Select to Add a new Task */}
                            {(decisionStatus === 'Draft' || decisionStatus === 'Rejected') && (
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
                                                zIndex: 4,
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
                                        <AddCircleIcon sx={{ fontSize: 30 }} /> {/* Điều chỉnh kích thước của icon */}
                                    </IconButton>
                                </Box>
                            )}
                        </Box>
                        {/* Cancel and Save */}
                        {(role === 'ADMIN' || role === 'MANAGER' || decisionStatus === 'Draft' || decisionStatus === 'Rejected') && (
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
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
                        )}
                    </Box>
                </Box>
            </Box>
        </div>
    );
};

export default TaskandPriceConfiguration;