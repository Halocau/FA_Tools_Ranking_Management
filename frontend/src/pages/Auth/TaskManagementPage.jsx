// Import các thư viện cần thiết từ React, Material-UI và các component khác
import React, { useEffect, useState } from "react";
import {
    Box, Button, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Modal, IconButton, Switch, FormControlLabel, Alert
} from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate, useParams } from "react-router-dom";
import Slider from "../../layouts/Slider.jsx";
import Box from "@mui/material/Box";
import useTask from "../../hooks/useTask.jsx";

const TaskManagement = () => {
    const navigate = useNavigate(); // Để điều hướng giữa các trang
    const { id } = useParams(); // Lấy tham số id từ URL
    const { fetchRankingGroupById, updateRankingGroup, fetchAllRankingGroups, data: group } = useRankingGroup(); // Các hàm từ hook để quản lý nhóm xếp hạng

    // State cho việc chỉnh sửa và hiển thị thông tin nhóm
    const [editGroup, setEditGroup] = useState({ groupName: '', currentRankingDecision: '' });
    const [originalGroupName, setOriginalGroupName] = useState('');
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
        data: groups,
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
            setValidationMessage("Group name can only contain letters, numbers, and spaces.");
            return;
        }
        // Check if the group name already exists
        const existingGroups = await fetchAllRankingGroups(); // Assuming this function fetches all groups
        const groupExists = existingGroups.some(group => group.groupName.toLowerCase() === trimmedName.toLowerCase());
        if (groupExists) {
            setValidationMessage("Group name already exists. Please choose a different name.");
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
                currentRankingDecision: selectedDecision || editGroup.currentRankingDecision,
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

  // Modal Edit
  const handleOpenEditModal = (task) => {
    setSelectedTask(task);
    setEditTaskName(task.taskName);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditTaskName("");
  };

  const handleUpdateTask = async () => {
    
    if (!selectedTask || !selectedTask.taskId) {
      console.error("No valid task selected for update.");
      return;
    }

    try {
      const updatedTask = { taskName: editTaskName.trim() };
      await updateTask(selectedTask.taskId, updatedTask); 
      setMessageType("success");
      setMessage("Task updated successfully!");
      setTimeout(() => setMessage(null), 2000);
      handleCloseEditModal();
    } catch (error) {
      console.error("Failed to update task:", error);
      setMessageType("danger");
      setMessage("Failed to update task. Please try again.");
      setTimeout(() => setMessage(null), 2000);
    }
  };

  // Modal Delete
  const handleOpenDeleteModal = (taskId) => {
    setGroupToDelete(taskId);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleDeleteTask = async () => {
    try {
      if (groupToDelete) {
        await deleteTask(groupToDelete);
        setMessageType("success");
        setMessage("Task deleted successfully!");
        setTimeout(() => setMessage(null), 2000);
        setGroupToDelete(null);
        handleCloseDeleteModal();
        await fetchAllTasks();
      }
    } catch (error) {
      console.error("Failed to delete Task:", error);
      setMessageType("danger");
      setMessage("Failed to delete Task. Please try again.");
      setTimeout(() => setMessage(null), 2000);
      handleCloseDeleteModal();
    }
  };

  const handleBulkDelete = async () => {
    const selectedIDs = Array.from(apiRef.current.getSelectedRows().keys());
    if (selectedIDs.length === 0) {
      setMessageType("warning");
      setMessage("Please select groups to delete.");
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    const groupsToDelete = selectedIDs.filter((id) => {
      const group = rows.find((row) => row.id === id);
      return group && group.taskName !== "";
    });
    if (groupsToDelete.length === 0) {
      setMessageType("warning");
      setMessage("Cannot delete the '' group.");
      setTimeout(() => setMessage(null), 2000);
      return;
    }
    try {
      await Promise.all(groupsToDelete.map((id) => deleteTask(id)));
      setMessageType("success");
      setMessage("Selected groups deleted successfully!");
      setTimeout(() => setMessage(null), 2000);
      await fetchAllTasks();
    } catch (error) {
      console.error("Failed to delete selected groups:", error);
      setMessageType("danger");
      setMessage("Failed to delete selected groups. Please try again.");
      setTimeout(() => setMessage(null), 2000);
    }
  };

  // Columns configuration
  const columns = [
    { field: "index", headerName: "ID", width: 80 },
    { field: "taskName", headerName: "Task Name", width: 400 },
    { field: "createdBy", headerName: "Created By", width: 200 },
    { field: "createdAt", headerName: "Created At", width: 180 },
    { field: "updatedAt", headerName: "Updated At", width: 159 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            onClick={() => handleOpenEditModal(params.row)}
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
        id: item.taskId,
        index: index + 1,
        taskName: item.taskName,
        createdBy: item.createdBy || "Unknown",
        createdAt: item.createdAt == null ? "N/A" : item.createdAt,
        updatedAt: item.updateAt == null ? "N/A" : item.updateAt,
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
        {message && <Alert severity={messageType}>{message}</Alert>}
        {loading ? (
          <CircularProgress />
        ) : (
          <DataGrid
            className="custom-data-grid"
            apiRef={apiRef}
            rows={rows}
            columns={columns}
            checkboxSelection
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5 },
              },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
          />
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleOpenAddModal}
          >
            Add New Task
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleBulkDelete}
            sx={{ ml: 2 }}
          >
            Delete Selected Tasks
          </Button>
        </Box>

        {/* Add Task Modal */}
        <ModalCustom
          show={showAddModal}
          handleClose={handleCloseAddModal}
          title="Add New Task"
          bodyContent={
            <TextField
              label="Task Name"
              variant="outlined"
              fullWidth
              value={newTaskName}
              onChange={(e) => {
                setNewTaskName(e.target.value);
                setValidationMessage("");
              }}
              error={!!validationMessage}
              helperText={validationMessage}
            />
          }
          footerContent={
            <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
              <Button variant="outlined" onClick={handleCloseAddModal}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleAddTask}
                sx={{ ml: 2 }}
              >
                Add
              </Button>
            </Box>
          }
        />

        {/* Edit Task Modal */}
        <ModalCustom
          show={showEditModal}
          handleClose={handleCloseEditModal}
          title="Edit Task"
          bodyContent={
            <TextField
              label="Task Name"
              variant="outlined"
              fullWidth
              value={editTaskName}
              onChange={(e) => setEditTaskName(e.target.value)}
            />
          }
          footerContent={
            <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
              <Button variant="outlined" onClick={handleCloseEditModal}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleUpdateTask}
                sx={{ ml: 2 }}
              >
                Save
              </Button>
            </Box>
            {/* Modal for deleting a Decision */}
            {/* <ModalCustom
                show={showDeleteModal}
                handleClose={handleCloseDeleteModal}
                title="Delete Decision"
                bodyContent="Are you sure you want to delete this Decision?"
                footerContent={
                    <>
                        <Button variant="outlined" onClick={handleCloseDeleteModal}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="error" onClick={handleDeleteDecision}>
                            Delete
                        </Button>
                    </>
                }
            /> */}
        </div>
    );
};

export default TaskManagement;
