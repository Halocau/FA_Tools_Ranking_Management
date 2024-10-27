import React, { useEffect, useState } from "react";
import { Button, Typography, Alert, TextField, FormControl, InputLabel, Select, MenuItem, Modal } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "../layouts/Slider.jsx";
import useRankingGroup from "../hooks/useRankingGroup";

const EditRankingGroup = () => {
    const navigate = useNavigate();
    const { groupId } = useParams();
    const { fetchRankingGroupById, updateRankingGroup, data: group, loading, error } = useRankingGroup();
    const [editGroup, setEditGroup] = useState({ groupName: '', currentRankingDecision: '' });
    const [originalGroupName, setOriginalGroupName] = useState('');
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");
    const [showAddModal, setShowAddModal] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");
    const [validationMessage, setValidationMessage] = useState("");
    const [selectedDecision, setSelectedDecision] = useState("");
    const [rankingDecisions, setRankingDecisions] = useState([]); // Add this if decisions are fetched or predefined

    useEffect(() => {
        const loadGroup = async () => {
            try {
                const groupData = await fetchRankingGroupById(groupId);
                setEditGroup({
                    groupName: groupData.groupName,
                    currentRankingDecision: groupData.currentRankingDecision,
                });
                setOriginalGroupName(groupData.groupName); // Lưu tên nhóm gốc
                setNewGroupName(groupData.groupName); // Khởi tạo tên mới với tên gốc
            } catch (error) {
                console.error("Error fetching group:", error);
            }
        };
        loadGroup();
    }, [groupId, fetchRankingGroupById]);

    const handleEditGroup = async () => {
        try {
            const updatedGroup = {
                groupName: newGroupName || originalGroupName, // Nếu newGroupName trống thì dùng tên gốc
                currentRankingDecision: editGroup.currentRankingDecision,
            };
            await updateRankingGroup(groupId, updatedGroup);
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

    const handleOpenAddModal = () => {
        setShowAddModal(true);
        setNewGroupName(originalGroupName); // Đặt tên mới là tên gốc khi mở modal
    };

    const handleCloseAddModal = () => {
        setShowAddModal(false);
        setValidationMessage("");
    };

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
                                setValidationMessage("");
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
