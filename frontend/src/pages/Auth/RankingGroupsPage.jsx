import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
// Css
import "../../assets/css/RankingGroups.css"
// Mui
import { Button, TextField, Alert, CircularProgress, IconButton } from "@mui/material";
import { FaEye } from 'react-icons/fa';
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
// Source code
import ModalCustom from "../../components/Common/Modal.jsx";
import useRankingGroup from "../../hooks/useRankingGroup.jsx";
import Slider from "../../layouts/Slider.jsx";
// acountID
import { useAuth } from "../../contexts/AuthContext";
const RankingGroups = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook to navigate between pages in the application
  // State
  //Add
  const [showAddModal, setShowAddModal] = useState(false); // State to determine whether the add group modal is visible or not
  const [newGroupName, setNewGroupName] = useState(""); // State to store the new group name that the user enters
  // Delete
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State to determine whether the delete group modal is displayed or not
  const [groupToDelete, setGroupToDelete] = useState(null); // State to save the ID of the group to be deleted
  //
  const [message, setMessage] = useState(""); // State to save notification messages for users
  const [messageType, setMessageType] = useState("success"); // State to determine the message type (success or error)
  const [validationMessage, setValidationMessage] = useState(""); // State to store the authentication message for the user
  const apiRef = useGridApiRef(); // Create apiRef to select multiple groups to delete
  // Destructuring from useRankingGroup custom hook
  const {
    data: groups,
    error,
    loading,
    fetchAllRankingGroups,
    deleteRankingGroup,
    addRankingGroup,
  } = useRankingGroup();

  // Fetch all ranking groups when component mounts
  useEffect(() => {
    fetchAllRankingGroups();
  }, []);

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
  const handleAddGroup = async () => {
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
      setValidationMessage("Group name can only contain letters, numbers, and spaces.");
      return;
    }
    // Capitalize the first letter of each word in the group name
    trimmedName = trimmedName.replace(/\b\w/g, (char) => char.toUpperCase());
    // Check for duplicate group name
    const isDuplicate = groups.some(
      group => group.groupName.toLowerCase() === trimmedName.toLowerCase()
    );
    if (isDuplicate) {
      setValidationMessage("Group name already exists.");
      return;
    }

    try {
      const newGroup = {
        groupName: trimmedName,
        createdBy: localStorage.getItem('userId'), // Get the account ID as the ID of the user creating the group
      };
      await addRankingGroup(newGroup); // Call API to add new group
      setMessageType("success");
      setMessage("Ranking Group successfully added.");
      setTimeout(() => setMessage(null), 2000);
      handleCloseAddModal(); // Close the add modal after successful addition
      await fetchAllRankingGroups(); // Refresh the group list
    } catch (error) {
      console.error("Failed to add group:", error);
      setMessageType("danger");
      setMessage("Error occurred adding Ranking Group. Please try again");
      setTimeout(() => setMessage(null), 2000);
    }
  };

  // Modal Delete
  const handleOpenDeleteModal = (groupId) => {
    // Find groups by ID to check names
    const selectedGroup = groups.find(group => group.groupId === groupId);
    // If the group is named "Trainer", show a notification and do not open the modal
    if (selectedGroup && selectedGroup.groupName === "Trainer") {
      setMessageType("warning");
      setMessage("Cannot delete the 'Trainer' group.");
      setTimeout(() => setMessage(null), 2000);
      return;
    }
    // If not "Trainer", open the delete modal
    setGroupToDelete(groupId);
    setShowDeleteModal(true);
  };
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  // Function to delete a group
  const handleDeleteGroup = async () => {
    try {
      if (groupToDelete) {
        await deleteRankingGroup(groupToDelete); // Call API to delete group
        setMessageType("success");
        setMessage("Ranking Group successfully removed.");
        setTimeout(() => setMessage(null), 2000);
        setGroupToDelete(null);
        handleCloseDeleteModal();
        await fetchAllRankingGroups();
      }
    } catch (error) {
      console.error("Failed to delete group:", error);
      setMessageType("danger");
      setMessage("Error occurred removing Ranking Group. Please try again.");
      setTimeout(() => setMessage(null), 2000);
      handleCloseDeleteModal();
    }
  };
  const handleBulkDeleteRankingGroup = async () => {
    const selectedIDs = Array.from(apiRef.current.getSelectedRows().keys());
    if (selectedIDs.length === 0) {
      setMessageType("warning");
      setMessage("Please select groups to delete.");
      setTimeout(() => setMessage(null), 2000);
      return;
    }
    // Filter for group IDs other than "Trainer"
    const groupsToDelete = selectedIDs.filter((id) => {
      const group = rows.find((row) => row.id === id);
      return group && group.groupName !== "Trainer";
    });
    if (groupsToDelete.length === 0) {
      setMessageType("warning");
      setMessage("Cannot delete the 'Trainer' group.");
      setTimeout(() => setMessage(null), 2000);
      return;
    }
    try {
      // Xóa từng nhóm không phải "Trainer"
      await Promise.all(groupsToDelete.map((id) => deleteRankingGroup(id)));
      setMessageType("success");
      setMessage("Selected groups deleted successfully!");
      setTimeout(() => setMessage(null), 2000);
      await fetchAllRankingGroups(); // Cập nhật lại danh sách nhóm sau khi xóa thành công
    } catch (error) {
      console.error("Failed to delete selected groups:", error);
      setMessageType("danger");
      setMessage("Failed to delete selected groups. Please try again.");
      setTimeout(() => setMessage(null), 2000);
    }
  };

  // Define columns for DataGrid
  const columns = [
    { field: "index", headerName: "ID", width: 70 },
    { field: "groupName", headerName: "Group Name", width: 250 },
    { field: "numEmployees", headerName: "No. of Employees", width: 250 },
    { field: "currentRankingDecision", headerName: "Current Ranking Decision", width: 350 },
    {
      field: "action", headerName: "Action", width: 200, renderCell: (params) => (
        <>
          <IconButton
            color="gray"
            onClick={() => {
              console.log(`Viewing group with ID: ${params.row.id}`);
              navigate(`/ranking-group/view/${params.row.id}`);
            }}
          >
            <FaEye />
          </IconButton>
          <Button
            variant="outlined"
            // size="small"
            onClick={() => {
              console.log(`Navigating to edit group with ID: ${params.row.id}`);
              navigate(`/ranking-group/edit/${params.row.id}`);
            }}
          >
            <FaEdit />
          </Button>

          <Button
            variant="outlined"
            color="error"
            sx={{ marginLeft: 1 }}
            // size="small"
            onClick={() => handleOpenDeleteModal(params.row.id)}
          >
            <MdDeleteForever />
          </Button>
        </>
      ),
    },
  ];

  // Map group data to rows for DataGrid
  const rows = groups
    ? groups.map((group, index) => ({
      id: group.groupId,
      index: index + 1,
      groupName: group.groupName,
      numEmployees: group.numEmployees < 1 ? "N/A" : group.numEmployees,
      currentRankingDecision:
        group.currentRankingDecision == null ? "N/A" : group.currentRankingDecision,
    }))
    : [];

  return (
    <div style={{ marginTop: "60px" }}>
      <Slider />
      <div>
        <h2>
          Ranking Group List
        </h2>
        {message && <Alert severity={messageType}>{message}</Alert>}
        {/* Table show Ranking Group */}
        <Box sx={{ width: "100%", height: 370 }}>
          {loading ? <CircularProgress /> : (
            <DataGrid
              className="custom-data-grid"
              apiRef={apiRef}
              rows={rows}
              columns={columns}
              checkboxSelection
              pagination
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                    page: 0,
                  },
                },
              }}
              disableRowSelectionOnClick
              autoHeight={false}
              sx={{
                height: '100%',
                overflow: 'auto',
                '& .MuiDataGrid-virtualScroller': {
                  overflowY: 'auto',
                },
              }}
            />
          )}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
          <Button variant="contained" color="success" onClick={handleOpenAddModal}>
            Add New Group
          </Button>
          <Button variant="contained" color="error" onClick={handleBulkDeleteRankingGroup} sx={{ ml: 2 }}>
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
            <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
              <Button variant="outlined" onClick={handleCloseAddModal}>
                Cancel
              </Button>
              <Button variant="contained" color="success" onClick={handleAddGroup} sx={{ ml: 2 }}>
                Add
              </Button>
            </Box>
          }
        />
        {/* Modal for deleting a group */}
        <ModalCustom
          show={showDeleteModal}
          handleClose={handleCloseDeleteModal}
          title="Delete Group"
          bodyContent="Are you sure you want to delete this group?"
          footerContent={
            <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
              <Button variant="outlined" onClick={handleCloseDeleteModal}>
                Cancel
              </Button>
              <Button variant="contained" color="error" onClick={handleDeleteGroup} sx={{ ml: 2 }}>
                Delete
              </Button>
            </Box>
          }
        />
      </div>
    </div>
  );
};

export default RankingGroups;
