// Import các thư viện cần thiết từ React, Material-UI và các component khác
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  IconButton,
  Switch,
  FormControlLabel,
  Alert,
} from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "../../layouts/Slider.jsx";
import useRankingGroup from "../../hooks/useRankingGroup.jsx";
import useRankingDecision from "../../hooks/useRankingDecision.jsx";
import "../../assets/css/RankingGroups.css";

const TaskManagement = () => {
  const navigate = useNavigate(); // Để điều hướng giữa các trang
  const { id } = useParams(); // Lấy tham số id từ URL
  const {
    fetchRankingGroupById,
    updateRankingGroup,
    fetchAllRankingGroups,
    data: group,
  } = useRankingGroup(); // Các hàm từ hook để quản lý nhóm xếp hạng

  // State cho việc chỉnh sửa và hiển thị thông tin nhóm
  const [editGroup, setEditGroup] = useState({
    groupName: "",
    currentRankingDecision: "",
  });
  const [originalGroupName, setOriginalGroupName] = useState("");
  const [message, setMessage] = useState(""); // Thông báo trạng thái
  const [messageType, setMessageType] = useState("success"); // Loại thông báo (success/error)
  const [showAddModal, setShowEditGroupInfoModal] = useState(false); // Hiển thị modal sửa nhóm
  const [newGroupName, setNewGroupName] = useState(""); // Tên nhóm mới
  const [validationMessage, setValidationMessage] = useState(""); // Thông báo lỗi validate
  const [selectedDecision, setSelectedDecision] = useState(""); // Quyết định xếp hạng hiện tại
  const [rankingDecisions, setTasks] = useState([]); // Danh sách các quyết định xếp hạng
  const [showDecisionModal, setShowTaskModal] = useState(false); // Hiển thị modal thêm quyết định
  const [decisionName, setTaskName] = useState(""); // Tên quyết định mới
  const [clone, setClone] = useState(false); // Trạng thái clone quyết định
  const [selectedCloneDecision, setSelectedCloneTask] = useState(""); // Quyết định clone
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [DecisionToDelete, setDecisionToDelete] = useState(null);
  const apiRef = useGridApiRef(); // Tạo apiRef để chọn nhiều group để xóa

  // Destructuring from useRankingGroup custom hook
  const {
    data: tasks,
    error,
    loading,
    fetchAllRankingDecisions,
    deleteRankingGroup,
    addRankingGroup,
  } = useRankingGroup();

  // Fetching the ranking group details when the component mounts
  useEffect(() => {
    const loadGroup = async () => {
      try {
        const groupData = await fetchRankingGroupById(id);
        setEditGroup({
          groupName: groupData.groupName,
          currentRankingDecision: groupData.currentRankingDecision,
        });
        setOriginalGroupName(groupData.groupName);
        setNewGroupName(groupData.groupName);
        setSelectedDecision(groupData.currentRankingDecision);
        setTasks(groupData.rankingDecisions || []);
      } catch (error) {
        console.error("Error fetching group:", error);
      }
    };
    loadGroup();
  }, [id]);

  //// Handlers to open/close modals for editing of the group info
  const handleOpenEditGroupInfoModal = () => {
    setShowEditGroupInfoModal(true);
    setValidationMessage("");
  };
  const handleEditGroup = async () => {
    setValidationMessage("");
    let trimmedName = newGroupName.trim();
    // Validation for the group name
    if (!trimmedName) {
      setValidationMessage("Group name cannot be empty.");
      return;
    }
    if (trimmedName.length < 3 || trimmedName.length > 20) {
      setValidationMessage("Group name must be between 3 and 20 characters.");
      return;
    }
    const nameRegex = /^[a-zA-Z0-9 ]+$/;
    if (!nameRegex.test(trimmedName)) {
      setValidationMessage(
        "Group name can only contain letters, numbers, and spaces."
      );
      return;
    }
    // Check if the group name already exists
    const existingGroups = await fetchAllRankingGroups(); // Assuming this function fetches all groups
    const groupExists = existingGroups.some(
      (group) => group.groupName.toLowerCase() === trimmedName.toLowerCase()
    );
    if (groupExists) {
      setValidationMessage(
        "Group name already exists. Please choose a different name."
      );
      return;
    }
    // Prevent changing the name of the trainer group
    if (editGroup.groupName === "Trainer" && trimmedName !== "Trainer") {
      setValidationMessage("Cannot change the name of the Trainer group.");
      return;
    }
    // Capitalize the first letter of each word
    trimmedName = trimmedName.replace(/\b\w/g, (char) => char.toUpperCase());

    // Prepare the updated group object
    try {
      const updatedGroup = {
        groupName: trimmedName,
        currentRankingDecision:
          selectedDecision || editGroup.currentRankingDecision,
      };

      await updateRankingGroup(id, updatedGroup);
      setOriginalGroupName(trimmedName);
      setMessageType("success");
      setMessage("Group updated successfully!");
      setTimeout(() => setMessage(null), 2000);
      setShowEditGroupInfoModal(false);
    } catch (error) {
      console.error("Error updating group:", error);
      setMessageType("error");
      setMessage("Failed to update group. Please try again.");
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const handleCloseEditGroupInfoModal = () => {
    setShowEditGroupInfoModal(false);
    setValidationMessage("");
  };
  //// Handlers to open/close modals for adding Decision
  const handleOpenAddTaskModal = () => {
    setShowTaskModal(true);
    setTaskName("");
    setClone(false);
    setSelectedCloneTask("");
    setValidationMessage("");
  };
  // Handling the add of a new ranking decision
  const handleAddTask = () => {
    setValidationMessage("");
    if (!decisionName.trim()) {
      setValidationMessage("Task Name is required.");
      return;
    }
    const isDuplicate = rankingDecisions.some(
      (decision) => decision.name.toLowerCase() === decisionName.toLowerCase()
    );
    if (isDuplicate) {
      setValidationMessage("Task Name already exists.");
      return;
    }
    const newDecision = {
      name: decisionName,
      status: "Draft",
      ...(clone && { baseDecisionId: selectedCloneDecision }), // Clone logic
    };
    setTasks([...rankingDecisions, newDecision]);
    setMessage("Task successfully added.");
    setMessageType("success");
    setShowTaskModal(false);
  };
  const handleCloseDeleteTaskModal = () => {
    setShowTaskModal(false);
    setValidationMessage("");
  };

  // Handlers to open/close modals for deleting Decision
  const handleOpenDeleteModal = (DecisionId) => {
    // Tìm nhóm theo ID để kiểm tra tên
    const selectedGroup = DecisionId.find(
      (group) => group.groupId === DecisionId
    );
    // Nếu nhóm có tên là "Trainer", hiển thị thông báo và không mở modal
    if (selectedGroup && selectedGroup.groupName === "Trainer") {
      setMessageType("warning");
      setMessage("Cannot delete the 'Trainer' group.");
      setTimeout(() => setMessage(null), 2000);
      return;
    }
    // Nếu không phải "Trainer", mở modal xóa
    setDecisionToDelete(DecisionId);
    setShowDeleteModal(true);
  };

  // Columns configuration for the DataGrid
  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "name", headerName: "Task Name", width: 400 },
    { field: "finalizedAt", headerName: "Finalized At", width: 200 },
    { field: "finalizedBy", headerName: "Finalized By", width: 180 },
    { field: "status", headerName: "Status", width: 159 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            onClick={() => {
              console.log(
                `Navigating to edit decision with ID: ${params.row.id}`
              );
              navigate(`/ranking-decision/edit/${params.row.id}`);
            }}
          >
            <FaEdit />
          </Button>

          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleOpenDeleteModal(params.row.id)}
          >
            <MdDeleteForever />
          </Button>
        </>
      ),
    },
  ];
  const rows = tasks
    ? tasks.map((item, index) => ({
        id: item.task_id,
        id: index + 1,
        name: item.task_name,
        finalizedAt: item.finalizedAt < 1 ? "N/A" : decision.numEmployees,
        currentRankingDecision:
          decision.currentRankingDecision == null
            ? "N/A"
            : decision.currentRankingDecision,
      }))
    : [];

  return (
    <div style={{ marginTop: "60px" }}>
      <Slider />
      <Box sx={{ marginTop: 4, padding: 2 }}>
        <Typography variant="h6">
          <a href="/ranking_decision">Ranking Decision List</a> {">"} Task
          Management
        </Typography>

        {/*Add new Task */}
        <Box
          sx={{
            marginTop: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <Typography variant="h5">Task List</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenAddTaskModal}
          >
            Add New Task
          </Button>
        </Box>

        <Box sx={{ width: "100%" }}>
          <DataGrid
            className="custom-data-grid"
            apiRef={apiRef} //
            rows={rows}
            columns={columns}
            checkboxSelection
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
          />
        </Box>

        {/* Modal for editing group info */}
        <Modal open={showAddModal} onClose={handleCloseEditGroupInfoModal}>
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
            <Typography variant="h6">Edit Group Info</Typography>
            <TextField
              label="Group Name"
              variant="outlined"
              fullWidth
              value={newGroupName}
              onChange={(e) => {
                setNewGroupName(e.target.value);
                setValidationMessage("");
              }}
              error={!!validationMessage}
              helperText={validationMessage}
              sx={{ marginTop: 2 }}
            />
            <FormControl fullWidth sx={{ marginTop: 2 }}>
              <InputLabel>Current Ranking Decision</InputLabel>
              <Select
                value={selectedDecision}
                onChange={(e) => setSelectedDecision(e.target.value)}
                label="Current Ranking Decision"
              >
                {rankingDecisions.map((decision) => (
                  <MenuItem key={decision.id} value={decision.name}>
                    {decision.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box
              sx={{
                marginTop: 2,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button
                variant="outlined"
                onClick={handleCloseEditGroupInfoModal}
              >
                Cancel
              </Button>
              <Button variant="contained" onClick={handleEditGroup}>
                Save
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Modal for adding new Task */}
        <Modal open={showDecisionModal} onClose={handleCloseDeleteTaskModal}>
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
            <Typography variant="h6">Add New Ranking Decision</Typography>
            <TextField
              label="Decision Name"
              variant="outlined"
              fullWidth
              value={decisionName}
              onChange={(e) => setTaskName(e.target.value)}
              error={!!validationMessage}
              helperText={validationMessage}
              sx={{ marginTop: 2 }}
            />
            <FormControlLabel
              control={
                <Switch checked={clone} onChange={() => setClone(!clone)} />
              }
              label="Clone from other decision"
            />
            {clone && (
              <FormControl fullWidth sx={{ marginTop: 2 }}>
                <InputLabel>Choose Decision</InputLabel>
                <Select
                  value={selectedCloneDecision}
                  onChange={(e) => setSelectedCloneTask(e.target.value)}
                  label="Clone Decision"
                >
                  {rankingDecisions.map((decision) => (
                    <MenuItem key={decision.id} value={decision.id}>
                      {decision.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <Box
              sx={{
                marginTop: 2,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button variant="outlined" onClick={handleCloseDeleteTaskModal}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleAddTask}>
                Save
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Displaying messages */}
        {message && (
          <Alert severity={messageType} sx={{ marginTop: 2 }}>
            {message}
          </Alert>
        )}
      </Box>
    </div>
  );
};

export default TaskManagement;
