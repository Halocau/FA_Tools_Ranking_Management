import React, { useEffect, useState } from "react";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { FaEdit, FaAngleRight } from "react-icons/fa";

import { Box, Button, Typography, TextField, IconButton, Table, TableHead, TableBody, TableRow, TableCell, Modal, Alert } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useParams, useNavigate } from "react-router-dom";
import useRankingDecision from "../../hooks/useRankingDecision";
import ModalCustom from "../../components/Common/Modal.jsx";
import "../../assets/css/RankingGroups.css";
import Slider from "../../layouts/Slider.jsx";
import useNotification from "../../hooks/useNotification";
import OptionAPI from "../../api/OptionAPI.js";
import CriteriaAPI from "../../api/CriteriaAPI.js";
import SearchComponent from "../../components/Common/Search.jsx";
const EditCriteria = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const apiRef = useGridApiRef();

    const { fetchCriteriaById, updateCriteria, addOptionToCriteria, updateOption, deleteOption } = useRankingDecision();

    const [criteria, setCriteria] = useState({});
    const [showEditNameModal, setShowEditNameModal] = useState(false);
    const [newCriteriaName, setNewCriteriaName] = useState("");
    const [showAddOptionModal, setShowAddOptionModal] = useState(false);
    const [showEditOptionModal, setShowEditOptionModal] = useState(false);

    const [newOption, setNewOption] = useState({ name: "", score: "", explanation: "" });
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");
    const [options, setOptions] = useState([]);
    const [pageSize, setpageSize] = useState(5);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState(`criteriaId : ${id}`);
    const [showSuccessMessage, showErrorMessage] = useNotification();
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [rows, setRows] = useState([]);


    useEffect(() => {
        getCriteria();
    }, [id]);
    console.log("criteria:", criteria);
    useEffect(() => {
        getAllOptionByID();
    }, [page, pageSize, filter]);

    const getCriteria = async () => {
        try {
            const data = await CriteriaAPI.getCriteriaById(id);
            setCriteria(data);
        } catch (error) {
            showErrorMessage("Some error ocured. Failed to load data.");
        }
    }

    const getAllOptionByID = async () => {
        try {
            const data = await OptionAPI.searchOptions(
                filter,
                page,
                pageSize
            )
            setOptions(data.result);
            setTotalPages(data.pageInfo.total);
            setTotalElements(data.pageInfo.element);
        } catch (error) {
            showErrorMessage("Some error ocured. Failed to load data.");
        }
    }

    useEffect(() => {
        try {
            if (options) {
                const mappedRows = options.map((option, index) => ({
                    id: option.optionId,
                    index: index + 1 + (page - 1) * 5,
                    optionName: option.optionName,
                    score: option.score,
                    description: option.description
                }));
                setRows(mappedRows);
            }
        } catch (error) {

        }
    }, [options])

    const handleOpenEditNameModal = () => {
        setNewCriteriaName(criteria?.criteriaName || "");
        setShowEditNameModal(true);
    };

    const handleSaveNewCriteriaName = async () => {
        try {
            const data = await CriteriaAPI.updateCriteria(id, { criteriaName: newCriteriaName, updatedBy: localStorage.getItem("userId") });
            setCriteria(data);
            showSuccessMessage("Criteria name updated successfully!");
        } catch (error) {
            setMessage("Failed to update criteria name.");
            setMessageType("error");
        }
        setShowEditNameModal(false);
    };

    const handleOpenAddOptionModal = () => {
        setNewOption({ name: "", score: "", explanation: "" });
        setShowAddOptionModal(true);
    };

    const handleOpenEditOptionModal = (option) => {
        setNewOption(option);
        setShowEditOptionModal(true);
    };

    const handleAddOption = async () => {
        try {
            const optionData = {
                optionName: newOption.name,
                score: newOption.score,
                description: newOption.description,
                createdBy: localStorage.getItem("userId"),
                criteriaId: id
            }
            const data = await OptionAPI.createOption(optionData);
            setTotalElements(totalElements + 1);
            if (options.length < pageSize) {
                getAllOptionByID();
            } else {
                setTotalPages(totalPages + 1);
            }
            showSuccessMessage("Option added successfully!");
        } catch (error) {
            showErrorMessage("Failed to add option.")
        }
        setShowAddOptionModal(false);
    };

    const handleDeleteOption = async (optionId) => {
        try {
            await OptionAPI.deleteOption(optionId);
            setOptions(options.filter((option) => option.optionId !== optionId));
            if (options.length === 5) {
                getAllOptionByID();
            }
            if (options.length === 1) {
                setPage(page - 1);
            }
            setTotalElements(totalElements - 1);
            showSuccessMessage("Option deleted successfully!")
        } catch (error) {
            setMessage("Failed to delete option.");
            setMessageType("error");
        }
    };

    const handleSearch = (event) => {
        // setFilter(filter.concat(`${event.target.value}`));
    };

    const handleEditOption = async () => {
        try {
            const optionUpdate = {
                optionName: newOption.optionName,
                score: newOption.score,
                description: newOption.description,
                criteriaId: id
            }
            console.log("newOption:", newOption);
            await OptionAPI.updateOption(newOption.id, optionUpdate);
            if (options.some((option) => option.id === newOption.id)) {
                getAllOptionByID();
            }
            setShowEditOptionModal(false);
            setMessage("Option updated successfully!");
            setMessageType("success");
        } catch (error) {
            setMessage("Failed to update option.");
            setMessageType("error");
        }
    };

    const columns = [
        { field: "index", headerName: "#", width: 80 },
        { field: "optionName", headerName: "Option Name", width: 200 },
        { field: "score", headerName: "Score", width: 150 },
        { field: "description", headerName: "Explaination", width: 400 },
        {
            field: "action", headerName: "Action", width: 200, renderCell: (params) => (
                <>
                    <Button
                        variant="outlined"
                        onClick={() => handleOpenEditOptionModal(params.row)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteOption(params.row.id)}
                        sx={{ marginLeft: 1 }}
                    >
                        Delete
                    </Button>
                </>
            ),
        },
    ];


    return (
        <Box sx={{ marginTop: "60px" }}>
            <Slider />
            <Typography variant="h6">
                <a href="/ranking-decision">Ranking Decision List</a> {'>'} <a href="/criteria-management">Criteria List</a> {'>'} Edit Criteria
            </Typography>


            <Box sx={{ border: '1px solid black', borderRadius: '4px', padding: '16px', margin: '16px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <Typography variant="h6" style={{ marginRight: '8px' }}>Criteria</Typography>
                    <IconButton size="small" aria-label="edit">
                    </IconButton>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
                    <Box sx={{ width: '90%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Typography style={{ marginLeft: '10px' }}>Criteria Name:</Typography>
                        <TextField style={{ width: '50%', marginLeft: '10px' }} variant="outlined" fullWidth value={criteria.criteriaName} disabled />
                        <EditIcon style={{ marginLeft: '10px' }} onClick={() => {
                            handleOpenEditNameModal();
                        }} />
                    </Box>
                </Box>
            </Box>

            <Box sx={{ margin: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="h5">Score List</Typography>

                <SearchComponent onSearch={handleSearch}></SearchComponent>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    // sx={{ marginTop: 2 }}
                    onClick={handleOpenAddOptionModal}
                >
                    Add New Option
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
                    getRowId={(row) => row.id}
                    rowCount={totalElements}
                    paginationMode="server" // Kích hoạt phân trang phía server
                    paginationModel={{
                        page: page - 1,  // Adjusted for 0-based index
                        pageSize: pageSize,
                    }}
                    onPaginationModelChange={(model) => {
                        setPage(model.page + 1);  // Set 1-based page for backend
                        setpageSize(model.pageSize);
                    }}
                    disableNextButton={page >= totalPages}
                    disablePrevButton={page <= 1}
                    disableRowSelectionOnClick
                />
            </Box>


            {/* Modal for editing criteria name */}
            <Modal open={showEditNameModal} onClose={() => setShowEditNameModal(false)}>
                <Box sx={{ padding: 2, backgroundColor: "white", borderRadius: 1, maxWidth: 400, margin: "auto", marginTop: "20vh" }}>
                    <Typography variant="h6">Edit Criteria Name</Typography>
                    <TextField
                        label="Criteria Name"
                        variant="outlined"
                        fullWidth
                        value={newCriteriaName}
                        onChange={(e) => setNewCriteriaName(e.target.value)}
                        sx={{ marginTop: 2 }}
                    />
                    <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                        <Button variant="outlined" onClick={() => setShowEditNameModal(false)}>Cancel</Button>
                        <Button variant="contained" onClick={handleSaveNewCriteriaName}>Save</Button>
                    </Box>
                </Box>
            </Modal>

            {/* Modal for adding a new option */}
            <ModalCustom
                show={showAddOptionModal}
                handleClose={() => setShowAddOptionModal(false)}
                title="Add New Option"
                bodyContent={
                    <>
                        <TextField
                            label="Option Name"
                            variant="outlined"
                            fullWidth
                            value={newOption.name}
                            onChange={(e) => setNewOption({ ...newOption, name: e.target.value })}
                            sx={{ marginBottom: 2 }}
                        />
                        <TextField
                            label="Score"
                            variant="outlined"
                            fullWidth
                            type="number"
                            value={newOption.score}
                            onChange={(e) => setNewOption({ ...newOption, score: e.target.value })}
                            sx={{ marginBottom: 2 }}
                        />
                        <TextField
                            label="Explanation"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={3}
                            value={newOption.explanation}
                            onChange={(e) => setNewOption({ ...newOption, explanation: e.target.value })}
                        />
                    </>
                }
                footerContent={
                    <>
                        <Button variant="outlined" onClick={() => setShowAddOptionModal(false)}>Cancel</Button>
                        <Button variant="contained" color="success" onClick={handleAddOption}>Add</Button>
                    </>
                }
            />

            {/* Modal for edit a new option */}
            <ModalCustom
                show={showEditOptionModal}
                handleClose={() => setShowEditOptionModal(false)}
                title="Edit Option"
                bodyContent={
                    <>
                        <TextField
                            label="Option Name"
                            variant="outlined"
                            fullWidth
                            value={newOption.optionName}
                            onChange={(e) => setNewOption({ ...newOption, optionName: e.target.value })}
                            sx={{ marginBottom: 2 }}
                        />
                        <TextField
                            label="Score"
                            variant="outlined"
                            fullWidth
                            type="number"
                            value={newOption.score}
                            onChange={(e) => setNewOption({ ...newOption, score: e.target.value })}
                            sx={{ marginBottom: 2 }}
                        />
                        <TextField
                            label="Explanation"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={3}
                            value={newOption.description}
                            onChange={(e) => setNewOption({ ...newOption, description: e.target.value })}
                        />
                    </>
                }
                footerContent={
                    <>
                        <Button variant="outlined" onClick={() => setShowEditOptionModal(false)}>Cancel</Button>
                        <Button variant="contained" color="success" onClick={handleEditOption}>Save</Button>
                    </>
                }
            />

            {/* Display success or error message */}
            {message && (
                <Alert severity={messageType} sx={{ marginTop: 2 }}>
                    {message}
                </Alert>
            )}
        </Box>
    );
};

export default EditCriteria;
