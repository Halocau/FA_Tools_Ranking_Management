import React, { useEffect, useState } from 'react';
import { MdDeleteForever } from 'react-icons/md';
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
// MUI
import {
    Box, Button, Typography, TextField, IconButton,
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import AddCircleIcon from '@mui/icons-material/AddCircle'; // Dấu + icon
// API
import DecisionTitleAPI from "../../../api/DecisionTitleAPI.js";
import DecisionTaskAPI from "../../../api/DecisionTaskAPI.js";
import { initialTask } from "../Data.jsx";

const TaskandPriceConfiguration = ({ decisionStatus, goToNextStep, showErrorMessage, showSuccessMessage }) => {
    // // Data 
    const { id } = useParams(); // Get the ID from the URL
    const [originalTask, setOriginalTask] = useState([]);  // Lưu dữ liệu gốc
    const [title, setTitle] = useState([]);  // Lưu dữ liệu gốc
    const [columnsTask, setColumnsTask] = useState([]);
    // Row table
    const [rows, setRows] = useState([]);
    //Select to Add a new Task
    const [selectedTask, setSelectedTask] = useState(null);
    // data tạm 
    // Sử dụng useState để lưu danh sách tên task
    const [listtask, setListTask] = useState(initialTask.map(task => ({
        taskId: task.taskId,
        taskName: task.taskName
    })));

    // Load data getTaskConfiguration
    const getTaskConfiguration = async () => {
        try {
            const response = await DecisionTaskAPI.getDecisionTaskByDecisionId(id);
            // console.log(response)
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
    //

    ///////////////////////////// The update function changes //////////////////////////
    const handleCellEditTaskCommit = (newRow) => {
        // console.log(newRow)
        // Cập nhật hàng mới
        const updatedRow = { ...newRow };
        // Cập nhật trạng thái `rows`
        setRows((prevRows) => {
            const updatedRows = prevRows.map((row) =>
                row.id === updatedRow.id ? updatedRow : row
            );
            return updatedRows;
        });
    };
    // End 
    //////////////////////////////////// Remove row ///////////////////////////////////////
    const handleDeleteRowData = (id) => {
        setRows((prevRows) => {
            // Lấy taskName từ id (giả sử id có dạng "taskName_type")
            const taskName = id.split('_')[0];

            // Lọc bỏ tất cả các hàng có cùng taskName
            const updatedRows = prevRows.filter((row) => !row.id.startsWith(taskName));

            return updatedRows;
        });
    };
    // End 
    //////////////////////////////////// Select to Add a new Task //////////////////////
    const handleAddTask = () => {
        const addedTask = listtask.find(
            (task) => task.taskId === selectedTask.value
        );
        const newRows = ['In Working Hour', 'Overtime'].map((type, index) => ({
            id: `${rows.length / 2 + 1}_${type}`,
            taskName: index === 0 ? addedTask.taskName : '',
            taskType: type,
            ...title.reduce((acc, title) => {
                acc[title.rankingTitleName] = '';
                return acc;
            }, {}),
        }));
        setRows([...rows, ...newRows]);
        setSelectedTask(null)
    };
    // console.log(rows)
    // End 
    //////////////////////////////////// Cancel ///////////////////////////////////////
    const handleCancelChanges = () => {
        console.log('cancel');
        // Kiểm tra nếu originalTitle và title có giá trị hợp lệ
        if (originalTask && title) {
            setRowData(originalTask, title);
        } else {
            console.error("Không có dữ liệu ban đầu để load lại.");
        }
        setSelectedTask(null)
    };
    // End 
    //////////////////////////////////// Save /////////////////////////////////////////
    const handleSaveChanges = () => {
        // Kiểm tra xem tất cả các ô trong bảng đã được điền (không có ô nào trống)
        const allFieldsFilled = rows.every((row) => {
            // Kiểm tra mỗi ô trong hàng (trừ các cột cố định như 'id' và 'task')
            return Object.keys(row).every((key) => {
                if (key !== 'id' && key !== 'taskName' && key !== 'taskType') {
                    // Kiểm tra giá trị của ô không phải là undefined, null hay rỗng
                    if (row[key] === '' || row[key] === null || row[key] === undefined) {
                        console.log(`Ô thiếu dữ liệu: ${key}, Dòng: ${JSON.stringify(row)}`);
                        return false;
                    }
                    return true;
                }
                return true;
            });
        });

        // Nếu có ít nhất một ô chưa được điền, hiển thị thông báo lỗi
        if (!allFieldsFilled) {
            showErrorMessage('Tất cả các ô phải được điền đầy đủ');
            console.log('Có ô chưa điền dữ liệu');
            return; // Dừng hàm nếu có ô chưa điền
        }
        showSuccessMessage('Task & Price Configuration successfully updated.');
        // console.log("Tất cả ô đã được điền đầy đủ. Lưu dữ liệu...");
        goToNextStep({ stayOnCurrentStep: true }); // Tiến hành lưu dữ liệu và chuyển sang bước tiếp theo
    };
    // End 
    //////////////////////////////////// Column Task////////////////////////////////////
    const ColumnsTask = (title, decisionStatus) => {
        // Cột tiêu đề động
        const titleColumns = title.map((titleItem) => ({
            field: titleItem.rankingTitleName, // Use rankingTitleName as field
            headerName: titleItem.rankingTitleName, // Display the name
            width: 150, // Adjust column width
            editable: decisionStatus === 'Draft' || decisionStatus === 'Finalized', // Only editable in Draft
            renderCell: (params) =>
                decisionStatus === 'Draft' || decisionStatus === 'Finalized' ? (
                    <TextField
                        sx={{
                            marginTop: '7px',
                            textAlign: 'center',
                        }}
                        value={params.value || ''} // Default value
                        onChange={(e) => {
                            const updatedValue = e.target.value;
                            // Update cell value
                            params.row[params.field] = updatedValue;
                        }}
                        onBlur={(e) => {
                            // Commit changes on blur
                            const updatedRow = { ...params.row, [params.field]: e.target.value };
                            handleCellEditTaskCommit(updatedRow); // Save changes
                        }}
                        variant="outlined"
                        size="small"
                        fullWidth
                        type="number"
                        InputProps={{
                            inputProps: { min: 0 },
                        }}
                    />
                ) : (
                    params.value // Show value in Finalized status
                ),
        }));

        // Cột cố định
        const fixedColumns = [
            { field: 'taskName', headerName: 'Task Name', width: 200 },
            { field: 'taskType', headerName: 'Task Type', width: 150 },
        ];

        // Column Action
        const actionColumn = [
            {
                field: 'action',
                headerName: 'Action',
                width: 90,
                renderCell: (params) =>
                    decisionStatus === 'Draft' && (
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleDeleteRowData(params.row.id)}
                        >
                            <MdDeleteForever />
                        </Button>
                    ),
            },
        ];

        return [...fixedColumns, ...titleColumns, ...actionColumn];
    };
    // End 
    //////////////////////////////////// Row Task /////////////////////////////////////
    const setRowData = (task, title) => {
        const mappedRows = task.flatMap((taskItem) => {
            return ["In Working Hour", "Overtime"].map((type) => {
                return {
                    id: `${taskItem.taskId}_${type}`, // Id lấy taskId + type
                    taskName: type === "In Working Hour" ? taskItem.taskName : "",
                    taskType: type,
                    ...title.reduce((acc, titleItem) => {
                        const titleWage = taskItem.taskWages?.find(
                            (wage) => wage.rankingTitleId === titleItem.rankingTitleId
                        );
                        acc[titleItem.rankingTitleName] =
                            type === "In Working Hour"
                                ? titleWage?.workingHourWage || ""
                                : titleWage?.overtimeWage || "";
                        return acc;
                    }, {}),
                };
            });
        });
        setRows(mappedRows); // Update state
    };

    useEffect(() => {
        if (originalTask) {
            const columns = ColumnsTask(title, decisionStatus);
            setColumnsTask(columns);
            setRowData(originalTask, title);
            // console.log(rows)
        }
    }, [originalTask, title, decisionStatus]);
    // End 
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
                    {/* Table DataGrid */}
                    <DataGrid
                        rows={rows}
                        columns={columnsTask}
                        // initialState={{ pinnedColumns: { left: ['taskName', 'taskType'], right: ['action'] } }}
                        getRowId={(row) => row.id}
                        processRowUpdate={(newRow) => {
                            handleCellEditTaskCommit(newRow);
                            return newRow;
                        }}
                        experimentalFeatures={{ newEditingApi: true }}
                        sx={{
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#f4f4f4',
                            },
                            overflowX: 'auto',
                            '.MuiDataGrid-virtualScroller': {
                                overflowX: 'auto',
                                overflowY: 'auto',
                            },
                        }}
                    />
                    {/* Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, marginTop: '20px' }}>
                        {/* Select to Add a new Task*/}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Select
                                isSearchable={true}
                                placeholder="Select to Add a new Task"
                                options={listtask
                                    .filter((task) => !rows.some((row) => row.id === task.taskId))
                                    .map((task) => ({ value: task.taskId, label: task.taskName, }))}
                                styles={{
                                    container: (provided) => ({ ...provided, width: '300px', }),
                                    control: (provided) => ({ ...provided, height: '40px', fontSize: '16px', display: 'flex', alignItems: 'center', }),
                                    placeholder: (provided) => ({ ...provided, color: '#888', }),
                                    menu: (provided) => ({ ...provided, maxHeight: 300, overflowY: 'auto', }),
                                }}
                                menuPlacement="top"
                                value={selectedTask}
                                onChange={(option) => setSelectedTask(option)}
                            />
                            <IconButton
                                onClick={handleAddTask}
                                color={selectedTask ? 'primary' : 'default'}
                                // disabled={!selectedTask}
                                sx={{ marginLeft: 1, height: '30px', display: 'flex', alignItems: 'center', }}
                            >
                                <AddCircleIcon sx={{ fontSize: 30 }} /> {/* Điều chỉnh kích thước của icon */}
                            </IconButton>
                        </Box>
                        {/* Cancel and Save */}
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
                    </Box>
                </Box>
            </Box>
        </div>
    );
};

export default TaskandPriceConfiguration;