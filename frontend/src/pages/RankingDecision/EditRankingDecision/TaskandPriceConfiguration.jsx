import React, { useEffect, useState } from 'react';
import { MdDeleteForever } from 'react-icons/md';
// MUI
import {
    InputAdornment, Box, Button, Typography, TextField, Modal, IconButton, Select, MenuItem, Table, TableHead, TableBody, TableCell, TableRow
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import CircleIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Stepper, Step, StepButton } from '@mui/material';
const TaskandPriceConfiguration = ({ criteria, title, task, decisionStatus, goToNextStep, showErrorMessage }) => {
    // // Data 
    // const { id } = useParams(); // Get the ID from the URL
    // const [task, setTask] = useState([]);
    const [columnsTask, setColumnsTask] = useState([]);
    const [originalTask, setOriginalTask] = useState([]);  // Lưu dữ liệu gốc
    // Row table
    const [rows, setRows] = useState([]);
    // State Cancel and Save
    const [hasChanges, setHasChanges] = useState(false); // kiểm tra thay đổi
    //Select to Add a new Task
    const [listtask, setListTask] = useState([]);

    // Load data getTitleConfiguration
    // chưa có API
    console.log(task)
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
    // Hàm hủy thay đổi, đặt lại  giá trị ban đầu của 1 hàng
    const handleDeleteRowData = (id) => {
        setRows((prevRows) => {
            // Tìm task_name từ id
            const taskName = id.split('_')[0]; // Giả sử id có định dạng "taskName_type"

            // Lọc các hàng có task_name tương tự và xóa chúng
            const updatedRows = prevRows.filter((row) => !row.id.startsWith(taskName));

            return updatedRows; // Trả về mảng các hàng đã được xóa
        });
    };


    //////////////////////////////////// Cancel /////////////////////////////////////

    //// Hàm hủy thay đổi, đặt lại  giá trị ban đầu của tất cả
    //// Hàm hủy thay đổi, đặt lại  giá trị ban đầu của tất cả
    const handleCancelChanges = () => {
        setRows(() => {
            return originalTask.map((originalRow) => ({ ...originalRow }));
        });
        // setHasChanges(false); // Đặt lại trạng thái khi đã hủy thay đổi
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

        console.log("Tất cả ô đã được điền đầy đủ. Lưu dữ liệu...");
        goToNextStep(); // Tiến hành lưu dữ liệu và chuyển sang bước tiếp theo
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




    //////////////////////////////////// Column task ////////////////////////////////////
    // Tạo cấu hình cột và hàng
    // Cập nhật bảng khi task, title, hoặc criteria thay đổi
    const updateTaskTableConfig = (criteria, title, task, decisionStatus) => {
        // Cột từ tiêu chí
        const titleColumns = title.map((title) => ({
            field: title.titleName,
            headerName: title.titleName,
            width: 140,
            editable: true,
            renderCell: (params) => (
                <TextField
                    value={params.value || ''}
                    onChange={(e) => handleCellEditTaskCommit({ id: params.row.id, field: params.field, value: e.target.value })}
                    variant="outlined"
                    fullWidth
                    sx={{
                        marginTop: '10px',
                        height: '30px',
                        '.MuiInputBase-root': { display: 'flex', alignItems: 'center' },
                        '.MuiInputBase-input': { padding: '4px' },
                    }}
                    type="number"
                    inputMode="numeric"
                />
            ),
        }));

        // Cột cố định
        const fixedColumns = [
            { field: 'taskName', headerName: 'Task', width: 100 },
            { field: 'taskType', headerName: 'Type', width: 130 },
        ];
        // // cột action
        // const actionColumn = [
        //     {
        //         field: 'action',
        //         headerName: 'Action',
        //         width: 130,
        //         renderCell: (params) => {
        //             // Tách task_name từ id (id là dạng "taskName_type")
        //             const taskName = params.row.id.split('_')[0];
        //             // Kiểm tra nếu đây là dòng đầu tiên của nhiệm vụ (In Working Hour)
        //             const isFirstRow = params.row.type === 'In Working Hour';

        //             return decisionStatus === 'Draft' && isFirstRow ? (
        //                 <Button
        //                     variant="outlined"
        //                     color="error"
        //                     onClick={() => handleDeleteRowData(taskName)} // Gửi taskName thay vì id cụ thể
        //                 >
        //                     <MdDeleteForever />
        //                 </Button>
        //             ) : null; // Không hiển thị nút xóa nếu không phải dòng đầu tiên
        //         },
        //     },
        // ];
        // cột action
        const actionColumn = [
            {
                field: 'action', headerName: 'Action', width: 130,
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

        const updatedRows = task.map((task) => {
            return ['In Working Hour', 'Overtime'].map((type, index) => ({
                id: `${task.task_name}_${type}`,
                taskName: index === 0 ? task.task_name : '',
                taskType: index === 0 ? 'In Working Hour' : 'Overtime',
                ...title.reduce((acc, title) => {
                    acc[title.titleName] = title.titleSelections && title.titleSelections[title.titleName] ? title.titleSelections[title.titleName] : '';
                    return acc;
                }, {}),
            }));

        }).flat().map((row) => {
            // Kiểm tra và thay thế undefined bằng chuỗi rỗng hoặc giá trị mặc định khác
            Object.keys(row).forEach((key) => {
                if (row[key] === undefined) {
                    row[key] = ''; // Hoặc bạn có thể thay bằng một giá trị mặc định nào đó
                }
            });
            return row;
        });


        // Trả về cột và hàng
        return { columns: [...fixedColumns, ...titleColumns, ...actionColumn], rows: updatedRows };
    };
    useEffect(() => {
        if (criteria && title && task) {
            const { columns, rows } = updateTaskTableConfig(criteria, title, task, decisionStatus);

            // Cập nhật cột và hàng
            setColumnsTask(columns);
            setRows(rows);
            setOriginalTask(rows); // Lưu lại dữ liệu gốc
        }
    }, [criteria, title, task, decisionStatus]);


    return (
        <div>
            <Box sx={{
                width: "100%",
                height: 500,
                marginTop: '10px',
                border: '2px solid black',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                overflow: 'hidden',
            }}>
                <Box sx={{ width: '100%', height: 400, marginTop: '10px' }}>
                    <DataGrid
                        rows={rows}
                        columns={columnsTask}
                        getRowId={(row) => row.id}
                        processRowUpdate={(newRow) => {
                            handleCellEditTaskCommit(newRow); // Lưu thay đổi chính thức
                            return newRow; // Cần trả về `newRow` để cập nhật DataGrid
                        }}
                        experimentalFeatures={{ newEditingApi: true }} // Bật tính năng chỉnh sửa hàng mới
                    />
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