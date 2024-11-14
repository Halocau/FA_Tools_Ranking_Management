// react
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
// css 
import "../../assets/css/RankingGroups.css";
// Mui
import {
    Box, Button, Typography, TextField, Autocomplete, IconButton
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ClearIcon from '@mui/icons-material/Clear'; // Import biểu tượng Clear
import InputAdornment from '@mui/material/InputAdornment';
// Source code
import Slider from "../../layouts/Slider.jsx";
import useRankingGroup from "../../hooks/useRankingGroup.jsx";
import useRankingDecision from "../../hooks/useRankingDecision.jsx";

const ViewRankingGroup = () => {
    const navigate = useNavigate(); // To navigate between pages
    const { id } = useParams(); // Get the ID from the URL

    // State 
    const [editGroup, setEditGroup] = useState({ groupName: '', currentRankingDecision: '' });
    const [originalGroupName, setOriginalGroupName] = useState('');
    const [selectedDecision, setSelectedDecision] = useState(""); // Current ranking decision
    const [rankingDecisions, setRankingDecisions] = useState([]); // List of ranking decisions
    const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering

    const { data: groups, fetchRankingGroupById } = useRankingGroup();
    const { data: decisions, fetchAllRankingDecisions } = useRankingDecision();

    // Fetch ranking decisions
    useEffect(() => {
        fetchAllRankingDecisions();
    }, []);

    // Fetch the ranking group by ID
    useEffect(() => {
        const loadGroup = async () => {
            try {
                const groupData = await fetchRankingGroupById(id);
                setEditGroup({
                    groupName: groupData.groupName,
                    currentRankingDecision: groupData.currentRankingDecision,
                });
                setOriginalGroupName(groupData.groupName);
                setSelectedDecision(groupData.currentRankingDecision);
                setRankingDecisions(groupData.rankingDecisions || []);
            } catch (error) {
                console.error("Error fetching group:", error);
            }
        };
        loadGroup();
    }, [id]);

    // Columns configuration for the DataGrid
    const columns = [
        { field: "index", headerName: "Employee ID", width: 250 },
        { field: "employeename", headerName: "Employee Name", width: 350 },
    ];

    // Map decision data to rows for DataGrid
    const rows = decisions
        ? decisions.map((decision, index) => ({
            id: decision.decisionId,
            index: index + 1,
            employeename: decision.decisionName,
            status: decision.status
        }))
        : [];

    return (
        <div style={{ marginTop: "60px" }}>
            <Slider />
            {/* Group Info */}
            <Box sx={{ marginTop: 4, padding: 2 }}>
                <Typography variant="h6">
                    <a href="/ranking_group">Ranking Group List</a> {'>'} View Ranking Group
                </Typography>
                <Box sx={{
                    border: '1px solid black',
                    borderRadius: '4px',
                    padding: '16px',
                    marginTop: '16px'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                        <Typography variant="h6" style={{ marginRight: '8px' }}>Group Info</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ width: '48%' }}>
                            <Typography>Group Name:</Typography>
                            <TextField variant="outlined" fullWidth value={originalGroupName} disabled />
                            <Typography>Create At:</Typography>
                            <TextField variant="outlined" fullWidth value={editGroup.createAt} disabled />
                        </Box>
                        <Box sx={{ width: '48%' }}>
                            <Typography>Current Ranking Decision:</Typography>
                            <TextField variant="outlined" fullWidth value={editGroup.currentRankingDecision} disabled />
                            <Typography>Create By:</Typography>
                            <TextField variant="outlined" fullWidth value={editGroup.createAt} disabled />
                        </Box>
                    </Box>

                </Box>

                <Autocomplete
                    disablePortal
                    options={rows} // Tất cả hàng để tìm kiếm
                    getOptionLabel={(option) => option.employeename || ''} // Lấy tên nhân viên
                    onInputChange={(event, newInputValue) => {
                        setSearchTerm(newInputValue); // Cập nhật từ khóa tìm kiếm
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search Employees"
                            variant="outlined"
                            fullWidth
                            sx={{ marginTop: 2 }}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => {
                                                setSearchTerm(''); // Reset từ khóa tìm kiếm
                                                params.inputProps.onChange({ target: { value: '' } });
                                            }}
                                            aria-label="clear"
                                        >
                                            <ClearIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                />
                <Typography variant="h5">List of employees</Typography>
                {/* Table Show list employees */}
                <Box sx={{ width: "100%", height: 350 }}>
                    <DataGrid
                        className="custom-data-grid"
                        rows={rows}
                        columns={columns}
                        pagination
                        pageSizeOptions={[5, 10, 25]}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                    page: 0,
                                },
                            },
                        }}
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
            </Box >
        </div >
    );
};

export default ViewRankingGroup;
