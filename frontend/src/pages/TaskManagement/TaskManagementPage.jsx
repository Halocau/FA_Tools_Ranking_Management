//React
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { FaEdit, FaAngleRight } from "react-icons/fa";
// Mui
import { MdDeleteForever } from "react-icons/md";
import { Button, TextField, Typography } from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
// Source Code
import ModalCustom from "../../components/Common/Modal.jsx";
// acountID
import Slider from "../../layouts/Slider.jsx";
import Box from "@mui/material/Box";

// Import hook Notification
import useNotification from "../../hooks/useNotification";
import taskApi from "../../api/TaskAPI.js";

const TaskManagement = () => {
  const navigate = useNavigate();
  //Add
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  //Delete
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  //Edit
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTaskName, setEditTaskName] = useState("");
  //Delete many
  const [selectedTask, setSelectedTask] = useState(null); // State to store selected task for editing
  const [groupToDelete, setGroupToDelete] = useState(null);
  // Use hook notification
  const [showSuccessMessage, showErrorMessage] = useNotification();
  //Validation error mesage
  const [validationMessage, setValidationMessage] = useState("");
  //Select many delete
  const apiRef = useGridApiRef();
  // Paging data
  const [task, setTask] = useState([]);
  const [pageSize, setpageSize] = useState(5);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  // Search
  const [rows, setRows] = useState([]); // Initialize with empty array
  const [filteredRows, setFilteredRows] = useState([]); // Initialize with empty array
  const [searchValue, setSearchValue] = useState("");

  //Get props from useTask

  const fetchAllTask = async () => {
    try {
      const data = await taskApi.searchByTaskName(filter, page, pageSize);
      setTask(data.result);
      setTotalPages(data.pageInfo.total);
      setTotalElements(data.pageInfo.element);
    } catch (error) {
      console.error("Failed to fetch criteria:", error);
    }
  };

  // Fetch all tasks when component mounts
  useEffect(() => {
    fetchAllTask();
  }, [page, pageSize, filter]);

  // Map decision data to rows for DataGrid when rows are fetched
  useEffect(() => {
    if (task) {
      const mappedRows = task.map((item, index) => ({
        id: item.taskId,
        index: index + 1 + (page - 1) * pageSize,
        taskName: item.taskName,
        createdBy: item.createdByName || "Unknown",
        createdAt: item.createdAt ? formatDate(item.createdAt) : "N/A",
        updatedAt: item.updatedAt ? formatDate(item.updatedAt) : "N/A",
      }));
      setRows(mappedRows);
      setFilteredRows(mappedRows);
    }
  }, [task]);

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
    const nameRegex = /^[a-zA-Z0-9 ]+$/;
    if (!nameRegex.test(trimmedName)) {
      setValidationMessage(
        "Task name can only contain letters, numbers, and spaces."
      );
      return;
    }
    trimmedName = trimmedName.replace(/\b\w/g, (char) => char.toUpperCase());
    const isDuplicate = task.some(
      (task) => task.taskName.toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      setValidationMessage("Task name already exists !");
      return;
    }

    try {
      const newTask = {
        taskName: trimmedName,
        createdBy: localStorage.getItem("userId"),
      };
      await taskApi.createTask(newTask);
      handleCloseAddModal();
      setTotalElements(totalElements + 1);
      if (task.length < pageSize) {
        fetchAllTask();
      } else {
        setTotalPages(totalPages + 1);
      }
      showSuccessMessage("Task successfully added.");
    } catch (error) {
      console.error("Failed to add Task:", error);
      if (error.response && error.response.data) {
        const detailMessage = error.response.data.detailMessage;
        if (
          detailMessage &&
          detailMessage.includes("Task name exists already!")
        ) {
          setValidationMessage("Task name exists already!");
          showErrorMessage("Error occurred adding Task. Please try again !");
        }
      } else {
        showErrorMessage("Error occurred adding Task. Please try again !");
      }
    }
  };

  // Modal Delete
  const handleOpenDeleteModal = (taskId) => {
    const selectedTask = task.find((task) => task.taskId === taskId);
    if (selectedTask && selectedTask.taskName === "") {
      showErrorMessage("Cannot delete the group.");
      return;
    }
    setTaskToDelete(taskId);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  //Delete Task
  const handleDeleteTask = async () => {
    try {
      if (taskToDelete) {
        await taskApi.deleteTaskById(taskToDelete);
        setTask(task.filter((item) => item.taskId !== taskToDelete));
        if (task.length === 5) {
          fetchAllTask();
        }
        if (task.length === 1) {
          setPage(page - 1);
        }
      }
      setTotalElements(totalElements - 1);
      showSuccessMessage("Task successfully removed.");
      setTaskToDelete(null);
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Failed to delete group:", error);
      showErrorMessage(
        "Error occurred removing Ranking Group. Please try again."
      );
      handleCloseDeleteModal();
    }
  };

  // Delete many task
  const handleOpenBulkDeleteModal = () => setShowBulkDeleteModal(true);
  const handleCloseBulkDeleteModal = () => setShowBulkDeleteModal(false); //close

  // Delete many tasks
  const handleDeleteManyTask = async () => {
    const selectedIDs = Array.from(apiRef.current.getSelectedRows().keys());
    if (selectedIDs.length === 0) {
      showErrorMessage("Please select tasks to delete.");
      return;
    }
    try {
      await Promise.all(selectedIDs.map((id) => taskApi.deleteTaskById(id)));
      showSuccessMessage("Selected tasks deleted successfully!");
      setTask((prevTasks) =>
        prevTasks.filter((task) => !selectedIDs.includes(task.taskId))
      );
      if (task.length <= pageSize) {
        fetchAllTask();
      }
      if (task.length === 1) {
        setPage(page - 1);
      }
      handleCloseBulkDeleteModal();
    } catch (error) {
      console.error("Failed to delete selected tasks:", error);
      handleCloseBulkDeleteModal();
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
    const existingTasks = await fetchAllTask();
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

  return (
    <div style={{ marginTop: "60px" }}>
      <Slider />
      <Box sx={{ marginTop: 4, padding: 2 }}>
        <Typography variant="h6">
          <a href="/ranking_decision">Ranking Decision List</a>{" "}
          {<FaAngleRight />}
          Task Management
        </Typography>
        <DataGrid
          className="custom-data-grid"
          apiRef={apiRef}
          rows={rows}
          columns={columns}
          checkboxSelection
          pagination
          pageSizeOptions={[5, 10, 20]}
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
            onClick={handleDeleteManyTask}
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
