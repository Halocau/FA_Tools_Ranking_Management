// React
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
// Mui
import { Box, TextField, Button, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
// API
import DecisionCriteriaAPI from "../../../api/DecisionCriteriaAPI.js";

const CriteriaConfiguration = ({ decisionStatus, showErrorMessage, showSuccessMessage }) => {
    // Data
    const { id } = useParams(); // Get the ID from the URL
    const [originalCriteria, setOriginalCriteria] = useState([]);
    // Row table
    const [rows, setRows] = useState([]);
    const [note, setNote] = useState('');
    const [statusNote, setStatusNote] = useState('');

    // Load data getCriteriaConfiguration
    const getCriteriaConfiguration = async () => {
        try {
            const response = await DecisionCriteriaAPI.getDecisionCriteriaByDecisionId(id);
            setOriginalCriteria((prevCriteria) => {
                if (JSON.stringify(prevCriteria) !== JSON.stringify(response)) {
                    return response;
                }
                return prevCriteria;
            });
        } catch (error) {
            console.error("Error fetching criteria:", error);
        }
    };
    useEffect(() => {
        if (!id) return; // Bỏ qua nếu `id` không xác định
        getCriteriaConfiguration();
    }, [id]);
    ///////////////////////////////// Note ///////////////////////////////////
    const handleNote = (e) => {
        showSuccessMessage('Feedback successfully')
    };
    /////////////////////////////////// Column Criteria //////////////////////////////////
    const columnsCriteria = [
        { field: 'criteria_name', headerName: 'Criteria Name', width: 500 },
        { field: 'weight', headerName: 'Weight', width: 150, align: 'center', headerAlign: 'center' },
        { field: 'num_options', headerName: 'No of Options', width: 150, align: 'center', headerAlign: 'center' },
        { field: 'max_score', headerName: 'Max Score', width: 150, align: 'center', headerAlign: 'center' },
    ];
    // End 
    ///////////////////////////////////// Row Criteria ////////////////////////////////////
    const setRowData = (data) => {
        const mappedRows = data.map((data, index) => ({
            id: data.criteriaId,
            index: index + 1,
            criteria_name: data.criteriaName,
            weight: data.weight || 0,
            num_options: data.numOptions < 1 ? "0" : data.numOptions,
            max_score: data.maxScore == null ? "" : data.maxScore,
        }));
        setRows(mappedRows);
    }
    // End 
    useEffect(() => {
        if (originalCriteria) {
            setRowData(originalCriteria);
        }
    }, [originalCriteria]);

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
            }}>
                <Box sx={{ width: '100%', height: 400, marginTop: '10px' }}>
                    {/* Table DataGrid */}
                    <DataGrid
                        rows={rows}
                        columns={columnsCriteria}
                        getRowId={(row) => row.id}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginTop: '10px' }}>
                        <input
                            type="text"
                            value={note}
                            onChange={(e) => {
                                setStatusNote(e.target.value);
                                setNote(e.target.value);
                            }}
                            placeholder="Note"
                            style={{ height: '50px', width: '900px', padding: '5px', fontSize: '16px', borderRadius: '5px' }}
                        />
                        <Button sx={{ marginLeft: 1 }}
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
export default CriteriaConfiguration;
