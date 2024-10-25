import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import useRankingGroup from "../hooks/useRankingGroup";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import Slider from "../layouts/Slider.jsx";
import ModalCustom from "../components/Common/Modal.jsx";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";

const RankingGroups = () => {
  // State for modal controls and new group name
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [groupToDelete, setGroupToDelete] = useState(null);

  // Destructure data and fetch function from custom hook
  const {
    data: groups,
    error,
    loading,
    fetchAllRankingGroups,
    deleteRankingGroup,
    addRankingGroup,
  } = useRankingGroup();

  // Fetch all ranking groups on component mount
  useEffect(() => {
    fetchAllRankingGroups();
  }, []); // Empty dependency array to run only once when the component mounts

  // Handlers for opening and closing the modal
  const handleOpenAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  const handleOpenDeleteModal = (groupId) => {
    setGroupToDelete(groupId); // Set group to be deleted
    setShowDeleteModal(true);
  };
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  // Handler for adding a new ranking group
  const handleAddGroup = async () => {
    try {
      const newGroup = {
        groupName: newGroupName,
        createdBy: 1,
      };
      console.log("New group:", newGroup);
      await addRankingGroup(newGroup); // This assumes addRankingGroup is async
      handleCloseAddModal(); // Close the modal
      fetchAllRankingGroups(); // Fetch all ranking groups again
    } catch (error) {
      console.error("Failed to add group:", error); // Handle any errors
    }
  };

  const handleDeleteGroup = async () => {
    try {
      if (groupToDelete) {
        await deleteRankingGroup(groupToDelete); // Delete the selected group
        setGroupToDelete(null); // Reset the group to be deleted
        handleCloseDeleteModal(); // Close the modal
        fetchAllRankingGroups(); // Fetch all ranking groups again
      }
    } catch (error) {
      console.error("Failed to delete group:", error); // Handle any errors
    }
  };

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Prepare table data
  const columns = [
    { field: "index", headerName: "Index", width: 70 },
    { field: "groupName", headerName: "Group Name", width: 250 },
    { field: "numEmployees", headerName: "No. of Employees", width: 180 },
    {
      field: "currentRankingDecision",
      headerName: "Current Ranking Decision",
      width: 250,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <>
          <Button variant="primary" size="sm">
            <FaEdit />
          </Button>{" "}
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleOpenDeleteModal(params.row.groupId)}
          >
            <MdDeleteForever />
          </Button>
        </>
      ),
    },
  ];

  const rows = groups
    ? groups.map((group, index) => ({
        id: group.groupId,
        index: index + 1,
        groupName: group.groupName,
        numEmployees: group.numEmployees < 1 ? "N/A" : group.numEmployees,
        currentRankingDecision:
          group.currrentRankingDecision == null
            ? "N/A"
            : group.currrentRankingDecision,
      }))
    : [];

  return (
    <div style={{ marginTop: "60px" }}>
      <Slider />
      <div>
        <h2>
          <FaRankingStar /> Ranking Group List
        </h2>
        {/* Use MUI Table */}
        <Box sx={{ width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>

        {/* Modal for delete group */}
        <ModalCustom
          show={showDeleteModal}
          handleClose={handleCloseDeleteModal}
          title="Delete Group"
          bodyContent={<p>Are you sure you want to delete this group?</p>}
          footerContent={
            <>
              <Button variant="secondary" onClick={handleCloseDeleteModal}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteGroup}>
                Delete
              </Button>
            </>
          }
        />

        {/* Button to open modal for adding a new group */}
        <Button variant="success" onClick={handleOpenAddModal}>
          Add New Group
        </Button>

        {/* Modal for adding a new group */}
        {/* ModalCustom for adding a new group */}
        <ModalCustom
          show={showAddModal}
          handleClose={handleCloseAddModal}
          title="Add New Group"
          bodyContent={
            <Form>
              <Form.Group controlId="formGroupName">
                <Form.Label>Group Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter group name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
              </Form.Group>
            </Form>
          }
          footerContent={
            <>
              <Button variant="secondary" onClick={handleCloseAddModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleAddGroup}>
                Save
              </Button>
            </>
          }
        />
      </div>
    </div>
  );
};

export default RankingGroups;
