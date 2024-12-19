import React, { useEffect, useState } from 'react';
import { MdDeleteForever } from 'react-icons/md';
import { useNavigate, useParams } from "react-router-dom";
// MUI
import {
    Box, Button, Typography, TextField, IconButton, Select, MenuItem
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
// API
import DecisionCriteriaAPI from "../../../api/DecisionCriteriaAPI.js";
import DecisionTitleAPI from "../../../api/DecisionTitleAPI.js";

const TitleConfiguration = ({ decisionStatus }) => {
    // Data 
    const { id } = useParams();
    const [originalTitle, setOriginalTitle] = useState([]);
    const [criteria, setCriteria] = useState([]);
    const [columnsTitle, setColumnsTitle] = useState([]);
    const [rows, setRows] = useState([]);
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
    // End 
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
            const criteriaFields = criteria.reduce((acc, criteriaItem) => {
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
                height: 450,
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
                </Box>
            </Box>
        </div>
    );
};

export default TitleConfiguration;
