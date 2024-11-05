// Import các thư viện cần thiết từ React, Material-UI và các component khác
import React, { useEffect, useState } from "react";
import {
    Box, Button, Typography, TextField, Alert
} from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import ModalCustom from "../../components/Common/Modal.jsx";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "../../layouts/Slider.jsx";
import useRankingGroup from "../../hooks/useRankingGroup.jsx";
import useRankingDecision from "../../hooks/useRankingDecision.jsx";
import "../../assets/css/RankingGroups.css";

const CriteriaManagement = () => {
    const navigate = useNavigate(); // Để điều hướng giữa các trang
    const { id } = useParams(); // Lấy tham số id từ URL
    const { fetchRankingGroupById, updateRankingGroup, fetchAllRankingGroups, data: group } = useRankingGroup(); // Các hàm từ hook để quản lý nhóm xếp hạng
    const apiRef = useGridApiRef(); // Tạo apiRef để chọn nhiều group để xóa

    // State cho việc chỉnh sửa và hiển thị thông tin nhóm
    const [showAddCriteriaModal, setShowAddCriteriaModal] = useState(false); // Hiển thị modal thêm tiêu chí
    const [criteriaName, setCriteriaName] = useState(""); // Tên quyết định mới
    const [validationMessage, setValidationMessage] = useState(""); // Thông điệp xác thực cho người dùng
    const [message, setMessage] = useState(""); // Thông điệp thông báo cho người dùng
    const [messageType, setMessageType] = useState("success"); // Kiểu thông điệp (thành công hoặc lỗi)

    // Handler mở/đóng modal thêm tiêu chí
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

    // Hàm thêm tiêu chí với các kiểm tra xác thực
    const handleAddCriteria = async () => {
        setValidationMessage("");
        let trimmedName = criteriaName.trim();

        // Kiểm tra độ dài và yêu cầu ký tự của tên tiêu chí
        if (!trimmedName) {
            setValidationMessage("Criteria name cannot be empty.");
            return;
        }

        if (trimmedName.length < 3 || trimmedName.length > 20) {
            setValidationMessage("Criteria name must be between 3 and 20 characters.");
            return;
        }

        const nameRegex = /^[a-zA-Z0-9 ]+$/;
        if (!nameRegex.test(trimmedName)) {
            setValidationMessage("Criteria name can only contain letters, numbers, and spaces.");
            return;
        }

        // Capitalize the first letter of each word in the criteria name
        trimmedName = trimmedName.replace(/\b\w/g, (char) => char.toUpperCase());

        // Kiểm tra trùng lặp
        const isDuplicate = group?.rankingDecisions?.some(
            decision => decision.criteriaName.toLowerCase() === trimmedName.toLowerCase()
        );
        if (isDuplicate) {
            setValidationMessage("Criteria name already exists.");
            return;
        }

        try {
            const newCriteria = {
                criteriaName: trimmedName,
                createdBy: 1, // Giả sử 1 là ID của người tạo tiêu chí
            };
            // Gọi API để thêm tiêu chí mới
            await useRankingDecision().addCriteria(newCriteria);
            setMessageType("success");
            setMessage("Criteria added successfully!");
            setTimeout(() => setMessage(null), 2000);
            handleCloseAddCriteriaModal(); // Đóng modal sau khi thêm thành công
            await useRankingDecision().fetchAllCriteria(); // Làm mới danh sách tiêu chí
        } catch (error) {
            console.error("Failed to add criteria:", error);
            setMessageType("error");
            setMessage("Failed to add criteria. Please try again.");
            setTimeout(() => setMessage(null), 2000);
        }
    };

    // Cấu hình cột cho DataGrid
    const columns = [
        { field: "id", headerName: "ID", width: 80 },
        { field: "name", headerName: "Criteria Name", width: 400 },
        { field: "noOfOption", headerName: "No Of Option", width: 200 },
        { field: "maxScore", headerName: "Max Score", width: 180 },
        {
            field: "action", headerName: "Action", width: 150, renderCell: (params) => (
                <>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            navigate(`/ranking-decision/edit/${params.row.id}`);
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => {
                            // Hàm mở modal xóa nhóm
                        }}
                    >
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div style={{ marginTop: "60px" }}>
            <Slider />
            <Box sx={{ marginTop: 4, padding: 2 }}>
                <Typography variant="h6">
                    <a href="/ranking_decision">Ranking Decision List</a> {'>'} Criteria List
                </Typography>
                <Box sx={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <Typography variant="h5">Criteria List</Typography>
                    <Button variant="contained" color="primary" onClick={handleOpenAddCriteriaModal}>
                        Add New Criteria
                    </Button>
                </Box>

                <Box sx={{ width: "100%" }}>
                    <DataGrid className="custom-data-grid"
                        apiRef={apiRef}
                        rows={group?.rankingDecisions || []}
                        columns={columns}
                        checkboxSelection
                        pageSizeOptions={[5]}
                    />
                </Box>

                {/* Modal for adding new Criteria */}
                <ModalCustom
                    show={showAddCriteriaModal}
                    handleClose={handleCloseAddCriteriaModal}
                    title="Add New Criteria"
                    bodyContent={
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
                        />
                    }
                    footerContent={
                        <>
                            <Button variant="outlined" onClick={handleCloseAddCriteriaModal}>
                                Cancel
                            </Button>
                            <Button variant="contained" color="success" onClick={handleAddCriteria}>
                                Add
                            </Button>
                        </>
                    }
                />

                {/* Hiển thị thông điệp */}
                {message && (
                    <Alert severity={messageType} sx={{ marginTop: 2 }}>
                        {message}
                    </Alert>
                )}
            </Box>
        </div>
    );
};

export default CriteriaManagement;
