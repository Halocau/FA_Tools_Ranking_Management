import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/RankingGroups.css"
import { Button, TextField, Alert } from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import ModalCustom from "../../components/Common/Modal.jsx";
import useRankingGroup from "../../hooks/useRankingGroup.jsx";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import Slider from "../../layouts/Slider.jsx";
import Box from "@mui/material/Box";

const RankingGroups = () => {
  const navigate = useNavigate(); // Khởi tạo hook useNavigate để điều hướng giữa các trang trong ứng dụng

  // State để quản lý hiển thị của các modal và thông tin người dùng nhập
  const [showAddModal, setShowAddModal] = useState(false); // State để xác định xem modal thêm nhóm có hiển thị hay không  
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State để xác định xem modal xóa nhóm có hiển thị hay không
  const [newGroupName, setNewGroupName] = useState(""); // State để lưu tên nhóm mới mà người dùng nhập vào
  const [groupToDelete, setGroupToDelete] = useState(null); // State để lưu ID của nhóm sẽ bị xóa
  const [message, setMessage] = useState(""); // State để lưu thông điệp thông báo cho người dùng
  const [messageType, setMessageType] = useState("success"); // State để xác định kiểu thông điệp (thành công hoặc lỗi)
  const [validationMessage, setValidationMessage] = useState(""); // State để lưu thông điệp xác thực cho người dùng
  const apiRef = useGridApiRef(); // Tạo apiRef để chọn nhiều group để xóa

  // Destructuring from useRankingGroup custom hook
  const {
    data: groups,
    error,
    loading,
    fetchAllRankingGroups,
    deleteRankingGroup,
    addRankingGroup,
  } = useRankingGroup();

  // Fetch all ranking groups when component mounts
  useEffect(() => {
    fetchAllRankingGroups();
  }, []);

  // Log state changes for debugging purposes
  useEffect(() => {
    console.log("Groups:", groups);
    console.log("Loading:", loading);
    console.log("Error:", error);

  }, [groups, loading, error]);
  //// Handlers to open/close modals for adding or deleting groups
  // Modal Add
  const handleOpenAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewGroupName("");
    setValidationMessage("");
  };
  // Function to add a new group with validation checks
  const handleAddGroup = async () => {
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
    const isDuplicate = groups.some(
      group => group.groupName.toLowerCase() === trimmedName.toLowerCase()
    );
    if (isDuplicate) {
      setValidationMessage("Group name already exists.");
      return;
    }

    try {
      const newGroup = {
        groupName: trimmedName,
        createdBy: 1, // Assuming 1 is the ID of the user creating the group
      };
      await addRankingGroup(newGroup); // Call API to add new group
      setMessageType("success");
      setMessage("Group added successfully!");
      setTimeout(() => setMessage(null), 2000);
      handleCloseAddModal(); // Close the add modal after successful addition
      await fetchAllRankingGroups(); // Refresh the group list
    } catch (error) {
      console.error("Failed to add group:", error);
      setMessageType("danger");
      setMessage("Failed to add group. Please try again.");
      setTimeout(() => setMessage(null), 2000);
    }
  };

  // Modal Delete
  const handleOpenDeleteModal = (groupId) => {
    // Find groups by ID to check names
    const selectedGroup = groups.find(group => group.groupId === groupId);
    // If the group is named "Trainer", show a notification and do not open the modal
    if (selectedGroup && selectedGroup.groupName === "Trainer") {
      setMessageType("warning");
      setMessage("Cannot delete the 'Trainer' group.");
      setTimeout(() => setMessage(null), 2000);
      return;
    }
    // If not "Trainer", open the delete modal
    setGroupToDelete(groupId);
    setShowDeleteModal(true);
  };
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  // Function to delete a group
  const handleDeleteGroup = async () => {
    try {
      if (groupToDelete) {
        await deleteRankingGroup(groupToDelete); // Gọi API để xóa nhóm
        setMessageType("success");
        setMessage("Group deleted successfully!");
        setTimeout(() => setMessage(null), 2000);
        setGroupToDelete(null); // Reset lại groupToDelete
        handleCloseDeleteModal(); // Đóng modal xóa sau khi xóa thành công
        await fetchAllRankingGroups(); // Refresh danh sách nhóm
      }
    } catch (error) {
      console.error("Failed to delete group:", error);
      setMessageType("danger");
      setMessage("Failed to delete group. Please try again.");
      setTimeout(() => setMessage(null), 2000);
      handleCloseDeleteModal();
    }
  };
  // Function to delete selects multiple groups
  const handleBulkDelete = async () => {
    const selectedIDs = apiRef.current.getSelectedRows();

    if (selectedIDs.size === 0) {
      // Không có hàng nào được chọn
      setMessageType("warning");
      setMessage("Please select groups to delete.");
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    // Lọc các ID của nhóm không phải "Trainer"
    const groupsToDelete = Array.from(selectedIDs.keys()).filter((id) => {
      const group = rows.find((row) => row.id === id); // Tìm nhóm theo ID
      return group && group.groupName !== "Trainer"; // Chỉ xóa nếu không phải là "Trainer"
    });

    if (groupsToDelete.length === 0) {
      // Không có nhóm hợp lệ để xóa sau khi lọc
      setMessageType("warning");
      setMessage("Cannot delete the 'Trainer' group.");
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    try {
      // Xóa từng nhóm không phải "Trainer"
      await Promise.all(groupsToDelete.map((id) => deleteRankingGroup(id)));
      setMessageType("success");
      setMessage("Selected groups deleted successfully!");
      setTimeout(() => setMessage(null), 2000);

      // Cập nhật lại danh sách nhóm sau khi xóa thành công
      await fetchAllRankingGroups();
    } catch (error) {
      console.error("Failed to delete selected groups:", error);
      setMessageType("danger");
      setMessage("Failed to delete selected groups. Please try again.");
      setTimeout(() => setMessage(null), 2000);
    }
  };


  // Define columns for DataGrid
  const columns = [
    { field: "index", headerName: "ID", width: 70 },
    { field: "groupName", headerName: "Group Name", width: 250 },
    { field: "numEmployees", headerName: "No. of Employees", width: 250 },
    { field: "currentRankingDecision", headerName: "Current Ranking Decision", width: 400 },
    {
      field: "action", headerName: "Action", width: 150, renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            // size="small"
            onClick={() => {
              console.log(`Navigating to edit group with ID: ${params.row.id}`);
              navigate(`/ranking-group/edit/${params.row.id}`);
            }}
          >
            <FaEdit />
          </Button>

          <Button
            variant="outlined"
            color="error"
            // size="small"
            onClick={() => handleOpenDeleteModal(params.row.id)}
          >
            <MdDeleteForever />
          </Button>
        </>
      ),
    },
  ];

  // Map group data to rows for DataGrid
  const rows = groups
    ? groups.map((group, index) => ({
      id: group.groupId,
      index: index + 1,
      groupName: group.groupName,
      numEmployees: group.numEmployees < 1 ? "N/A" : group.numEmployees,
      currentRankingDecision:
        group.currentRankingDecision == null ? "N/A" : group.currentRankingDecision,
    }))
    : [];

  return (
    <div style={{ marginTop: "60px" }}>
      <Slider />
      <div>
        <h2>
          {/* <FaRankingStar />  */}
          Ranking Group List
        </h2>
        {message && <Alert severity={messageType}>{message}</Alert>}

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
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <Button variant="contained" color="success" onClick={handleOpenAddModal}>
            Add New Group
          </Button>
          <Button variant="contained" color="error" onClick={handleBulkDelete}>
            Delete Selected Groups
          </Button>
        </div>

        {/* Modal for adding a new group */}
        <ModalCustom
          show={showAddModal}
          handleClose={handleCloseAddModal}
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
            <>
              <Button variant="outlined" onClick={handleCloseAddModal}>
                Cancel
              </Button>
              <Button variant="contained" color="success" onClick={handleAddGroup}>
                Add
              </Button>
            </>
          }
        />

        {/* Modal for deleting a group */}
        <ModalCustom
          show={showDeleteModal}
          handleClose={handleCloseDeleteModal}
          title="Delete Group"
          bodyContent="Are you sure you want to delete this group?"
          footerContent={
            <>
              <Button variant="outlined" onClick={handleCloseDeleteModal}>
                Cancel
              </Button>
              <Button variant="contained" color="error" onClick={handleDeleteGroup}>
                Delete
              </Button>
            </>
          }
        />
      </div>
    </div>
  );
};

export default RankingGroups;
