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
const TaskandPriceConfiguration = ({ criteria, title, task, rankTitle, decisionStatus, page, pageSize, goToNextStep, showErrorMessage }) => {
    console.log(task)
    const [columnsTask, setColumnsTask] = useState([]);
    const [rows, setRows] = useState([]);
    const [hasChanges, setHasChanges] = useState(false);
    useEffect(() => {
        // Kiểm tra xem có bất kỳ ô nào đã được thay đổi không
        const hasAnyChanges = rows.some((row) => {
            return Object.keys(row).some((key) => {
                if (key !== 'id' && key !== 'titleName' && row[key] !== '') {
                    return true; // Nếu có ô nào không rỗng thì có thay đổi
                }
                return false;
            });
        });

        setHasChanges(hasAnyChanges);
    }, [rows]); // Theo dõi sự thay đổi của rows
    // Tạo cấu hình cột và hàng
    useEffect(() => {
        if (criteria && title && task) {
            // Cột từ tiêu chí
            const titleColumns = title.map((title) => ({
                field: title.titleName,
                headerName: title.titleName,
                width: 140,
                editable: true,
                renderCell: (params) => (
                    <TextField
                        value={params.value || null}  // Giá trị mặc định là 0
                        onChange={(e) => handleCellEditTaskCommit({ id: params.row.id, field: params.field, value: e.target.value })}
                        variant="outlined"
                        fullWidth
                        sx={{
                            marginTop: '10px',  // Áp dụng margin-top
                            height: '30px',  // Chiều cao của ô nhập liệu
                            '.MuiInputBase-root': {
                                display: 'flex',
                                alignItems: 'center',  // Căn giữa theo chiều dọc
                            },
                            '.MuiInputBase-input': {
                                padding: '4px',  // Padding trong ô nhập liệu
                                appearance: 'textfield',  // Hủy bỏ các biểu tượng tăng giảm (cho Webkit, Firefox)
                            },
                            // Ẩn nút tăng giảm
                            '& input[type="number"]::-webkit-outer-spin-button, & input[type="number"]::-webkit-inner-spin-button': {
                                display: 'none',
                            },
                            '& input[type="number"]': {
                                '-moz-appearance': 'textfield', // Hủy bỏ nút tăng giảm cho Firefox
                            },
                        }}
                        type="number"  // Loại số để nhập giá trị số
                        inputMode="numeric"  // Thiết lập kiểu nhập liệu là số
                    />



                ),
            }));

            // Cột cố định
            const fixedColumns = [
                { field: 'task', headerName: 'Task', width: 100 },
                { field: 'type', headerName: 'Type', width: 100 },
            ];

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

            // Tạo hàng dữ liệu
            const updatedRows = task.map((task) => {
                return ['In Working Hour', 'Overtime'].map((type, index) => ({
                    id: `${task.task_name}_${type}`,
                    task: index === 0 ? task.task_name : '', // Chỉ hiển thị tên task ở hàng đầu tiên
                    type: type,
                    ...criteria.reduce((acc, title) => {
                        acc[title.titleName] = '';
                        return acc;
                    }, {}),
                }));
            }).flat(); // Flat để biến mảng 2 chiều thành mảng 1 chiều

            // Cập nhật cột và hàng
            setColumnsTask([...fixedColumns, ...titleColumns, ...actionColumn]);
            // setTask(updatedRows);
            setRows(updatedRows);
        }
    }, [criteria, title, task, decisionStatus]);

    // Xử lý khi chỉnh sửa ô
    const handleCellEditTaskCommit = ({ id, field, value }) => {
        setRows((prevRows) => {
            // Tạo bản sao của danh sách hàng
            const updatedRows = [...prevRows];

            // Tìm chỉ số của hàng cần cập nhật
            const rowIndex = updatedRows.findIndex((row) => row.id === id);

            // Nếu tìm thấy hàng, tiến hành cập nhật
            if (rowIndex !== -1) {
                const currentRow = updatedRows[rowIndex];

                // Kiểm tra nếu giá trị thay đổi và không bằng giá trị cũ
                if (currentRow[field] !== value) {
                    updatedRows[rowIndex] = {
                        ...currentRow,
                        [field]: value, // Cập nhật giá trị ô đã sửa
                    };

                    // Kiểm tra xem tất cả các tiêu chí đã được điền chưa
                    const allCriteriaFilled = criteria.every((title) => currentRow[title.titleName] !== '');

                    if (allCriteriaFilled) {
                        // Tính toán rankScore khi tất cả tiêu chí đã được điền
                        const newRankScore = criteria.reduce((score, title) => {
                            const chosenValue = parseInt(currentRow[title.titleName]) || 0; // Giá trị lựa chọn từ ô nhập liệu
                            const weight = title.weight;
                            const numOptions = title.numOptions;

                            // Cập nhật score theo công thức
                            return score + (chosenValue * (weight / numOptions));
                        }, 0);

                        // Cập nhật rankScore, làm tròn đến 2 chữ số
                        updatedRows[rowIndex].rankScore = newRankScore.toFixed(2);
                    } else {
                        // Nếu chưa đủ tiêu chí, xóa giá trị rankScore
                        updatedRows[rowIndex].rankScore = '';
                    }
                }
            }

            return updatedRows;
        });
    };
    // / Hàm thêm tiêu chí mới
    const handleAddTask = () => {
        const newTitle = {
            id: rows.length + 1,
            titleName: 'New Title',
            rankScore: '',
            ...title.reduce((acc, title) => {
                acc[title.titleName] = '';  // Chỗ này sẽ là ô trống cho mỗi tiêu chí mới
                return acc;
            }, {}),
        };
        setRows([...rows, newTitle]);
    };
    const handleDeleteRowData = (id) => {
        setRows((prevRows) => {
            // Tìm chỉ số của hàng cần xóa giá trị
            const rowIndex = prevRows.findIndex((row) => row.id === id);

            if (rowIndex !== -1) {
                // Tạo một bản sao của hàng hiện tại
                const updatedRow = { ...prevRows[rowIndex] };

                // Xóa các giá trị trong các ô, giữ lại id và các thuộc tính cố định
                Object.keys(updatedRow).forEach((key) => {
                    if (key !== 'id' && key !== 'titleName') { // Giữ lại id và titleName (hoặc các cột cố định khác)
                        updatedRow[key] = ''; // Đặt lại giá trị ô
                    }
                });

                // Cập nhật lại hàng trong mảng
                const updatedRows = [...prevRows];
                updatedRows[rowIndex] = updatedRow;

                return updatedRows;
            }

            return prevRows;
        });
    };
    const handleCancelChanges = () => {
        // Đặt lại các ô có thể chỉnh sửa về giá trị mặc định
        setRows((prevRows) => {
            const resetRows = prevRows.map((row) => {
                const updatedRow = { ...row };
                // Duyệt qua tất cả các cột có thể chỉnh sửa (như cột tiêu chí) và đặt lại giá trị về mặc định
                Object.keys(updatedRow).forEach((key) => {
                    if (key !== 'task' && key !== 'type' && key !== 'id') { // Giữ lại 'task', 'type', và 'id'
                        updatedRow[key] = ''; // Đặt lại giá trị ô cho các cột có thể sửa
                    }
                });
                return updatedRow;
            });
            return resetRows;
        });
    };



    const handleSaveChanges = () => {
        // Kiểm tra xem tất cả rankScore đã được tính toán chưa
        const allRankScoresCalculated = rows.every(row => row.rankScore && row.rankScore !== '');
        console.log(rows)
        if (!allRankScoresCalculated) {
            showErrorMessage('Tất cả Rank Score phải được tính toán');
            return; // Dừng hàm nếu có hàng chưa tính toán rankScore
        }

        console.log("Tổng weight hợp lệ và tất cả Rank Score đã được tính toán. Lưu dữ liệu...");
        goToNextStep(); // Tiến hành lưu dữ liệu và chuyển sang bước tiếp theo
    };

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
                        pageSize={5}
                        rowsPerPageOptions={[5]}
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