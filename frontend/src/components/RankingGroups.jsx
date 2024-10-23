// src/components/RankingGroupTable.jsx
import React from 'react';
import { Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const RankingGroupTable = ({ groups }) => {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID</th>
          <th>Group Name</th>
          <th>No. of Employees</th>
          <th>Current Ranking Decision</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {groups.map((group) => (
          <tr key={group.id}>
            <td>{group.id}</td>
            <td>{group.name}</td>
            <td>{group.employees}</td>
            <td>{group.currrentRankingDecision}</td>
            <td>
              <Link to={`/edit-group/${group.id}`}>
                <Button variant="primary" size="sm" className="me-2">
                  Edit
                </Button>
              </Link>
              {group.employees === 0 && (
                <Button variant="danger" size="sm">
                  Delete
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default RankingGroupTable;
