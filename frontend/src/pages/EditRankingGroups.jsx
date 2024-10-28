import React, { useEffect, useState } from "react";
import { Button, Typography, Alert, TextField, FormControl, InputLabel, Select, MenuItem, Modal } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "../layouts/Slider.jsx";
import useRankingGroup from "../hooks/useRankingGroup";

const EditRankingGroup = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { fetchRankingGroupById, updateRankingGroup, data: group, loading, error } = useRankingGroup();

    // State for handling editing and displaying group information
    const [editGroup, setEditGroup] = useState({ groupName: '', currentRankingDecision: '' });
    const [originalGroupName, setOriginalGroupName] = useState(''); // Original group name for display purposes
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");
    const [showAddModal, setShowAddModal] = useState(false); // Control modal visibility
    const [newGroupName, setNewGroupName] = useState(""); // New group name being edited
    const [validationMessage, setValidationMessage] = useState(""); // Validation message for group name
    const [selectedDecision, setSelectedDecision] = useState(""); // Selected decision in the dropdown
    const [rankingDecisions, setRankingDecisions] = useState([]); // List of ranking decisions

    // Destructuring from useRankingGroup custom hook
    const {
        data: groups
    } = useRankingGroup();
    // Load the group data when the component mounts
    useEffect(() => {
        const loadGroup = async () => {
            try {
                const groupData = await fetchRankingGroupById(id);
                console.log("Group Data:", groupData); // Kiểm tra dữ liệu trả về
                setEditGroup({
                    groupName: groupData.groupName,
                    currentRankingDecision: groupData.currentRankingDecision,
                });
                setOriginalGroupName(groupData.groupName);
                setNewGroupName(groupData.groupName);
                setRankingDecisions(groupData.rankingDecisions || []); // Lưu danh sách quyết định nếu có
            } catch (error) {
                console.error("Error fetching group:", error);
            }
        };
        loadGroup();
    }, [id]);

    // Update group information when Save is clicked
    const handleEditGroup = async () => {
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

        // // Check for duplicate group name, excluding the current group's name
        // const isDuplicate = groups.some(existingGroup =>
        //     existingGroup.id !== editGroup.id && // Kiểm tra để không so sánh với nhóm hiện tại
        //     existingGroup.groupName.toLowerCase() === trimmedName.toLowerCase()
        // );

        // if (isDuplicate) {
        //     setValidationMessage("Group name already exists.");
        //     return;
        // }


        try {
            const updatedGroup = {
                groupName: trimmedName,
                currentRankingDecision: selectedDecision || editGroup.currentRankingDecision,
            };

            // Log the updated group data for debugging
            console.log("Updating group with data:", updatedGroup);

            const response = await updateRankingGroup(id, updatedGroup);

            // Kiểm tra phản hồi từ server
            console.log("Update response:", response);

            // Cập nhật `originalGroupName` với tên mới ngay khi lưu
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




    // Open the edit group info modal
    const handleOpenAddModal = () => {
        setShowAddModal(true);
        setValidationMessage("");
    };

    // Close the modal and reset validation message
    const handleCloseAddModal = () => {
        setShowAddModal(false);
        setValidationMessage("");
    };

    // Columns for DataGrid
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
            <div style={{ padding: "20px" }}>
                {message && <Alert severity={messageType}>{message}</Alert>}
                <Typography variant="h5">Edit Ranking Group</Typography>
                <div>
                    <Button onClick={handleOpenAddModal}>Edit group info</Button>
                    <Typography>Group Name: {originalGroupName}</Typography>
                    <Typography>Current Ranking Decision: {editGroup.currentRankingDecision}</Typography>
                </div>

                {/* Display the group's ranking decisions in a table */}
                <DataGrid rows={group?.rankingDecisions || []} columns={columns} pageSize={5} />

                {/* Modal for editing group info */}
                <Modal open={showAddModal} onClose={handleCloseAddModal}>
                    <div style={{ padding: '20px', background: 'white', borderRadius: '8px', maxWidth: '400px', margin: 'auto', marginTop: '100px' }}>
                        <Typography variant="h6">Edit Group Info</Typography>
                        <TextField
                            label="Group Name"
                            variant="outlined"
                            fullWidth
                            value={newGroupName}
                            onChange={(e) => {
                                setNewGroupName(e.target.value);
                                setValidationMessage(""); // Clear validation message on change
                            }}
                            error={!!validationMessage}
                            helperText={validationMessage}
                        />
                        <FormControl fullWidth style={{ marginTop: '20px' }}>
                            <InputLabel>Current Ranking Decision</InputLabel>
                            <Select
                                value={selectedDecision}
                                onChange={(e) => setSelectedDecision(e.target.value)}
                                label="Current Ranking Decision"
                            >
                                {rankingDecisions.map((decision) => (
                                    <MenuItem key={decision.id} value={decision.id}>
                                        {decision.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                            <Button variant="outlined" onClick={handleCloseAddModal}>Cancel</Button>
                            <Button variant="contained" onClick={handleEditGroup}>Save</Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default EditRankingGroup;
