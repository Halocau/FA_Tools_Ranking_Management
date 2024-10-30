import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  IconButton,
  Switch,
  FormControlLabel,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "../../layouts/Slider.jsx";
import useRankingGroup from "../../hooks/useRankingGroup.jsx";
import { VscTriangleRight } from "react-icons/vsc";
import { IoIosListBox } from "react-icons/io";

const EditRankingGroup = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    fetchRankingGroupById,
    updateRankingGroup,
    fetchAllRankingGroups,
    data: group,
  } = useRankingGroup();

  // State for handling editing and displaying group information
  const [editGroup, setEditGroup] = useState({
    groupName: "",
    currentRankingDecision: "",
  });
  const [originalGroupName, setOriginalGroupName] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [selectedDecision, setSelectedDecision] = useState("");
  const [rankingDecisions, setRankingDecisions] = useState([]);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decisionName, setDecisionName] = useState("");
  const [clone, setClone] = useState(false);
  const [selectedCloneDecision, setSelectedCloneDecision] = useState("");

  // Fetching the ranking group details when the component mounts
  useEffect(() => {
    const loadGroup = async () => {
      try {
        const groupData = await fetchRankingGroupById(id);
        setEditGroup({
          groupName: groupData.groupName,
          currentRankingDecision: groupData.currentRankingDecision,
        });
        setOriginalGroupName(groupData.groupName);
        setNewGroupName(groupData.groupName);
        setSelectedDecision(groupData.currentRankingDecision);
        setRankingDecisions(groupData.rankingDecisions || []);
      } catch (error) {
        console.error("Error fetching group:", error);
      }
    };
    loadGroup();
  }, [id]);

  // Handling the editing of the group
  const handleEditGroup = async () => {
    setValidationMessage("");
    let trimmedName = newGroupName.trim();

    // Validation for the group name
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

    // Check if the group name already exists
    const existingGroups = await fetchAllRankingGroups(); // Assuming this function fetches all groups
    const groupExists = existingGroups.some(
      (group) => group.groupName.toLowerCase() === trimmedName.toLowerCase()
    );
    if (groupExists) {
      setValidationMessage(
        "Group name already exists. Please choose a different name."
      );
      return;
    }

    // Prevent changing the name of the trainer group
    if (editGroup.groupName === "Trainer" && trimmedName !== "Trainer") {
      setValidationMessage("Cannot change the name of the Trainer group.");
      return;
    }

    // Capitalize the first letter of each word
    trimmedName = trimmedName.replace(/\b\w/g, (char) => char.toUpperCase());

    // Prepare the updated group object
    try {
      const updatedGroup = {
        groupName: trimmedName,
        currentRankingDecision:
          selectedDecision || editGroup.currentRankingDecision,
      };

      await updateRankingGroup(id, updatedGroup);
      setOriginalGroupName(trimmedName);
      setMessageType("success");
      setMessage("Group updated successfully!");
      setTimeout(() => setMessage(null), 2000);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error updating group:", error);
      setMessageType("error");
      setMessage("Failed to update group. Please try again.");
      setTimeout(() => setMessage(null), 2000);
    }
  };

  // Modal open and close handlers
  const handleOpenAddModal = () => {
    setShowAddModal(true);
    setValidationMessage("");
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setValidationMessage("");
  };

  const handleOpenDecisionModal = () => {
    setShowDecisionModal(true);
    setDecisionName("");
    setClone(false);
    setSelectedCloneDecision("");
    setValidationMessage("");
  };

  // Handling the saving of a new ranking decision
  const handleSaveDecision = () => {
    setValidationMessage("");

    if (!decisionName.trim()) {
      setValidationMessage("Ranking Decision Name is required.");
      return;
    }

    const isDuplicate = rankingDecisions.some(
      (decision) => decision.name.toLowerCase() === decisionName.toLowerCase()
    );
    if (isDuplicate) {
      setValidationMessage("Ranking Decision Name already exists.");
      return;
    }

    const newDecision = {
      name: decisionName,
      status: "Draft",
      ...(clone && { baseDecisionId: selectedCloneDecision }), // Clone logic
    };

    setRankingDecisions([...rankingDecisions, newDecision]);
    setMessage("Ranking Decision successfully added.");
    setMessageType("success");
    setShowDecisionModal(false);
  };

  const handleCloseDecisionModal = () => {
    setShowDecisionModal(false);
    setValidationMessage("");
  };

  // Columns configuration for the DataGrid
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Ranking Decision Name", width: 200 },
    { field: "finalizedAt", headerName: "Finalized At", width: 150 },
    { field: "finalizedBy", headerName: "Finalized By", width: 150 },
    { field: "status", headerName: "Status", width: 100 },
  ];

  return (
    <div style={{ marginTop: "60px" }}>
      <Slider />
      <Box sx={{ marginTop: 4, padding: 2 }}>
      <Typography variant="h6">
          <a href="/ranking_group">Ranking Group List </a> / Edit Ranking Group
        </Typography>
        <Box
          sx={{
            border: "1px solid black",
            borderRadius: "4px",
            padding: "16px",
            marginTop: "16px",
          }}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", marginBottom: "16px" }}
          >
            <Typography variant="h6" style={{ marginRight: "8px" }}>
              Group Info
            </Typography>
            <IconButton
              size="small"
              aria-label="edit"
              onClick={handleOpenAddModal}
            >
              <EditIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ width: "48%" }}>
              <Typography>Group Name:</Typography>
              <TextField
                variant="outlined"
                fullWidth
                value={originalGroupName}
                disabled
              />
            </Box>
            <Box sx={{ width: "48%" }}>
              <Typography>Current Ranking Decision:</Typography>
              <TextField
                variant="outlined"
                fullWidth
                value={editGroup.currentRankingDecision}
                disabled
              />
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            marginTop: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h5" style={{ color: "" }}>
            <IoIosListBox />
            Ranking Decision List
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenDecisionModal}
          >
            Add New Ranking Decision
          </Button>
        </Box>

        <Box sx={{ height: 400, marginTop: 2 }}>
          <DataGrid
            rows={group?.rankingDecisions || []}
            columns={columns}
            pageSize={5}
          />
        </Box>

        {/* Modal for editing group info */}
        <Modal open={showAddModal} onClose={handleCloseAddModal}>
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
            <Typography variant="h6">Edit Group Info</Typography>
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
              sx={{ marginTop: 2 }}
            />
            <FormControl fullWidth sx={{ marginTop: 2 }}>
              <InputLabel>Current Ranking Decision</InputLabel>
              <Select
                value={selectedDecision}
                onChange={(e) => setSelectedDecision(e.target.value)}
                label="Current Ranking Decision"
              >
                {rankingDecisions.map((decision) => (
                  <MenuItem key={decision.id} value={decision.name}>
                    {decision.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box
              sx={{
                marginTop: 2,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button variant="outlined" onClick={handleCloseAddModal}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleEditGroup}>
                Save
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Modal for adding new ranking decision */}
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
            <Typography variant="h6">Add New Ranking Decision</Typography>
            <TextField
              label="Decision Name"
              variant="outlined"
              fullWidth
              value={decisionName}
              onChange={(e) => setDecisionName(e.target.value)}
              error={!!validationMessage}
              helperText={validationMessage}
              sx={{ marginTop: 2 }}
            />
            <FormControlLabel
              control={
                <Switch checked={clone} onChange={() => setClone(!clone)} />
              }
              label="Clone from existing decision"
            />
            {clone && (
              <FormControl fullWidth sx={{ marginTop: 2 }}>
                <InputLabel>Clone Decision</InputLabel>
                <Select
                  value={selectedCloneDecision}
                  onChange={(e) => setSelectedCloneDecision(e.target.value)}
                  label="Clone Decision"
                >
                  {rankingDecisions.map((decision) => (
                    <MenuItem key={decision.id} value={decision.id}>
                      {decision.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
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
              <Button variant="contained" onClick={handleSaveDecision}>
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
