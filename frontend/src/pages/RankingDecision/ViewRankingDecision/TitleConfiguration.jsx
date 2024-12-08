import React, { useEffect, useState } from 'react';
import { MdDeleteForever } from 'react-icons/md';
import { useNavigate, useParams } from "react-router-dom";
// MUI
import {
    Box, Button, Typography, TextField, IconButton, Select, MenuItem
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import AddCircleIcon from '@mui/icons-material/AddCircle'; // Dấu + icon

// API
import DecisionCriteriaAPI from "../../../api/DecisionCriteriaAPI.js";
import DecisionTitleAPI from "../../../api/DecisionTitleAPI.js";
import Feedback from 'react-bootstrap/esm/Feedback.js';

const TitleConfiguration = ({ decisionStatus, goToNextStep, showErrorMessage, showSuccessMessage }) => {
    // Data 
    const { id } = useParams(); // Get the ID from the URL
    const [originalTitle, setOriginalTitle] = useState([]);  // Lưu dữ liệu gốc
    const [criteria, setCriteria] = useState([]);
    const [columnsTitle, setColumnsTitle] = useState([]);
    // Row table
    const [rows, setRows] = useState([]);
    //Note
    const [note, setNote] = useState('');
    const [statusNote, setStatusNote] = useState('');


    // Load data of table header
    const getCriteriaConfiguration = async () => {
        try {
            const response = await DecisionCriteriaAPI.optionCriteria(id);
            setCriteria(response);
        } catch (error) {
            console.error("Error fetching criteria:", error);
        }
    };

    // Load data getTitleConfiguration
    const getTitleConfiguration = async () => {
        try {
            const response = await DecisionTitleAPI.getDecisionTitleByDecisionId(id);
            setOriginalTitle(response);
        } catch (error) {
            console.error("Error fetching criteria:", error);
        }
    };
    // Load update
    useEffect(() => {
        getCriteriaConfiguration()
        getTitleConfiguration();
    }, [id]);

    /////////////////////////////////// Xử Lý backend //////////////////////////////////
    // End 
    ///////////////////////////////// Note ///////////////////////////////////
    const handleNote = (e) => {
        showSuccessMessage('Feedback successfully')
    };
    ///////////////////////////////// Column Title ///////////////////////////////////
    const ColumnsTitle = (criteria) => {
        if (!Array.isArray(criteria)) {
            console.error("Invalid criteria data:", criteria);
            return [];
        }
        // Column Criteria
        const criteriaColumns = criteria.map((criteriaItem) => ({
            field: criteriaItem.criteriaName,
            headerName: criteriaItem.criteriaName,
            width: 200,
        }));
        // Column Title
        const fixedColumns = [
            { field: 'titleName', headerName: 'Title Name', width: 100, pinned: 'left' },
            { field: 'rankScore', headerName: 'Rank Score', width: 100, pinned: 'left', align: 'center', headerAlign: 'center' },
        ];
        return [...fixedColumns, ...criteriaColumns];
    };
    // End 
    //////////////////////////////////// Row Title ////////////////////////////////////
    const setRowData = (title, criteria) => {
        const mappedRows = title.map((titleItem, index) => {
            // Create fields for criteria columns, ensuring every criteria is included
            const criteriaFields = criteria.reduce((acc, criteriaItem) => {
                // Find the option corresponding to this criteria
                const matchingOption = titleItem.options?.find(
                    (option) => option.criteriaId === criteriaItem.criteriaId
                );
                acc[criteriaItem.criteriaName] = matchingOption ? matchingOption.optionName : "";
                acc[`${criteriaItem.criteriaName}_id`] = criteriaItem.criteriaId;

                return acc;
            }, {});
            const normalizedOptions = criteria.map((criteriaItem) => {
                const matchingOption = titleItem.options?.find(
                    (option) => option.criteriaId === criteriaItem.criteriaId
                );
                return matchingOption || {
                    criteriaId: criteriaItem.criteriaId,
                    optionName: "",
                    score: 0,
                    optionId: null,
                };
            });

            return {
                id: titleItem.rankingTitleId,
                index: index + 1,
                titleName: titleItem.rankingTitleName,
                rankScore: titleItem.totalScore || '',
                ...criteriaFields,
                options: normalizedOptions,
            };
        });
        // Update the state with the new rows
        setRows(mappedRows);
    };
    // End 
    useEffect(() => {
        if (originalTitle) {
            // Tạo cột
            const columns = ColumnsTitle(criteria, decisionStatus);
            setColumnsTitle(columns);
            setRowData(originalTitle, criteria);
        }
    }, [originalTitle, criteria, decisionStatus]);

    return (
        <div>
            {/* Surrounding border */}
            <Box sx={{
                width: "100%",
                height: 500,
                marginTop: '10px',
                border: '2px solid black',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                overflow: 'hidden',
            }}>
                <Box sx={{ width: '100%', height: 400, marginTop: '10px' }}>
                    {/* Table DataGrid */}
                    <DataGrid
                        rows={rows}
                        columns={columnsTitle}
                        getRowId={(row) => row.index}
                        sx={{ '& .MuiDataGrid-columnHeaders': { backgroundColor: '#e0e0e0' } }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginTop: '10px' }}>
                        <textarea
                            value={note}
                            onChange={(e) => {
                                setStatusNote(e.target.value);
                                setNote(e.target.value);
                            }}
                            placeholder="Note"
                            style={{
                                height: '40px', // Chiều cao lớn hơn để nhập nhiều dòng
                                width: '500px',
                                padding: '10px',
                                fontSize: '14px',
                                borderRadius: '5px',
                                resize: 'none', // Ngăn chặn thay đổi kích thước (nếu muốn)
                            }}
                        />
                        <Button sx={{ height: '40px', marginLeft: 1 }}
                            variant="contained"
                            color="primary"
                            onClick={handleNote}
                        >
                            Note
                        </Button>
                    </Box>
                </Box>
            </Box>
        </div>
    );
};

export default TitleConfiguration;
