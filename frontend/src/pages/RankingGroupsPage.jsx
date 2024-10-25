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
    if (!newGroupName.trim()) {
      setValidationMessage("Group name cannot be empty.");
      return;
    }
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
      await addRankingGroup(newGroup); // Gọi hàm thêm nhóm
      setMessageType("success");
      setMessage("Group added successfully!");
      setTimeout(() => setMessage(null), 2000);
      handleCloseAddModal();
      await fetchAllRankingGroups(); // Tải lại danh sách nhóm
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
        await fetchAllRankingGroups(); // Tải lại danh sách nhóm
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
      fetchAllRankingGroups();
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
