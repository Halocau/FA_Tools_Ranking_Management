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
    // Row table
    const [originalRows, setOriginalRows] = useState([]);  // Lưu dữ liệu gốc
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

            // Kiểm tra sự thay đổi so với `originalRows`
            const hasAnyChanges = updatedRows.some(
                (row, index) => row.weight !== originalRows[index]?.weight
            );
            setHasChanges(hasAnyChanges);

            return updatedRows;
        });
    };

    //////////////////////////////////// Remove ////////////////////////////////////
    // Hàm hủy thay đổi, đặt lại  giá trị ban đầu của 1 hàng
    const handleDeleteRowData = (id) => {
        setRows((prevRows) => {
            const rowIndex = prevRows.findIndex((row) => row.id === id);

            if (rowIndex !== -1) {
                const updatedRow = { ...prevRows[rowIndex] };
                const originalRow = originalRows.find((row) => row.id === id);

                // Khôi phục giá trị từ originalRow chỉ cho các cột title
                Object.keys(updatedRow).forEach((key) => {
                    // Kiểm tra xem cột có phải là cột 'title' hay không
                    if (key !== 'id' && key !== 'task' && key !== 'type') {
                        // updatedRow[key] = originalRow ? originalRow[key] : '';
                        updatedRow[key] = '';// Khôi phục giá trị gốc cho các cột title
                    }
                });

                const updatedRows = [...prevRows];
                updatedRows[rowIndex] = updatedRow;
                return updatedRows;
            }

            return prevRows;
        });
    };

    //////////////////////////////////// Cancel /////////////////////////////////////
    // Theo dõi sự thay đổi của rows và originalRows
    useEffect(() => {
        const checkForChanges = () => {
            // Kiểm tra sự khác biệt giữa rows và originalRows
            const hasAnyChanges = rows.some((row, index) => {
                const originalRow = originalRows[index];

                // Kiểm tra nếu có sự khác biệt giữa row và originalRow
                return Object.keys(row).some((key) => {
                    if (key !== 'id' && key !== 'task') {
                        return true;
                    }
                    return false;
                });
            });

            setHasChanges(hasAnyChanges);
        };

        // Gọi hàm kiểm tra thay đổi
        checkForChanges();
    }, [rows, originalRows]);
    //// Hàm hủy thay đổi, đặt lại  giá trị ban đầu của tất cả
    const handleCancelChanges = () => {
        // Đặt lại tất cả các ô trong bảng về giá trị ban đầu
        setRows((prevRows) => {
            const resetRows = prevRows.map((row, index) => {
                const originalRow = originalRows[index]; // Lấy giá trị ban đầu từ originalRows

                const updatedRow = { ...row };

                // Khôi phục lại giá trị của mỗi ô từ originalRow, ngoại trừ cột 'task', 'type', và 'id'
                Object.keys(updatedRow).forEach((key) => {
                    if (key !== 'id' && key !== 'task' && key !== 'type') { // Giữ lại 'id', 'titleName', 'task', và 'type'
                        updatedRow[key] = originalRow ? originalRow[key] : ''; // Khôi phục giá trị gốc từ originalRow, nếu có
                    }
                });

                return updatedRow;
            });

            return resetRows;
        });
    };

    //////////////////////////////////// Save ////////////////////////////////////
    const handleSaveChanges = () => {
        // Kiểm tra xem tất cả các ô trong bảng đã được điền (không có ô nào trống)
        const allFieldsFilled = rows.every((row) => {
            // Kiểm tra mỗi ô trong hàng (trừ các cột cố định như 'id' và 'task')
            return Object.keys(row).every((key) => {
                if (key !== 'id' && key !== 'task' && key !== 'type') { // Giữ lại các cột cố định
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
        const newTitle = {
            id: rows.length + 1,
            titleName: 'New Title',
            ...title.reduce((acc, title) => {
                acc[title.titleName] = '';  // Chỗ này sẽ là ô trống cho mỗi tiêu chí mới
                return acc;
            }, {}),
        };
        setRows([...rows, newTitle]);
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
            { field: 'task', headerName: 'Task', width: 100 },
            { field: 'type', headerName: 'Type', width: 100 },
        ];
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
                task: index === 0 ? task.task_name : '',
                type: index === 0 ? 'In Working Hour' : 'Overtime',
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
            setOriginalRows(rows); // Lưu lại dữ liệu gốc
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
                                {hasChanges && (
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={handleCancelChanges} // Gọi hàm hủy thay đổi
                                    >
                                        Cancel
                                    </Button>
                                )}
                                {hasChanges && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSaveChanges} // Gọi hàm lưu thay đổi
                                    >
                                        Save
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>
        </div>
    );
};


export default TaskandPriceConfiguration;