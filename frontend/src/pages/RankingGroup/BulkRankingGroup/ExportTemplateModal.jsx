import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Modal,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import { InputAdornment } from "@mui/material";
import * as XLSX from "xlsx";
import EmployeeAPI from "../../../api/EmployeeAPI.js";
import SearchComponent from "../../../components/Common/Search.jsx";
import useNotification from "../../../hooks/useNotification";

const ExportTemplateModal = ({ open, handleClose, onExport }) => {
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
  const [rankError, setRankError] = useState(false);
  // Select Employee
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  //Table
  const [rows, setRows] = useState([]);
  // Use hook notification
  const [showSuccessMessage, showErrorMessage] = useNotification();
  const [loading, setLoading] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false); // Global loading state for mock-up loading

  ////////////////////////////////////////////////////////////// Load Data //////////////////////////////////////////////////////////////
  const getAllEmployees = async () => {
    try {
      // Gọi API từ bảng Employee
      const data = await EmployeeAPI.getAllEmployee(id);
      setEmployees(data);

      const uniqueRankingDecisions = [
        ...new Set(data.map((item) => item.currentRankingDecision)),
      ];
      setRankingDecisions(uniqueRankingDecisions);

      // Tạo danh sách dữ liệu để hiển thị
      const mappedRows = data.map((employee) => ({
        employeeId: employee.employeeId,
        employeeName: employee.employeeName,
        rankingGroup: employee.rankingGroupName,
        currentDecision: employee.currentRankingDecision,
        currentRank: employee.currentRank,
      }));
      setRows(mappedRows);
    } catch (error) {
      const errorMessage =
        error.response?.data?.detailMessage || "An unexpected error occurred.";
      showErrorMessage(errorMessage);
      setEmployees([]);
    }
  };
  useEffect(() => {
    if (open) {
      getAllEmployees();
    }
  }, [id, open]);

  ////////////////////////////////////////////////////////////// Sreach //////////////////////////////////////////////////////////////
  const handleSearch = (event) => {
    const query = event;
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
    filterRows(searchQuery, decision);
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
    // Filter based on search query (ID and Name)
    if (query) {
      console.log(query);
      filteredEmployees = filteredEmployees.filter(
        (employee) =>
          employee.employeeId.toString().includes(query) || // Tìm theo ID
          employee.employeeName.toLowerCase().includes(query.toLowerCase()) // Tìm theo tên
      );
    }

    // Filter based on the selected ranking decision
    if (decision && decision.length > 0) {
      filteredEmployees = filteredEmployees.filter(
        (employee) => employee.currentRankingDecision === decision
      );
    }
    // Filter based on the selected rank
    if (rank && rank.length > 0) {
      filteredEmployees = filteredEmployees.filter(
        (employee) => employee.currentRank === rank
      );
    }

    // Map the filtered data to the table rows
    const mappedRows = filteredEmployees.map((employee) => ({
      employeeId: employee.employeeId,
      employeeName: employee.employeeName,
      rankingGroup: employee.rankingGroupName,
      currentDecision: employee.currentRankingDecision,
      currentRank: employee.currentRank,
    }));

    setRows(mappedRows); // Update the rows to reflect the filtered data
  };

  //
  const capitalizeFirstLetterEachWord = (string) => {
    return string
      .split(" ") // Split string to word
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Uppercase
      .join(" "); // Connect words
  };

  ////////////////////////////////////////////////////////////// Select //////////////////////////////////////////////////////////////
  // Function to export selected data to Excel
  const handleSelectionModelChange = async () => {
    try {
      setGlobalLoading(true); // Start global loading
      const selectedIDs = Array.from(apiRef.current.getSelectedRows().keys());

      if (selectedIDs.length === 0) {
        showErrorMessage("No rows selected to export.");
        setGlobalLoading(false); // Stop global loading
        return;
      }

      const detailedEmployees = await EmployeeAPI.getEmployeeCriteria(id);
      const selectedData = detailedEmployees.filter((employee) =>
        selectedIDs.includes(employee.employeeId)
      );

      const worksheetData = selectedData.map((employee) => {
        const criteriaColumns = employee.criteriaList.reduce(
          (acc, criteria) => {
            acc[
              criteria.criteriaName
            ] = `${criteria.score} - ${criteria.optionName}`;
            return acc;
          },
          {}
        );

        return {
          employeeId: employee.employeeId,
          employeeName: employee.employeeName,
          currentRankingDecision: employee.currentRankingDecision,
          currentRank: employee.currentRank,
          assessmentRank: employee.assessmentRank,
          ...criteriaColumns,
          totalScore: employee.totalScore,
        };
      });

      const headers = Object.keys(worksheetData[0]).map((key) =>
        key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
      );

      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      headers.forEach((header, index) => {
        worksheet[`${String.fromCharCode(65 + index)}1`] = { v: header };
      });

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

      XLSX.writeFile(workbook, "Selected_Employees.xlsx");

      setGlobalLoading(false); // Stop global loading
      showSuccessMessage("Export successful!");
      handleClose();
    } catch (error) {
      setGlobalLoading(false); // Stop global loading on error
      showErrorMessage(
        error.response?.data?.detailMessage ||
          "An error occurred while exporting."
      );
    }
  };

  ////////////////////////////////////////////////////////////// Table//////////////////////////////////////////////////////////////
  const columns = [
    { field: "employeeId", headerName: "Employee ID", width: 150 },
    { field: "employeeName", headerName: "Employee Name", width: 200 },
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
        employeeId: employees.employeeId,
        employeeName: employees.employeeName,
        rankingGroup: employees.rankingGroupName,
        currentDecision: employees.currentRankingDecision,
        currentRank: employees.currentRank,
      }));
      setRows(mappedRows);
    }
  }, [employees]);

  return (
    <div>
      {/* Mock-up Global Loading */}
      {globalLoading && (
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            padding: 4,
            borderRadius: "8px",
            boxShadow: 24,
            zIndex: 1301,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress sx={{ color: "white", marginBottom: 2 }} />
          <Typography variant="body1" sx={{ color: "white" }}>
            Processing...
          </Typography>
        </Box>
      )}
      <Modal sx={{ marginTop: 2 }} open={open} onClose={handleClose}>
        <Box
          sx={{
            maxWidth: 1200,
            width: "95%",
            margin: "auto",
            padding: 4,
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: 24,
            position: "relative", // Để cố định spinner ở giữa
          }}
        >
          {/* Loading Spinner */}
          {loading && (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1000,
              }}
            >
              <CircularProgress />
            </Box>
          )}

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
          {/* Search */}
          <Box sx={{ width: 1200, marginTop: 4, marginBottom: 3 }}>
            <SearchComponent onSearch={handleSearch} placeholder="Search" />
          </Box>

          {/* Filter for Ranking Decision & Current Rank */}
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
            {/* Filter Ranking Decision */}
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
                renderValue={(value) => value || "Select a decision"}
                endAdornment={
                  // Thêm biểu tượng Clear vào trong Select
                  <InputAdornment position="end">
                    {selectedRankingDecision && (
                      <IconButton
                        size="small"
                        sx={{ position: "absolute", right: 30 }} // Đặt vị trí của biểu tượng Clear
                        onClick={() => setSelectedRankingDecision("")}
                      >
                        <ClearIcon />
                      </IconButton>
                    )}
                  </InputAdornment>
                }
              >
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
                value={selectedRank || ""}
                onChange={handleRankChange}
                displayEmpty
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  width: 300,
                  height: 40,
                }}
                renderValue={(value) => value || "Select a decision"}
                endAdornment={
                  // Thêm biểu tượng Clear vào trong Select
                  <InputAdornment position="end">
                    {selectedRankingDecision && (
                      <IconButton
                        size="small"
                        sx={{ position: "absolute", right: 30 }} // Đặt vị trí của biểu tượng Clear
                        onClick={() => setSelectedRank("")}
                      >
                        <ClearIcon />
                      </IconButton>
                    )}
                  </InputAdornment>
                }
              >
                {selectedRankingDecision.length > 0 ? (
                  // Lọc nhân viên theo Current Ranking Decision
                  employees
                    .filter(
                      (employee) =>
                        employee.currentRankingDecision ===
                        selectedRankingDecision
                    )
                    .reduce((acc, employee) => {
                      // Kiểm tra xem currentRank đã xuất hiện chưa
                      if (
                        !acc.some(
                          (item) => item.currentRank === employee.currentRank
                        )
                      ) {
                        acc.push(employee); // Thêm nhân viên vào mảng nếu currentRank chưa có
                      }
                      return acc;
                    }, [])
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
              apiRef={apiRef} // Truyền apiRef vào DataGrid
              rows={rows}
              columns={columns}
              getRowId={(row) => row.employeeId}
              checkboxSelection
              disableRowSelectionOnClick
              hideFooter
              autoHeight
              onSelectionModelChange={(newSelection) =>
                handleSelectionModelChange(newSelection)
              } // Sự kiện này sẽ truyền đúng newSelection
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
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleSelectionModelChange}
              disabled={loading}
            >
              Export
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ExportTemplateModal;
