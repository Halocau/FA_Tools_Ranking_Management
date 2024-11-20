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
import CriteriaConfigurationStep from "./CriteriaConfigurationStep.jsx";

const EditDecision = () => {
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

  // Ranking Decision Edit
  const RankingDecisionEdit = async () => {
    try {
      const decisionData = await RankingDecisionAPI.getRankingDecisionById(id);
      // Ensure no undefined values are passed
      setEditDecision({
        decisionName: decisionData.decisionName || "",
        status: decisionData.status || "",
      });
      console.log(decisionData);
      setOriginalDecisionName(decisionData.decisionName || "Decision Name");
      setNewDecisionName(decisionData.decisionName || "");
      setStatus(decisionData.status || "");
    } catch (error) {
      console.error("Error fetching group:", error);
    }
  };
  // Fetch Ranking Decision on id change
  useEffect(() => {
    RankingDecisionEdit();
  }, [id]);

  ////Handlers to open/close modals for editing of the decision info
  const handleOpenEditRankingDecisionInfoModal = () => {
    setShowEditDecisionInfoModal(true);
    setValidationMessage("");
  };
  const handleCloseEditRankingDecisionInfoModal = () => {
    setShowEditDecisionInfoModal(false);
    setValidationMessage("");
  };
  const handleEditRankingDecisionInfo = async () => {
    setValidationMessage("");
    let trimmedName = newDecisionName.trim();

    if (!trimmedName) {
      setValidationMessage("Decision name cannot be empty.");
      return;
    }
    if (trimmedName.length < 3 || trimmedName.length > 20) {
      setValidationMessage(
        "Decision name must be between 3 and 20 characters."
      );
      return;
    }

    // Capitalize the first letter of each word
    trimmedName = trimmedName.replace(/\b\w/g, (char) => char.toUpperCase());

    try {
      const updatedDecision = {
        decisionName: trimmedName,
        createBy: localStorage.getItem("userId"),
      };
      await RankingDecisionAPI.updateRankingDecision(id, updatedDecision);
      setOriginalDecisionName(trimmedName);
      showSuccessMessage("Decision info successfully updated");
      setShowEditDecisionInfoModal(false);
    } catch (error) {
      console.error("Error updating decision:", error);
      showErrorMessage(
        "Error occurred updating decision info. Please try again."
      );
    }
  };

  const getCriteriaConfiguration = async () => {
    try {
      const response =
        await DecisionCriteriaAPI.getDecisionCriteriaByDecisionId(id);
      setCriteria(response.result);
      setTotalElements(response.pageInfo.element);
      setTotalPages(response.pageInfo.total);
    } catch (error) {
      console.error("Error fetching criteria:", error);
    }
  };

  useEffect(() => {
    getCriteriaConfiguration();
  }, []);

  console.log(rows);
  // Hàm kiểm tra xem có thể chuyển sang bước khác không
  const canMoveToNextStep = (step) => {
    if (step === 1 && !isCriteriaSaved) return false; // Không chuyển sang Title Configuration nếu Criteria chưa lưu
    if (step === 2 && !isTitleSaved) return false; // Không chuyển sang Task & Price Configuration nếu Title chưa lưu
    return true;
  };

  // Hàm xử lý khi người dùng nhấn vào một bước
  const handleStepChange = (step) => {
    if (step < activeStep || canMoveToNextStep(step)) {
      // Người dùng chỉ có thể quay lại các bước trước hoặc tiến tới bước sau nếu dữ liệu đã lưu
      setActiveStep(step);
    }
  };

  // Hàm xử lý khi lưu dữ liệu cho từng bước
  const handleSave = () => {
    if (activeStep === 0) {
      setIsCriteriaSaved(true); // Đánh dấu Criteria đã lưu
    } else if (activeStep === 1) {
      setIsTitleSaved(true); // Đánh dấu Title đã lưu
    } else if (activeStep === 2) {
      setIsTaskSaved(true); // Đánh dấu Task đã lưu
    }
  };

  // Màu sắc cho từng bước dựa trên trạng thái
  const getStepColor = (index) => {
    if (index === activeStep) {
      return "primary"; // Bước hiện tại sẽ có màu chính
    }
    if (index === 0 && !isCriteriaSaved) {
      return "default"; // Criteria chưa lưu thì không có tick mark
    }
    if (index === 1 && !isTitleSaved) {
      return "default"; // Title chưa lưu thì không có tick mark
    }
    if (index === 2 && !isTaskSaved) {
      return "default"; // Task chưa lưu thì không có tick mark
    }
    return "secondary"; // Các bước đã lưu sẽ có tick mark
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
  // Xử lý khi người dùng chỉnh sửa một ô
  const handleCellEditCriteriaCommit = (newRow, oldRow) => {
    const updatedRow = { ...oldRow, ...newRow };
    if (newRow.weight !== oldRow.weight) {
      // Cập nhật giá trị weight
      updatedRow.weight = newRow.weight;
      // Cập nhật lại giá trị trong trạng thái
      setRows((prevRows) =>
        prevRows.map((item) => (item.id === updatedRow.id ? updatedRow : item))
      );
    }
    return updatedRow;
  };
  // Hàm tính tổng weight
  const calculateTotalWeight = () => {
    const totalWeight = criteria.reduce((total, row) => total + row.weight, 0);
    return totalWeight;
  };
  // Hàm lưu dữ liệu và kiểm tra tổng weight
  const handleSaveChanges = () => {
    const totalWeight = calculateTotalWeight();
    if (totalWeight === 100) {
      // Lưu dữ liệu
      console.log("Tổng weight hợp lệ. Lưu dữ liệu...");
      // Tiến hành lưu dữ liệu tại đây
      goToNextStep();
    } else {
      showErrorMessage("Tổng weight phải bằng 100");
    }
  };
  // Hàm chuyển sang bước tiếp theo
  const goToNextStep = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  // Hàm xử lý khi bấm nút Xóa
  const handleDeleteRowData = (id) => {
    // Tìm vị trí của dòng cần hủy
    const rowIndex = criteria.findIndex((row) => row.id === id);
    if (rowIndex !== -1) {
      // Sử dụng initialCriteria để phục hồi dữ liệu gốc cho hàng đó
      const newRows = [...criteria];
      newRows[rowIndex] = { ...initialCriteria[rowIndex] }; // Khôi phục lại dữ liệu ban đầu
      setRows(newRows);
    }
  };

  useEffect(() => {
    if (criteria) {
      const mappedRows = criteria.map((criteria, index) => ({
        id: criteria.criteriaId,
        index: index + 1 + (page - 1) * pageSize,
        criteria_name: criteria.criteriaName,
        weight: criteria.weight,
        num_options: criteria.numOptions < 1 ? "0" : criteria.numOptions,
        max_score: criteria.maxScore == null ? "" : criteria.maxScore,
      }));
      setRows(mappedRows);
    }
  }, [criteria]);

  // Column Criteria
  const columnsCriteria = [
    { field: "criteria_name", headerName: "Criteria Name", width: 500 },
    {
      field: "weight",
      headerName: "Weight",
      width: 150,
      editable: decisionStatus === "Draft", // Cho phép chỉnh sửa khi trạng thái là 'Draft'
      cellClassName: "cell-center",
      renderCell: (params) =>
        decisionStatus === "Draft" ? (
          <TextField
            value={params.value || ""} // Giá trị ô hiện tại hoặc chuỗi rỗng
            onChange={(e) =>
              handleCellEditTaskCommit({
                id: params.row.id,
                field: params.field,
                value: e.target.value,
              })
            } // Cập nhật giá trị khi thay đổi
            variant="outlined"
            size="small"
            fullWidth
            sx={{
              marginTop: "10px",
              ".MuiInputBase-root": {
                display: "flex",
                alignItems: "center", // Căn giữa theo chiều dọc
                justifyContent: "center", // Căn giữa theo chiều ngang
              },
              ".MuiInputBase-input": {
                padding: "4px", // Padding trong ô nhập liệu
                textAlign: "center", // Căn giữa văn bản trong ô
              },
            }}
            type="number" // Chỉ cho phép nhập số
            inputMode="numeric" // Thiết lập kiểu nhập liệu là số
          />
        ) : (
          params.value // Nếu không phải 'Draft', chỉ hiển thị giá trị
        ),
    },
    {
      field: "num_options",
      headerName: "No of Options",
      width: 150,
      cellClassName: "cell-center",
    },
    {
      field: "max_score",
      headerName: "Max Score",
      width: 150,
      cellClassName: "cell-center",
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
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

  //////////////////////////////////////////////////////////////////////////// Title Configuration ////////////////////////////////////////////////////////////////////////////

  const [columnsTitle, setColumnsTitle] = useState([]);
  // Tạo cấu hình cột và hàng
  useEffect(() => {
    if (initialCriteria && initialTitle) {
      // Cột từ tiêu chí
      const criteriaColumns = initialCriteria.map((criteria) => ({
        field: criteria.criteriaName,
        headerName: criteria.criteriaName,
        width: 140,
        editable: true,
        renderCell: (params) => (
          <Select
            value={params.value || ""}
            onChange={(e) =>
              handleCellEditTitleCommit({
                id: params.row.id,
                field: params.field,
                value: e.target.value,
              })
            }
            fullWidth
            sx={{
              height: "30px", // Chiều cao của box
              ".MuiSelect-select": {
                padding: "4px", // Padding trong box
              },
            }}
          >
            {rankTitles.map((title, index) => (
              <MenuItem key={index} value={title}>
                {title}
              </MenuItem>
            ))}
          </Select>
        ),
      }));

      // Cột cố định
      const fixedColumns = [
        { field: "titleName", headerName: "Title Name", width: 100 },
        {
          field: "rankScore",
          headerName: "Rank Score",
          width: 100,
          editable: decisionStatus === "Draft",
          align: "center",
          headerAlign: "center",
        },
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
      const updatedRows = initialTitle.map((title) => ({
        id: title.titleId,
        titleName: title.titleName,
        rankScore: "",
        ...initialCriteria.reduce((acc, criteria) => {
          acc[criteria.criteriaName] = "";
          return acc;
        }, {}),
      }));

      // Cập nhật cột và hàng
      setColumnsTitle([...fixedColumns, ...criteriaColumns, ...actionColumn]);
      setTitle(updatedRows);
    }
  }, [initialCriteria, initialTitle, decisionStatus]);

  // Xử lý khi chỉnh sửa ô
  const handleCellEditTitleCommit = ({ id, field, value }) => {
    setTitle((prevRows) => {
      const updatedRows = [...prevRows];
      const rowIndex = updatedRows.findIndex((row) => row.id === id);

      if (rowIndex !== -1) {
        // Cập nhật giá trị ô
        updatedRows[rowIndex] = {
          ...updatedRows[rowIndex],
          [field]: value,
        };

        // Tính toán rankScore nếu tất cả các tiêu chí đã được chọn
        const currentRow = updatedRows[rowIndex];
        const allCriteriaFilled = initialCriteria.every(
          (criteria) => currentRow[criteria.criteriaName]
        );

        if (allCriteriaFilled) {
          // Công thức tính toán rankScore
          const newRankScore = initialCriteria.reduce((score, criteria) => {
            const chosenValue =
              parseInt(currentRow[criteria.criteriaName]) || 0; // Giá trị lựa chọn
            const weight = criteria.weight;
            const numOptions = criteria.numOptions;

            return score + chosenValue * (weight / numOptions);
          }, 0);

          // Cập nhật rankScore
          updatedRows[rowIndex].rankScore = newRankScore.toFixed(2); // Làm tròn 2 chữ số
        } else {
          // Xóa rankScore nếu chưa đủ điều kiện
          updatedRows[rowIndex].rankScore = "";
        }
      }
      return updatedRows;
    });
  };

  //////////////////////////////////////////////////////////////////////////// Task and Price Configuration ////////////////////////////////////////////////////////////////////////////

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

  return (
    <div style={{ marginTop: "60px" }}>
      <Box sx={{ marginTop: 4, padding: 2 }}>
        {/* Link */}
        <Typography variant="h6">
          <a href="/ranking-decision">Ranking Decision List</a> <FaAngleRight />
          Edit Ranking Decision
        </Typography>
        {/* Box Decision Info */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            marginTop: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", width: "48%" }}>
            <Typography sx={{ marginRight: 1 }}>
              Ranking Decision Name:
            </Typography>
            <TextField
              variant="outlined"
              fullWidth
              value={originalDecisionName}
              disabled
              sx={{ width: "60%" }}
              InputProps={{
                sx: { height: "30px" },
              }}
            />
            <IconButton
              size="small"
              aria-label="edit"
              onClick={handleOpenEditRankingDecisionInfoModal}
            >
              <EditIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", width: "48%" }}>
            <Typography sx={{ marginRight: 1 }}>Status:</Typography>
            <TextField
              variant="outlined"
              fullWidth
              value={status}
              disabled
              sx={{ width: "60%" }}
              InputProps={{
                sx: { height: "30px" },
              }}
            />
          </Box>
        </Box>

        {/* Stepper */}
        <Box sx={{ width: "100%", marginTop: 2 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepButton
                  onClick={() => handleStepChange(index)}
                  sx={{
                    color: getStepColor(index),
                    textAlign: "center", // Ensure the label is centered
                    fontSize: "16px", // Customize font size as needed
                    fontWeight: "bold", // Optional: Make the label bold
                  }}
                >
                  {label} {/* Only display the step label */}
                </StepButton>
              </Step>
            ))}
          </Stepper>
        </Box>
        {/* Nội dung của bước hiện tại */}
        <Box sx={{ marginTop: 4 }}>
          <CriteriaConfigurationStep/>

        </Box>

        {/* Modal for editing group info */}
        <Modal
          open={showEditDecisionInfoModal}
          onClose={handleCloseEditRankingDecisionInfoModal}
        >
          <Box
            sx={{
              padding: 2,
              backgroundColor: "white",
              borderRadius: 1,
              maxWidth: 400,
              margin: "auto",
              marginTop: "100px",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              Edit Decision Info
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleCloseEditRankingDecisionInfoModal}
              ></button>
            </Typography>
            <TextField
              label="Decision Name"
              variant="outlined"
              fullWidth
              value={newDecisionName || ""} // Default to empty string if undefined
              onChange={(e) => setNewDecisionName(e.target.value)}
              error={!!validationMessage}
              helperText={validationMessage}
              sx={{ marginTop: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        console.log(newDecisionName);
                        setNewDecisionName("");
                        setValidationMessage("");
                      }}
                      size="small"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box
              sx={{
                marginTop: 2,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button
                variant="outlined"
                onClick={handleCloseEditRankingDecisionInfoModal}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleEditRankingDecisionInfo}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </div>
  );
};
export default EditDecision;
