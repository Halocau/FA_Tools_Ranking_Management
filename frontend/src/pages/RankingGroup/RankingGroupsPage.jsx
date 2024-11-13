import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import "../../assets/css/RankingGroups.css";
// Mui
import {
  Box,
  Button,
  Typography,
  TextField,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import Autocomplete from "@mui/material/Autocomplete";
import ClearIcon from "@mui/icons-material/Clear";
// Source code
//Common
import ModalCustom from "../../components/Common/Modal.jsx";
import ActionButtons from "../../components/Common/ActionButtons.jsx";
// Hooks
import useRankingGroup from "../../hooks/useRankingGroup.jsx";
import Slider from "../../layouts/Slider.jsx";
// acountID
import { useAuth } from "../../contexts/AuthContext.jsx";
// Import hook Notification
import useNotification from "../../hooks/useNotification";

const RankingGroups = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook to navigate between pages in the application
  // State
  //Add
  const [showAddModal, setShowAddModal] = useState(false); // State to determine whether the add group modal is visible or not
  const [newGroupName, setNewGroupName] = useState(""); // State to store the new group name that the user enters
  // Delete
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State to determine whether the delete group modal is displayed or not
  const [groupToDelete, setGroupToDelete] = useState(null); // State to save the ID of the group to be deleted
  // delete select
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  // Search Decision
  const [rows, setRows] = useState([]); // Initialize with empty array
  const [filteredRows, setFilteredRows] = useState([]); // Initialize with empty array
  const [searchValue, setSearchValue] = useState(""); // State to store search value
  // Use hook notification
  const [showSuccessMessage, showErrorMessage] = useNotification();
  // Validation error message
  const [validationMessage, setValidationMessage] = useState("");
<<<<<<< HEAD
  //Paging

  const apiRef = useGridApiRef();
=======
  //
  const apiRef = useGridApiRef(); // Create apiRef to select multiple groups to delete
  // Table page, size 
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

>>>>>>> quatbt
  // Destructuring from useRankingGroup custom hook
  const {
    data: groups,
    error,
    loading,
<<<<<<< HEAD
    page,
    size,
    filter,
    total,
    setTotal,
    setPage,
    setSize,
    setFilter,
=======
    fetchRankingGroups,
>>>>>>> quatbt
    fetchAllRankingGroups,
    deleteRankingGroup,
    addRankingGroup,
  } = useRankingGroup();

<<<<<<< HEAD
=======
  // Fetch all ranking groups when component mounts
  useEffect(() => {
    fetchAllRankingGroups();
  }, []);

  // Gọi API lần đầu khi component mount
  useEffect(() => {
    fetchRankingGroups(page, pageSize);
  }, [page, pageSize]);

>>>>>>> quatbt
  // Log state changes for debugging purposes
  useEffect(() => {
    console.log("Groups:", groups);
    console.log("Loading:", loading);
    console.log("Error:", error);
  }, [groups, loading, error]);

  // Fetch groups for the current page and page size
  useEffect(() => {
    fetchAllRankingGroups(page, size);
  }, [page, size]);

  // Modal Add
  const handleOpenAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewGroupName("");
    setValidationMessage("");
  };
  // Function to add a new group with validation checks
  const handleAddRankingGroup = async () => {
    setValidationMessage("");
    let trimmedName = newGroupName.trim();
    // Validate group name length and character requirements
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
    // Capitalize the first letter of each word in the group name
    trimmedName = trimmedName.replace(/\b\w/g, (char) => char.toUpperCase());
    // Check for duplicate group name
    const isDuplicate = groups.some(
      (group) => group.groupName.toLowerCase() === trimmedName.toLowerCase()
    );
    if (isDuplicate) {
      setValidationMessage("Group name already exists.");
      return;
    }

    try {
      const newGroup = {
        groupName: trimmedName,
        createdBy: localStorage.getItem("userId"),
      };
      await addRankingGroup(newGroup);
      showSuccessMessage("Ranking Group successfully added.");
      handleCloseAddModal();
      await fetchAllRankingGroups();
    } catch (error) {
      console.error("Failed to add group:", error);
      showErrorMessage("Error occurred adding Ranking Group. Please try again");
    }
  };

  // Modal Delete
  const handleOpenDeleteModal = (groupId) => {
    // Find groups by ID to check names
    const selectedGroup = groups.result.find(
      (group) => group.groupId === groupId
    );
    // If the group is named "Trainer", show a notification and do not open the modal
    if (selectedGroup && selectedGroup.groupName === "Trainer") {
      showErrorMessage("Cannot delete the 'Trainer' group.");
      return;
    }
    // If not "Trainer", open the delete modal
    setGroupToDelete(groupId);
    setShowDeleteModal(true);
  };
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  // Function to delete a group
  const handleDeleteRankingGroup = async () => {
    try {
      if (groupToDelete) {
        await deleteRankingGroup(groupToDelete); // Call API to delete group
        showSuccessMessage("Ranking Group successfully removed.");
        setGroupToDelete(null);
        handleCloseDeleteModal();
        await fetchAllRankingGroups();
      }
    } catch (error) {
      console.error("Failed to delete group:", error);
      showErrorMessage(
        "Error occurred removing Ranking Group. Please try again."
      );
      handleCloseDeleteModal();
    }
  };
  // Bulk Delete Ranking Group
  const handleOpenBulkDeleteModal = () => setShowBulkDeleteModal(true);
  const handleCloseBulkDeleteModal = () => setShowBulkDeleteModal(false);

  const handleBulkDeleteRankingGroup = async () => {
    const selectedIDs = Array.from(apiRef.current.getSelectedRows().keys());
    if (selectedIDs.length === 0) {
      showErrorMessage("Please select groups to delete.");
      return;
    }
    const groupsToDelete = selectedIDs.filter((id) => {
      const group = groups.find((row) => row.groupId === id);
      return group && group.groupName !== "Trainer";
    });
    if (groupsToDelete.length === 0) {
      showErrorMessage("Cannot delete the 'Trainer' group.");
      return;
    }
    try {
      await Promise.all(groupsToDelete.map((id) => deleteRankingGroup(id)));
      showSuccessMessage("Selected groups deleted successfully!");
      await fetchAllRankingGroups();
      handleCloseBulkDeleteModal();
    } catch (error) {
      console.error("Failed to delete selected groups:", error);
      showErrorMessage("Failed to delete selected groups. Please try again.");
      handleCloseBulkDeleteModal();
    }
  };

  //
  const handleFilter = (event) => {
    setFilter(event.target.value);
    setPage(0); // Reset
  };

  // Define columns for DataGrid
  const columns = [
    { field: "index", headerName: "ID", width: 70 },
    { field: "groupName", headerName: "Group Name", width: 230 },
    { field: "numEmployees", headerName: "No. of Employees", width: 230 },
    {
      field: "currentRankingDecision",
      headerName: "Current Ranking Decision",
      width: 350,
    },
    {
      field: "action",
      headerName: "Action",
      width: 300,
      renderCell: (params) => (
        <>
          {/* View */}
          <Button
            variant="outlined"
            color="gray"
            // size="small"
            onClick={() => {
              console.log(`Navigating to view group with ID: ${params.row.id}`);
              navigate(`/ranking-group/view/${params.row.id}`);
            }}
          >
            <FaEye />
          </Button>
          {/* Edit */}
          <Button
            variant="outlined"
            // size="small"
            sx={{ marginLeft: 1 }}
            onClick={() => {
              console.log(`Navigating to edit group with ID: ${params.row.id}`);
              navigate(`/ranking-group/edit/${params.row.id}`);
            }}
          >
            <FaEdit />
          </Button>
          {/* Delete */}
          <Button
            variant="outlined"
            color="error"
            // size="small"
            sx={{ marginLeft: 1 }}
            onClick={() => handleOpenDeleteModal(params.row.id)}
          >
            <MdDeleteForever />
          </Button>
          {/* Bulk Ranking History */}
          <Button
            variant="outlined"
            // size="small"
            sx={{ marginLeft: 1 }}
            onClick={() => {
              console.log(`Navigating to bulk group with ID: ${params.row.id}`);
              navigate(`/ranking-group/bulk/${params.row.id}`);
            }}
          >
            <FaHistory />
          </Button>
        </>
      ),
    },
  ];

  useEffect(() => {
    if (groups) {
      const mappedRows = groups.result.map((group, index) => ({
        id: group.groupId,
        index: index + 1 + page * size,
        groupName: group.groupName,
        numEmployees: group.numEmployees < 1 ? "0" : group.numEmployees,
        currentRankingDecision:
          group.currentRankingDecision == null
            ? "No decision applies"
            : group.currentRankingDecision,
      }));
      setRows(mappedRows);
      setFilteredRows(mappedRows);
    }
  }, [groups, page, size]);

  console.log(groups);

  //Search
  const handleInputChange = (event, value) => {
    setSearchValue(value);
    const filtered = value
      ? filteredRows.filter((row) =>
          row.groupName.toLowerCase().includes(value.toLowerCase())
        )
      : rows; // If no value, use original rows
    setFilteredRows(filtered);
  };

  return (
    <div style={{ marginTop: "60px" }}>
      <Slider />
      <div>
<<<<<<< HEAD
        <h2>Ranking Group List</h2>
        <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
          <Typography sx={{ marginRight: 2, fontSize: "1.3rem", marginTop: 0 }}>
            Search Group Name:
          </Typography>
=======
        <h2>
          Ranking Group List
        </h2>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 1 }}>
          {/* <Typography sx={{ marginRight: 2, fontSize: '1.3rem', marginTop: 0 }}>Search Group Name:</Typography> */}
>>>>>>> quatbt
          <Autocomplete
            disablePortal
            options={rows}
            getOptionLabel={(option) => option.groupName || ""}
            onInputChange={handleInputChange}
            value={{ groupName: searchValue }} // Giữ nguyên nếu bạn cần
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Group"
                variant="outlined"
                fullWidth
<<<<<<< HEAD
                InputLabelProps={{
                  shrink: true,
                  sx: {
                    fontSize: "1rem",
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": { height: "30px" },
                  marginTop: 1,
                }}
                InputProps={{
=======
                // InputLabelProps={{ shrink: true, sx: { fontSize: '1rem', display: 'flex', alignItems: 'center', height: '100%' } }}
                sx={{
                  marginTop: 2,
                  height: '40px',
                  '& .MuiInputBase-root': { height: '130%', borderRadius: '20px' },
                }} InputProps={{
>>>>>>> quatbt
                  ...params.InputProps,
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      sx={{ marginRight: "-50px" }}
                    >
                      <IconButton
                        onClick={() => {
                          setFilteredRows(rows);
                          setSearchValue("");
                          params.inputProps.onChange({ target: { value: "" } });
                        }}
                        size="small"
                        sx={{ padding: "0" }}
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
<<<<<<< HEAD
            sx={{ flexGrow: 1, marginRight: "16px", maxWidth: "500px" }}
          />
        </Box>
        {/* Table show Ranking Group */}
        <Box sx={{ width: "100%", height: 370, marginTop: "20px" }}>
          {loading ? (
            <CircularProgress />
          ) : (
=======
            sx={{
              flexGrow: 1,
              marginRight: '16px',
              maxWidth: '600px',
              marginTop: '-10px',
              borderRadius: '20px' // Bo tròn góc cho Autocomplete
            }}
          />
        </Box>
        <Box sx={{ width: "100%", height: 370, marginTop: '60px' }}>
          {loading ? <CircularProgress /> : (
>>>>>>> quatbt
            <DataGrid
              className="custom-data-grid"
              apiRef={apiRef}
              rows={filteredRows}
              columns={columns}
              pagination
<<<<<<< HEAD
              pageSize={size}
              onPageChange={(newPage) => setPage(newPage)}
              onPageSizeChange={(newSize) => setSize(newSize)}
              paginationMode="server"
              rowCount={rows.length} // Use the total count from API response
              loading={loading}
              checkboxSelection
=======
              pageSizeOptions={[5, 10, 25]}
              pageSize={pageSize}
              page={page}
              onPageChange={(newPage) => {
                setPage(newPage);
                // Gọi hàm API mới với `newPage` và `pageSize` hiện tại
                fetchRankingGroups(newPage, pageSize);
              }}
              onPageSizeChange={(newPageSize) => {
                setPageSize(newPageSize);
                setPage(0); // Reset lại `page` khi thay đổi `pageSize`
                // Gọi hàm API mới với `page` là 0 và `newPageSize`
                fetchRankingGroups(0, newPageSize);
              }}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                    page: 0,
                  },
                },
              }}
>>>>>>> quatbt
              disableRowSelectionOnClick
              sx={{
                height: "100%",
                overflow: "auto",
                "& .MuiDataGrid-virtualScroller": {
                  overflowY: "auto",
                },
              }}
            />
          )}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleOpenAddModal}
          >
            Add New Group
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleOpenBulkDeleteModal}
            sx={{ ml: 2 }}
          >
            Delete Selected Groups
          </Button>
        </Box>
        {/* Modal for adding a new group */}
        <ModalCustom
          show={showAddModal}
          handleClose={handleCloseAddModal}
          title="Add New Group"
          bodyContent={
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
            />
          }
          footerContent={
            <ActionButtons
              onCancel={handleCloseAddModal}
              onConfirm={handleAddRankingGroup}
              confirmText="Add"
              cancelText="Cancel"
              color="success"
            />
          }
        />
        {/* Modal for deleting a group */}
        <ModalCustom
          show={showDeleteModal}
          handleClose={handleCloseDeleteModal}
          title="Delete Group"
          bodyContent="Are you sure you want to delete this group?"
          footerContent={
            <ActionButtons
              onCancel={handleCloseDeleteModal}
              onConfirm={handleDeleteRankingGroup}
              confirmText="Delete"
              cancelText="Cancel"
              color="error"
            />
          }
        />
        {/* Modal for deleting select group */}
        <ModalCustom
          show={showBulkDeleteModal}
          handleClose={handleCloseBulkDeleteModal}
          title="Delete Selected Groups"
          bodyContent="Are you sure you want to delete the selected groups?"
          footerContent={
            <ActionButtons
              onCancel={handleCloseDeleteModal}
              onConfirm={handleBulkDeleteRankingGroup}
              confirmText="Delete"
              cancelText="Cancel"
              color="error"
            />
          }
        />
      </div>
    </div>
  );
};

export default RankingGroups;
