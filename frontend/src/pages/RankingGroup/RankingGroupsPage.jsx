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
import rankingGroupApi from "../../api/rankingGroupAPI.js";

const RankingGroups = () => {
  const navigate = useNavigate();
  //Add
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  // Delete
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  // delete select
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  // Search Decision
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  // Use hook notification
  const [showSuccessMessage, showErrorMessage] = useNotification();
  // Validation error message
  const [validationMessage, setValidationMessage] = useState("");
  //paging
  const [pageSize, setpageSize] = useState(5);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [rows, setRows] = useState([]);
  //
  const [group, setGroup] = useState([]);
  const apiRef = useGridApiRef();

  // Destructuring from useRankingGroup custom hook
  const {
    data: groups,
    error,
    loading,
    fetchAllRankingGroups,
    deleteRankingGroup,
    addRankingGroup,
  } = useRankingGroup();

  //get All Ranking Group
  const getAllRankingGroup = async () => {
    try {
      const data = await rankingGroupApi.searchRankingGroups(
        filter,
        page,
        pageSize
      );
      setGroup(data.result);
      setTotalPages(data.pageInfo.total);
      setTotalElements(data.pageInfo.element);
    } catch (error) {
      console.error("Failed to fetch ranking group :", error);
    }
  };

  useEffect(() => {
    getAllRankingGroup();
  }, [page, pageSize, filter]);

  // Fetch all ranking groups when component mounts

  // Log state changes for debugging purposes
  useEffect(() => {
    console.log("Groups:", groups);
    console.log("Loading:", loading);
    console.log("Error:", error);
  }, [groups, loading, error]);
  //// Handlers to open/close modals for adding or deleting groups
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
        createdBy: localStorage.getItem("userId"), // Get the account ID as the ID of the user creating the group
      };
      await addRankingGroup(newGroup); // Call API to add new group
      showSuccessMessage("Ranking Group successfully added.");
      handleCloseAddModal(); // Close the add modal after successful addition
      await fetchAllRankingGroups(); // Refresh the group list
    } catch (error) {
      console.error("Failed to add group:", error);
      showErrorMessage("Error occurred adding Ranking Group. Please try again");
    }
  };

  // Modal Delete
  const handleOpenDeleteModal = (groupId) => {
    // Find groups by ID to check names
    const selectedGroup = groups.find((group) => group.groupId === groupId);
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

  // Map decision data to rows for DataGrid when rows are fetched
  useEffect(() => {
    if (group) {
      const mappedRows = group.map((item, index) => ({
        id: item.groupId,
        index: index + 1,
        groupName: item.groupName,
        numEmployees: item.numEmployees < 1 ? "0" : item.numEmployees,
        currentRankingDecision:
          item.currentRankingDecision == null
            ? "No decision applies"
            : item.currentRankingDecision,
      }));
      setRows(mappedRows);
      setFilteredRows(mappedRows);
    }
  }, [group]);
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
        <h2>Ranking Group List</h2>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 1,
          }}
        >
          {/* <Typography sx={{ marginRight: 2, fontSize: '1.3rem', marginTop: 0 }}>Search Group Name:</Typography> */}
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
                // InputLabelProps={{ shrink: true, sx: { fontSize: '1rem', display: 'flex', alignItems: 'center', height: '100%' } }}
                sx={{
                  marginTop: 2,
                  height: "40px",
                  "& .MuiInputBase-root": {
                    height: "130%",
                    borderRadius: "20px",
                  },
                }}
                InputProps={{
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
            sx={{
              flexGrow: 1,
              marginRight: "16px",
              maxWidth: "600px",
              marginTop: "-10px",
              borderRadius: "20px",
            }}
          />
        </Box>
        <Box sx={{ width: "100%", height: 370, marginTop: "60px" }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <DataGrid
              className="custom-data-grid"
              apiRef={apiRef}
              rows={filteredRows}
              columns={columns}
              checkboxSelection
              pagination
              pageSizeOptions={[5, 10, 25]}
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
              autoHeight={false}
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
