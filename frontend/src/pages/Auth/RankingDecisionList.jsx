import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Modal,
  TextField,
  Menu,
  MenuItem,
  Alert,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "../../layouts/Slider.jsx";
import useRankingGroup from "../../hooks/useRankingGroup.jsx";
import SettingsIcon from "@mui/icons-material/Settings";
import { IoIosListBox } from "react-icons/io";

const EditRankingGroup = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    fetchRankingGroupById,
    data: group,
  } = useRankingGroup();

  // State for managing ranking decisions and menu actions
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decisionName, setDecisionName] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null); // Track selected row for the menu
  const [rankingDecisions, setRankingDecisions] = useState([]);

  // Fetching the ranking group details when the component mounts
  useEffect(() => {
    const loadGroup = async () => {
      try {
        const groupData = await fetchRankingGroupById(id);
        setRankingDecisions(groupData?.rankingDecisions || [
          {
            id: 1,
            name: "Sample Decision",
            finalizedAt: "2024-10-29",
            finalizedBy: "Admin",
            status: "Draft"
          }
        ]);
      } catch (error) {
        console.error("Error fetching group:", error);
        setMessage("Failed to load data.");
        setMessageType("error");
      }
    };
    loadGroup();
  }, [id, fetchRankingGroupById]);

  // Modal and Menu handlers
  const handleOpenDecisionModal = () => {
    setShowDecisionModal(true);
    handleMenuClose(); // Close menu after opening modal
  };

  const handleCloseDecisionModal = () => {
    setShowDecisionModal(false);
  };

  const handleMenuClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowId); // Set the selected row ID
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRowId(null);
  };

  // Navigate to Task Management when clicking Task List
  const handleNavigateToTaskList = () => {
    navigate("/task-management"); // Adjust the path to your Task Management page
    handleMenuClose();
  };

  // Columns configuration for the DataGrid with Gear Icon in Action column
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Ranking Decision Name", width: 200 },
    { field: "finalizedAt", headerName: "Finalized At", width: 150 },
    { field: "finalizedBy", headerName: "Finalized By", width: 150 },
    { field: "status", headerName: "Status", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 80,
      renderCell: (params) => (
        <IconButton onClick={(event) => handleMenuClick(event, params.row.id)}>
          <SettingsIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <div style={{ marginTop: "60px" }}>
      <Slider />
      <Box sx={{ marginTop: 4, padding: 2 }}>
        <Typography variant="h6">
          <a href="/ranking_group">Ranking Group List</a>
        </Typography>

        <Box
          sx={{
            marginTop: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h5">
            <IoIosListBox /> Ranking Decision List
          </Typography>
        </Box>

        <Box sx={{ height: 400, marginTop: 2 }}>
          <DataGrid
            rows={rankingDecisions}
            columns={columns}
            pageSize={5}
          />
        </Box>

        {/* Menu for actions triggered by Gear Icon */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleOpenDecisionModal}>Edit Decision</MenuItem>
          <MenuItem onClick={handleNavigateToTaskList}>Task List</MenuItem>
        </Menu>

        {/* Modal for adding/editing ranking decision */}
        <Modal open={showDecisionModal} onClose={handleCloseDecisionModal}>
          <Box
            sx={{
              padding: 2,
              backgroundColor: "white",
              borderRadius: 1,
              maxWidth: 400,
              margin: "auto",
              marginTop: "100px",
            }}
          >
            <Typography variant="h6">Edit Ranking Decision</Typography>
            <TextField
              label="Decision Name"
              variant="outlined"
              fullWidth
              value={decisionName}
              onChange={(e) => setDecisionName(e.target.value)}
              sx={{ marginTop: 2 }}
            />
            <Box
              sx={{
                marginTop: 2,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button variant="outlined" onClick={handleCloseDecisionModal}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleCloseDecisionModal}>
                Save
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Displaying messages */}
        {message && (
          <Alert severity={messageType} sx={{ marginTop: 2 }}>
            {message}
          </Alert>
        )}
      </Box>
    </div>
  );
};

export default EditRankingGroup;
