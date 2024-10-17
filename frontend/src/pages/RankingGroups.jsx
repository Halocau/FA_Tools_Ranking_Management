// // src/pages/RankingGroups.jsx
// import React, { useState } from 'react';
// import { Table, Button, Modal, Form } from 'react-bootstrap';

// const RankingGroups = () => {
//   // Initial state for groups
//   const [groups, setGroups] = useState([
//     { id: 1, name: 'Trainer', employees: 2, decision: 'QDD01/Fsoft/ACCBED' },
//     { id: 2, name: 'Supporter', employees: 3, decision: 'QDD01/Fsoft/ACCBED' },
//     { id: 3, name: 'Class Manager', employees: 0, decision: 'QDD01/Fsoft/ACCBED' },
//     { id: 4, name: 'Class Admin', employees: 0, decision: 'QDD01/Fsoft/ACCBED' },
//     { id: 5, name: 'Marketing Clerk', employees: 0, decision: 'QDD01/Fsoft/ACCBED' },
//   ]);

//   // Modal state
//   const [showModal, setShowModal] = useState(false);
//   const [newGroupName, setNewGroupName] = useState('');

//   // Handlers for opening and closing the modal
//   const handleOpenModal = () => setShowModal(true);
//   const handleCloseModal = () => {
//     setShowModal(false);
//     setNewGroupName('');
//   };

//   // Handler for saving the new group
//   const handleSaveGroup = () => {
//     if (newGroupName.trim()) {
//       const newGroup = {
//         id: groups.length + 1, // Auto-incrementing ID
//         name: newGroupName,
//         employees: 0,
//         decision: 'Pending', // Placeholder decision
//       };
//       setGroups([...groups, newGroup]); // Add new group to list
//       handleCloseModal(); // Close the modal
//     }
//   };

//   return (
//     <div>
//       <h2>Ranking Group List</h2>
//       <Table striped bordered hover>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Group Name</th>
//             <th>No. of Employee</th>
//             <th>Current Ranking Decision</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {groups.map((group) => (
//             <tr key={group.id}>
//               <td>{group.id}</td>
//               <td>{group.name}</td>
//               <td>{group.employees}</td>
//               <td>{group.decision}</td>
//               <td>
//                 <Button variant="primary" size="sm">Edit</Button>{' '}
//                 <Button variant="warning" size="sm">Bulk Upload</Button>{' '}
//                 <Button
//                   variant="danger"
//                   size="sm"
//                   disabled={group.employees > 0}
//                 >
//                   Delete
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>

//       {/* Button to open modal */}
//       <Button variant="success" onClick={handleOpenModal}>Add New Group</Button>

//       {/* Modal for adding new group */}
//       <Modal show={showModal} onHide={handleCloseModal}>
//         <Modal.Header closeButton>
//           <Modal.Title>Add New Group</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group controlId="formGroupName">
//               <Form.Label>Group Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Enter group name"
//                 value={newGroupName}
//                 onChange={(e) => setNewGroupName(e.target.value)}
//               />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseModal}>
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={handleSaveGroup}>
//             Save
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default RankingGroups;





// src/pages/RankingGroups.jsx
import React, { useState } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';

const RankingGroups = () => {
  // Initial state for groups
  const [groups, setGroups] = useState([
    { id: 1, name: 'Trainer', employees: 2, decision: 'QDD01/Fsoft/ACCBED' },
    { id: 2, name: 'Supporter', employees: 3, decision: 'QDD01/Fsoft/ACCBED' },
    { id: 3, name: 'Class Manager', employees: 0, decision: 'QDD01/Fsoft/ACCBED' },
    { id: 4, name: 'Class Admin', employees: 0, decision: 'QDD01/Fsoft/ACCBED' },
    { id: 5, name: 'Marketing Clerk', employees: 0, decision: 'QDD01/Fsoft/ACCBED' },
  ]);

  // Modal state for adding a new group
  const [showModal, setShowModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  // Modal state for removing group confirmation
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [groupToRemove, setGroupToRemove] = useState(null);
  
  // Alert state for success/failure messages
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('');

  // Handlers for opening and closing modals
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setNewGroupName('');
  };

  const handleOpenRemoveModal = (group) => {
    setGroupToRemove(group);
    setShowRemoveModal(true);
  };

  const handleCloseRemoveModal = () => {
    setShowRemoveModal(false);
    setGroupToRemove(null);
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

  // Handler for removing a group
  const handleRemoveGroup = () => {
    if (groupToRemove) {
      setGroups(groups.filter(group => group.id !== groupToRemove.id));
      setAlertMessage(`Ranking Group "${groupToRemove.name}" successfully removed.`);
      setAlertVariant('success');
      handleCloseRemoveModal();
    } else {
      setAlertMessage('Error occurred removing Ranking Group. Please try again.');
      setAlertVariant('danger');
    }
  };

  return (
    <div>
      <h2>Ranking Group List</h2>
      
      {/* Alert for success/failure */}
      {alertMessage && (
        <Alert variant={alertVariant} onClose={() => setAlertMessage('')} dismissible>
          {alertMessage}
        </Alert>
      )}

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
                  onClick={() => handleOpenRemoveModal(group)}
                  disabled={group.employees > 0}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Button to open Add Group modal */}
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

      {/* Modal for confirming removal */}
      <Modal show={showRemoveModal} onHide={handleCloseRemoveModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Remove Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove the ranking group "{groupToRemove?.name}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRemoveModal}>
            No
          </Button>
          <Button variant="danger" onClick={handleRemoveGroup}>
            Yes, Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RankingGroups;
