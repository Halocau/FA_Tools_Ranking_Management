import React, { useEffect, useState } from "react";
import { Box, Button, Typography, TextField, IconButton, Table, TableHead, TableBody, TableRow, TableCell, Modal, Alert } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useParams, useNavigate } from "react-router-dom";
import useRankingDecision from "../../hooks/useRankingDecision";
import ModalCustom from "../../components/Common/Modal.jsx";
import "../../assets/css/RankingGroups.css";
import Slider from "../../layouts/Slider.jsx";

const EditCriteria = () => {
    const { id } = useParams(); // Lấy ID của tiêu chí từ URL
    const navigate = useNavigate();
    const { fetchCriteriaById, updateCriteria, addOptionToCriteria, updateOption, deleteOption } = useRankingDecision();
    
    const [criteria, setCriteria] = useState(null);
    const [showEditNameModal, setShowEditNameModal] = useState(false);
    const [newCriteriaName, setNewCriteriaName] = useState("");
    const [showAddOptionModal, setShowAddOptionModal] = useState(false);
    const [newOption, setNewOption] = useState({ name: "", score: "", explanation: "" });
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    useEffect(() => {
        // Lấy dữ liệu tiêu chí theo ID
        const fetchCriteria = async () => {
            const criteriaData = await fetchCriteriaById(id);
            setCriteria(criteriaData);
        };
        fetchCriteria();
    }, [id]);

    const handleOpenEditNameModal = () => {
        setNewCriteriaName(criteria?.name || "");
        setShowEditNameModal(true);
    };

    const handleSaveNewCriteriaName = async () => {
        try {
            await updateCriteria(id, { name: newCriteriaName });
            setCriteria((prev) => ({ ...prev, name: newCriteriaName }));
            setMessage("Criteria name updated successfully!");
            setMessageType("success");
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

    const handleAddOption = async () => {
        try {
            await addOptionToCriteria(id, newOption);
            setCriteria((prev) => ({
                ...prev,
                options: [...prev.options, { ...newOption, id: Date.now() }]
            }));
            setMessage("Option added successfully!");
            setMessageType("success");
        } catch (error) {
            setMessage("Failed to add option.");
            setMessageType("error");
        }
        setShowAddOptionModal(false);
    };

    const handleDeleteOption = async (optionId) => {
        try {
            await deleteOption(optionId);
            setCriteria((prev) => ({
                ...prev,
                options: prev.options.filter(option => option.id !== optionId)
            }));
            setMessage("Option deleted successfully!");
            setMessageType("success");
        } catch (error) {
            setMessage("Failed to delete option.");
            setMessageType("error");
        }
    };

    const handleEditOption = async (option) => {
        try {
            await updateOption(option.id, option);
            setCriteria((prev) => ({
                ...prev,
                options: prev.options.map(opt => opt.id === option.id ? option : opt)
            }));
            setMessage("Option updated successfully!");
            setMessageType("success");
        } catch (error) {
            setMessage("Failed to update option.");
            setMessageType("error");
        }
    };

    return (
        <Box sx={{ marginTop: "60px" }}>
            <Slider />
            <Typography variant="h6">
                <a href="/ranking-decision">Ranking Decision List</a> {'>'} <a href="/criteria_list">Criteria List</a> {'>'} Edit Criteria
            </Typography>

            <Box sx={{ marginTop: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="h5">
                    Criteria Name: {criteria?.name}
                </Typography>
                <IconButton onClick={handleOpenEditNameModal}>
                    <EditIcon />
                </IconButton>
            </Box>

            <Button 
                variant="contained" 
                color="primary" 
                startIcon={<AddIcon />} 
                sx={{ marginTop: 2 }} 
                onClick={handleOpenAddOptionModal}
            >
                Add New Option
            </Button>

            <Table sx={{ marginTop: 2 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Option Name</TableCell>
                        <TableCell>Score</TableCell>
                        <TableCell>Explanation</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {criteria?.options?.map((option, index) => (
                        <TableRow key={option.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{option.name}</TableCell>
                            <TableCell>{option.score}</TableCell>
                            <TableCell>{option.explanation}</TableCell>
                            <TableCell>
                                <IconButton color="primary" onClick={() => handleEditOption(option)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton color="error" onClick={() => handleDeleteOption(option.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Modal for editing criteria name */}
            <Modal open={showEditNameModal} onClose={() => setShowEditNameModal(false)}>
                <Box sx={{
                    padding: 2, backgroundColor: "white", borderRadius: 1, maxWidth: 400, margin: "auto", marginTop: "20vh"
                }}>
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

            {message && (
                <Alert severity={messageType} sx={{ marginTop: 2 }}>
                    {message}
                </Alert>
            )}
        </Box>
    );
};

export default EditCriteria;
