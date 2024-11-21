// react
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { FaEye } from 'react-icons/fa';
import { FaHistory } from 'react-icons/fa';
import { FaAngleRight } from 'react-icons/fa';
// Mui
import {
    InputAdornment, Box, Button, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Modal, IconButton, Switch, FormControlLabel, Alert, FormHelperText
} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import EditIcon from '@mui/icons-material/Edit';
import Autocomplete from '@mui/material/Autocomplete';
// Css 
import "../../assets/css/RankingGroups.css"
// Source code
// API
import RankingGroupAPI from "../../api/RankingGroupAPI.js";
import BulkRankingAPI from "../../api/BulkRankingAPI.js";
//Common
import ModalCustom from "../../components/Common/Modal.jsx";
import ActionButtons from "../../components/Common/ActionButtons.jsx";
import SearchComponent from "../../components/Common/Search.jsx";
// Contexts
import { useAuth } from "../../contexts/AuthContext.jsx";
// Hooks
import useNotification from "../../hooks/useNotification";
// Layouts
import Slider from "../../layouts/Slider.jsx";
//Filter
import { sfLike, sfEqual, sfAnd } from 'spring-filter-query-builder';

const BulkRankingGroup = () => {
    const navigate = useNavigate(); // To navigate between pages
    const { id } = useParams(); // Get the ID from the URL

    // State 
    //// State
    // Table  List Ranking Decision (page, size) 
    const [rows, setRows] = useState([]); // Initialize with empty array
    const [bulkRankingGroup, setBulkRankingGroup] = useState([]);
    const [filter, setFilter] = useState(`rankingGroupId : ${id}`);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    // Edit
    const [editGroup, setEditGroup] = useState({ groupName: '', currentRankingDecision: '' });
    const [originalGroupName, setOriginalGroupName] = useState('');
    const [originalDecisionName, setOriginalDecisionName] = useState('');
    // Status
    const [message, setMessage] = useState(""); // Status notification
    const [messageType, setMessageType] = useState("success"); // Message type (success/error)
    const [validationMessage, setValidationMessage] = useState(""); // Validation error message


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
    }

    useEffect(() => {
        getBulkRankingGroup();
    }, [id, filter, page, pageSize]);


    useEffect(() => {
        if (bulkRankingGroup) {
            const mappedRows = bulkRankingGroup.map((bulkRankingGroup, index) => ({
                id: bulkRankingGroup.historyId,
                fileName: bulkRankingGroup.fileName,
                rankingdecision: bulkRankingGroup.decisionName,
                uploadedAt: bulkRankingGroup.uploadedAt ? bulkRankingGroup.uploadedAt : "N/A",
                uploadedBy: bulkRankingGroup.uploadByName ? bulkRankingGroup.uploadByName : "N/A",
                status: bulkRankingGroup.status ? bulkRankingGroup.status : "N/A",
                note: bulkRankingGroup.note
            }));
            setRows(mappedRows);
        }
    }, [bulkRankingGroup])

    console.log(bulkRankingGroup);
    // Ranking Group Edit
    const RankingGroupEdit = async () => {
        try {
            const groupData = await RankingGroupAPI.getRankingGroupById(id);
            // Ensure no undefined values are passed
            setEditGroup({
                groupName: groupData.groupName || "",
                currentRankingDecision: groupData.currentRankingDecision || "",
            });
            console.log(groupData)
            setOriginalGroupName(groupData.groupName || "Group Name");
            setOriginalDecisionName(groupData.currentRankingDecision || "");
        } catch (error) {
            console.error("Error fetching group:", error);
        }
    };

    const handleSearch = (query) => {
        console.log(query);
        if (query) {
            setFilter(sfAnd([sfEqual("rankingGroupId", id), sfLike("fileName", query)]).toString());
        } else {
            setFilter(`rankingGroupId : ${id}`);
        }
    }

    //// Fetch Ranking Group on id change
    useEffect(() => {
        RankingGroupEdit();
    }, [id]);

    // Columns configuration for the DataGrid
    const columns = [
        { field: "fileName", headerName: "File Name", width: 200 },
        { field: "rankingdecision", headerName: "Ranking Decision", width: 300 },
        { field: "uploadedAt", headerName: "Uploaded At", width: 130 },
        { field: "uploadedBy", headerName: "Uploaded By", width: 130 },
        { field: "status", headerName: "Status", width: 130 },
        { field: "note", headerName: "Note", width: 300 }
    ];


    return (
        <div style={{ marginTop: "60px" }}>
            <Slider />
            {/* Group Info */}
            <Box sx={{ marginTop: 4, padding: 2 }}>
                <Typography variant="h6">
                    <a href="/ranking-group">Ranking Group List</a>{" "}
                    {<FaAngleRight />}
                    Bulk Ranking Group
                </Typography>
                <Box sx={{
                    border: '1px solid black',
                    borderRadius: '4px',
                    padding: '16px',
                    marginTop: '16px'
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ width: '48%' }}>
                            <Typography>Group Name:</Typography>
                            <TextField variant="outlined" fullWidth value={originalGroupName} disabled />
                        </Box>
                        <Box sx={{ width: '48%' }}>
                            <Typography>Current Ranking Decision:</Typography>
                            <TextField variant="outlined" fullWidth value={originalDecisionName} disabled />
                        </Box>
                    </Box>
                </Box>
                {/* Displaying messages after when add/delete decision*/}
                {message && (
                    <Alert severity={messageType} sx={{ marginTop: 2 }}>
                        {message}
                    </Alert>
                )}

                <Box sx={{
                    marginTop: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px'
                }}>
                    <Typography variant="h5">Bulk Ranking History</Typography>
                    <SearchComponent onSearch={handleSearch} width={200} />

                    <Box sx={{ display: 'flex', gap: 1 }}> {/* Sử dụng gap để tạo khoảng cách giữa các nút */}
                        <Button variant="contained" color="primary" onClick={""}>
                            Export Template
                        </Button>
                        <Button variant="contained" color="primary" onClick={"handleOpenAddRankingDecisionModal"}>
                            Bulk Ranking
                        </Button>
                    </Box>
                </Box>

                {/* Table Show Ranking Decision List */}
                <Box sx={{ width: "100%", height: 350 }}>
                    <DataGrid
                        className="custom-data-grid"
                        rows={rows}
                        columns={columns}
                        // checkboxSelection
                        pagination
                        getRowId={(row) => row.id}

                        pageSizeOptions={[5, 10, 25]}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                    page: 0,
                                },
                            },
                        }}
                        // disableRowSelectionOnClick
                        autoHeight={false}
                        sx={{
                            height: '100%',
                            overflow: 'auto',
                            '& .MuiDataGrid-virtualScroller': {
                                overflowY: 'auto',
                            },
                        }}
                    />
                </Box>

            </Box>
        </div>
    );
};

export default BulkRankingGroup;
