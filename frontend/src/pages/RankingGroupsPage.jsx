import React, { useEffect, useState } from "react";
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [groupToDelete, setGroupToDelete] = useState(null);
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
    setNewGroupName(""); // Reset the input field
    setValidationMessage(""); // Reset validation message
  };

  const handleOpenDeleteModal = (groupId) => {
    setGroupToDelete(groupId);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleAddGroup = async () => {
    setValidationMessage("");
    // check name group have space
    if (!newGroupName.trim()) {
        setValidationMessage("Group name cannot be empty.");
        return;
    }
    //  check length
    if (newGroupName.length < 3) {
        setValidationMessage("Group name must be at least 3 characters long.");
        return;
    }
    if (newGroupName.length > 50) {
        setValidationMessage("Group name cannot exceed 50 characters.");
        return;
    }
    // check space in head and tail
    if (newGroupName !== newGroupName.trim()) {
        setValidationMessage("Group name cannot have leading or trailing spaces.");
        return;
    }
    // check 
    const specialCharRegex = /[^a-zA-Z0-9\s]/;
    if (specialCharRegex.test(newGroupName)) {
        setValidationMessage("Group name cannot contain special characters.");
        return;
    }
    // check forbidden word
    const forbiddenWords = ["admin", "group"]; // Danh sách từ cấm
    if (forbiddenWords.some(word => newGroupName.toLowerCase().includes(word))) {
        setValidationMessage("Group name cannot contain forbidden words.");
        return;
    }

    // check group name exist
    const isDuplicate = groups.some(group => group.groupName.toLowerCase() === newGroupName.toLowerCase());
    if (isDuplicate) {
        setValidationMessage("Group name already exists.");
        return;
    }

    try {
      const newGroup = {
        groupName: newGroupName,
        createdBy: 1,
      };
      await addRankingGroup(newGroup);
      setMessageType("success");
      setMessage("Group added successfully!");
      setTimeout(() => setMessage(null), 2000);
      handleCloseAddModal();
      fetchAllRankingGroups();
    } catch (error) {
      console.error("Failed to add group:", error);
      setMessageType("danger");
      setMessage("Failed to add group. Please try again.");
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const handleDeleteGroup = async () => {
    console.log("Attempting to delete group with ID:", groupToDelete);
    try {
      if (groupToDelete) {
        await deleteRankingGroup(groupToDelete);
        setMessageType("success");
        setMessage("Group deleted successfully!");
        setTimeout(() => setMessage(null), 2000);
        setGroupToDelete(null);
        handleCloseDeleteModal(); //  closed modal after successflly
        await fetchAllRankingGroups();
      }
    } catch (error) {
      console.error("Failed to delete group:", error);
      setMessageType("danger");
      setMessage("Failed to delete group. Please try again.");
      setTimeout(() => setMessage(null), 2000);
      handleCloseDeleteModal(); // closed  modal if not successflly
    }
  };



  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error: {error.message}</div>;
  }

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
          <Button variant="outlined" size="small">
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
        {/* Alert for success/error messages */}
        {message && <Alert severity={messageType}>{message}</Alert>}

        <Box sx={{ width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>

        {/* Modal for delete group */}
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

        {/* Button to open modal for adding a new group */}
        <Button variant="contained" color="success" onClick={handleOpenAddModal}>
          Add New Group
        </Button>

        {/* Modal for adding a new group */}
        <ModalCustom
          show={showAddModal}
          handleClose={handleCloseAddModal}
          title="Add New Group"
          bodyContent={
            <>
              <TextField
                label="Group Name"
                variant="outlined"
                fullWidth
                value={newGroupName}
                onChange={(e) => {
                  setNewGroupName(e.target.value);
                  setValidationMessage(""); // Clear validation message on input change
                }}
                error={!!validationMessage}
                helperText={validationMessage}
              />
            </>
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
      </div>
    </div>
  );
};

export default RankingGroups;
