import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Alert, CircularProgress, Typography } from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import ModalCustom from "../../components/Common/Modal.jsx";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import Slider from "../../layouts/Slider.jsx";
import Box from "@mui/material/Box";
import useTask from "../../hooks/useTask.jsx";


const TaskManagement = () => {
  const navigate = useNavigate();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [groupToDelete, setGroupToDelete] = useState(null); // State để lưu ID của nhóm sẽ bị xóa
  const [message, setMessage] = useState(""); // State để lưu thông điệp thông báo cho người dùng
  const [messageType, setMessageType] = useState("success"); // State để xác định kiểu thông điệp (thành công hoặc lỗi)
  const [validationMessage, setValidationMessage] = useState(""); // State để lưu thông điệp xác thực cho người dùng
  const apiRef = useGridApiRef(); // Tạo apiRef để chọn nhiều group để xóa

  // Destructuring from useRankingGroup custom hook
  const {
    data: tasks,
    error,
    loading,
    fetchAllTasks,
    addTask,
    deleteTask,
  } = useTask();

  // Fetch all ranking groups
  useEffect(() => {
    fetchAllTasks();
  }, []);

  // Log state changes for debugging purposes
  useEffect(() => {
    console.log("Task:", tasks);
    console.log("Loading:", loading);
    console.log("Error:", error);
  }, [tasks, loading, error]);

  // Modal Add
  const handleOpenAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewTaskName("");
    setValidationMessage("");
  };
  // Function to add a new group with validation checks
  const handleAddTask = async () => {
    setValidationMessage("");
    let trimmedName = newTaskName.trim();

    // Validate group name length and character requirements
    if (!trimmedName) {
      setValidationMessage("Task name cannot be empty !");
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

    // Capitalize the first letter of each word in the group name
    trimmedName = trimmedName.replace(/\b\w/g, (char) => char.toUpperCase());
    // Check for duplicate group name
    const isDuplicate = groups.some(
      (group) => group.groupName.toLowerCase() === trimmedName.toLowerCase()
    );
    if (isDuplicate) {
      setValidationMessage("Task name already exists !");
      return;
    }

    try {
      const newTask = {
        taskName: trimmedName,
        createdBy: 1, // Assuming 1 is the ID of the user creating the list task
      };
      await addTask(newTask); // Call API to add
      setMessageType("success");
      setMessage("Task added successfully!");
      setTimeout(() => setMessage(null), 2000);
      handleCloseAddModal();
      await fetchAllTasks();
    } catch (error) {
      console.error("Failed to add Task:", error);
      setMessageType("danger");
      setMessage("Failed to add task. Please try again !");
      setTimeout(() => setMessage(null), 2000);
    }
  };

  // Modal Delete
  const handleOpenDeleteModal = (taskId) => {
    const selectedTask = tasks.find((t) => t.taskId === taskId);
    if (selectedTask && selectedTask.taskName === "") {
      setMessageType("warning");
      setMessage("Cannot delete the '' group.");
      setTimeout(() => setMessage(null), 2000);
      return;
    }
    // If not "Trainer", open the delete modal
    setGroupToDelete(taskId);
    setShowDeleteModal(true);
  };
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  // Function to delete a task
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


  // Columns configuration for the DataGrid
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
            onClick={() => {
              console.log(
                `Navigating to edit decision with ID: ${params.row.id}`
              );
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

  const rows = tasks
    ? tasks.map((item, index) => ({
        id: item.taskId,
        index: index + 1,
        taskName: item.taskName,
        createdBy: item.createdBy < 1 ? "N/A" : item.createdBy,
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

        <DataGrid
          className="custom-data-grid"
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

        {/*Add new Task */}

        {/* Modal for editing group info */}

        {/* Modal for adding new Task */}

        {/* Displaying messages */}
      </Box>
    </div>
  );
};

export default TaskManagement;
