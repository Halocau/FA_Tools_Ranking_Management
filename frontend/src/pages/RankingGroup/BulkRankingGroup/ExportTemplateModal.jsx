import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CSVLink, CSVDownload } from "react-csv";
// ExportTemplateModal.jsx
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
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
// API
import EmpoyeeAPI from "../../../api/EmployeeAPI.js";
//Common
import SearchComponent from "../../../components/Common/Search.jsx";
// Hooks
import useNotification from "../../../hooks/useNotification";
const ExportTemplateModal = ({ open, handleClose, onExport }) => {
  const navigate = useNavigate(); // To navigate between pages
  const { id } = useParams(); // Get the ID from the URL
  // ApiRef
  const apiRef = useGridApiRef(); // Create apiRef to select multiple groups to delete
  // Employee
  const [employees, setEmployees] = useState([]);
  const [rankingDecisions, setRankingDecisions] = useState([]);
  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRankingDecision, setSelectedRankingDecision] = useState([]);
  const [selectedRank, setSelectedRank] = useState([]);
  // Select Employee
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  //Table
  const [rows, setRows] = useState([]);
  // Use hook notification
  const [showSuccessMessage, showErrorMessage] = useNotification();
  // Load Data
  //  Destructuring from RankingGroupAPI custom API
  const getAllEmployees = async () => {
    try {
      const data = await EmpoyeeAPI.getAllEmployee(id);
      setEmployees(data);
      const uniqueRankingDecisions = [
        ...new Set(data.map((item) => item.currentRankingDecision)),
      ];
      setRankingDecisions(uniqueRankingDecisions);
    } catch (error) {
      // Extract the error message from the response
      const errorMessage =
        error.response?.data?.detailMessage || "An unexpected error occurred."; // Default message if no specific message found
      showErrorMessage(errorMessage); // Set the error message from API response
      setEmployees([]);
    }
  };
  useEffect(() => {
    getAllEmployees();
  }, [id]);

  ////////////////////////////////////////////////////////////// Sreach //////////////////////////////////////////////////////////////
  // Khi thay đổi giá trị tìm kiếm
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter employees based on search query, selected ranking decision, and selected rank
    filterRows(query, selectedRankingDecision, selectedRank);
  };
  // Khi thay đổi Ranking Decision
  const handleRankingDecisionChange = (event) => {
    const decision = event.target.value;
    setSelectedRankingDecision(decision);
    setSelectedRank(""); // Reset rank selection when decision changes
    setRankError(false);

    // Filter rows based on the selected decision
    filterRows(searchQuery, decision, selectedRank);
  };
  // Khi thay đổi Current Rank
  const handleRankChange = (event) => {
    const rank = event.target.value;
    setSelectedRank(rank);
    setRankError(false);

    // Filter rows based on the selected rank
    filterRows(searchQuery, selectedRankingDecision, rank);
  };
  const filterRows = (query, decision, rank) => {
    let filteredEmployees = employees;
    // Filter based on the search query
    if (query) {
      filteredEmployees = filteredEmployees.filter(
        (employee) =>
          employee.employeeName.toLowerCase().includes(query.toLowerCase()) ||
          employee.employeeId.toString().includes(query)
      );
    }
    // Filter based on the selected ranking decision
    if (decision) {
      filteredEmployees = filteredEmployees.filter(
        (employee) => employee.currentRankingDecision === decision
      );
    }
    // Filter based on the selected rank
    if (rank) {
      filteredEmployees = filteredEmployees.filter(
        (employee) => employee.currentRank === rank
      );
    }
    // Map the filtered data to the table rows
    const mappedRows = filteredEmployees.map((employee) => ({
      id: employee.employeeId,
      name: employee.employeeName,
      rankingGroup: employee.decisionName,
      currentDecision: employee.currentRankingDecision,
      currentRank: employee.currentRank,
    }));
    setRows(mappedRows);
  };
  ////////////////////////////////////////////////////////////// Select //////////////////////////////////////////////////////////////
  const handleSelectionModelChange = (selection) => {
    setSelectedEmployees(selection);
  };
  ////////////////////////////////////////////////////////////// Table//////////////////////////////////////////////////////////////
  const columns = [
    { field: "id", headerName: "Employee ID", width: 150 },
    { field: "name", headerName: "Employee Name", width: 200 },
    { field: "rankingGroup", headerName: "Ranking Group", width: 200 },
    {
      field: "currentDecision",
      headerName: "Current Ranking Decision",
      width: 200,
    },
    { field: "currentRank", headerName: "Current Rank", width: 200 },
  ];

  useEffect(() => {
    if (employees) {
      const mappedRows = employees.map((employees) => ({
        id: employees.employeeId,
        name: employees.employeeName,
        rankingGroup: employees.decisionName,
        currentDecision: employees.currentRankingDecision,
        currentRank: employees.currentRank,
      }));
      setRows(mappedRows);
    }
  }, [employees]);

  //Data Export
  const exportData = selectedEmployees.map((id) =>
    employees.find((employee) => employee.employeeId === id)
  );

  //Header Of File Export
  const csvHeaders = [
    { label: "Employee ID", key: "employeeId" },
    { label: "Employee Name", key: "employeeName" },
    { label: "Ranking Group", key: "decisionName" },
    { label: "Current Ranking Decision", key: "currentRankingDecision" },
    { label: "Current Rank", key: "currentRank" },
  ];

  return (
    <Modal sx={{ marginTop: 2 }} open={open} onClose={handleClose}>
      <Box
        sx={{
          maxWidth: 1200,
          width: "95%", // Đảm bảo modal chiếm gần hết chiều ngang màn hình
          margin: "auto",
          padding: 4,
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 24,
        }}
      >
        {/* Tiêu đề với icon đóng trong phần tiêu đề */}
        <Box
          sx={{
            marginTop: -4,
            width: 1200,
            marginLeft: -4,
            height: "40px",
            backgroundColor: "#1976d2",
            color: "white",
            padding: "10px",
            borderRadius: "4px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Typography
            variant="a"
            sx={{
              fontWeight: "bold",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            Export Template
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        {/* Thanh tìm kiếm */}
        <Box sx={{ width: 1200, marginTop: 4, marginBottom: 3 }}>
          <SearchComponent onSearch={handleSearch} placeholder="Search" />
        </Box>

        {/* Bộ lọc Ranking Decision và Current Rank */}
        <Box
          sx={{
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <Typography sx={{ display: "flex", width: 130 }} variant="a">
            {" "}
            Current Ranking Decision{" "}
          </Typography>
          {/* Bộ lọc Ranking Decision */}
          <Box>
            <Select
              fullWidth
              value={selectedRankingDecision}
              onChange={handleRankingDecisionChange}
              displayEmpty
              sx={{
                backgroundColor: "white",
                borderRadius: "8px",
                width: 400,
                height: 40,
                marginRight: 20,
              }}
            >
              <MenuItem
                disabled
                value="Select Current Ranking Decision"
              ></MenuItem>
              {rankingDecisions.map((decision) => (
                <MenuItem key={decision} value={decision}>
                  {decision}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Typography sx={{ display: "flex", width: 30 }} variant="a">
            {" "}
            Current Rank{" "}
          </Typography>
          {/* Bộ lọc Current Rank */}
          <Box>
            <Select
              fullWidth
              value={selectedRank}
              onChange={handleRankChange}
              displayEmpty
              sx={{
                backgroundColor: "white",
                borderRadius: "8px",
                width: 300,
                height: 40,
              }}
            >
              <MenuItem disabled value="Select Current Rank"></MenuItem>
              {selectedRankingDecision.length > 0 ? (
                // Filter employees based on the selected Ranking Decision
                employees
                  .filter(
                    (employee) =>
                      employee.currentRankingDecision ===
                      selectedRankingDecision
                  )
                  .map((employee) => (
                    <MenuItem
                      key={employee.employeeId}
                      value={employee.currentRank}
                    >
                      {employee.currentRank}
                    </MenuItem>
                  ))
              ) : (
                <MenuItem disabled>
                  You need to select Current Ranking Decision first
                </MenuItem>
              )}
            </Select>
          </Box>
        </Box>
        {/* Bảng dữ liệu */}
        <Box
          sx={{
            width: "100%",
            height: 400,
            border: "2px solid black",
            borderRadius: "8px",
            padding: "16px",
            overflow: "auto", // Thêm scroll nếu nội dung dài
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            hideFooter
            autoHeight
            sx={{
              "& .MuiDataGrid-columnHeader": {
                textAlign: "center", // Căn giữa header
                backgroundColor: "#f5f5f5",
              },
              "& .MuiDataGrid-row": {
                "&:nth-of-type(even)": {
                  backgroundColor: "#f9f9f9", // Tô màu hàng chẵn
                },
              },
            }}
          />
        </Box>

        {/* Nút Export */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
          <Button variant="contained" color="primary">
            <CSVLink
              data={exportData}
              headers={csvHeaders}
              filename="employees.csv"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              Export 
            </CSVLink>
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ExportTemplateModal;
