import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/TaskManagement.css";
import { Button, TextField, Alert, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ModalCustom from "../../components/Common/Modal.jsx";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import Slider from "../../layouts/Slider.jsx";
import Box from "@mui/material/Box";

const TaskManagement = () => {
  const navigate = useNavigate();

  // State for managing modal visibility and user input
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [validationMessage, setValidationMessage] = useState("");

  // Placeholder for task data (replace with actual data fetching in production)
  const [tasks, setTasks] = useState([
    { id: 1, taskName: "Sample Task 1" },
    { id: 2, taskName: "Sample Task 2" },
  ]);

  // Fetch all tasks when component mounts (simulate fetching from an API)
  useEffect(() => {
    // In a real application, replace this with API fetch logic
    console.log("Tasks loaded:", tasks);
  }, []);

  // Handlers to open/close modals for adding or deleting tasks
  const handleOpenAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewTaskName("");
    setValidationMessage("");
  };

  const handleOpenDeleteModal = (taskId) => {
    setTaskToDelete(taskId);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  // Function to add a new task with validation checks
  const handleAddTask = () => {
    setValidationMessage("");
    let trimmedName = newTaskName.trim();

    // Validate task name length and character requirements
    if (!trimmedName) {
      setValidationMessage("Task name cannot be empty.");
      return;
    }

    if (trimmedName.length < 3 || trimmedName.length > 20) {
      setValidationMessage("Task name must be between 3 and 20 characters.");
      return;
    }

    const nameRegex = /^[a-zA-Z0-9 ]+$/;
    if (!nameRegex.test(trimmedName)) {
      setValidationMessage(
        "Task name can only contain letters, numbers, and spaces."
      );
      return;
    }

    // Capitalize the first letter of each word in the task name
    trimmedName = trimmedName.replace(/\b\w/g, (char) => char.toUpperCase());

    // Check for duplicate task name
    const isDuplicate = tasks.some(
      (task) => task.taskName.toLowerCase() === trimmedName.toLowerCase()
    );
    if (isDuplicate) {
      setValidationMessage("Task name already exists.");
      return;
    }

    const newTask = { id: tasks.length + 1, taskName: trimmedName };
    setTasks([...tasks, newTask]);
    setMessageType("success");
    setMessage("Task added successfully!");
    setTimeout(() => setMessage(null), 2000);
    handleCloseAddModal(); // Close the add modal after successful addition
  };

  // Function to delete a selected task
  const handleDeleteTask = () => {
    setTasks(tasks.filter((task) => task.id !== taskToDelete));
    setMessageType("success");
    setMessage("Task deleted successfully!");
    setTimeout(() => setMessage(null), 2000);
    setTaskToDelete(null);
    handleCloseDeleteModal(); // Close the delete modal after successful deletion
  };

  // Function to delete multiple selected tasks
  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      setMessageType("warning");
      setMessage("Please select tasks to delete.");
      setTimeout(() => setMessage(null), 2000);
      return;
    }
    setTasks(tasks.filter((task) => !selectedRows.includes(task.id)));
    setMessageType("success");
    setMessage("Selected tasks deleted successfully!");
    setTimeout(() => setMessage(null), 2000);
    setSelectedRows([]); // Clear selected rows
  };

  // Define columns for DataGrid
  const columns = [
    { field: "index", headerName: "Index", width: 70 },
    { field: "taskName", headerName: "Task Name", width: 300 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            onClick={() => {
              console.log(`Navigating to edit task with ID: ${params.row.id}`);
              navigate(`/task/edit/${params.row.id}`);
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

  // Map task data to rows for DataGrid
  const rows = tasks.map((task, index) => ({
    id: task.id,
    index: index + 1,
    taskName: task.taskName,
  }));

  return (
    <div style={{ marginTop: "60px" }}>
      <Slider />
      <div>
      <Typography variant="h6">
          <a href="/ranking_group">Ranking Group List</a> / Task List
        </Typography>
        {message && <Alert severity={messageType}>{message}</Alert>}

        <Box sx={{ width: "100%" }}>
          <DataGrid
            className="custom-data-grid"
            rows={rows}
            columns={columns}
            checkboxSelection
            onSelectionModelChange={(newSelection) => {
              setSelectedRows(newSelection);
            }}
            selectionModel={selectedRows}
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

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleOpenAddModal}
          >
            Add New Task
          </Button>
          <Button variant="contained" color="error" onClick={handleBulkDelete}>
            Delete Selected Tasks
          </Button>
        </div>

        {/* Modal for adding a new task */}
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
            <>
              <Button variant="outlined" onClick={handleCloseAddModal}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleAddTask}
              >
                Add
              </Button>
            </>
          }
        />

        {/* Modal for deleting a task */}
        <ModalCustom
          show={showDeleteModal}
          handleClose={handleCloseDeleteModal}
          title="Delete Task"
          bodyContent="Are you sure you want to delete this task?"
          footerContent={
            <>
              <Button variant="outlined" onClick={handleCloseDeleteModal}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteTask}
              >
                Delete
              </Button>
            </>
          }
        />
      </div>
    </div>
  );
};

export default TaskManagement;
