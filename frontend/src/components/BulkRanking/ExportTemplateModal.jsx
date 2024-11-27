import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  Select,
  MenuItem,
  Alert,
  FormHelperText,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import * as XLSX from "xlsx";

const ExportTemplateModal = ({ open, handleClose, employees, rankingDecisions }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRankingDecision, setSelectedRankingDecision] = useState([]);
  const [selectedRank, setSelectedRank] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [rankError, setRankError] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const handleRankingDecisionChange = (event) => {
    setSelectedRankingDecision(event.target.value);
    setSelectedRank([]); // Reset rank selection when decision changes
    setRankError(false);
  };

  const handleRankChange = (event) => {
    if (selectedRankingDecision.length === 0) {
      setRankError(true);
    } else {
      setSelectedRank(event.target.value);
      setRankError(false);
    }
  };

  const handleSelectionModelChange = (selection) => {
    setSelectedEmployees(selection);
  };

  const handleExport = () => {
    if (selectedEmployees.length === 0) {
      setAlertMessage("No employees selected. Exporting a sample template.");
      const sampleData = [
        {
          id: 1,
          name: "Nguyen Van A",
          rankingGroup: "Sample Group",
          currentDecision: null,
          currentRank: null,
          total: null,
          assessmentRank: null,
          criteria1: null,
          criteria2: null,
        },
      ];
      exportToExcel(sampleData, "Export_Template_Sample.xlsx");
    } else {
      const dataToExport = employees
        .filter((emp) => selectedEmployees.includes(emp.id))
        .map((emp) => ({
          EmployeeID: emp.id,
          EmployeeName: emp.name,
          CurrentDecision: emp.currentDecision,
          CurrentRank: emp.currentRank,
          AssessmentRank: calculateAssessmentRank(emp),
          Total: calculateTotal(emp),
          ...generateCriteriaColumns(emp),
        }));
      exportToExcel(dataToExport, "Export_Template.xlsx");
      setAlertMessage("Export successful!");
    }

    handleClose();
  };

  const calculateTotal = (employee) => {
    return employee.criteria1 + employee.criteria2 || null;
  };

  const calculateAssessmentRank = (employee) => {
    return employee.total > 100 ? "Rank A" : null;
  };

  const generateCriteriaColumns = (employee) => {
    return {
      criteria1: employee.criteria1 || null,
      criteria2: employee.criteria2 || null,
    };
  };

  const exportToExcel = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ExportTemplate");
    XLSX.writeFile(workbook, fileName);
  };

  const columns = [
    { field: "id", headerName: "Employee ID", width: 150 },
    { field: "name", headerName: "Employee Name", width: 200 },
    { field: "rankingGroup", headerName: "Ranking Group", width: 200 },
    { field: "currentDecision", headerName: "Current Ranking Decision", width: 200 },
    { field: "currentRank", headerName: "Current Rank", width: 200 },
  ];

  const filteredRows = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          maxWidth: 1200,
          margin: "50px auto",
          padding: 4,
          backgroundColor: "white",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Export Template
        </Typography>

        {/* Search Bar */}
        <TextField
          fullWidth
          label="Search by Employee Name or ID"
          value={searchQuery}
          onChange={handleSearch}
          sx={{ marginBottom: 2 }}
        />

        {/* Ranking Decision Filter */}
        <Select
          multiple
          fullWidth
          value={selectedRankingDecision}
          onChange={handleRankingDecisionChange}
          displayEmpty
          sx={{ marginBottom: 2 }}
        >
          <MenuItem disabled value="">
            Select Current Ranking Decision
          </MenuItem>
          {rankingDecisions.map((decision) => (
            <MenuItem key={decision} value={decision}>
              {decision}
            </MenuItem>
          ))}
        </Select>

        {/* Rank Filter */}
        <Select
          multiple
          fullWidth
          value={selectedRank}
          onChange={handleRankChange}
          displayEmpty
          sx={{ marginBottom: 2 }}
        >
          <MenuItem disabled value="">
            Select Current Rank
          </MenuItem>
          {selectedRankingDecision.length > 0 ? (
            ["Rank 1", "Rank 2", "Rank 3"].map((rank) => (
              <MenuItem key={rank} value={rank}>
                {rank}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>
              You need to select Current Ranking Decision first
            </MenuItem>
          )}
        </Select>
        {rankError && (
          <FormHelperText error>
            You need to select Current Ranking Decision first
          </FormHelperText>
        )}

        {/* Alert Message */}
        {alertMessage && <Alert severity="info">{alertMessage}</Alert>}

        {/* Data Table */}
        <DataGrid
          rows={filteredRows}
          columns={columns}
          checkboxSelection
          onSelectionModelChange={handleSelectionModelChange}
          sx={{ height: 300, marginBottom: 2 }}
        />

        {/* Export Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleExport}
        >
          Export
        </Button>
      </Box>
    </Modal>
  );
};

export default ExportTemplateModal;
