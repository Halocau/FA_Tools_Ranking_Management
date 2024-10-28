import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Alert } from "react-bootstrap";
import useRankingGroup from "../hooks/useRankingGroup";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import Slider from "../layouts/Slider.jsx";
import ModalCustom from "../components/Common/Modal.jsx";
import { DataGrid } from "@mui/x-data-grid";
import "../assets/css/RankingGroups.css";

const RankingGroups = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(null); // Message for Add group status
  const [addMessage, setAddMessage] = useState(null); // Message for Add group status
  const [successMessage, setSuccessMessage] = useState(null); // Message for success add status

  const {
    data: groups,
    error,
    loading,
    fetchAllRankingGroups,
    deleteRankingGroup,
    addRankingGroup,
  } = useRankingGroup();

  useEffect(() => {
    fetchAllRankingGroups();
  }, []);

  const handleOpenAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewGroupName("");
    setAddMessage(null);
  };

  const handleOpenDeleteModal = (groupId) => {
    const group = groups.find((g) => g.groupId === groupId);
    if (group.groupName === "Trainer") {
      setDeleteMessage({
        type: "danger",
        text: "Cannot delete Trainer Group !",
      });
    } else {
      setGroupToDelete(groupId);
      setShowDeleteModal(true);
    }
  };
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleAddGroup = async () => {
    if (newGroupName.trim() === "") {
      setAddMessage({ type: "danger", text: "Group name cannot be empty!" });
      return;
    }

    const isDuplicate = groups.some(
      (group) => group.groupName === newGroupName.trim()
    );
    if (isDuplicate) {
      setAddMessage({ type: "danger", text: "Group name already exists!" });
      return;
    }

    try {
      const newGroup = { groupName: newGroupName, createdBy: 1 };
      await addRankingGroup(newGroup);
      handleCloseAddModal();
      fetchAllRankingGroups();
      setSuccessMessage("Group added successfully!"); // Set success message here
    } catch (error) {
      console.error("Failed to add group:", error);
      setAddMessage({ type: "danger", text: "Failed to add group!" });
    }
  };

  const handleDeleteGroup = async () => {
    try {
      if (groupToDelete) {
        await deleteRankingGroup(groupToDelete);
        setGroupToDelete(null);
        handleCloseDeleteModal();
        fetchAllRankingGroups();
        setDeleteMessage({
          type: "success",
          text: "Group deleted successfully!",
        });
      }
    } catch (error) {
      console.error("Failed to delete group:", error);
      setDeleteMessage({ type: "danger", text: "Failed to delete group!" });
    }
  };

  useEffect(() => {
    if (deleteMessage) {
      const timer = setTimeout(() => setDeleteMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [deleteMessage]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 2000); // Clear success message after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  // Prepare table data
  const columns = [
    { field: "index", headerName: "Index", width: 100 },
    { field: "groupName", headerName: "Group Name", width: 350 },
    { field: "numEmployees", headerName: "No. of Employees", width: 220 },
    {
      field: "currentRankingDecision",
      headerName: "Current Ranking Decision",
      width: 300,
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
            onClick={() => handleOpenDeleteModal(params.row.id)}
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
          group.currentRankingDecision == null
            ? "N/A"
            : group.currentRankingDecision,
      }))
    : [];

  return (
    <div style={{ marginTop: "60px" }}>
      <Slider />
      <div>
        <h2>
          <FaRankingStar /> Ranking Group List
        </h2>

        {successMessage && (
          <Alert
            variant="success"
            onClose={() => setSuccessMessage(null)}
            dismissible
          >
            {successMessage}
          </Alert>
        )}

        {deleteMessage && (
          <Alert
            variant={deleteMessage.type}
            onClose={() => setDeleteMessage(null)}
            dismissible
          >
            {deleteMessage.text}
          </Alert>
        )}

        {/*Use MUI lib for Table data */}
        <DataGrid
          className="custom-data-grid"
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
        />

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

        <Button variant="success" onClick={handleOpenAddModal}>
          Add New Group
        </Button>

        <Modal show={showAddModal} onHide={handleCloseAddModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Group</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {addMessage && (
              <Alert
                variant={addMessage.type}
                onClose={() => setAddMessage(null)}
                dismissible
              >
                {addMessage.text}
              </Alert>
            )}
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAddModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddGroup}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default RankingGroups;
