import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/RankingGroups.css"
import { Button, TextField, Alert } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ModalCustom from "../../components/Common/Modal.jsx";
import useRankingGroup from "../../hooks/useRankingGroup.jsx";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import Slider from "../../layouts/Slider.jsx";
import Box from "@mui/material/Box";

const RankingGroups = () => {
  const navigate = useNavigate();

  // State for managing modal visibility and user input
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [validationMessage, setValidationMessage] = useState("");

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

  // Handlers to open/close modals for adding or deleting groups
  const handleOpenAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewGroupName("");
    setValidationMessage("");
  };

  const handleOpenDeleteModal = (groupId) => {
    // Tìm nhóm theo ID để kiểm tra tên
    const selectedGroup = groups.find(group => group.groupId === groupId);

    // Nếu nhóm có tên là "Trainer", hiển thị thông báo và không mở modal
    if (selectedGroup && selectedGroup.groupName === "Trainer") {
      setMessageType("warning");
      setMessage("Cannot delete the 'Trainer' group.");
      setTimeout(() => setMessage(null), 2000);
      return;
    }
    // Nếu không phải "Trainer", mở modal xóa
    setGroupToDelete(groupId);
    setShowDeleteModal(true);
  };


  const handleCloseDeleteModal = () => setShowDeleteModal(false);

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
        createdBy: 1, // Assuming 1 is the ID of the user creating the group
      };
      await addRankingGroup(newGroup); // Call API to add new group
      setMessageType("success");
      setMessage("Group added successfully!");
      setTimeout(() => setMessage(null), 2000);
      handleCloseAddModal(); // Close the add modal after successful addition
      await fetchAllRankingGroups(); // Refresh the group list
    } catch (error) {
      console.error("Failed to add group:", error);
      setMessageType("danger");
      setMessage("Failed to add group. Please try again.");
      setTimeout(() => setMessage(null), 2000);
    }
  };

  // Function to delete a selected group
  const handleDeleteGroup = async () => {
    try {
      if (groupToDelete) {
        await deleteRankingGroup(groupToDelete); // Call API to delete group
        setMessageType("success");
        setMessage("Group deleted successfully!");
        setTimeout(() => setMessage(null), 2000);
        setGroupToDelete(null);
        handleCloseDeleteModal(); // Close the delete modal after successful deletion
        await fetchAllRankingGroups(); // Refresh the group list
      }
    } catch (error) {
      console.error("Failed to delete group:", error);
      setMessageType("danger");
      setMessage("Failed to delete group. Please try again.");
      setTimeout(() => setMessage(null), 2000);
      handleCloseDeleteModal();
    }
  };

  // Function to delete multiple selected groups
  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) {
      setMessageType("warning");
      setMessage("Please select groups to delete.");
      setTimeout(() => setMessage(null), 2000);
      return;
    }
    try {
      // Delete each selected group
      await Promise.all(selectedRows.map(id => deleteRankingGroup(id)));
      setMessageType("success");
      setMessage("Selected groups deleted successfully!");
      setTimeout(() => setMessage(null), 2000);
      await fetchAllRankingGroups(); // Refresh the group list
      setSelectedRows([]); // Clear selected rows
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
    { field: "currentRankingDecision", headerName: "Current Ranking Decision", width: 400 },
    {
      field: "action", headerName: "Action", width: 150, renderCell: (params) => (
        <>
          <Button
            variant="outlined"
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
            size="small"
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
          <FaRankingStar /> Ranking Group List
        </h2>
        {message && <Alert severity={messageType}>{message}</Alert>}

        <Box sx={{ width: "100%" }}>
          <DataGrid className="custom-data-grid"
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
          <Button variant="contained" color="success" onClick={handleOpenAddModal}>
            Add New Group
          </Button>
          <Button variant="contained" color="error" onClick={handleBulkDelete}>
            Delete Selected Groups
          </Button>
        </div>

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
            <>
              <Button variant="outlined" onClick={handleCloseAddModal}>
                Cancel
              </Button>
              <Button variant="contained" color="success" onClick={handleAddGroup}>
                Add
              </Button>
            </>
          }
        />

        {/* Modal for deleting a group */}
        <ModalCustom
          show={showDeleteModal}
          handleClose={handleCloseDeleteModal}
          title="Delete Group"
          bodyContent="Are you sure you want to delete this group?"
          footerContent={
            <>
              <Button variant="outlined" onClick={handleCloseDeleteModal}>
                Cancel
              </Button>
              <Button variant="contained" color="error" onClick={handleDeleteGroup}>
                Delete
              </Button>
            </>
          }
        />
      </div>
    </div>
  );
};

export default RankingGroups;
