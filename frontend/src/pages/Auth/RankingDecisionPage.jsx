import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/RankingGroups.css"
import { Box, Button, TextField, Menu, MenuItem, IconButton, Alert } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { DataGrid } from "@mui/x-data-grid";
import ModalCustom from "../../components/Common/Modal.jsx";
import useRankingDecision from "../../hooks/useRankingDecision.jsx";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import Slider from "../../layouts/Slider.jsx";
import { Link } from 'react-router-dom';


const RankingDecision = () => {
    const navigate = useNavigate(); // Khởi tạo hook useNavigate để điều hướng giữa các trang trong ứng dụng

    // State để quản lý hiển thị của các modal và thông tin người dùng nhập
    const [showAddModal, setShowAddModal] = useState(false); // State để xác định xem modal thêm decision có hiển thị hay không
    const [showDeleteModal, setShowDeleteModal] = useState(false); // State để xác định xem modal xóa decision có hiển thị hay không
    const [newDecisionName, setnewDecisionName] = useState(""); // State để lưu tên decison mới mà người dùng nhập vào
    const [decisionToDelete, setdecisionToDelete] = useState(null); // State để lưu ID của decision sẽ bị xóa
    const [selectedRows, setSelectedRows] = useState([]); // State để lưu danh sách ID của các hàng đã chọn trong DataGrid
    const [message, setMessage] = useState(""); // State để lưu thông điệp thông báo cho người dùng
    const [messageType, setMessageType] = useState("success"); // State để xác định kiểu thông điệp (thành công hoặc lỗi)
    const [validationMessage, setValidationMessage] = useState(""); // State để lưu thông điệp xác thực cho người dùng
    // Khai báo trạng thái để quản lý menu
    const [anchorEl, setAnchorEl] = useState(null);
    // Hàm mở menu khi nhấn vào tiêu đề
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget); // Lưu trữ vị trí của tiêu đề để hiển thị menu
    };
    // Hàm đóng menu
    const handleClose = () => {
        setAnchorEl(null); // Đặt anchorEl về null để ẩn menu
    };

    // Sử dụng `useRankingDecision` 
    const {
        data: decisions,
        error,
        loading,
        fetchAllDecisions,
        deleteRankingDecision,
        addRankingDecision,
    } = useRankingDecision();

    // Fetch all ranking decisions when component mounts
    useEffect(() => {
        fetchAllDecisions(); // Gọi fetchAllDecisions thay vì fetchAllRankingdecisions
    }, []);

    // Log state changes for debugging purposes
    useEffect(() => {
        console.log("Decisions:", decisions);
        console.log("Loading:", loading);
        console.log("Error:", error);

    }, [decisions, loading, error]);


    //// Handlers to open/close modals for adding or deleting decisions
    // Modal Add
    const handleOpenAddModal = () => setShowAddModal(true);
    const handleCloseAddModal = () => {
        setShowAddModal(false);
        setnewDecisionName("");
        setValidationMessage("");
    };
    // Function to add a new decision with validation checks
    const handleaddRankingDecision = async () => {
        setValidationMessage("");
        let trimmedName = newDecisionName.trim();

        // Kiểm tra tên quyết định có bị trống không
        if (!trimmedName) {
            setValidationMessage("Tên quyết định không được để trống.");
            return;
        }

        // Kiểm tra trùng lặp tên quyết định
        const isDuplicate = decisions.some((decision) => {
            // Đảm bảo decision.decisionName không phải là null hoặc undefined
            return decision.decisionName && decision.decisionName.toLowerCase() === trimmedName.toLowerCase();
        });

        if (isDuplicate) {
            setValidationMessage("Tên quyết định đã tồn tại.");
            return;
        }

        // Viết hoa chữ cái đầu của mỗi từ trong tên quyết định
        trimmedName = trimmedName.replace(/\b\w/g, (char) => char.toUpperCase());

        try {
            const newdecision = {
                decisionName: trimmedName,
                createdBy: 1, // Assuming 1 is the ID of the user creating the decision
            };
            await addRankingDecision(newdecision); // Call API to add new decision
            setMessageType("success");
            setMessage("Decision added successfully!");
            setTimeout(() => setMessage(null), 2000);
            handleCloseAddModal(); // Close the add modal after successful addition
            await fetchAllDecisions(); // Refresh the decision list
        } catch (error) {
            console.error("Failed to add decision:", error);
            setMessageType("danger");
            setMessage("Failed to add decision. Please try again.");
            setTimeout(() => setMessage(null), 2000);
        }
    };


    // Modal Delete
    const handleOpenDeleteModal = (decisionId) => {
        setdecisionToDelete(decisionId); // Đặt decisionToDelete là ID của quyết định đang chọn
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => setShowDeleteModal(false);

    // Function to delete a selected decision
    const handledeleteRankingDecision = async () => {
        try {
            if (decisionToDelete) {
                await deleteRankingDecision(decisionToDelete); // Gọi API để xóa decision
                setMessageType("success");
                setMessage("Decision deleted successfully!");
                setTimeout(() => setMessage(null), 2000);
                setdecisionToDelete(null); // Reset lại decisionToDelete
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

    // // Function to delete multiple selected decisions
    // const handleBulkDelete = async () => {
    //     if (selectedRows.length === 0) {
    //         setMessageType("warning");
    //         setMessage("Please select decisions to delete.");
    //         setTimeout(() => setMessage(null), 2000);
    //         return;
    //     }
    //     try {
    //         // Xóa từng decision trong danh sách đã chọn
    //         await Promise.all(selectedRows.map(id => deleteRankingDecision(id)));
    //         setMessageType("success");
    //         setMessage("Selected decisions deleted successfully!");
    //         setTimeout(() => setMessage(null), 2000);
    //         await fetchAllDecisions(); // Refresh danh sách decision
    //         setSelectedRows([]); // Xóa các hàng đã chọn
    //     } catch (error) {
    //         console.error("Failed to delete selected decisions:", error);
    //         setMessageType("danger");
    //         setMessage("Failed to delete selected decisions. Please try again.");
    //         setTimeout(() => setMessage(null), 2000);
    //     }
    // };


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
            <div>
                <h2 onClick={handleClick} style={{ cursor: 'pointer' }}>
                    <IconButton onClick={handleClick} style={{ cursor: 'pointer' }}>
                        <MenuIcon />
                    </IconButton>
                    {/* Tiêu đề với sự kiện onClick để mở menu */}
                    Ranking Decision List
                </h2>
                {message && <Alert severity={messageType}>{message}</Alert>}
                {/* Hiển thị thông báo nếu có message */}

                <Menu
                    anchorEl={anchorEl} // Vị trí của menu dựa trên anchorEl
                    open={Boolean(anchorEl)} // Mở menu nếu anchorEl không null
                    onClose={handleClose} // Đóng menu khi không còn tương tác
                >
                    {/* Tùy chọn 1 */}
                    <MenuItem onClick={handleClose}>
                        <Link to="/task_management" style={{ textDecoration: 'none', color: 'inherit' }}>
                            Task Management
                        </Link>
                    </MenuItem>
                    {/* Tùy chọn 2 */}
                    <MenuItem onClick={handleClose}>
                        <Link to="/criteria_management" style={{ textDecoration: 'none', color: 'inherit' }}>
                            Criteria Management
                        </Link>
                    </MenuItem>
                </Menu>

                <Box sx={{ width: "100%" }}>
                    <DataGrid className="custom-data-grid"
                        rows={rows}
                        columns={columns}
                        checkboxSelection
                        onSelectionModelChange={(newSelection) => {
                            setSelectedRows(newSelection);
                            console.log("Selected Rows:", newSelection); // Kiểm tra giá trị mới
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

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <Button variant="contained" color="success" onClick={handleOpenAddModal}>
                        Add New Decision
                    </Button>
                    {/* <Button variant="contained" color="error" onClick={handleBulkDelete}>
                        Delete Selected Decision
                    </Button> */}
                </div>

                {/* Modal for adding a new decision */}
                <ModalCustom
                    show={showAddModal}
                    handleClose={handleCloseAddModal}
                    title="Add New decision"
                    bodyContent={
                        <TextField
                            label="Decision Name"
                            variant="outlined"
                            fullWidth
                            value={newDecisionName}
                            onChange={(e) => {
                                setnewDecisionName(e.target.value);
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
                            <Button variant="contained" color="success" onClick={handleaddRankingDecision}>
                                Add
                            </Button>
                        </>
                    }
                />

                {/* Modal for deleting a decision */}
                <ModalCustom
                    show={showDeleteModal}
                    handleClose={handleCloseDeleteModal}
                    title="Delete decision"
                    bodyContent="Are you sure you want to delete this decision?"
                    footerContent={
                        <>
                            <Button variant="outlined" onClick={handleCloseDeleteModal}>
                                Cancel
                            </Button>
                            <Button variant="contained" color="error" onClick={handledeleteRankingDecision}>
                                Delete
                            </Button>
                        </>
                    }
                />
            </div>
        </div>
    );
};

export default RankingDecision;
