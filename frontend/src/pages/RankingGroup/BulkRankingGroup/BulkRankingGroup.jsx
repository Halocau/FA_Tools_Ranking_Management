// react
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { FaInfo } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";
// Mui
import {
  InputAdornment,
  Box,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  IconButton,
  Switch,
  FormControlLabel,
  Alert,
  FormHelperText,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import InfoIcon from "@mui/icons-material/Info";
import Autocomplete from "@mui/material/Autocomplete";
// Css
import "../../../assets/css/RankingGroups.css";
// Source code
// API
import RankingGroupAPI from "../../../api/RankingGroupAPI.js";
import BulkRankingAPI from "../../../api/BulkRankingAPI.js";
//Common
import SearchComponent from "../../../components/Common/Search.jsx";
// Contexts
import { useAuth } from "../../../contexts/AuthContext.jsx";
// Hooks
import useNotification from "../../../hooks/useNotification";
// Layouts
import Slider from "../../../layouts/Slider.jsx";
//Filter
import { sfLike, sfEqual, sfAnd } from "spring-filter-query-builder";
//Export
import ExportTemplateModal from "./ExportTemplateModal.jsx";
//Import
import BulkRankingModal from "./BulkRankingModal.jsx";
import * as XLSX from "xlsx";

const BulkRankingGroup = () => {
  const { id } = useParams(); // Get the ID from the URL
  // Group Info
  const [groupInfo, setGroupInfo] = useState({
    groupName: "",
    currentRankingDecision: "",
  });
  // Export popup
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  // Import popup
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Table  List
  const [rows, setRows] = useState([]); // Initialize with empty array
  const [bulkRankingGroup, setBulkRankingGroup] = useState([]);
  const [filter, setFilter] = useState(`rankingGroupId : ${id}`);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  // Use hook notification
  const [showSuccessMessage, showErrorMessage] = useNotification();
  // Status
  const [validationMessage, setValidationMessage] = useState(""); // Validation error message

  const [file, setFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //////////////////////////////////////////////////////////// Group Info ////////////////////////////////////////////////////////////
  const RankingGroupInfo = async () => {
    try {
      const groupData = await RankingGroupAPI.getRankingGroupById(id);
      setGroupInfo(groupData);
      // console.log(groupData);
    } catch (error) {
      console.error("Error fetching group:", error);
    }
  };

  //// Fetch Ranking Group on id change
  useEffect(() => {
    RankingGroupInfo();
  }, [id]);
  ////////////////////////////////////////////////////////////// Sreach //////////////////////////////////////////////////////////////
  const handleSearch = (query) => {
    console.log(query);
    if (query) {
      setFilter(
        sfAnd([
          sfEqual("rankingGroupId", id),
          sfLike("fileName", query),
        ]).toString()
      );
    } else {
      setFilter(`rankingGroupId : ${id}`);
    }
  };

  ///////////////////////////////////////////////////////// Table /////////////////////////////////////////////////////////
  const getBulkRankingGroup = async () => {
    try {
      const response = await BulkRankingAPI.viewBulkHistory(
        filter,
        page,
        pageSize
      );
      setBulkRankingGroup(response.result);
      setTotalPages(response.pageInfo.total);
      setTotalElements(response.pageInfo.element);
    } catch (error) {
      console.error("Error fetching group:", error);
    }
  };
  useEffect(() => {
    getBulkRankingGroup();
  }, [id, filter, page, pageSize]);

  const addNewBulkRanking = async (data) => {
    try {
      const response = await BulkRankingAPI.addNewBulkRanking(data);
      return response;
    } catch (error) {
      console.error("Error fetching group:", error);
    }
  }

  // Columns configuration for the DataGrid
  const columns = [
    { field: "fileName", headerName: "File Name", width: 200 },
    { field: "rankingdecision", headerName: "Ranking Decision", width: 300 },
    { field: "uploadedAt", headerName: "Uploaded At", width: 130 },
    { field: "uploadedBy", headerName: "Uploaded By", width: 130 },
    { field: "status", headerName: "Status", width: 130 },
    { field: "note", headerName: "Note", width: 300 },
  ];


  useEffect(() => {
    if (bulkRankingGroup) {
      const mappedRows = bulkRankingGroup.map((bulkRankingGroup, index) => ({
        id: bulkRankingGroup.historyId,
        fileName: bulkRankingGroup.fileName,
        rankingdecision: bulkRankingGroup.decisionName,
        uploadedAt: bulkRankingGroup.uploadedAt
          ? bulkRankingGroup.uploadedAt
          : "N/A",
        uploadedBy: bulkRankingGroup.uploadByName
          ? bulkRankingGroup.uploadByName
          : "N/A",
        status: bulkRankingGroup.status ? bulkRankingGroup.status : "N/A",
        note: bulkRankingGroup.note,
      }));
      setRows(mappedRows);
    }
  }, [bulkRankingGroup]);

  ///////////////////////////////////////////////////////// BulkRankingGroup /////////////////////////////////////////////////////////
  //// Import
  const handleOpenImportModal = () => {
    setIsImportModalOpen(true);
  };

  const handleCloseImportModal = () => {
    setIsImportModalOpen(false);
  };
  //// Export
  // Toggle modal
  const handleOpenExportModal = () => setIsExportModalOpen(true);
  const handleCloseExportModal = () => setIsExportModalOpen(false);
  // End code


  return (
    <div style={{ marginTop: "60px" }}>
      <Slider />
      <Box sx={{ marginTop: 4, padding: 2 }}>
        {/* Group Info */}
        <Box>
          <Typography variant="h6">
            <a href="/ranking-group">Ranking Group List</a> {<FaAngleRight />}
            Bulk Ranking Group
          </Typography>
          <Box
            sx={{
              border: "1px solid black",
              borderRadius: "4px",
              padding: "16px",
              marginTop: "16px",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ width: "48%" }}>
                <Typography>Group Name:</Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={groupInfo.groupName}
                  disabled
                />
              </Box>
              <Box sx={{ width: "48%" }}>
                <Typography>Current Ranking Decision:</Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={groupInfo.currentRankingDecision}
                  disabled
                />
              </Box>
            </Box>
          </Box>
        </Box>
        {/* Button */}
        <Box
          sx={{
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <Typography sx={{ display: "flex", gap: 1, width: 350 }} variant="h6">
            Bulk Ranking History
          </Typography>
          <SearchComponent onSearch={handleSearch} width={200} />
          <Box sx={{ display: "flex", gap: 1, height: 40 }}>
            {" "}
            {/* Sử dụng gap để tạo khoảng cách giữa các nút */}
            <Button
              sx={{ width: 160 }}
              variant="contained"
              color="primary"
              onClick={handleOpenExportModal}
            >
              Export Template
            </Button>
            {/* Modal xuất template */}
            <ExportTemplateModal
              open={isExportModalOpen}
              handleClose={handleCloseExportModal}
              // employees={employees}
              // rankingDecisions={rankingDecisions}
              onExport={(selectedEmployees) => {
                console.log(
                  "Selected Employees for Export:",
                  selectedEmployees
                );
                handleCloseExportModal();
              }}
            />
            <Button
              sx={{ width: 130 }}
              variant="contained"
              color="primary"
              onClick={handleOpenImportModal}
            >
              Bulk Ranking
            </Button>
            {/* Modal bulk ranking */}
            <BulkRankingModal
              open={isImportModalOpen}
              handleClose={handleCloseImportModal}
              showSuccessMessage={showSuccessMessage}
              showErrorMessage={showErrorMessage}
              currentGroup={groupInfo}
              addNewBulkRanking={addNewBulkRanking}
              fetchBulkRankings={getBulkRankingGroup}
            />
          </Box>
        </Box>
        {/* Table */}
        <Box sx={{ width: "100%", height: 350 }}>
          <DataGrid
            className="custom-data-grid"
            rows={rows}
            columns={columns}
            pagination
            pageSizeOptions={[5, 10, 25]}
            getRowId={(row) => row.id}
            rowCount={totalElements}
            paginationMode="server"
            paginationModel={{
              page: page - 1, // Adjusted for 0-based index
              pageSize: pageSize,
            }}
            onPaginationModelChange={(model) => {
              setPage(model.page + 1); // Set 1-based page for backend
              setPageSize(model.pageSize);
            }}
            disableNextButton={page >= totalPages}
            disablePrevButton={page <= 1}
          />
        </Box>
      </Box>
    </div>
  );
};

export default BulkRankingGroup;
