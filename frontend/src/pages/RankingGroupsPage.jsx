import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import { Table, Button, Modal, Form, Alert } from "react-bootstrap";
=======
import { Table, Button, Modal, Form } from "react-bootstrap";
>>>>>>> origin/quatbt
import useRankingGroup from "../hooks/useRankingGroup";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import Slider from "../layouts/Slider.jsx";
import ModalCustom from "../components/Common/Modal.jsx";
<<<<<<< HEAD

const RankingGroups = () => {
=======
import { useAuth } from "../contexts/AuthContext";

const RankingGroups = () => {
  // State for modal controls and new group name
>>>>>>> origin/quatbt
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [groupToDelete, setGroupToDelete] = useState(null);
<<<<<<< HEAD
  const [deleteMessage, setDeleteMessage] = useState(null); // Message for Add group status
  const [addMessage, setAddMessage] = useState(null); // Message for Add group status
  const [successMessage, setSuccessMessage] = useState(null); // Message for success add status

=======
  const { user } = useAuth();
  console.log("user", user);
  // Destructure data and fetch function from custom hook
>>>>>>> origin/quatbt
  const {
    data: groups,
    error,
    loading,
    fetchAllRankingGroups,
    deleteRankingGroup,
    addRankingGroup,
  } = useRankingGroup();

<<<<<<< HEAD
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
=======
  // Fetch all ranking groups on component mount
  useEffect(() => {
    fetchAllRankingGroups();
  }, []); // Empty dependency array to run only once when the component mounts

  // Handlers for opening and closing the modal
  const handleOpenAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  const handleOpenDeleteModal = (groupId) => {
    setGroupToDelete(groupId); // Set group to be deleted
>>>>>>> origin/quatbt
    setShowDeleteModal(true);
  };
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

<<<<<<< HEAD
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
      setSuccessMessage("Group added successfully!"); // Set success message here
    } catch (error) {
      console.error("Failed to add group:", error);
      setAddMessage({ type: "danger", text: "Failed to add group!" });
=======
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
>>>>>>> origin/quatbt
    }
  };

  const handleDeleteGroup = async () => {
    try {
      if (groupToDelete) {
<<<<<<< HEAD
        await deleteRankingGroup(groupToDelete);
        setGroupToDelete(null);
        handleCloseDeleteModal();
        fetchAllRankingGroups();
        setDeleteMessage({ type: "success", text: "Group deleted successfully!" });
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
=======
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
>>>>>>> origin/quatbt

  return (
    <div style={{ marginTop: "60px" }}>
      <Slider />
      <div>
        <h2>
          <FaRankingStar /> Ranking Group List
        </h2>
<<<<<<< HEAD

        {successMessage && (
          <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible>
            {successMessage}
          </Alert>
        )}

        {deleteMessage && (
          <Alert variant={deleteMessage.type} onClose={() => setDeleteMessage(null)} dismissible>
            {deleteMessage.text}
          </Alert>
        )}

=======
>>>>>>> origin/quatbt
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
<<<<<<< HEAD
                    {group.currrentRankingDecision == null
                      ? "N/A"
                      : group.currrentRankingDecision}
=======
                    {group.currentRankingDecision == null
                      ? "N/A"
                      : group.currentRankingDecision}
>>>>>>> origin/quatbt
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

<<<<<<< HEAD
=======
        {/* Modal for delete group */}
>>>>>>> origin/quatbt
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

<<<<<<< HEAD
=======
        {/* Button to open modal for adding a new group */}
>>>>>>> origin/quatbt
        <Button variant="success" onClick={handleOpenAddModal}>
          Add New Group
        </Button>

<<<<<<< HEAD
=======
        {/* Modal for adding a new group */}
>>>>>>> origin/quatbt
        <Modal show={showAddModal} onHide={handleCloseAddModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Group</Modal.Title>
          </Modal.Header>
          <Modal.Body>
<<<<<<< HEAD
            {addMessage && (
              <Alert variant={addMessage.type} onClose={() => setAddMessage(null)} dismissible>
                {addMessage.text}
              </Alert>
            )}
=======
>>>>>>> origin/quatbt
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

<<<<<<< HEAD
export default RankingGroups;
=======
export default RankingGroups;
>>>>>>> origin/quatbt
