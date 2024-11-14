//React
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { VscTriangleRight } from "react-icons/vsc";
import { format } from "date-fns";
import { FaEdit, FaAngleRight } from "react-icons/fa";
// Mui
import { MdDeleteForever } from "react-icons/md";
import {
  Button,
  TextField,
  Alert,
  CircularProgress,
  Typography,
} from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
// Source Code
import ModalCustom from "../../components/Common/Modal.jsx";
import ActionButtons from "../../components/Common/ActionButtons.jsx";
// acountID
import { useAuth } from "../../contexts/AuthContext.jsx";
import Slider from "../../layouts/Slider.jsx";
import Box from "@mui/material/Box";
// Hooks
import useTask from "../../hooks/useTask.jsx";

// Import hook Notification
import useNotification from "../../hooks/useNotification";
import authClient from "../../api/baseapi/AuthorAPI.js";
import taskApi from "../../api/TaskAPI.js";

const TaskManagement = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // State for Edit Modal
  const [newTaskName, setNewTaskName] = useState("");
  const [editTaskName, setEditTaskName] = useState(""); // State for edited task name
  const [selectedTask, setSelectedTask] = useState(null); // State to store selected task for editing
  const [groupToDelete, setGroupToDelete] = useState(null);
  // Use hook notification
  const [showSuccessMessage, showErrorMessage] = useNotification();
  const [validationMessage, setValidationMessage] = useState("");
  // Paging
  const [task, setTask] = useState([]);
  const [pageSize, setpageSize] = useState(5);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const apiRef = useGridApiRef();

  const {
    data: tasks,
    error,
    loading,
    fetchAllTasks,
    addTask,
    deleteTask,
    updateTask,
    setError,
    setLoading,
  } = useTask();

  const getAllTask = async () => {
    try {
      const data = await taskApi.searchByTaskName(filter, page, pageSize);
      setTask(data.result);
      setTotalPages(data.pageInfo.total);
      setTotalElements(data.pageInfo.element);
    } catch (error) {
      console.error("Failed to fetch criteria:", error);
    }
  };

  useEffect(() => {
    getAllTask();
  }, [page, pageSize, filter]);

  // Modal Add
  const handleOpenAddModal = () => {
    setValidationMessage("");
    setShowAddModal(true);
  };
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewTaskName("");
    setValidationMessage("");
  };

  // Function to add a new task with validation checks
  const handleAddTask = async () => {
    setValidationMessage("");
    let trimmedName = newTaskName.trim();

    if (!trimmedName) {
      setValidationMessage("Task name cannot be empty !");
      return;
    }

    if (trimmedName.length < 3 || trimmedName.length > 20) {
      setValidationMessage("Task name must be between 3 and 20 characters.");
      return;
    }
    trimmedName = trimmedName.charAt(0).toUpperCase() + trimmedName.slice(1);
    // Kiểm tra xem tên đã tồn tại hay chưa
    const existingTasks = await fetchAllTasks();
    const isDuplicate = existingTasks.some(
      (task) => task.taskName.toLowerCase() === trimmedName.toLowerCase()
    );
    console.log("isDuplicate:", isDuplicate);

    if (isDuplicate) {
      setValidationMessage("Task name already exists !");
      return;
    }

    try {
      const newTask = {
        taskName: trimmedName,
        createdBy: localStorage.getItem("userId"),
      };
      await addTask(newTask);
      showSuccessMessage("Task added successfully!");
      handleCloseAddModal();
      await fetchAllTasks();
    } catch (error) {
      console.error("Failed to add Task:", error);
      showErrorMessage("Failed to add task. Please try again !");
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
    setValidationMessage("");
  };

  const handleUpdateTask = async () => {
    const trimmedName = editTaskName.trim();
    setValidationMessage("");
    if (!trimmedName) {
      setValidationMessage("Task name cannot be empty!");
      return;
    }

    if (trimmedName.length < 3 || trimmedName.length > 20) {
      setValidationMessage("Task name must be between 3 and 20 characters.");
      return;
    }

    // Kiểm tra xem tên nhiệm vụ đã tồn tại hay chưa, ngoại trừ nhiệm vụ đang được chỉnh sửa
    const existingTasks = await fetchAllTasks();
    const isDuplicate = existingTasks.some(
      (task) =>
        task.taskName.toLowerCase() === trimmedName.toLowerCase() &&
        task.id == selectedTask.id
    );

    if (isDuplicate) {
      setValidationMessage(
        "Task name already exists. Please choose another name."
      );
      return;
    }

    const updatedTask = {
      taskName: trimmedName,
      createdBy: localStorage.getItem("userId"),
    };

    try {
      await updateTask(selectedTask.id, updatedTask);
      showSuccessMessage("Task updated successfully!");
      handleCloseEditModal();
      await fetchAllTasks(); // Cập nhật lại danh sách nhiệm vụ
    } catch (error) {
      console.error("Failed to update Task:", error);
      showErrorMessage("Failed to update task. Please try again.");
    }
  };

  // Modal Delete
  const handleOpenDeleteModal = (taskId) => {
    setGroupToDelete(taskId);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  //Delete Task
  const handleDeleteTask = async () => {
    setLoading(true);
    try {
      if (groupToDelete) {
        await deleteTask(groupToDelete);
        showSuccessMessage("Task deleted successfully!");
        setGroupToDelete(null);
        handleCloseDeleteModal();
        await fetchAllTasks();
      }
    } catch (error) {
      console.error("Failed to delete Task:", error);
      showErrorMessage("Failed to delete Task. Please try again.");
      handleCloseDeleteModal();
    } finally {
      setLoading(false);
    }
  };

  // Delete many tasks
  const handleBulkDelete = async () => {
    const selectedIDs = Array.from(apiRef.current.getSelectedRows().keys());
    if (selectedIDs.length === 0) {
      showErrorMessage("Please select tasks to delete.");
      return;
    }

    const tasksToDelete = selectedIDs.filter((id) => {
      const group = rows.find((row) => row.id === id);
      return group && group.taskName.trim() !== ""; // Kiểm tra nếu tên nhiệm vụ không rỗng
    });

    if (tasksToDelete.length === 0) {
      showErrorMessage("Cannot delete the group.");
      return;
    }

    try {
      await Promise.all(tasksToDelete.map((id) => deleteTask(id)));
      showSuccessMessage("Selected tasks deleted successfully!");
      await fetchAllTasks();
    } catch (error) {
      console.error("Failed to delete selected tasks:", error);
      showErrorMessage("Failed to delete selected tasks. Please try again.");
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

  const rows = task
    ? task.map((item, index) => ({
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
          <a href="/ranking_decision">Ranking Decision List</a>{" "}
          {<FaAngleRight />}
          Task Management
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <DataGrid
            className="custom-data-grid"
            apiRef={apiRef}
            rows={rows}
            columns={columns}
            checkboxSelection
            pagination
            pageSizeOptions={[5, 10, 20]}
            loading={loading}
            getRowId={(row) => row.id}
            rowCount={totalElements}
            paginationMode="server"
            paginationModel={{
              page: page - 1, // Adjusted for 0-based index
              pageSize: pageSize,
            }}
            onPaginationModelChange={(model) => {
              setPage(model.page + 1); // Set 1-based page for backend
              setpageSize(model.pageSize);
            }}
            disableNextButton={page >= totalPages}
            disablePrevButton={page <= 1}
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
            <Box>
              <TextField
                label="Task Name"
                variant="outlined"
                fullWidth
                value={editTaskName}
                onChange={(e) => {
                  setEditTaskName(e.target.value);
                  setValidationMessage(""); // Xóa thông báo khi người dùng nhập tên mới
                }}
                error={!!validationMessage}
                helperText={validationMessage}
              />
            </Box>
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
