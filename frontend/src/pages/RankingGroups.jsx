import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import useRankingGroup from '../hooks/useRankingGroup';

const RankingGroups = () => {
  // State for modal controls and new group name
  const [showModal, setShowModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  // Destructure data and fetch function from custom hook
  const { data: groups, error, loading, fetchAllRankingGroups } = useRankingGroup();

  // Fetch all ranking groups on component mount
  useEffect(() => {
    fetchAllRankingGroups();
  }, []); // Empty dependency array to run only once when the component mounts

  // Handlers for opening and closing the modal
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setNewGroupName('');
  };

  // Handler for saving the new group (currently only adds a group locally)
  const handleSaveGroup = () => {
    if (newGroupName.trim()) {
      const newGroup = {
        id: groups.length + 1, // Auto-incrementing ID (consider refactoring to handle server-side ID if needed)
        name: newGroupName,
        employees: 0,
        decision: 'Pending', // Placeholder decision
      };
      setGroups([...groups, newGroup]); // Add new group locally
      handleCloseModal(); // Close the modal
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

  return (
    <div>
      <h2>Ranking Group List</h2>

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
                <td>{group.numEmployees < 1 ? 'N/A' : group.numEmployees}</td>
                <td>{group.currentRankingDecision == null ? 'N/A' : group.currentRankingDecision}</td>
                <td>
                  <Button variant="primary" size="sm">Edit</Button>{' '}
                  <Button variant="warning" size="sm">Bulk Upload</Button>{' '}
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={group.employees > 0}
                  >
                    Delete
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

      {/* Button to open modal */}
      <Button variant="success" onClick={handleOpenModal}>
        Add New Group
      </Button>

      {/* Modal for adding a new group */}
      <Modal show={showModal} onHide={handleCloseModal}>
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
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveGroup}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RankingGroups;
