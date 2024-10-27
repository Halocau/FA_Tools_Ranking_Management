import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Alert } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ModalCustom from "../components/Common/Modal.jsx";
import useRankingGroup from "../hooks/useRankingGroup";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import Slider from "../layouts/Slider.jsx";
import Box from "@mui/material/Box";

const RankingGroups = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [validationMessage, setValidationMessage] = useState("");

  const {
    data: groups,
    error,
    loading,
    fetchAllRankingGroups,
    deleteRankingGroup,
    addRankingGroup,
  } = useRankingGroup();

  useEffect(() => {
    fetchAllRankingGroups();
  }, []);

  const handleOpenAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewGroupName("");
    setValidationMessage("");
  };

  const handleOpenDeleteModal = (groupId) => {
    setGroupToDelete(groupId);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleAddGroup = async () => {
    setValidationMessage("");
    let trimmedName = newGroupName.trim();

    // Condition 1: Check if the group name is empty
    if (!trimmedName) {
      setValidationMessage("Group name cannot be empty.");
      return;
    }

    // Condition 2: Check for minimum and maximum length (e.g., 3 to 20 characters)
    if (trimmedName.length < 3 || trimmedName.length > 20) {
      setValidationMessage("Group name must be between 3 and 20 characters.");
      return;
    }

    // Condition 3: Only allow alphanumeric characters and spaces
    const nameRegex = /^[a-zA-Z0-9 ]+$/;
    if (!nameRegex.test(trimmedName)) {
      setValidationMessage("Group name can only contain letters, numbers, and spaces.");
      return;
    }

    // Format the name to capitalize each word's first letter
    trimmedName = trimmedName.replace(/\b\w/g, (char) => char.toUpperCase());

    // Condition 4: Check for duplicate names (case-insensitive)
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
        createdBy: 1,
      };
      await addRankingGroup(newGroup);
      setMessageType("success");
      setMessage("Group added successfully!");
      setTimeout(() => setMessage(null), 2000);
      handleCloseAddModal();
      await fetchAllRankingGroups();
    } catch (error) {
      console.error("Failed to add group:", error);
      setMessageType("danger");
      setMessage("Failed to add group. Please try again.");
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      if (groupToDelete) {
        await deleteRankingGroup(groupToDelete);
        setMessageType("success");
        setMessage("Group deleted successfully!");
        setTimeout(() => setMessage(null), 2000);
        setGroupToDelete(null);
        handleCloseDeleteModal();
        await fetchAllRankingGroups(); // Reload the group list
      }
    } catch (error) {
      console.error("Failed to delete group:", error);
      setMessageType("danger");
      setMessage("Failed to delete group. Please try again.");
      setTimeout(() => setMessage(null), 2000);
      handleCloseDeleteModal();
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) {
      setMessageType("warning");
      setMessage("Please select groups to delete.");
      setTimeout(() => setMessage(null), 2000);
      return;
    }
    try {
      await Promise.all(selectedRows.map(id => deleteRankingGroup(id)));
      setMessageType("success");
      setMessage("Selected groups deleted successfully!");
      setTimeout(() => setMessage(null), 2000);
      await fetchAllRankingGroups(); // Reload the group list after bulk delete
      setSelectedRows([]);
    } catch (error) {
      console.error("Failed to delete selected groups:", error);
      setMessageType("danger");
      setMessage("Failed to delete selected groups. Please try again.");
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const columns = [
    { field: "index", headerName: "Index", width: 70 },
    { field: "groupName", headerName: "Group Name", width: 500 },
    { field: "numEmployees", headerName: "No. of Employees", width: 250 },
    {
      field: "currentRankingDecision",
      headerName: "Current Ranking Decision",
      width: 400,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            size="small"
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

  const rows = groups
    ? groups.map((group, index) => ({
      id: group.groupId,
      index: index + 1,
      groupName: group.groupName,
      numEmployees: group.numEmployees < 1 ? "N/A" : group.numEmployees,
      currentRankingDecision:
        group.currentRankingDecision == null
          ? "N/A"
          : group.currentRankingDecision,
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
          <DataGrid
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

        {/* Buttons for adding and bulk deleting */}
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
              <Button variant="contained" color="primary" onClick={handleAddGroup}>
                Save
              </Button>
            </>
          }
        />

        {/* Modal for deleting a single group */}
        <ModalCustom
          show={showDeleteModal}
          handleClose={handleCloseDeleteModal}
          title="Delete Group"
          bodyContent={<p>Are you sure you want to delete this group?</p>}
          footerContent={
            <>
              <Button variant="outlined" onClick={handleCloseDeleteModal}>
                Cancel
              </Button>
              <Button variant="outlined" color="error" onClick={handleDeleteGroup}>
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
