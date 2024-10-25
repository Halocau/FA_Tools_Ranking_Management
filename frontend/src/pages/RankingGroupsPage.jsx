import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Alert } from "react-bootstrap";
import useRankingGroup from "../hooks/useRankingGroup";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import Slider from "../layouts/Slider.jsx";
import ModalCustom from "../components/Common/Modal.jsx";

const RankingGroups = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [addMessage, setAddMessage] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success modal
  const [successMessage, setSuccessMessage] = useState(""); // Message for success modal

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
    setGroupToDelete(groupId);
    setShowDeleteModal(true);
  };
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleAddGroup = async () => {
    if (newGroupName.trim() === "") {
      setAddMessage({ type: "danger", text: "Group name cannot be empty!" });
      return;
    }

    const isDuplicate = groups.some((group) => group.groupName === newGroupName.trim());
    if (isDuplicate) {
      setAddMessage({ type: "danger", text: "Group name already exists!" });
      return;
    }

    try {
      const newGroup = { groupName: newGroupName, createdBy: 1 };
      await addRankingGroup(newGroup);
      handleCloseAddModal();
      fetchAllRankingGroups();
      setSuccessMessage("Group added successfully!"); // Set success message
      setShowSuccessModal(true); // Show success modal
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
        setSuccessMessage("Group deleted successfully!"); // Set success message
        setShowSuccessModal(true); // Show success modal
      }
    } catch (error) {
      console.error("Failed to delete group:", error);
      setDeleteMessage({ type: "danger", text: "Failed to delete group!" });
    }
  };

  // Close success modal after 5 seconds
  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => setShowSuccessModal(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div style={{ marginTop: "60px" }}>
      <Slider />
      <div>
        <h2>
          <FaRankingStar /> Ranking Group List
        </h2>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Index</th>
              <th>Group Name</th>
              <th>No. of Employees</th>
              <th>Current Ranking Decision</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {groups && groups.length > 0 ? (
              groups.map((group, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{group.groupName}</td>
                  <td>{group.numEmployees < 1 ? "N/A" : group.numEmployees}</td>
                  <td>
                    {group.currrentRankingDecision == null
                      ? "N/A"
                      : group.currrentRankingDecision}
                  </td>
                  <td>
                    <Button variant="primary" size="sm">
                      <FaEdit />
                    </Button>{" "}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleOpenDeleteModal(group.groupId)}
                    >
                      <MdDeleteForever />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No groups available</td>
              </tr>
            )}
          </tbody>
        </Table>

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
              <Alert variant={addMessage.type} onClose={() => setAddMessage(null)} dismissible>
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
        {/* Success Modal */}
        <Modal
          className="custom-modal"
          show={showSuccessModal}
          onHide={() => setShowSuccessModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Success</Modal.Title>
          </Modal.Header>
          <Modal.Body>{successMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default RankingGroups;
