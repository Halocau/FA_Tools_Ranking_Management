import React, { useEffect, useState } from 'react';
import { MdDeleteForever } from 'react-icons/md';
import { useNavigate, useParams } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

// MUI
import {
    Box, Button, Typography,
} from "@mui/material";
// API
import DecisionTitleAPI from "../../../api/DecisionTitleAPI.js";
import DecisionTaskAPI from "../../../api/DecisionTaskAPI.js";
import taskApi from '../../../api/TaskAPI.js';

const TaskandPriceConfiguration = ({ }) => {
    // Data
    const { id } = useParams();
    const [originalTask, setOriginalTask] = useState([]);
    const [title, setTitle] = useState([]);
    // Row table
    const [rows, setRows] = useState([]);
    // Load data getTaskConfiguration
    const getTaskConfiguration = async () => {
        try {
            const response = await DecisionTaskAPI.getDecisionTaskByDecisionId(id);
            console.log(response);
            setOriginalTask(response);
        } catch (error) {
            console.error("Error fetching task:", error);
        }
    };
    // Load data getTitleConfiguration
    const getTitleConfiguration = async () => {
        try {
            const response = await DecisionTitleAPI.getDecisionTitleByDecisionId(id);
            setTitle(response);
        } catch (error) {
            console.error("Error fetching task:", error);
        }
    };
    // Load update
    useEffect(() => {
        getTaskConfiguration();
        getTitleConfiguration();
    }, [id]);
    //////////////////////////////////// Column Task//////////////////////////////////
    const allTitle = title.map((title) => ({
        rankingTitleId: title.rankingTitleId,
        titleName: title.rankingTitleName,
    }));
    const normalizeRows = (rows, allTitles) => {
        return rows.map((row) => {
            const updatedRow = { ...row };
            const existingTitleIds = new Set((updatedRow.taskWages || []).map((wage) => wage.rankingTitleId));
            allTitles.forEach(({ rankingTitleId, titleName }) => {
                if (!existingTitleIds.has(rankingTitleId)) {
                    updatedRow.taskWages.push({
                        rankingTitleId,
                        titleName,
                        workingHourWage: null,
                        overtimeWage: null,
                    });
                }
            });
            updatedRow.taskWages = updatedRow.taskWages.sort((a, b) => a.titleName.localeCompare(b.titleName));
            return updatedRow;
        });
    };
    useEffect(() => {
        const normalized = normalizeRows(originalTask, allTitle);
        setRows(normalized);
    }, [originalTask]);

    //////////////////////////////////// Return //////////////////////////////////////
    return (
        <div>
            {/* Surrounding border */}
            <Box
                sx={{
                    width: "100%",
                    height: 450,
                    marginTop: '10px',
                    border: '2px solid black',
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}>
                <Box sx={{ width: '100%', height: 400 }}>
                    {/* Table  */}
                    <Box sx={{ width: '100%', height: 400, marginTop: '10px' }}>
                        <TableContainer component={Paper} sx={{ height: 400, minWidth: 400, maxHeight: 400, overflow: 'auto' }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ position: 'sticky', top: 0, left: 0, backgroundColor: '#e0e0e0', zIndex: 3, width: '120px', maxWidth: '120px', minWidth: '120px' }}>
                                            Task
                                        </TableCell>
                                        <TableCell sx={{ position: 'sticky', top: 0, left: 120, backgroundColor: '#e0e0e0', zIndex: 3, width: '120px', maxWidth: '120px', minWidth: '120px' }} rowSpan={2}>
                                            Task Type
                                        </TableCell>
                                        {allTitle.map((title, index) => (
                                            <TableCell
                                                key={index}
                                                sx={{ position: 'sticky', top: 0, backgroundColor: '#e0e0e0', width: '150px', maxWidth: '150px', minWidth: '150px', zIndex: 1 }}
                                            >
                                                {title.titleName}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((task) => (
                                        <>
                                            {['In Working Hour', 'Overtime'].map((type, typeIndex) => (
                                                <TableRow key={`task-${task.taskId}-${typeIndex}`}>
                                                    {typeIndex === 0 && (
                                                        <TableCell sx={{ position: 'sticky', left: 0, background: '#fff', zIndex: 2, width: 120 }} rowSpan={2}>
                                                            {task.taskName}
                                                        </TableCell>
                                                    )}
                                                    <TableCell sx={{ position: 'sticky', left: 120, background: '#fff', zIndex: 2, width: 120 }}>
                                                        {type}
                                                    </TableCell>
                                                    {allTitle.map((title, index) => {
                                                        const wageKey =
                                                            type === 'In Working Hour'
                                                                ? 'workingHourWage'
                                                                : 'overtimeWage';
                                                        const wageData =
                                                            task.taskWages.find(
                                                                (wage) => wage.rankingTitleId === title.rankingTitleId
                                                            ) || {};
                                                        return (
                                                            <TableCell sx={{ width: '150px', maxWidth: '150px', minWidth: '150px' }} key={index}>
                                                                {/* Hiển thị giá trị mà không cho chỉnh sửa */}
                                                                {wageData[wageKey] || 'N/A'}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            ))}
                                        </>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
            </Box>
        </div>
    );
};

export default TaskandPriceConfiguration;
