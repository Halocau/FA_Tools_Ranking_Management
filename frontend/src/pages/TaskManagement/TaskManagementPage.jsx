import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Alert,
  CircularProgress,
  Typography,
} from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import ModalCustom from "../../components/Common/Modal.jsx";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import Slider from "../../layouts/Slider.jsx";
import Box from "@mui/material/Box";
import useTaskManagement from "../../hooks/useTaskManagement.jsx";
import { format } from "date-fns";
// acountID
import { useAuth } from "../../contexts/AuthContext";

const TaskManagement = () => {
  const navigate = useNavigate();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // State for Edit Modal
  const [newTaskName, setNewTaskName] = useState("");
  const [editTaskName, setEditTaskName] = useState(""); // State for edited task name
  const [selectedTask, setSelectedTask] = useState(null); // State to store selected task for editing
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [validationMessage, setValidationMessage] = useState("");
  const apiRef = useGridApiRef();

  const {
    data: tasks,
    error,
    loading,
    fetchAllTasks,
    addTask,
    deleteTask,
    updateTask, // Assuming you have an updateTask function in your useTask hook
  } = useTaskManagement();

  useEffect(() => {
    fetchAllTasks();
  }, []);

  // Modal Add
  const handleOpenAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewTaskName("");
    setValidationMessage("");
  };

  const handleAddTask = async () => {
    setValidationMessage("");
    let trimmedName = newTaskName.trim();

    if (!trimmedName) {
      setValidationMessage("Task name cannot be empty!");
      return;
    }

    if (trimmedName.length < 3 || trimmedName.length > 20) {
      setValidationMessage("Task name must be between 3 and 20 characters.");
      return;
    }

    // Capitalize the first letter of the task name
    trimmedName = trimmedName.charAt(0).toUpperCase() + trimmedName.slice(1);

    // Adjusted nameRegex to allow letters (including Vietnamese diacritics), numbers, and spaces
    const nameRegex = /^[\p{L}\p{N}\s.,!?"'()-]+$/u;
    if (!nameRegex.test(trimmedName)) {
      setValidationMessage(
        "Task name can only contain letters, numbers, spaces, and certain punctuation marks."
      );
      return;
    }

    const isDuplicate = tasks.some(
      (task) => task.taskName.toLowerCase() === trimmedName.toLowerCase()
    );
    if (isDuplicate) {
      setValidationMessage("Task name already exists!");
      return;
    }

    try {
      const newTask = {
        taskName: trimmedName,
        createdBy: localStorage.getItem("userId"),
      };
      await addTask(newTask);
      setMessageType("success");
      setMessage("Task successfully added !");
      setTimeout(() => setMessage(null), 2000);
      handleCloseAddModal();
      await fetchAllTasks();
    } catch (error) {
      console.error("Failed to add Task:", error);
      setMessageType("danger");
      setMessage("Error occurred adding new Task. Please try again !");
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
      setMessage("Task successfully updated !");
      setTimeout(() => setMessage(null), 2000);
      handleCloseEditModal();
    } catch (error) {
      console.error("Failed to update task:", error);
      setMessageType("danger");
      setMessage("Error occurred updating Task. Please try again !");
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
        setMessage("Task successfully deleted !");
        setTimeout(() => setMessage(null), 2000);
        setGroupToDelete(null);
        handleCloseDeleteModal();
        await fetchAllTasks();
      }
    } catch (error) {
      console.error("Failed to delete Task:", error);
      setMessageType("danger");
      setMessage("Error occurred removing Task. Please try again !");
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

  //Format Data
  const formatDate = (dateString) => {
    return dateString ? format(new Date(dateString), "dd/MM/yyyy ") : "N/A";
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
            // size="small"
            onClick={() => handleOpenEditModal(params.row)}
          >
            <FaEdit />
          </Button>
          <Button
            variant="outlined"
            color="error"
            // size="small"
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
        createdBy: item.createdByName || "Unknown",
        createdAt: item.createdAt ? formatDate(item.createdAt) : "N/A",
        updatedAt: item.updatedAt ? formatDate(item.updatedAt) : "N/A",
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
          }
        />

        {/* Delete Task Modal */}
        <ModalCustom
          show={showDeleteModal}
          handleClose={handleCloseDeleteModal}
          title="Confirm Delete"
          bodyContent="Are you sure you want to delete this task?"
          footerContent={
            <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
              <Button variant="outlined" onClick={handleCloseDeleteModal}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteTask}
                sx={{ ml: 2 }}
              >
                Delete
              </Button>
            </Box>
          }
        />
      </Box>
    </div>
  );
};

export default TaskManagement;
