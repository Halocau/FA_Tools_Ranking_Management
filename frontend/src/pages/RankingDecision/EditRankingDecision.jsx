import React, { useEffect, useState } from "react";
import { FaEdit, FaAngleRight } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
// CSS
import "../../assets/css/RankingGroups.css";
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
// Source code
import useRankingDecision from "../../hooks/useRankingDecision.jsx";
import useNotification from "../../hooks/useNotification.jsx";

const EditRankingDecision = () => {
  const navigate = useNavigate(); // To navigate between pages
  const { id } = useParams(); // Get the ID from the URL

  // Edit
  const [editDecision, setEditDecision] = useState({
    decisionName: "",
    currentRankingDecision: "",
  });
  const [originalDecisionName, setOriginalDecisionName] = useState("");
  const [showEditDecisionInfoModal, setShowEditDecisionInfoModal] =
    useState(false); // Display decision editing modal
  const [newDecisionName, setNewDecisionName] = useState(""); // New decision Name
  const [status, setStatus] = useState("");

  // Use hook notification
  const [showSuccessMessage, showErrorMessage] = useNotification();
  // Validation error message
  const [validationMessage, setValidationMessage] = useState("");

  // Destructuring from useRankingDecision custom hook
  const {
    data: decisions,
    fetchAllRankingDecisions,
    fetchRankingDecisionById,
    updateRankingDecision,
  } = useRankingDecision();

  // Get the list of ranking decisions
  useEffect(() => {
    fetchAllRankingDecisions();
  }, []);

  useEffect(() => {
    const loadGroup = async () => {
      try {
        const decisionData = await fetchRankingDecisionById(id);
        console.log("API DecisionData:", decisionData);

        // Check if decisionData exists and has required fields
        if (decisionData && decisionData.decisionName) {
          setEditDecision({
            decisionName: decisionData.decisionName,
            decisionStatus: decisionData.status,
          });
          setOriginalDecisionName(decisionData.decisionName);
          setNewDecisionName(decisionData.decisionName);
          setStatus(decisionData.status);
        } else {
          console.error("decisionData is undefined or missing decisionName");
        }
      } catch (error) {
        console.error("Error fetching group:", error);
      }
    };
    loadGroup();
  }, [id]);

  // Handlers to open/close modals for editing of the decision info
  const handleOpenEditRankingDecisionInfoModal = () => {
    setShowEditDecisionInfoModal(true);
    setValidationMessage("");
  };

  const handleEditRankingDecisionInfo = async () => {
    setValidationMessage("");
    let trimmedName = newDecisionName.trim();

    // Validation for the decision name
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
    // Check if the decision name already exists, excluding the current decision name
    const existingDecisions = await fetchAllRankingDecisions();
    const decisionExists = existingDecisions.some(
      (decision) =>
        decision.decisionName.toLowerCase() === trimmedName.toLowerCase() &&
        decision.decisionName !== editDecision.decisionName
    );
    if (decisionExists) {
      setValidationMessage(
        "Decision name already exists. Please choose a different name."
      );
      return;
    }

    // Capitalize the first letter of each word
    trimmedName = trimmedName.replace(/\b\w/g, (char) => char.toUpperCase());

    // Prepare the updated decision object
    try {
      const updatedDecision = {
        decisionName: trimmedName,
        createBy: localStorage.getItem("userId"),
      };
      await updateRankingDecision(id, updatedDecision);
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

  const handleCloseEditRankingDecisionInfoModal = () => {
    setShowEditDecisionInfoModal(false);
    setValidationMessage("");
  };

  ////////////////////////////// Criteria Configuration //////////////////////////////
  //data
  const initialCriteria = [
    { criteria_name: "Antsalova", max_score: 5762, num_options: 3 },
    { criteria_name: "Pocatello", max_score: 120, num_options: 4 },
    { criteria_name: "Tamworth", max_score: 1005, num_options: 5 },
    { criteria_name: "Lannion", max_score: 1905, num_options: 6 },
  ]; // Dữ liệu tiêu chí khởi đầu
  const titleRows = [
    {
      rank_title: "Rank 1",
      rank_score: 90,
      criteria_scores: {
        Antsalova: 85,
        Pocatello: 75,
        Tamworth: 95,
        Lannion: 70,
      },
    },
    {
      rank_title: "Rank 2",
      rank_score: 85,
      criteria_scores: {
        Antsalova: 80,
        Pocatello: 70,
        Tamworth: 90,
        Lannion: 65,
      },
    },
    // Thêm các hàng dữ liệu khác nếu cần
  ];
  const [activeStep, setActiveStep] = React.useState(1);
  const [rows, setRows] = React.useState(initialCriteria);
  const [selectedCriteria, setSelectedCriteria] = React.useState(null);

  const handleAddCriteria = () => {
    if (selectedCriteria) {
      const newRow = {
        criteria_name: selectedCriteria.name,
        max_score: selectedCriteria.maxScore,
        num_options: selectedCriteria.numOptions,
      };
      setRows([...rows, newRow]);
      setSelectedCriteria(null); // Làm trống dropdown sau khi thêm
    }
  };
  const [decisionStatus, setDecisionStatus] = React.useState("Draft"); // Trạng thái quyết định

  // Hàm lưu dữ liệu vào DB (giả sử)
  const handleSave = () => {
    // Lưu dữ liệu vào DB ở đây
    console.log("Dữ liệu đã được lưu:", rows);
  };

  // Xóa dữ liệu hàng
  const handleStepChange = (step) => setActiveStep(step);

  // Hàm xóa dữ liệu trong ô
  const handleDeleteRowData = (index) => {
    const newRows = [...rows];
    newRows[index] = {
      criteria_name: newRows[index].criteria_name,
      weight: "",
      max_score: "",
      num_options: "",
    }; // Đặt tất cả các giá trị trong hàng thành rỗng
    setRows(newRows);
  };
  // Hàm khôi phục dữ liệu ban đầu
  const handleCancelAllData = () => {
    setRows(initialCriteria); // Khôi phục về dữ liệu ban đầu
  };
  // Hàm kiểm tra xem giá trị có phải là số hay không
  const handleNumberInput = (value, index, field) => {
    if (!isNaN(value) && value !== "") {
      const newRows = [...rows];
      newRows[index] = { ...newRows[index], [field]: value };
      setRows(newRows);
    }
  };

  return (
    <div style={{ marginTop: "60px" }}>
      <Box sx={{ marginTop: 4, padding: 2 }}>
        {/* Breadcrumb */}
        <Typography variant="h6">
          <a href="/ranking-decision">Ranking Decision List</a>{" "}
          {<FaAngleRight />}
          Edit Ranking Decision
        </Typography>
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
              Ranking Decision Name
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

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 20,
            marginTop: 2,
          }}
        >
          {[1, 2, 3].map((step) => (
            <Box
              key={step}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Button
                variant={activeStep === step ? "contained" : "outlined"}
                onClick={() => handleStepChange(step)}
                sx={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {step}
              </Button>
              <Typography variant="caption" sx={{ marginTop: 1 }}>
                {step === 1
                  ? "Criteria Configuration"
                  : step === 2
                  ? "Title Configuration"
                  : "Task & Price Configuration"}
              </Typography>
            </Box>
          ))}
        </Box>
        {activeStep === 1 && (
          <Box sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#b0bec5", color: "#fff" }}>
                <TableRow>
                  <TableCell sx={{ padding: "4px 8px" }}>#</TableCell>
                  <TableCell sx={{ padding: "4px 8px" }}>
                    Criteria Name
                  </TableCell>
                  <TableCell sx={{ padding: "4px 8px" }}>Weight</TableCell>
                  <TableCell sx={{ padding: "4px 8px" }}>Max Score</TableCell>
                  <TableCell sx={{ padding: "4px 8px" }}>Num Options</TableCell>
                  {decisionStatus === "Draft" && (
                    <TableCell sx={{ padding: "4px 8px" }}>Action</TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ padding: "4px 8px" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell sx={{ padding: "4px 8px" }}>
                      <TextField
                        value={row.criteria_name}
                        onChange={(e) =>
                          handleNumberInput(
                            e.target.value,
                            index,
                            "criteria_name"
                          )
                        }
                        sx={{ width: "200px" }} // Kích thước cho ô tên tiêu chí
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "4px 8px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <TextField
                          type="number"
                          value={row.weight || ""}
                          onChange={(e) =>
                            handleNumberInput(e.target.value, index, "weight")
                          }
                          sx={{ width: "120px", marginRight: "0px" }} // Tăng kích thước ô nhập liệu
                          InputProps={{
                            endAdornment: (
                              <Typography
                                variant="body2"
                                sx={{ marginLeft: "4px" }}
                              >
                                %
                              </Typography>
                            ),
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell sx={{ padding: "4px 8px" }}>
                      <TextField
                        type="number"
                        value={row.max_score || ""}
                        onChange={(e) =>
                          handleNumberInput(e.target.value, index, "max_score")
                        }
                        sx={{ width: "100px" }}
                      />
                    </TableCell>
                    <TableCell sx={{ padding: "4px 8px" }}>
                      <TextField
                        type="number"
                        value={row.num_options || ""}
                        onChange={(e) =>
                          handleNumberInput(
                            e.target.value,
                            index,
                            "num_options"
                          )
                        }
                        sx={{ width: "100px" }}
                      />
                    </TableCell>
                    {decisionStatus === "Draft" && (
                      <TableCell sx={{ padding: "4px 8px" }}>
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
            {decisionStatus === "Draft" && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddCriteria}
                sx={{ marginTop: 2 }}
              >
                Add Criteria
              </Button>
            )}
          </Box>
        )}
        {decisionStatus === "Draft" && (
          <Box sx={{ marginTop: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{ marginRight: 2 }}
            >
              Lưu
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleCancelAllData}
            >
              Hủy Tất Cả
            </Button>
          </Box>
        )}
        {/* Bước 2 - Title Configuration */}
        {activeStep === 2 && (
          <Box sx={{ overflowX: "auto", marginTop: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#b0bec5", color: "#fff" }}>
                <TableRow>
                  <TableCell sx={{ padding: "4px 8px" }}>#</TableCell>
                  <TableCell sx={{ padding: "4px 8px" }}>Rank Title</TableCell>
                  <TableCell sx={{ padding: "4px 8px" }}>Rank Score</TableCell>
                  {/* Hiển thị cột cho từng tiêu chí */}
                  {/* {criteria.map((criterion) => (
                                        <TableCell key={criterion.criteria_name} sx={{ padding: '4px 8px' }}>
                                            {criterion.criteria_name}
                                        </TableCell>
                                    ))} */}
                </TableRow>
              </TableHead>
              <TableBody>
                {titleRows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ padding: "4px 8px" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell sx={{ padding: "4px 8px" }}>
                      {row.rank_title}
                    </TableCell>
                    <TableCell sx={{ padding: "4px 8px" }}>
                      {row.rank_score}
                    </TableCell>
                    
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Box>

      {/* Modal for Editing Decision Info */}
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
          <Typography variant="h6">Edit Decision Info</Typography>
          <TextField
            label="Decision Name"
            variant="outlined"
            fullWidth
            value={newDecisionName}
            onChange={(e) => setNewDecisionName(e.target.value)}
            error={!!validationMessage}
            helperText={validationMessage}
            sx={{ marginTop: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setNewDecisionName("")}
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
            <Button variant="contained" onClick={handleEditRankingDecisionInfo}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default EditRankingDecision;
