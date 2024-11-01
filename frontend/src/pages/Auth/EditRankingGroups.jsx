// Import các thư viện cần thiết từ React, Material-UI và các component khác
import React, { useEffect, useState } from "react";
import "../../assets/css/RankingGroups.css"
import {
    Box, Button, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Modal, IconButton, Switch, FormControlLabel, Alert
} from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useParams } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import useRankingGroup from "../../hooks/useRankingGroup.jsx";
import useRankingDecision from "../../hooks/useRankingDecision.jsx";
import Slider from "../../layouts/Slider.jsx";

const EditRankingGroup = () => {
    const navigate = useNavigate(); // Để điều hướng giữa các trang
    const { id } = useParams(); // Lấy tham số id từ URL
    const { fetchRankingGroupById, updateRankingGroup, fetchAllRankingGroups, data: group } = useRankingGroup(); // Các hàm từ hook để quản lý nhóm xếp hạng

    // State cho việc chỉnh sửa và hiển thị thông tin nhóm
    const [editGroup, setEditGroup] = useState({ groupName: '', currentRankingDecision: '' });
    const [originalGroupName, setOriginalGroupName] = useState('');
    const [message, setMessage] = useState(""); // Thông báo trạng thái
    const [messageType, setMessageType] = useState("success"); // Loại thông báo (success/error)
    const [showEditGroupInfoModal, setShowEditGroupInfoModal] = useState(false); // Hiển thị modal sửa nhóm
    const [newGroupName, setNewGroupName] = useState(""); // Tên nhóm mới
    const [validationMessage, setValidationMessage] = useState(""); // Thông báo lỗi validate
    const [selectedDecision, setSelectedDecision] = useState(""); // Quyết định xếp hạng hiện tại
    const [rankingDecisions, setRankingDecisions] = useState([]); // Danh sách các quyết định xếp hạng
    const [showDecisionModal, setShowDecisionModal] = useState(false); // Hiển thị modal thêm quyết định
    const [decisionName, setDecisionName] = useState(""); // Tên quyết định mới
    const [clone, setClone] = useState(false); // Trạng thái clone quyết định
    const [selectedCloneDecision, setSelectedCloneDecision] = useState(""); // Quyết định clone
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [decisionToDelete, setDecisionToDelete] = useState(null);
    const apiRef = useGridApiRef(); // Tạo apiRef để chọn nhiều group để xóa

    // Destructuring from useRankingGroup custom hook
    const {
        data: groups,
        fetchAllRankingDecisions,
        deleteRankingGroup,
        addRankingGroup,
    } = useRankingGroup();
    // // Destructuring from useRankingDecision custom hook
    const {
        data: decisions,
        error,
        loading,
        fetchAllDecisions,
        deleteRankingDecision,
        addRankingDecision,
    } = useRankingDecision();
    // Lấy danh sách các quyết định xếp hạng
    useEffect(() => {
        fetchAllDecisions();
    }, []);

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



    //// Handlers to open/close modals for editing of the group info
    const handleOpenEditGroupInfoModal = () => {
        setShowEditGroupInfoModal(true);
        setValidationMessage("");
    };
    const handleEditGroupInfo = async () => {
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
            setValidationMessage("Group name can only contain letters, numbers, and spaces.");
            return;
        }
        // Check if the group name already exists
        const existingGroups = await fetchAllRankingGroups(); // Assuming this function fetches all groups
        const groupExists = existingGroups.some(group => group.groupName.toLowerCase() === trimmedName.toLowerCase());
        if (groupExists) {
            setValidationMessage("Group name already exists. Please choose a different name.");
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
                currentRankingDecision: selectedDecision || editGroup.currentRankingDecision,
            };

            await updateRankingGroup(id, updatedGroup);
            setOriginalGroupName(trimmedName);
            setMessageType("success");
            setMessage("Group updated successfully!");
            setTimeout(() => setMessage(null), 2000);
            setShowEditGroupInfoModal(false);
        } catch (error) {
            console.error("Error updating group:", error);
            setMessageType("error");
            setMessage("Failed to update group. Please try again.");
            setTimeout(() => setMessage(null), 2000);
        }
    };

    const handleCloseEditGroupInfoModal = () => {
        setShowEditGroupInfoModal(false);
        setValidationMessage("");
    };
    //// Handlers to open/close modals for adding Decision
    // Mở Modal thêm quyết định
    const handleOpenAddDecisionModal = () => {
        setShowDecisionModal(true);
    };
    // Đóng Modal thêm quyết định
    const handleCloseAddDecisionModal = () => {
        setShowDecisionModal(false);
        setDecisionName("");
        setClone(false);
        setSelectedCloneDecision(""); // Reset quyết định clone khi mở modal
        setValidationMessage("");
    };
    // Hàm xử lý thêm quyết định mới
    // Hàm xử lý thêm quyết định mới
    const handleAddDecision = async () => { // Thêm async vào đây
        setValidationMessage("");

        // Kiểm tra tên quyết định
        if (!decisionName.trim()) {
            setValidationMessage("Ranking Decision Name is required.");
            return;
        }

        // Kiểm tra trùng lặp tên quyết định
        const isDuplicate = rankingDecisions.some(decision =>
            decision.name.toLowerCase() === decisionName.toLowerCase()
        );
        if (isDuplicate) {
            setValidationMessage("Ranking Decision Name already exists.");
            return;
        }

        // Tạo quyết định mới với điều kiện clone
        const newDecision = {
            name: decisionName,
            status: "Draft",
            ...(clone && { baseDecisionId: selectedCloneDecision }) // Nếu clone được bật, thêm ID quyết định gốc
        };

        // Thêm quyết định mới vào danh sách quyết định xếp hạng
        setRankingDecisions([...rankingDecisions, newDecision]);
        setMessage("Ranking Decision successfully added.");
        setMessageType("success");
        setShowDecisionModal(false); // Đóng modal khi hoàn tất
        await fetchAllDecisions();
        // Gọi API để thêm quyết định mới
        try {
            await addRankingDecision(newDecision); // Thêm quyết định mới qua API
            setMessage("Decision added successfully!");
            setTimeout(() => setMessage(null), 2000);
            // setShowDecisionModal(); // Đóng modal khi hoàn tất
            await fetchAllDecisions(); // Làm mới danh sách quyết định
        } catch (error) {
            console.error("Failed to add decision:", error);
            setMessageType("danger");
            setMessage("Failed to add decision. Please try again.");
            setShowDecisionModal()
            setTimeout(() => setMessage(null), 2000);
        }
    };





    // Handlers to open/close modals for deleting Decision
    // Modal Delete
    const handleOpenDeleteModal = (DecisionId) => {
        const selectedDecision = decisions.find(decision => decision.id === DecisionId);
        if (selectedDecision && selectedDecision.name === "Trainer") {
            setMessageType("warning");
            setMessage("Cannot delete the 'Trainer' decision.");
            setTimeout(() => setMessage(null), 2000);
            return;
        }
        setDecisionToDelete(DecisionId);
        setShowDeleteModal(true);
    };


    const handleCloseDeleteModal = () => setShowDeleteModal(false);

    // Function to delete a selected decision
    const handleDeleteDecision = async () => {
        try {
            if (decisionToDelete) {
                await deleteRankingDecision(decisionToDelete); // Gọi API để xóa decision
                setMessageType("success");
                setMessage("Decision deleted successfully!");
                setTimeout(() => setMessage(null), 2000);
                setDecisionToDelete(null); // Reset lại decisionToDelete
                handleCloseDeleteModal(); // Đóng modal xóa sau khi xóa thành công
                await fetchAllDecisions(); // Refresh danh sách decision
            }
        } catch (error) {
            console.error("Failed to delete decision:", error);
            setMessageType("danger");
            setMessage("Failed to delete decision. Please try again.");
            setTimeout(() => setMessage(null), 2000);
            handleCloseDeleteModal();
        }
    };

    // Columns configuration for the DataGrid
    const columns = [
        { field: "index", headerName: "ID", width: 80 },
        { field: "dicisionname", headerName: "Ranking Decision Name", width: 400 },
        { field: "finalizedAt", headerName: "Finalized At", width: 200 },
        { field: "finalizedBy", headerName: "Finalized By", width: 180 },
        { field: "status", headerName: "Status", width: 159 },
        {
            field: "action",
            headerName: "Action",
            width: 150,
            renderCell: (params) => (
                <>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            console.log(`Navigating to edit decision with ID: ${params.row.id}`);
                            navigate(`/ranking-decision/edit/${params.row.id}`);
                        }}
                    >
                        <FaEdit />
                    </Button>

                    {/* Chỉ hiển thị nút xóa nếu status là 'Finalized' */}
                    {params.row.status !== 'Finalized' && (
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleOpenDeleteModal(params.row.id)}
                        >
                            <MdDeleteForever />
                        </Button>
                    )}
                </>
            ),
        },
    ];

    // Map decision data to rows for DataGrid
    const rows = decisions
        ? decisions.map((decision, index) => ({
            id: decision.decisionId,
            index: index + 1,
            dicisionname: decision.decisionName,
            finalizedAt: decision.status === 'Finalized' ? decision.finalizedAt : '-', // Hiển thị ngày giờ nếu là 'Finalized', ngược lại hiển thị '-'
            finalizedBy: decision.status === 'Finalized' ? (decision.finalizedBy == null ? "N/A" : decision.finalizedBy) : '-', // Hiển thị tên người nếu là 'Finalized', ngược lại hiển thị '-'
            status: decision.status
        }))
        : [];

    return (
        <div style={{ marginTop: "60px" }}>
            <Slider />
            <Box sx={{ marginTop: 4, padding: 2 }}>
                <Typography variant="h6">
                    <a href="/ranking_group">Ranking Group List</a> {'>'} Edit Ranking Group
                </Typography>
                <Box sx={{
                    border: '1px solid black',
                    borderRadius: '4px',
                    padding: '16px',
                    marginTop: '16px'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                        <Typography variant="h6" style={{ marginRight: '8px' }}>Group Info</Typography>
                        <IconButton size="small" aria-label="edit" onClick={handleOpenEditGroupInfoModal}>
                            <EditIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ width: '48%' }}>
                            <Typography>Group Name:</Typography>
                            <TextField variant="outlined" fullWidth value={originalGroupName} disabled />
                        </Box>
                        <Box sx={{ width: '48%' }}>
                            <Typography>Current Ranking Decision:</Typography>
                            <TextField variant="outlined" fullWidth value={editGroup.currentRankingDecision} disabled />
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <Typography variant="h5">Ranking Decision List</Typography>
                    <Button variant="contained" color="primary" onClick={handleOpenAddDecisionModal}>
                        Add New Ranking Decision
                    </Button>
                </Box>
                {/* Displaying messages */}
                {message && (
                    <Alert severity={messageType} sx={{ marginTop: 2 }}>
                        {message}
                    </Alert>
                )}
                <Box sx={{ width: "100%" }}>
                    <DataGrid className="custom-data-grid"
                        apiRef={apiRef} // Cung cấp `apiRef` cho DataGrid
                        rows={rows}
                        columns={columns}
                        checkboxSelection
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
                {/* <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <Button variant="contained" color="error" onClick={handleBulkDelete}>
                        Delete Selected Groups
                    </Button>
                </div> */}
                {/* <Box sx={{ width: "100%" }}>
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
                </Box> */}
                {/* Modal for editing group info */}
                <Modal open={showEditGroupInfoModal} onClose={handleCloseEditGroupInfoModal}>
                    <Box sx={{
                        padding: 2,
                        backgroundColor: 'white',
                        borderRadius: 1,
                        maxWidth: 400,
                        margin: 'auto',
                        marginTop: '100px'
                    }}>
                        <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            Edit Group Info
                            <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseEditGroupInfoModal}></button>
                        </Typography>

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
                        <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
                            <Button variant="outlined" onClick={handleCloseEditGroupInfoModal}>Cancel</Button>
                            <Button variant="contained" onClick={handleEditGroupInfo}>Save</Button>
                        </Box>
                    </Box>
                </Modal>

                {/* Modal for adding new ranking decision */}
                <Modal open={showDecisionModal} onClose={handleOpenAddDecisionModal}>
                    <Box sx={{
                        padding: 2,
                        backgroundColor: 'white',
                        borderRadius: 1,
                        maxWidth: 400,
                        margin: 'auto',
                        marginTop: '100px'
                    }}>
                        <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            Add New Ranking Decision
                            <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseAddDecisionModal}></button>
                        </Typography>

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
                            control={<Switch checked={clone} onChange={() => setClone(!clone)} />}
                            label="Clone from other decision"
                        />

                        {clone && (
                            <FormControl fullWidth sx={{ marginTop: 2 }}>
                                <InputLabel>Choose Decision to Clone</InputLabel>
                                <Select
                                    value={selectedCloneDecision}
                                    onChange={(e) => setSelectedCloneDecision(e.target.value)}
                                    label="Choose Decision to Clone"
                                >
                                    {rankingDecisions.map((decision) => (
                                        <MenuItem key={decision.id} value={decision.id}>
                                            {decision.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
                            <Button variant="outlined" onClick={handleCloseAddDecisionModal}>Cancel</Button>
                            <Button variant="contained" onClick={handleAddDecision}>Save</Button>
                        </Box>
                    </Box>
                </Modal>

            </Box>
            {/* Modal for deleting a Decision */}
            <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <Box sx={{
                    padding: 2,
                    backgroundColor: 'white',
                    borderRadius: 1,
                    maxWidth: 400,
                    margin: 'auto',
                    marginTop: '100px'
                }}>
                    <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Confirm Delete
                        <IconButton size="small" onClick={() => setShowDeleteModal(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Typography>
                    <Typography sx={{ marginTop: 2 }}>
                        Are you sure you want to delete this decision?
                    </Typography>
                    <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="outlined" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                        <Button variant="contained" color="error" onClick={handleDeleteDecision}>Delete</Button>
                    </Box>
                </Box>
            </Modal>

        </div>
    );
};

export default EditRankingGroup;
