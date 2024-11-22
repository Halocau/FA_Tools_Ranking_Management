import React, { useEffect, useState } from 'react';
import { MdDeleteForever } from 'react-icons/md';
import { useNavigate, useParams } from "react-router-dom";
// MUI
import {
    InputAdornment, Box, Button, Typography, TextField, Modal, IconButton, Select, MenuItem, Table, TableHead, TableBody, TableCell, TableRow
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import CircleIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Stepper, Step, StepButton } from '@mui/material';
import { DataGridPro } from '@mui/x-data-grid-pro';
import AddCircleIcon from '@mui/icons-material/AddCircle'; // Dấu + icon
// API
import DecisionTitleAPI from "../../../api/DecisionTitleAPI.js";
import DecisionTaskAPI from "../../../api/DecisionTaskAPI.js";

const TaskandPriceConfiguration = ({ decisionStatus, goToNextStep, showErrorMessage, showSuccessMessage }) => {
    // // Data 
    const { id } = useParams(); // Get the ID from the URL
    const [originalTask, setOriginalTask] = useState([]);  // Lưu dữ liệu gốc
    const [title, setTitle] = useState([]);  // Lưu dữ liệu gốc
    const [columnsTask, setColumnsTask] = useState([]);
    // Row table
    const [rows, setRows] = useState([]);
    const [originalRows, set0riginalTask] = useState([]);
    //Select to Add a new Task
    const [selectedTask, setSelectedTask] = useState(null);
    const [listtask, setListTask] = useState([]);


    // Load data getTaskConfiguration
    const getTaskConfiguration = async () => {
        try {
            const response = await DecisionTaskAPI.getDecisionTaskByDecisionId(id);
            console.log(response)
            setOriginalTask(response);
        } catch (error) {
            console.error("Error fetching criteria:", error);
        }
    };
    // Load data getTitleConfiguration
    const getTitleConfiguration = async () => {
        try {
            const response = await DecisionTitleAPI.getDecisionTitleByDecisionId(id);
            console.log(response)
            setTitle(response);
        } catch (error) {
            console.error("Error fetching criteria:", error);
        }
    };
    useEffect(() => {
        getTaskConfiguration()
        getTitleConfiguration();

    }, [id]);



    ///////////////////////////// Hàm cập nhập thay đổi ///////////////////////////
    // Hàm cập nhập thay đổi data
    const handleCellEditTaskCommit = (newRow) => {
        console.log(newRow)
        // Cập nhật hàng mới
        const updatedRow = { ...newRow };

        // Cập nhật trạng thái `rows`
        setRows((prevRows) => {
            const updatedRows = prevRows.map((row) =>
                row.id === updatedRow.id ? updatedRow : row
            );

            // // Kiểm tra sự thay đổi so với `originalTask`
            // const hasAnyChanges = updatedRows.some(
            //     (row, index) => row.weight !== originalTask[index]?.weight
            // );
            // setHasChanges(hasAnyChanges);

            return updatedRows;
        });
    };

    //////////////////////////////////// Remove ////////////////////////////////////
    const handleDeleteRowData = (id) => {
        setRows((prevRows) => {
            // Lấy taskName từ id (giả sử id có dạng "taskName_type")
            const taskName = id.split('_')[0];

            // Lọc bỏ tất cả các hàng có cùng taskName
            const updatedRows = prevRows.filter((row) => !row.id.startsWith(taskName));

            return updatedRows;
        });
    };



    //////////////////////////////////// Cancel /////////////////////////////////////
    const handleCancelChanges = () => {
        console.log('Original Rows:', originalRows);

        // Phục hồi lại các dòng từ dữ liệu ban đầu
        setRows(originalRows); // Cập nhật lại rows với dữ liệu ban đầu
    };

    //////////////////////////////////// Save ////////////////////////////////////
    const handleSaveChanges = () => {
        // Kiểm tra xem tất cả các ô trong bảng đã được điền (không có ô nào trống)
        const allFieldsFilled = rows.every((row) => {
            // Kiểm tra mỗi ô trong hàng (trừ các cột cố định như 'id' và 'task')
            return Object.keys(row).every((key) => {
                if (key !== 'id' && key !== 'taskName' && key !== 'taskType') { // Giữ lại các cột cố định
                    // Kiểm tra giá trị của ô không phải là undefined, null hay rỗng
                    if (row[key] === '' || row[key] === null || row[key] === undefined) {
                        console.log(`Ô thiếu dữ liệu: ${key}, Dòng: ${JSON.stringify(row)}`);
                        return false; // Nếu ô thiếu dữ liệu, trả về false
                    }
                    return true; // Nếu ô có dữ liệu, trả về true
                }
                return true; // Các cột 'id', 'task', 'type' không cần kiểm tra
            });
        });

        // Nếu có ít nhất một ô chưa được điền, hiển thị thông báo lỗi
        if (!allFieldsFilled) {
            showErrorMessage('Tất cả các ô phải được điền đầy đủ');
            console.log('Có ô chưa điền dữ liệu');
            return; // Dừng hàm nếu có ô chưa điền
        }
        showSuccessMessage('Task & Price Configuration successfully updated.');
        console.log("Tất cả ô đã được điền đầy đủ. Lưu dữ liệu...");
        // goToNextStep(); // Tiến hành lưu dữ liệu và chuyển sang bước tiếp theo
    };


    //////////////////////////////////// Select to Add a new Task ////////////////////////////////////
    const handleAddTask = () => {
        const newTasks = ['In Working Hour', 'Overtime'].map((type, index) => ({
            id: `${rows.length + 1}_${type}`,
            taskName: index === 0 ? 'New Task' : '',
            taskType: type,
            ...title.reduce((acc, title) => {
                acc[title.titleName] = '';
                return acc;
            }, {}),
        }));

        console.log('Rows before adding:', rows);
        setRows([...rows, ...newTasks]);
        console.log('Rows after adding:', [...rows, ...newTasks]);
    };



    // ColumnsTask function with taskWages handling
    const ColumnsTask = (title, decisionStatus) => {
        // Cột tiêu đề động
        const titleColumns = title.map((titleItem) => ({
            field: titleItem.rankingTitleName, // Use rankingTitleName as field
            headerName: titleItem.rankingTitleName, // Display the name
            width: 150, // Adjust column width
            editable: decisionStatus === 'Draft', // Only editable in Draft
            renderCell: (params) =>
                decisionStatus === 'Draft' ? (
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

    // Hàm để thiết lập dữ liệu dòng
    const setRowData = (task, title) => {
        // Duyệt qua từng task
        const mappedRows = task.flatMap((taskItem) => {
            return ['In Working Hour', 'Overtime'].map((type) => {
                // Tìm wage tương ứng với type (In Working Hour hoặc Overtime)
                const taskWages = taskItem.taskWages?.find(
                    (wage) => wage.rankingTitleId === title.rankingTitleId
                ) || {}; // Lấy taskWage tương ứng nếu có

                // Tạo hàng với thông tin từ task và tiêu đề (title)
                return {
                    id: `${taskItem.taskId}_${type}`, // Unique ID cho từng hàng
                    taskName: type === 'In Working Hour' ? taskItem.taskName : '', // Hiển thị taskName chỉ 1 lần
                    taskType: type, // Loại task: In Working Hour hoặc Overtime
                    // Tạo cột tiêu đề tương ứng cho từng title
                    ...title.reduce((acc, titleItem) => {
                        // Lấy wage dựa vào titleName và loại task (In Working Hour hoặc Overtime)
                        const titleWage = taskItem.taskWages?.find(
                            (wage) => wage.rankingTitleId === titleItem.rankingTitleId
                        );
                        acc[titleItem.rankingTitleName] =
                            type === 'In Working Hour'
                                ? titleWage?.workingHourWage || ''  // Lấy workingHourWage nếu là In Working Hour
                                : titleWage?.overtimeWage || '';    // Lấy overtimeWage nếu là Overtime
                        return acc;
                    }, {}),
                };
            });
        });
        set0riginalTask(mappedRows)
        return mappedRows; // Trả về mảng hàng đã được xử lý
    };



    useEffect(() => {
        if (originalTask) {
            const columns = ColumnsTask(title, decisionStatus);
            setColumnsTask(columns);
            const rows = setRowData(originalTask, title);
            setRows(rows); // Set rows vào DataGrid
        }
    }, [originalTask, title, decisionStatus]);



    return (
        <div>
            {/* Viền bao quanh */}
            <Box sx={{
                width: "100%", // Set width to 100% of the parent element.
                height: 500, // Set a fixed height of 500px.
                marginTop: '10px', // Add a top margin for spacing.
                border: '2px solid black', // Add a 2px solid black border.
                borderRadius: '8px', // Round the corners with an 8px radius.
                padding: '16px', // Add 16px padding inside the Box.
                display: 'flex', // Use flexbox for layout.
                flexDirection: 'column', // Arrange child elements in a column.
                gap: 2, // Set space between child elements.
                overflow: 'hidden', // Hide any overflow content.
            }}>
                {/* Box chứa DataGrid */}
                <Box sx={{ width: '100%', height: 400, marginTop: '10px' }}>
                    <DataGrid
                        rows={rows}
                        columns={columnsTask} r
                        // initialState={{ pinnedColumns: { left: ['taskName', 'taskType'], right: ['action'] } }}
                        getRowId={(row) => row.id}
                        processRowUpdate={(newRow) => {
                            handleCellEditTaskCommit(newRow); // Lưu thay đổi chính thức
                            return newRow; // Cần trả về `newRow` để cập nhật DataGrid
                        }}
                        experimentalFeatures={{ newEditingApi: true }} // Bật tính năng chỉnh sửa hàng mới
                        sx={{
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#f4f4f4',
                            },
                            overflowX: 'auto',  // Cho phép cuộn ngang cho các cột cuộn
                            '.MuiDataGrid-virtualScroller': {
                                overflowX: 'auto', // Cho phép cuộn ngang trong phần cuộn
                                overflowY: 'auto', // Ẩn cuộn dọc trong vùng cuộn
                            },
                        }}
                    />

                    {/* Button */}
                    {decisionStatus === 'Draft' && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, marginTop: '20px' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <Button variant="contained" color="success" onClick={handleAddTask}>
                                    Add Task
                                </Button>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleCancelChanges} // Gọi hàm hủy thay đổi
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSaveChanges} // Gọi hàm lưu thay đổi
                                >
                                    Save
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>
        </div>
    );
};

export default TaskandPriceConfiguration;