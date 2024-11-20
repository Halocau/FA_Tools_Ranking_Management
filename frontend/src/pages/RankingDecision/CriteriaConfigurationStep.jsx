import React, { useState, useEffect } from "react";
import { FaAngleRight } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
// MUI
import {
  InputAdornment,
  Box,
  Button,
  Typography,
  TextField,
  Modal,
  IconButton,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import { Stepper, Step, StepButton } from "@mui/material";

// Css
import "../../assets/css/RankingGroups.css";
import "../../assets/css/Table.css";
// API
import RankingDecisionAPI from "../../api/rankingDecisionAPI.js";
import DecisionCriteriaAPI from "../../api/DecisionCriteriaAPI.js";

// Hooks
import useNotification from "../../hooks/useNotification";
//Data
import {
  rankTitles,
  initialCriteria,
  initialTitle,
  initialTask,
} from "../../pages/RankingDecision/Data";

const CriteriaConfigurationStep = () => {
  const { id } = useParams(); // Get the ID from the URL
  // Edit
  const [editDecision, setEditDecision] = useState({ decisionName: "" });
  const [originalDecisionName, setOriginalDecisionName] = useState("");
  const [showEditDecisionInfoModal, setShowEditDecisionInfoModal] =
    useState(false); // Display decision editing modal
  const [newDecisionName, setNewDecisionName] = useState(""); // New decision Name
  const [status, setStatus] = useState("");

  // Step
  const [activeStep, setActiveStep] = useState(2);

  const [criteria, setCriteria] = useState([]);
  const [title, setTitle] = useState([]);
  const [task, setTask] = useState([]);
  const [decisionStatus, setDecisionStatus] = useState("Draft");
  // Các bước
  const steps = [
    "Criteria Configuration",
    "Title Configuration",
    "Task & Price Configuration",
  ];
  // Trạng thái lưu dữ liệu cho từng bước
  const [isCriteriaSaved, setIsCriteriaSaved] = useState(false);
  const [isTitleSaved, setIsTitleSaved] = useState(false);
  const [isTaskSaved, setIsTaskSaved] = useState(false);

  const [rows, setRows] = useState([]);
  // Table  List  (page, size)
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  // Use hook notification
  const [showSuccessMessage, showErrorMessage] = useNotification();
  // Validation error message
  const [validationMessage, setValidationMessage] = useState("");

  const [columnsTitle, setColumnsTitle] = useState([]);
  const [columnsTask, setColumnsTask] = useState([]);
  // Tạo cấu hình cột và hàng
  useEffect(() => {
    if (initialCriteria && initialTitle && initialTask) {
      // Cột từ tiêu chí
      const titleColumns = initialTitle.map((title) => ({
        field: title.titleName,
        headerName: title.titleName,
        width: 140,
        editable: true,
        renderCell: (params) => (
          <TextField
            value={params.value || null} // Giá trị mặc định là 0
            onChange={(e) =>
              handleCellEditTaskCommit({
                id: params.row.id,
                field: params.field,
                value: e.target.value,
              })
            }
            variant="outlined"
            fullWidth
            sx={{
              marginTop: "10px", // Áp dụng margin-top
              height: "30px", // Chiều cao của ô nhập liệu
              ".MuiInputBase-root": {
                display: "flex",
                alignItems: "center", // Căn giữa theo chiều dọc
              },
              ".MuiInputBase-input": {
                padding: "4px", // Padding trong ô nhập liệu
                appearance: "textfield", // Hủy bỏ các biểu tượng tăng giảm (cho Webkit, Firefox)
              },
              // Ẩn nút tăng giảm
              '& input[type="number"]::-webkit-outer-spin-button, & input[type="number"]::-webkit-inner-spin-button':
                {
                  display: "none",
                },
              '& input[type="number"]': {
                "-moz-appearance": "textfield", // Hủy bỏ nút tăng giảm cho Firefox
              },
            }}
            type="number" // Loại số để nhập giá trị số
            inputMode="numeric" // Thiết lập kiểu nhập liệu là số
          />
        ),
      }));

      // Cột cố định
      const fixedColumns = [
        { field: "task", headerName: "Task", width: 100 },
        { field: "type", headerName: "Type", width: 100 },
      ];

      const actionColumn = [
        {
          field: "action",
          headerName: "Action",
          width: 130,
          renderCell: (params) =>
            decisionStatus === "Draft" && (
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
      const updatedRows = initialTask
        .map((task) => {
          return ["In Working Hour", "Overtime"].map((type, index) => ({
            id: `${task.task_name}_${type}`,
            task: index === 0 ? task.task_name : "", // Chỉ hiển thị tên task ở hàng đầu tiên
            type: type,
            ...initialCriteria.reduce((acc, title) => {
              acc[title.titleName] = "";
              return acc;
            }, {}),
          }));
        })
        .flat(); // Flat để biến mảng 2 chiều thành mảng 1 chiều

      // Cập nhật cột và hàng
      setColumnsTask([...fixedColumns, ...titleColumns, ...actionColumn]);
      setTask(updatedRows);
    }
  }, [initialCriteria, initialTitle, initialTask, decisionStatus]);

  // Xử lý khi chỉnh sửa ô
  const handleCellEditTaskCommit = ({ id, field, value }) => {
    setTitle((prevRows) => {
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
          const allCriteriaFilled = initialCriteria.every(
            (title) => currentRow[title.titleName] !== ""
          );

          if (allCriteriaFilled) {
            // Tính toán rankScore khi tất cả tiêu chí đã được điền
            const newRankScore = initialCriteria.reduce((score, title) => {
              const chosenValue = parseInt(currentRow[title.titleName]) || 0; // Giá trị lựa chọn từ ô nhập liệu
              const weight = title.weight;
              const numOptions = title.numOptions;

              // Cập nhật score theo công thức
              return score + chosenValue * (weight / numOptions);
            }, 0);

            // Cập nhật rankScore, làm tròn đến 2 chữ số
            updatedRows[rowIndex].rankScore = newRankScore.toFixed(2);
          } else {
            // Nếu chưa đủ tiêu chí, xóa giá trị rankScore
            updatedRows[rowIndex].rankScore = "";
          }
        }
      }

      return updatedRows;
    });
  };

  const handleAddCriteria = () => {
    const newCriteria = {
      criteria_name: "New Criteria",
      weight: 0,
      max_score: 1,
      num_options: 1,
    };
    console.log(newCriteria);
    setRows([...rows, newCriteria]);
  };

  return (
    <div>
      <Box sx={{ marginTop: 4 }}>
        {/*Criteria Configuration */}
        {activeStep === 0 && (
          <div>
            <h3>Criteria Configuration</h3>
            {/* Nội dung của Criteria Configuration */}
            <Box
              sx={{
                width: "100%",
                height: 500,
                marginTop: "10px",
                border: "2px solid black",
                borderRadius: "8px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                overflow: "hidden", // Loại bỏ thanh cuộn bên ngoài
              }}
            >
              {activeStep === 0 && (
                <Box sx={{ width: "100%", height: 400, marginTop: "10px" }}>
                  <DataGrid
                    // className="custom-data-grid"
                    rows={rows}
                    columns={columnsCriteria}
                    pagination
                    pageSize={pageSize}
                    pageSizeOptions={[5, 10, 20]}
                    getRowId={(row) => row.id} // Sử dụng criteriaId làm id
                    rowCount={totalElements}
                    paginationMode="server"
                    paginationModel={{
                      page: page - 1,
                      pageSize: pageSize,
                    }}
                    onPaginationModelChange={(model) => {
                      setPage(model.page + 1);
                      setPageSize(model.pageSize);
                    }}
                    disableNextButton={page >= totalPages}
                    disablePrevButton={page <= 1}
                    disableRowSelectionOnClick
                    autoHeight={false}
                    processRowUpdate={handleCellEditCriteriaCommit}
                    onCellEditCommit={(params) => {
                      console.log("Cell edit committed:", params);
                    }}
                    sx={{
                      height: "100%",
                      "& .MuiDataGrid-virtualScroller": {
                        overflowY: "auto",
                      },
                    }}
                  />

                  {/* Button criteria */}
                  {decisionStatus === "Draft" && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 2,
                        marginTop: "20px",
                      }}
                    >
                      {/* Nút Add Criteria ở bên trái */}
                      <Box
                        sx={{ display: "flex", justifyContent: "flex-start" }}
                      >
                        <Button
                          variant="contained"
                          color="success"
                          onClick={handleAddCriteria}
                        >
                          Add Criteria
                        </Button>
                      </Box>
                      {/* Nút Save và Cancel ở bên phải */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 2,
                        }}
                      >
                        <Button
                          variant="contained"
                          color="error"
                          // onClick={handleCancelChanges}
                          // disabled={!hasChanges} // Bật/tắt dựa trên trạng thái
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleSaveChanges}
                          // disabled={!isSaveButtonEnabled} // Bật/tắt dựa trên trạng thái
                        >
                          Save
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </div>
        )}
        {/* Title Configuration */}
        {activeStep === 1 && (
          <div>
            <h3>Title Configuration</h3>
            {/* Nội dung của Title Configuration */}
            <Box
              sx={{
                width: "100%",
                height: 500,
                marginTop: "10px",
                border: "2px solid black",
                borderRadius: "8px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                overflow: "hidden", // Loại bỏ thanh cuộn bên ngoài
              }}
            >
              {activeStep === 1 && (
                <Box sx={{ width: "100%", height: 400, marginTop: "10px" }}>
                  <DataGrid
                    // className="custom-data-grid"
                    rows={title}
                    columns={columnsTitle}
                    getRowId={(row) => row.id}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                  />

                  {/* Button Title */}
                  {decisionStatus === "Draft" && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 2,
                        marginTop: "20px",
                      }}
                    >
                      {/* Nút Add Criteria ở bên trái */}
                      <Box
                        sx={{ display: "flex", justifyContent: "flex-start" }}
                      >
                        <Button
                          variant="contained"
                          color="success"
                          onClick={handleAddCriteria}
                        >
                          Add Criteria
                        </Button>
                      </Box>

                      {/* Nút Save và Cancel ở bên phải */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 2,
                        }}
                      >
                        <Button
                          variant="contained"
                          color="error"
                          // onClick={handleCancelChanges}
                          // disabled={!hasChanges} // Bật/tắt dựa trên trạng thái
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleSaveChanges}
                          // disabled={!isSaveButtonEnabled} // Bật/tắt dựa trên trạng thái
                        >
                          Save
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </div>
        )}

        {activeStep === 2 && (
          <div>
            <h3>Task & Price Configuration</h3>
            {/* Nội dung của Task & Price Configuration */}
            <Box
              sx={{
                width: "100%",
                height: 500,
                marginTop: "10px",
                border: "2px solid black",
                borderRadius: "8px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                overflow: "hidden", // Loại bỏ thanh cuộn bên ngoài
              }}
            >
              {activeStep === 2 && (
                <Box sx={{ width: "100%", height: 400, marginTop: "10px" }}>
                  <DataGrid
                    // className="custom-data-grid"z
                    rows={task}
                    columns={columnsTask}
                    getRowId={(row) => row.id}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                  />

                  {/* Button Task */}
                  {decisionStatus === "Draft" && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 2,
                        marginTop: "20px",
                      }}
                    >
                      {/* Nút Add Criteria ở bên trái */}
                      <Box
                        sx={{ display: "flex", justifyContent: "flex-start" }}
                      >
                        <Button
                          variant="contained"
                          color="success"
                          onClick={handleAddCriteria}
                        >
                          Add Task
                        </Button>
                      </Box>

                      {/* Nút Save và Cancel ở bên phải */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 2,
                        }}
                      >
                        <Button
                          variant="contained"
                          color="error"
                          // onClick={handleCancelChanges}
                          // disabled={!hasChanges} // Bật/tắt dựa trên trạng thái
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleSaveChanges}
                          // disabled={!isSaveButtonEnabled} // Bật/tắt dựa trên trạng thái
                        >
                          Save
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </div>
        )}

        {/* Nút lưu */}
        {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}><Button variant="contained" onClick={handleSave}>Save</Button></Box> */}
      </Box>
    </div>
  );
};

export default CriteriaConfigurationStep;
