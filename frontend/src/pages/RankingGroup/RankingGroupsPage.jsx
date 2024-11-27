// React
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { FaEye } from 'react-icons/fa';
import { FaHistory } from 'react-icons/fa';
//Filter Query Builder
import { sfLike } from 'spring-filter-query-builder';
// Mui
import { Box, Button, Typography, TextField, Alert, CircularProgress, InputAdornment, IconButton, } from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import Autocomplete from '@mui/material/Autocomplete';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
// Css
import "../../assets/css/RankingGroups.css"
// Source code
// API
import RankingGroupAPI from "../../api/RankingGroupAPI.js";
//Common
import ModalCustom from "../../components/Common/Modal.jsx";
import ActionButtons from "../../components/Common/ActionButtons.jsx";
import SearchComponent from "../../components/Common/Search.jsx";
// Contexts
import { useAuth } from "../../contexts/AuthContext.jsx";
// Hooks
import useNotification from "../../hooks/useNotification";
// Layouts
import Slider from "../../layouts/Slider.jsx";


const RankingGroups = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook to navigate between pages in the application
  // State
  // Table  List Ranking Group (page, size)
  const [filter, setFilter] = useState("");
  const [RankingGroups, setRankingGroups] = useState([]);
  const [Page, setPage] = useState(1);
  const [PageSize, setPageSize] = useState(5);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  //Add
  const [showAddModal, setShowAddModal] = useState(false); // State to determine whether the add group modal is visible or not
  const [newGroupName, setNewGroupName] = useState(""); // State to store the new group name that the user enters
  // Delete
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State to determine whether the delete group modal is displayed or not
  const [groupToDelete, setGroupToDelete] = useState(null); // State to save the ID of the group to be deleted
  // Delete select
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  // API
  const apiRef = useGridApiRef(); // Create apiRef to select multiple groups to delete
  // Search Group
  const [rows, setRows] = useState([]); // Initialize with empty array
  const [filteredRows, setFilteredRows] = useState([]); // Initialize with empty array
  const [searchValue, setSearchValue] = useState(''); // State to store search value
  // Use hook notification
  const [showSuccessMessage, showErrorMessage] = useNotification();
  // Validation error message
  const [validationMessage, setValidationMessage] = useState("");

  //  Destructuring from RankingGroupAPI custom API
  const fetchAllRankingGroups = async () => {
    try {
      const data = await RankingGroupAPI.searchRankingGroups(
        filter,
        Page,
        PageSize
      );
      setRankingGroups(data.result);
      setTotalPages(data.pageInfo.total);
      setTotalElements(data.pageInfo.element);
    } catch (error) {
      console.error("Failed to fetch criteria:", error);
    }
  }
  // Fetch all ranking groups when component mounts
  useEffect(() => {
    fetchAllRankingGroups();
  }, [Page, PageSize, filter]);

  // Map decision data to rows for DataGrid when rows are fetched
  useEffect(() => {
    if (RankingGroups) {
      const mappedRows = RankingGroups.map((group, index) => ({
        id: group.groupId,
        index: index + 1 + (Page - 1) * PageSize,
        groupName: group.groupName,
        numEmployees: group.numEmployees < 1 ? "0" : group.numEmployees,
        currentRankingDecision: group.currentRankingDecision == null ? "No decision applies" : group.currentRankingDecision,
      }));
      setRows(mappedRows);
      setFilteredRows(mappedRows);
    }
  }, [RankingGroups]);


  //// Handlers to open/close modals for adding group
  // Open the modal
  const handleOpenAddRankingGroupModal = () => setShowAddModal(true);
  // Close the modal
  const handleCloseAddRankingGroupModal = () => {
    setShowAddModal(false);
    setNewGroupName("");
    setValidationMessage("");
  };
  // Function to add a Ranking Group
  const handleAddRankingGroup = async () => {
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
    // Check for duplicate group name
    const isDuplicate = RankingGroups.some(
      group => group.groupName.toLowerCase() === trimmedName.toLowerCase()
    );
    if (isDuplicate) {

      setValidationMessage("Group name already exists.");
      return;
    }
    try {
      const newGroup = {
        groupName: trimmedName,
        createdBy: localStorage.getItem('userId'),
      };
      await RankingGroupAPI.addRankingGroup(newGroup);
      handleCloseAddRankingGroupModal()();
      setTotalElements(totalElements + 1);
      if (RankingGroups.length < PageSize) {
        fetchAllRankingGroups();
      } else {
        setTotalPages(totalPages + 1);
      }
      showSuccessMessage("Ranking Group successfully added.");
    } catch (error) {
      console.error("Failed to add group:", error);

      // Kiểm tra nếu lỗi từ backend có chứa thông báo lỗi liên quan đến tên nhóm
      if (error.response && error.response.data) {
        // Lọc chỉ thông báo lỗi "RankingGroup name exists already!" từ phần detailMessage
        const detailMessage = error.response.data.detailMessage;
        if (detailMessage && detailMessage.includes("RankingGroup name exists already!")) {
          setValidationMessage("RankingGroup name exists already!");  // Chỉ hiển thị thông báo lỗi mong muốn
        } else {
          showErrorMessage("Error occurred adding Ranking Group. Please try again");
        }
      } else {
        // Nếu không có thông báo cụ thể từ backend, hiển thị thông báo lỗi mặc định
        showErrorMessage("Error occurred adding Ranking Group. Please try again");
      }
    }
  };

  //// Handlers to open/close modals for delete group
  /// Open the modal
  const handleOpenDeleteRankingGroupModal = (groupId) => {
    // Find group by ID in result array
    const selectedGroup = RankingGroups.find(group => group.groupId === groupId);
    // If the group is named "Trainer", display an error message and do not open the modal
    if (selectedGroup && selectedGroup.groupName === "Trainer") {
      showErrorMessage("Cannot delete the 'Trainer' group.");
      return;
    }
    // If not "Trainer", open the delete modal
    setGroupToDelete(groupId);
    setShowDeleteModal(true);
  };
  // Close the modal
  const handleCloseDeleteRankingGroupModal = () => setShowDeleteModal(false);
  // Function to delete a ranking  group
  const handleDeleteRankingGroup = async () => {
    try {
      if (groupToDelete) {
        await RankingGroupAPI.deleteRankingGroup(groupToDelete);
        setRankingGroups(RankingGroups.filter((group) => group.groupId !== groupToDelete));
        if (RankingGroups.length === 5) {
          fetchAllRankingGroups();
        }
        if (RankingGroups.length === 1) {
          setPage(Page - 1)
        }
      }
      setTotalElements(totalElements - 1);
      showSuccessMessage("Ranking Group successfully removed.");
      setGroupToDelete(null);
      handleCloseDeleteRankingGroupModal();
    } catch (error) {
      console.error("Failed to delete group:", error);
      showErrorMessage("Error occurred removing Ranking Group. Please try again.");
      handleCloseDeleteRankingGroupModal();
    }
  };

  // Bulk Delete Ranking Groups
  // Open the modal
  const handleOpenBulkDeleteModal = () => setShowBulkDeleteModal(true);
  // Close the modal
  const handleCloseBulkDeleteModal = () => setShowBulkDeleteModal(false);
  // Function to delete select  ranking  group
  const handleBulkDeleteRankingGroup = async () => {
    const selectedIDs = Array.from(apiRef.current.getSelectedRows().keys());
    if (selectedIDs.length === 0) {
      showErrorMessage("Please select groups to delete.");
      return;
    }

    const groupsToDelete = selectedIDs.filter((id) => {
      const group = RankingGroups.find((row) => row.groupId === id);
      return group && group.groupName !== "Trainer";
    });

    if (groupsToDelete.length === 0) {
      showErrorMessage("Cannot delete the 'Trainer' group.");
      return;
    }

    try {
      await Promise.all(groupsToDelete.map((id) => RankingGroupAPI.deleteRankingGroup(id)));
      showSuccessMessage("Selected groups deleted successfully!");
      // Cập nhật lại danh sách nhóm sau khi xóa
      setRankingGroups(RankingGroups.filter((group) => !groupsToDelete.includes(group.groupId)));
      // Kiểm tra nếu còn đúng 5 nhóm sau khi xóa thì gọi fetchAllRankingGroups
      if (RankingGroups.length === 5) {
        await fetchAllRankingGroups();
      }
      // Kiểm tra nếu còn đúng 1 nhóm sau khi xóa thì giảm Page đi 1
      if (RankingGroups.length === 1) {
        setPage(Page - 1);
      }

      await fetchAllRankingGroups();
      handleCloseBulkDeleteModal();
    } catch (error) {
      console.error("Failed to delete selected groups:", error);
      showErrorMessage("Failed to delete selected groups. Please try again.");
      handleCloseBulkDeleteModal();
    }
  };

  ///// Search Group
  const handleSearch = (event) => {
    if (event) {
      setFilter(sfLike("groupName", event).toString());
    } else {
      setFilter("")
    }
    setPage(1);
  };

  // Define columns for DataGrid
  const columns = [
    { field: "index", headerName: "ID", width: 70 },
    { field: "groupName", headerName: "Group Name", width: 230 },
    { field: "numEmployees", headerName: "No. of Employees", width: 230 },
    { field: "currentRankingDecision", headerName: "Current Ranking Decision", width: 350 },
    {
      field: "action", headerName: "Action", width: 300, renderCell: (params) => (
        <>
          {/* View */}
          <Button
            variant="outlined"
            color="gray"
            // size="small"
            onClick={() => {
              console.log(`Navigating to view group with ID: ${params.row.id}`);
              navigate(`/ranking-group/view/${params.row.id}`);
            }}
          >
            <FaEye />
          </Button>
          {/* Edit */}
          <Button
            variant="outlined"
            // size="small"
            sx={{ marginLeft: 1 }}
            onClick={() => {
              console.log(`Navigating to edit group with ID: ${params.row.id}`);
              navigate(`/ranking-group/edit/${params.row.id}`);
            }}
          >
            <FaEdit />
          </Button>
          {/* Delete */}
          <Button
            variant="outlined"
            color="error"
            // size="small"
            sx={{ marginLeft: 1 }}
            onClick={() => handleOpenDeleteRankingGroupModal(params.row.id)}
          >
            <MdDeleteForever />
          </Button>
          {/* Bulk Ranking History */}
          <Button
            variant="outlined"
            // size="small"
            sx={{ marginLeft: 1 }}
            onClick={() => {
              console.log(`Navigating to bulk group with ID: ${params.row.id}`);
              navigate(`/ranking-group/bulk/${params.row.id}`);
            }}
          >
            <FaHistory />
          </Button>
        </>
      ),
    },
  ];

  /////////////////////////////////////////////////////////// Return ///////////////////////////////////////////////////////////
  return (
    <div style={{ marginTop: "60px" }}>
      <Slider />
      <div>
        <h2>
          Ranking Group List
        </h2>
        {/* Search Ranking Group */}
        <SearchComponent onSearch={handleSearch} placeholder=" Sreach Group" />
        {/* Table show Ranking Group */}
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
          />
          {/* )} */}
        </Box>
        {/* Button Add new Group and Delete Selected Groups */}
        <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
          <Button variant="contained" color="success" onClick={handleOpenAddRankingGroupModal}>
            Add New Group
          </Button>
          <Button variant="contained" color="error" onClick={handleOpenBulkDeleteModal} sx={{ ml: 2 }}>
            Delete Selected Groups
          </Button>
        </Box>
        {/* Modal for adding a new group */}
        <ModalCustom
          show={showAddModal}
          handleClose={handleCloseAddRankingGroupModal}
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
            <ActionButtons
              onCancel={handleCloseAddRankingGroupModal}
              onConfirm={handleAddRankingGroup}
              confirmText="Add"
              cancelText="Cancel"
              color="success"
            />
          }
        />
        {/* Modal for deleting a group */}
        <ModalCustom
          show={showDeleteModal}
          handleClose={handleCloseDeleteRankingGroupModal}
          title="Delete Group"
          bodyContent="Are you sure you want to delete this group?"
          footerContent={
            <ActionButtons
              onCancel={handleCloseDeleteRankingGroupModal}
              onConfirm={handleDeleteRankingGroup}
              confirmText="Delete"
              cancelText="Cancel"
              color="error"
            />
          }
        />
        {/* Modal for deleting select group */}
        <ModalCustom
          show={showBulkDeleteModal}
          handleClose={handleCloseBulkDeleteModal}
          title="Delete Selected Groups"
          bodyContent="Are you sure you want to delete the selected groups?"
          footerContent={
            <ActionButtons
              onCancel={handleCloseDeleteRankingGroupModal}
              onConfirm={handleBulkDeleteRankingGroup}
              confirmText="Delete"
              cancelText="Cancel"
              color="error"
            />
          }
        />
      </div>
    </div >
  );
};

export default RankingGroups;
