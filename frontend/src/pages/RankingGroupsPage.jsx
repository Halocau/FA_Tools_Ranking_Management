import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Alert } from "react-bootstrap";
import useRankingGroup from "../hooks/useRankingGroup";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import Slider from "../layouts/Slider.jsx";
import ModalCustom from "../components/Common/Modal.jsx";

const RankingGroups = () => {
  // State for modal controls and new group name
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [groupToDelete, setGroupToDelete] = useState(null);
  // Status notification when deleting
  const [deleteMessage, setDeleteMessage] = useState(null);

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
      await addRankingGroup(newGroup); // Add new group
      handleCloseAddModal(); // Close modal
      fetchAllRankingGroups(); // Fetch groups again
    } catch (error) {
      console.error("Failed to add group:", error); // Handle any errors
    }
  };

  const handleDeleteGroup = async () => {
    try {
      if (groupToDelete) {
        await deleteRankingGroup(groupToDelete); // Delete selected group
        setGroupToDelete(null); // Reset group to delete
        handleCloseDeleteModal(); // Close modal
        fetchAllRankingGroups(); // Refresh groups list
        setDeleteMessage({ type: "success", text: "Group deleted successfully!" });
      }
    } catch (error) {
      console.error("Failed to delete group:", error); // Handle error
      setDeleteMessage({ type: "danger", text: "Failed to delete group!" });
    }
  };

  // Automatically hide the delete message after 5 seconds
  useEffect(() => {
    if (deleteMessage) {
      const timer = setTimeout(() => {
        setDeleteMessage(null);
      }, 5000); // Hide after 5 seconds

      return () => clearTimeout(timer); // Clean up the timer
    }
  }, [deleteMessage]);

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div style={{ marginTop: "60px" }}>
      <Slider />
      <div>
        <h2>
          <FaRankingStar /> Ranking Group List
        </h2>

        {/* Display the delete message */}
        {deleteMessage && (
          <Alert variant={deleteMessage.type} onClose={() => setDeleteMessage(null)} dismissible>
            {deleteMessage.text}
          </Alert>
        )}

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
        <Modal show={showAddModal} onHide={handleCloseAddModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Group</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
