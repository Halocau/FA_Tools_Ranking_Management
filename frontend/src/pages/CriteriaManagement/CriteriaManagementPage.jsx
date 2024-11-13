import React, { useEffect, useState } from "react";
import {
    Box, Button, Typography, TextField, Alert, CircularProgress, Modal
} from "@mui/material";
import { format } from "date-fns";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import Slider from "../../layouts/Slider.jsx";
import useCriteria from "../../hooks/useCriteria.jsx"; // Import hook mới để quản lý tiêu chí

import "../../assets/css/RankingGroups.css";


const CriteriaManagement = () => {
    const navigate = useNavigate();
    const apiRef = useGridApiRef();
    const [showAddCriteriaModal, setShowAddCriteriaModal] = useState(false);
    const [criteriaName, setCriteriaName] = useState("");
    const [validationMessage, setValidationMessage] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    const { criteria,
        loading,
        error,
        addCriteria,
        fetchAllCriteria,
        deleteCriteria } = useCriteria(); // Sử dụng hook useCriteria

    // Fetch all ranking groups when component mounts
    useEffect(() => {
        fetchAllCriteria();
    }, []);
    // Log state changes for debugging purposes
    useEffect(() => {
        console.log("Criteria:", criteria);
        console.log("Loading:", loading);
        console.log("Error:", error);

    }, [criteria, loading, error]);

    const handleOpenAddCriteriaModal = () => {
        setShowAddCriteriaModal(true);
        setCriteriaName("");
        setValidationMessage("");
    };

    const handleCloseAddCriteriaModal = () => {
        setShowAddCriteriaModal(false);
        setCriteriaName("");
        setValidationMessage("");
    };

    const handleAddCriteria = async () => {
        setValidationMessage("");
        let trimmedName = criteriaName.trim();

        // Kiểm tra nếu tên bị trống
        if (!trimmedName) {
            setValidationMessage("Criteria name cannot be empty.");
            return;
        }

        // Kiểm tra độ dài
        if (trimmedName.length < 3 || trimmedName.length > 20) {
            setValidationMessage("Criteria name must be between 3 and 20 characters.");
            return;
        }

        // Kiểm tra ký tự không hợp lệ
        const nameRegex = /^[a-zA-Z0-9 ]+$/;
        if (!nameRegex.test(trimmedName)) {
            setValidationMessage("Criteria name can only contain letters, numbers, and spaces.");
            return;
        }

        // Chuẩn hóa tên tiêu chí
        trimmedName = trimmedName.replace(/\b\w/g, (char) => char.toUpperCase());

        try {
            const newCriteria = {
                criteriaName: trimmedName,
                createdBy: 1, // Thay thế bằng ID người dùng nếu cần
            };

            await addCriteria(newCriteria);
            setMessageType("success");
            setMessage("Criteria added successfully!");
            setTimeout(() => setMessage(null), 2000);
            handleCloseAddCriteriaModal();
            await fetchAllCriteria();
        } catch (error) {
            console.error("Failed to add criteria:", error);
            setMessageType("error");
            setMessage("Failed to add criteria. Please try again.");
            setTimeout(() => setMessage(null), 2000);
        } finally {
        }
    };


    const handleDeleteCriteria = async (criteriaId) => {
        try {
            await deleteCriteria(criteriaId);
            setMessageType("success");
            setMessage("Criteria deleted successfully!");
            setTimeout(() => setMessage(null), 2000);
            await fetchAllCriteria(); // Cập nhật danh sách tiêu chí sau khi xóa
        } catch (error) {
            console.error("Failed to delete criteria:", error);
            setMessageType("error");
            setMessage("Failed to delete criteria. Please try again.");
            setTimeout(() => setMessage(null), 2000);
        }
    };

    const columns = [
        { field: "id", headerName: "ID", width: 80 },
        { field: "criteriaName", headerName: "Criteria Name", width: 300 },
        { field: "noOfOption", headerName: "No Of Option", width: 250 },
        { field: "maxScore", headerName: "Max Score", width: 150 },
        {
            field: "action", headerName: "Action", width: 200, renderCell: (params) => (
                <>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            navigate(`/criteria/edit/${params.row.id}`);
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteCriteria(params.row.id)}
                        sx={{ marginLeft: 1 }}
                    >
                        Delete
                    </Button>
                </>
            ),
        },
    ];
    const rows = criteria
        ? criteria.map((criteria, index) => ({
            id: criteria.criteriaId,
            index: index + 1,
            criteriaName: criteria.criteriaName,
            noOfOption: criteria.numOptions,
            maxScore: criteria.maxScore
        }))
        : [];
    return (
        <div style={{ marginTop: "60px" }}>
            <Slider />
            <Box sx={{ marginTop: 4, padding: 2 }}>
                <Typography variant="h6">
                    <a href="/ranking_decision">Ranking Decision List</a> {'>'} Criteria List
                </Typography>
                <Box sx={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <Typography variant="h5">Criteria List</Typography>
                    <Button variant="contained" color="primary" onClick={handleOpenAddCriteriaModal} disabled={loading}>
                        Add New Criteria
                    </Button>
                </Box>

                <Box sx={{ width: "100%", height: 370, marginTop: '20px' }}>
                    {loading ? <CircularProgress /> : (
                        <DataGrid
                            className="custom-data-grid"
                            // apiRef={apiRef}
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

                <Modal
                    open={showAddCriteriaModal}
                    onClose={handleCloseAddCriteriaModal}
                >
                    <Box sx={{
                        padding: 2, backgroundColor: "white", borderRadius: 1, maxWidth: 400, margin: "auto", marginTop: "20vh"
                    }}>
                        <Typography variant="h6">Add New Criteria</Typography>
                        <TextField
                            label="Criteria Name"
                            variant="outlined"
                            fullWidth
                            value={criteriaName}
                            onChange={(e) => {
                                setCriteriaName(e.target.value);
                                setValidationMessage("");
                            }}
                            error={!!validationMessage}
                            helperText={validationMessage}
                            sx={{ marginTop: 2 }}
                        />
                        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                            <Button variant="outlined" onClick={handleCloseAddCriteriaModal}>Cancel</Button>
                            <Button variant="contained" color="success" onClick={handleAddCriteria} disabled={loading}>Add</Button>
                        </Box>
                    </Box>
                </Modal>

                {message && (
                    <Alert severity={messageType} sx={{ marginTop: 2 }}>
                        {typeof message === "object" ? JSON.stringify(message) : message}
                    </Alert>
                )}

                {error && (
                    <Alert severity="error" sx={{ marginTop: 2 }}>
                        {error}
                    </Alert>
                )}
            </Box>
        </div>
    );
};

export default CriteriaManagement;
