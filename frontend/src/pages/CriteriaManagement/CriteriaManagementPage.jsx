import React, { useEffect, useState } from "react";
import { Box, Button, Typography, TextField, Modal } from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import useCriteria from "../../hooks/useCriteria"; // Import useCriteria hook
import Slider from "../../layouts/Slider.jsx";
import useRankingGroup from "../../hooks/useRankingGroup.jsx";
import "../../assets/css/RankingGroups.css";
import { useNavigate } from "react-router-dom";
import CriteriaAPI from "../../api/CriteriaAPI.js";
const CriteriaManagement = () => {
  const navigate = useNavigate();
  const { addCriteria, fetchAllCriteria, deleteCriteria, loading, error } =
    useCriteria(); // Sử dụng hook
  const apiRef = useGridApiRef();
  const [showAddCriteriaModal, setShowAddCriteriaModal] = useState(false);
  const [criteriaName, setCriteriaName] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const [criteria, setCriteria] = useState([]);
  const [pageSize, setpageSize] = useState(5);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [rows, setRows] = useState([]);

  const getAllCriteria = async () => {
    try {
      const data = await CriteriaAPI.searchCriteria(filter, page, pageSize);
      setCriteria(data.result);
      setTotalPages(data.pageInfo.total);
      setTotalElements(data.pageInfo.element);
    } catch (error) {
      console.error("Failed to fetch criteria:", error);
    }
  };

  useEffect(() => {
    getAllCriteria();
  }, [page, pageSize, filter]);

  console.log(criteria, totalPages, totalElements, page, pageSize);

  useEffect(() => {
    if (criteria) {
      const mappedRows = criteria.map((criteria, index) => ({
        id: criteria.criteriaId,
        index: index + 1,
        criteriaName: criteria.criteriaName,
        noOfOption: criteria.numOptions ? criteria.numOptions : 0,
        maxScore: criteria.maxScore ? criteria.maxScore : 0,
      }));
      setRows(mappedRows);
    }
  }, [criteria]);

  const handleOpenAddCriteriaModal = () => {
    setShowAddCriteriaModal(true);
    setCriteriaName("");
    setValidationMessage("");
  };

  const handleCloseAddCriteriaModal = () => {
    setShowAddCriteriaModal(false);
    setCriteriaName("");
    setValidationMessage("");
  };

  const handleAddCriteria = async () => {
    setValidationMessage("");
    let trimmedName = criteriaName.trim();

    if (!trimmedName) {
      setValidationMessage("Criteria name cannot be empty.");
      return;
    }

    if (trimmedName.length < 3 || trimmedName.length > 20) {
      setValidationMessage(
        "Criteria name must be between 3 and 20 characters."
      );
      return;
    }

    const nameRegex = /^[a-zA-Z0-9 ]+$/;
    if (!nameRegex.test(trimmedName)) {
      setValidationMessage(
        "Criteria name can only contain letters, numbers, and spaces."
      );
      return;
    }

    trimmedName = trimmedName.replace(/\b\w/g, (char) => char.toUpperCase());

    try {
      await CriteriaAPI.createCriteria({
        criteriaName: trimmedName,
        createdBy: 1,
      });
      setMessageType("success");
      setMessage("Criteria added successfully!");
      setTimeout(() => setMessage(null), 2000);
      handleCloseAddCriteriaModal();
      const updatedCriteria = await fetchAllCriteria();
      setCriteriaList(updatedCriteria);
    } catch (error) {
      console.error("Failed to add criteria:", error);
      setMessageType("error");
      setMessage("Failed to add criteria. Please try again.");
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const handleDeleteCriteria = async (criteriaId) => {
    try {
      await deleteCriteria(criteriaId);
      setMessageType("success");
      setMessage("Criteria deleted successfully!");
      setTimeout(() => setMessage(null), 2000);
      const updatedCriteria = await fetchAllCriteria();
      setCriteria(updatedCriteria);
    } catch (error) {
      console.error("Failed to delete criteria:", error);
      setMessageType("error");
      setMessage("Failed to delete criteria. Please try again.");
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const columns = [
    { field: "index", headerName: "ID", width: 80 },
    { field: "criteriaName", headerName: "Criteria Name", width: 300 },
    { field: "noOfOption", headerName: "No Of Option", width: 150 },
    { field: "maxScore", headerName: "Max Score", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            onClick={() => {
              navigate(`/criteria/edit/${params.row.id}`);
            }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleDeleteCriteria(params.row.id)}
            sx={{ marginLeft: 1 }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];
  console.log(rows);
  return (
    <div style={{ marginTop: "60px" }}>
      <Slider />
      <Box sx={{ marginTop: 4, padding: 2 }}>
        <Typography variant="h6">
          <a href="/ranking_decision">Ranking Decision List</a> {">"} Criteria
          List
        </Typography>
        <Box
          sx={{
            marginTop: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <Typography variant="h5">Criteria List</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenAddCriteriaModal}
            disabled={loading}
          >
            Add New Criteria
          </Button>
        </Box>

        <Box sx={{ width: "100%" }}>
          <DataGrid
            apiRef={apiRef}
            rows={rows}
            columns={columns}
            checkboxSelection
            pagination
            pageSizeOptions={[5, 10, 20]}
            loading={loading}
            getRowId={(row) => row.id}
            rowCount={totalElements}
            paginationMode="server" // Kích hoạt phân trang phía server
            paginationModel={{
              page: page - 1, // Adjusted for 0-based index
              pageSize: pageSize,
            }}
            onPaginationModelChange={(model) => {
              setPage(model.page + 1); // Set 1-based page for backend
              setpageSize(model.pageSize);
            }}
            disableNextButton={page >= totalPages}
            disablePrevButton={page <= 1}
            disableRowSelectionOnClick
          />
        </Box>

        <Modal
          open={showAddCriteriaModal}
          onClose={handleCloseAddCriteriaModal}
        >
          <Box
            sx={{
              padding: 2,
              backgroundColor: "white",
              borderRadius: 1,
              maxWidth: 400,
              margin: "auto",
              marginTop: "20vh",
            }}
          >
            <Typography variant="h6">Add New Criteria</Typography>
            <TextField
              label="Criteria Name"
              variant="outlined"
              fullWidth
              value={criteriaName}
              onChange={(e) => {
                setCriteriaName(e.target.value);
                setValidationMessage("");
              }}
              error={!!validationMessage}
              helperText={validationMessage}
              sx={{ marginTop: 2 }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 2,
              }}
            >
              <Button variant="outlined" onClick={handleCloseAddCriteriaModal}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleAddCriteria}
                disabled={loading}
              >
                Add
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </div>
  );
};

export default CriteriaManagement;
