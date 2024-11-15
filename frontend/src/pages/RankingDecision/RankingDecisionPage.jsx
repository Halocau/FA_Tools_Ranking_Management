// react
import React, { useEffect, useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaEye } from 'react-icons/fa';
// Mui
import { Box, Button, Menu, MenuItem, InputAdornment, Typography, TextField, FormControl, InputLabel, Select, Modal, IconButton, Switch, FormControlLabel, Alert, FormHelperText } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import Autocomplete from '@mui/material/Autocomplete';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
// Css
import "../../assets/css/RankingGroups.css"
// Source code
// API
import RankingDecisionAPI from "../../api/RankingDecisionAPI.js";
//Common
import ModalCustom from "../../components/Common/Modal.jsx";
import ActionButtons from "../../components/Common/ActionButtons.jsx";
// Contexts
import { useAuth } from "../../contexts/AuthContext.jsx";
// Hooks
import useNotification from "../../hooks/useNotification";
import useRankingDecision from "../../hooks/useRankingDecision"
// Layouts
import Slider from "../../layouts/Slider.jsx";

const RankingDecision = () => {
    const navigate = useNavigate(); //  // Initialize the useNavigate hook to navigate between pages in the application
    //
    const handleTaskManagementClick = () => {
        navigate('/task-management'); // Navigate Page Task Management
    };
    const handleCriteriaManagementClick = () => {
        navigate('/criteria-management'); // Navigate Page CriteriaManagement
    };
    //// State
    // Table  List Ranking decision (page, size)
    const [filter, setFilter] = useState("");
    const [RankingDecisions, setRankingDecisions] = useState([]);
    const [Page, setPage] = useState(1);
    const [PageSize, setPageSize] = useState(5);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    // ApiRef   
    const apiRef = useGridApiRef(); // Create apiRef to select multiple decisions to delete

    // Add
    const [showAddModal, setShowAddModal] = useState(false); // State to determine whether the additional decision modal is displayed or not
    const [newDecisionName, setnewDecisionName] = useState(""); // State to store the new decison name that the user enters
    const [clone, setClone] = useState(false); // Clone state decides
    const [selectedCloneDecision, setSelectedCloneDecision] = useState(null);
    const [listDecisionClone, setlistDecisionClone] = useState([]);
    // Delete
    const [showDeleteModal, setShowDeleteModal] = useState(false); // State to determine whether the delete decision modal is displayed or not
    const [DecisionToDelete, setDecisionToDelete] = useState(null); // State to store the ID of the decision to be deleted
    const [selectedRows, setSelectedRows] = useState([]); // State to save a list of IDs of selected rows in the DataGrid
    // delete select
    const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
    // Search Decision
    const [rows, setRows] = useState([]); // Initialize with empty array
    const [filteredRows, setFilteredRows] = useState([]); // Initialize with empty array
    const [searchValue, setSearchValue] = useState(''); // State to store search value
    // Use hook notification
    const [showSuccessMessage, showErrorMessage] = useNotification();
    // Validation error message
    const [validationMessage, setValidationMessage] = useState("");
    // Status menu
    const [anchorEl, setAnchorEl] = useState(null);
    // Function Onclick Menu
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    // Function Close Menu
    const handleClose = () => {
        setAnchorEl(null);
    };

    //  Destructuring from RankingdecisionAPI custom API
    const fetchAllRankingDecisions = async () => {
        try {
            const data = await RankingDecisionAPI.searchRankingDecisions(
                filter,
                Page,
                PageSize
            );
            setRankingDecisions(data.result);
            setTotalPages(data.pageInfo.total);
            setTotalElements(data.pageInfo.element);
        } catch (error) {
            console.error("Failed to fetch criteria:", error);
        }
    }
    // Fetch all ranking decisions when component mounts
    useEffect(() => {
        fetchAllRankingDecisions();
    }, [Page, PageSize, filter]);
    // Map decision data to rows for DataGrid when rows are fetched
    useEffect(() => {
        if (RankingDecisions) {
            const mappedRows = RankingDecisions.map((decision, index) => ({
                id: decision.decisionId,
                index: index + 1 + (Page - 1) * PageSize,
                dicisionname: decision.decisionName,
                finalizedAt: decision.status === 'Finalized' ? decision.finalizedAt : '-',
                finalizedBy: decision.status === 'Finalized' ? (decision.finalizedBy == null ? "N/A" : decision.finalizedBy) : '-',
                status: decision.status
            }));
            setRows(mappedRows); // Update rows with data from decisions
            setFilteredRows(mappedRows); // Update filteredRows with original data
        }
    }, [RankingDecisions]);

    //// Handlers to open/close modals for adding decisions
    // Open the modal
    const handleOpenAddRankingDecisionModal = () => setShowAddModal(true);
    // Close the modal
    const handleCloseAddRankingDecisionModal = () => {
        setShowAddModal(false);
        setnewDecisionName("");
        setValidationMessage("");
        setSelectedCloneDecision(null);
        setClone(false);
    };
    // Function to adding Ranking Decision
    const handleAddRankingDecision = async () => {
        setValidationMessage("");
        let trimmedName = newDecisionName.trim();
        if (!trimmedName) {
            setValidationMessage("Ranking Decision Name is required.");
            return;
        }
        const isDuplicate = RankingDecisions.some(
            decision => decision.decisionName.toLowerCase() === trimmedName.toLowerCase()
        );
        if (isDuplicate) {

            setValidationMessage("Decision name already exists.");
            return;
        }
        try {
            let newDecision = {
                decisionName: trimmedName,
                createdBy: localStorage.getItem('userId'), // ID của người tạo
            };
            // Check condision Clone
            if (clone && selectedCloneDecision) {
                newDecision = {
                    ...newDecision,
                    CloneDecision: selectedCloneDecision.decisionId
                };
                await RankingDecisionAPI.addRankingDecision(newDecision);
            } else {
                newDecision = {
                    ...newDecision,
                    CloneDecision: null
                };
                await RankingDecisionAPI.addRankingDecision(newDecision);
            }
            // setRankingDecisions([...rankingDecisions, newDecision]);
            setTotalElements(totalElements + 1);
            if (RankingDecisions.length < PageSize) {
                fetchAllRankingDecisions();
            } else {
                setTotalPages(totalPages + 1);
            }
            handleCloseAddRankingDecisionModal();
            showSuccessMessage("Ranking Decision successfully added.");
        } catch (error) {
            console.error("Failed to add group:", error);

            // Kiểm tra nếu lỗi từ backend có chứa thông báo lỗi liên quan đến tên nhóm
            if (error.response && error.response.data) {
                // Lọc chỉ thông báo lỗi "RankingGroup name exists already!" từ phần detailMessage
                const detailMessage = error.response.data.detailMessage;
                if (detailMessage && detailMessage.includes("RankingGroup name exists already!")) {
                    setValidationMessage("RankingGroup name exists already!");  // Chỉ hiển thị thông báo lỗi mong muốn
                } else {
                    showErrorMessage("Error occurred adding Ranking Decision. Please try again");
                }
            } else {
                // Nếu không có thông báo cụ thể từ backend, hiển thị thông báo lỗi mặc định
                showErrorMessage("Error occurred adding Ranking Decision. Please try again");
            }
        }
    };
    const {
        data: decisions,
        fetchListAllRankingDecisions,
    } = useRankingDecision();

    useEffect(() => {
        fetchListAllRankingDecisions();
    }, []);
    //// Handlers to open/close modals for delete decision
    // Open the modal
    const handleOpenDeleteRankingDecisionModal = (decisionId) => {
        setDecisionToDelete(decisionId);
        setShowDeleteModal(true);
    };
    // Close the modal
    const handleCloseDeleteRankingDecisionModal = () => setShowDeleteModal(false);
    // Function to delete a  ranking decision
    const handledeleteRankingDecision = async () => {
        try {
            if (DecisionToDelete) {
                await RankingDecisionAPI.deleteRankingDecision(DecisionToDelete);
                setRankingDecisions(RankingDecisions.filter((decision) => decision.decisionId !== DecisionToDelete))
                if (RankingDecisions.length === 5) {
                    fetchAllRankingDecisions();
                }
                if (RankingDecisions.length === 1) {
                    setPage(Page - 1)
                }
            }
            setTotalElements(totalElements - 1);
            showSuccessMessage("Ranking Decision successfully removed.");
            setDecisionToDelete(null);
            handleCloseDeleteRankingDecisionModal();
        } catch (error) {
            console.error("Failed to delete decison:", error);
            showErrorMessage("Error occurred removing Ranking Decision. Please try again.");
            handleCloseDeleteRankingDecisionModal();
        }
    };
    // Function to delete a selected ranking decisions
    // Open the modal
    const handleOpenBulkDeleteModal = () => setShowBulkDeleteModal(true);
    // Close the modal
    const handleCloseBulkDeleteModal = () => setShowBulkDeleteModal(false);
    const handleBulkDeleteRankingDecision = async () => {
        // List ID of Row choice
        const selectedIDs = Array.from(apiRef.current.getSelectedRows().keys());
        if (selectedIDs.length === 0) {
            showErrorMessage("Please select decisions to delete.");
            handleCloseBulkDeleteModal();
            return;
        }
        try {
            // Xóa quyết định
            await Promise.all(selectedIDs.map((id) => RankingDecisionAPI.deleteRankingDecision(id)));
            showSuccessMessage("Selected decision deleted successfully!");
            // Cập nhật danh sách sau khi xóa
            const updatedRankingDecisions = RankingDecisions.filter(
                (decision) => !selectedIDs.includes(decision.decisionId)
            );
            setRankingDecisions(updatedRankingDecisions);
            // Kiểm tra điều kiện giảm trang khi xóa
            if (updatedRankingDecisions.length === 0 && Page > 1) {
                setPage(Page - 1); // Giảm trang nếu không còn dữ liệu
            }

            // Kiểm tra nếu còn đúng 5 nhóm sau khi xóa thì gọi fetchAllRankingDecisions
            if (updatedRankingDecisions.length === 5) {
                await fetchAllRankingDecisions();
            }
            handleCloseBulkDeleteModal();
        } catch (error) {
            console.error("Failed to delete selected groups:", error);
            showErrorMessage("Failed to delete selected groups. Please try again.");
            handleCloseBulkDeleteModal();
        }
    };

    //// Search Decision 
    const handleInputChange = (event, value) => {
        // const safeGroups = Array.isArray(groups) ? groups : [];
        setSearchValue(event.target.value); // Cập nhật giá trị tìm kiếm
        const filtered = value
            ? filteredRows.filter(row => row.groupName.toLowerCase().includes(value.toLowerCase()))
            : rows; // If no value, use original rows
        setFilteredRows(filtered);
    };
    const handleSearchSubmit = () => {
        // Gửi text trong searchValue về backend
        console.log("Search query:", searchValue);
        // Thực hiện gọi API hoặc hành động gửi dữ liệu về backend
        // fetch('/api/search', { method: 'POST', body: JSON.stringify({ query: searchValue }) })
    };
    const clearSearch = () => {
        setSearchValue("");
        setFilteredRows([]); // Reset dữ liệu lọc nếu cần
    };

    // Define columns for DataGrid
    const columns = [
        { field: "index", headerName: "ID", width: 80 },
        { field: "dicisionname", headerName: "Ranking Decision Name", width: 350 },
        { field: "finalizedAt", headerName: "Finalized At", width: 200 },
        { field: "finalizedBy", headerName: "Finalized By", width: 180 },
        { field: "status", headerName: "Status", width: 150 },
        {
            field: "action",
            headerName: "Action",
            width: 200,
            renderCell: (params) => (
                <>
                    <IconButton
                        color="gray"
                        onClick={() => {
                            console.log(`Viewing decision with ID: ${params.row.id}`);
                            navigate(`/ranking-decision/view/${params.row.id}`);
                        }}
                    >
                        <FaEye />
                    </IconButton>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            console.log(`Navigating to edit decision with ID: ${params.row.id}`);
                            navigate(`/ranking-decision/edit/${params.row.id}`);
                        }}
                    >
                        <FaEdit />
                    </Button>
                    {params.row.status !== 'Finalized' && (
                        <Button
                            variant="outlined"
                            color="error"
                            sx={{ marginLeft: 1 }} // 
                            onClick={() => handleOpenDeleteRankingDecisionModal(params.row.id)}
                        >
                            <MdDeleteForever />
                        </Button>
                    )}
                </>
            ),
        },
    ];

    /////////////////////////////////////////////////////////// Return ///////////////////////////////////////////////////////////
    return (
        <div style={{ marginTop: "60px" }}>
            <Slider />
            <div>
                <h2 onClick={handleClick} style={{ cursor: 'pointer' }}>
                    <IconButton onClick={handleClick} style={{ cursor: 'pointer' }}>
                        <MenuIcon />
                    </IconButton>
                    Ranking Decision List
                </h2>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    {/* Task Management */}
                    <MenuItem onClick={handleTaskManagementClick}>
                        Task Management
                    </MenuItem>
                    {/* Criteria Management */}
                    <MenuItem onClick={handleCriteriaManagementClick}>
                        Criteria Management
                    </MenuItem>
                </Menu>
                {/* Search Decision */}
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 2 }}>
                    {/* <Typography sx={{ marginRight: 2, fontSize: '1.3rem', marginTop: 0 }}>Search Decision Name:</Typography> */}
                    <TextField
                        value={searchValue}
                        onChange={handleInputChange}
                        onKeyPress={(e) => e.key === "Enter" && handleSearchSubmit()}
                        placeholder="Search Decision"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start" sx={{ display: "flex", alignItems: "center" }}>
                                    <SearchIcon
                                        onClick={() => {
                                            setSearchValue(''); // Xóa text khi nhấn vào icon tìm kiếm
                                            handleSearchSubmit(); // Gọi hàm tìm kiếm (nếu cần thiết)
                                        }}
                                        sx={{
                                            cursor: 'pointer',
                                            marginRight: 1,
                                            transition: 'transform 0.2s ease-in-out',
                                            '&:hover': {
                                                transform: 'scale(1.2)',
                                                color: 'primary.main',
                                            },
                                            '&:active': {
                                                transform: 'scale(1.1)',
                                            },
                                        }}
                                    />
                                </InputAdornment>
                            ),
                            endAdornment: searchValue && (
                                <InputAdornment position="end" sx={{ display: 'flex' }}>
                                    <IconButton
                                        onClick={clearSearch}
                                        size="small"
                                        sx={{ padding: '0' }}
                                    >
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            flexGrow: 1,
                            marginRight: '16px',
                            maxWidth: '600px',
                            marginTop: '-10px',
                            '& .MuiInputBase-root': {
                                borderRadius: '20px',
                                height: '40px',
                            },
                        }}
                    />

                </Box>
                {/* Table show Ranking Decision */}
                <Box sx={{ width: "100%", height: 370, marginTop: '60px' }}>
                    {/* {loading ? <CircularProgress /> : ( */}
                    <DataGrid
                        className="custom-data-grid"
                        apiRef={apiRef}
                        rows={rows}
                        columns={columns}
                        checkboxSelection
                        pagination
                        pageSizeOptions={[5, 10, 25]}
                        getRowId={(row) => row.id}
                        rowCount={totalElements}
                        paginationMode="server"
                        paginationModel={{
                            page: Page - 1,  // Adjusted for 0-based index
                            pageSize: PageSize,
                        }}
                        onPaginationModelChange={(model) => {
                            setPage(model.page + 1);  // Set 1-based page for backend
                            setPageSize(model.pageSize);
                        }}
                        disableNextButton={Page >= totalPages}
                        disablePrevButton={Page <= 1}
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
                    {/* )} */}
                </Box>

                {/* Button Add new Group and Delete Selected Decision */}
                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <Button variant="contained" color="success" onClick={handleOpenAddRankingDecisionModal}>
                        Add New Decision
                    </Button>
                    <Button variant="contained" color="error" onClick={handleOpenBulkDeleteModal}>
                        Delete Selected Decision
                    </Button>
                </div>

                {/* Modal for adding new ranking decision */}
                <Modal open={showAddModal} onClose={handleCloseAddRankingDecisionModal}>
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
                            <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseAddRankingDecisionModal}></button>
                        </Typography>

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
                            sx={{ marginTop: 2 }}
                        />
                        <FormControlLabel
                            control={<Switch checked={clone} onChange={() => setClone(!clone)} />}
                            label="Clone from other decision"
                        />
                        {clone && (
                            <Autocomplete
                                disablePortal
                                options={decisions.result}
                                getOptionLabel={(option) => option.decisionName || ''}
                                value={selectedCloneDecision}
                                onChange={(event, value) => {
                                    setSelectedCloneDecision(value || null);
                                    console.log(selectedCloneDecision)

                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Choice Decision"
                                        variant="outlined"
                                        fullWidth
                                        sx={{ marginTop: 2 }}
                                    />
                                )}
                            />
                        )}
                        <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
                            <Button variant="outlined" onClick={handleCloseAddRankingDecisionModal}>Cancel</Button>
                            <Button variant="contained" onClick={handleAddRankingDecision}>Save</Button>
                        </Box>
                    </Box>
                </Modal>
                {/* Modal for deleting a decision */}
                <ModalCustom
                    show={showDeleteModal}
                    handleClose={handleCloseDeleteRankingDecisionModal}
                    title="Delete decision"
                    bodyContent="Are you sure you want to delete this decision?"
                    footerContent={
                        <ActionButtons
                            onCancel={handleCloseDeleteRankingDecisionModal}
                            onConfirm={handledeleteRankingDecision}
                            confirmText="Delete"
                            cancelText="Cancel"
                            color="error"
                        />
                    }
                />
                {/* Modal for deleting select decision */}
                <ModalCustom
                    show={showBulkDeleteModal}
                    handleClose={handleCloseBulkDeleteModal}
                    title="Delete Selected decisions"
                    bodyContent="Are you sure you want to delete the selected decisions?"
                    footerContent={
                        <ActionButtons
                            onCancel={handleCloseBulkDeleteModal}
                            onConfirm={handleBulkDeleteRankingDecision}
                            confirmText="Delete"
                            cancelText="Cancel"
                            color="error"
                        />
                    }
                />
            </div>
        </div>
    );
};

export default RankingDecision;
