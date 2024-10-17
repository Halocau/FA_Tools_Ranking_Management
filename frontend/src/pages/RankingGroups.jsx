// src/pages/RankingGroups.jsx
import React, { useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';

const RankingGroups = () => {
  // Initial state for groups
  const [groups, setGroups] = useState([
    { id: 1, name: 'Trainer', employees: 2, decision: 'QDD01/Fsoft/ACCBED' },
    { id: 2, name: 'Supporter', employees: 3, decision: 'QDD01/Fsoft/ACCBED' },
    { id: 3, name: 'Class Manager', employees: 0, decision: 'QDD01/Fsoft/ACCBED' },
    { id: 4, name: 'Class Admin', employees: 0, decision: 'QDD01/Fsoft/ACCBED' },
    { id: 5, name: 'Marketing Clerk', employees: 0, decision: 'QDD01/Fsoft/ACCBED' },
  ]);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  // Handlers for opening and closing the modal
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setNewGroupName('');
  };

  // Handler for saving the new group
  const handleSaveGroup = () => {
    if (newGroupName.trim()) {
      const newGroup = {
        id: groups.length + 1, // Auto-incrementing ID
        name: newGroupName,
        employees: 0,
        decision: 'Pending', // Placeholder decision
      };
      setGroups([...groups, newGroup]); // Add new group to list
      handleCloseModal(); // Close the modal
    }
  };

  return (
    <div>
      <h2>Ranking Group List</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Group Name</th>
            <th>No. of Employee</th>
            <th>Current Ranking Decision</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <tr key={group.id}>
              <td>{group.id}</td>
              <td>{group.name}</td>
              <td>{group.employees}</td>
              <td>{group.decision}</td>
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
          ))}
        </tbody>
      </Table>

      {/* Button to open modal */}
      <Button variant="success" onClick={handleOpenModal}>Add New Group</Button>

      {/* Modal for adding new group */}
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
