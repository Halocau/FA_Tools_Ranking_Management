import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Breadcrumbs,
    Link,
    Stepper,
    Step,
    StepLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    TextField,
    Button,
    Select,
    MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

// import Select from 'react-select';

import DecisionCriteriaAPI from "../../api/DecisionCriteriaAPI";

const CriteriaConfiguration = () => {
    const steps = ["Criteria Configuration", "Title Configuration", "Task & Price Configuration"];

    const [criteria, setCriteria] = useState([]);
    const [addedCriteria, setAddedCriteria] = useState([]);
    const [selectedCriteria, setSelectedCriteria] = useState("");
    const [hasChanges, setHasChanges] = useState(false);
    const [decisionStatus, setDecisionStatus] = useState("Draft");
    const [activeStep, setActiveStep] = useState(0);

    const id = 1;

    const getCriteriaConfiguration = async () => {
        try {
            const response = await DecisionCriteriaAPI.getDecisionCriteriaByDecisionId(id);
            setCriteria(response.result);
        } catch (error) {
            console.error("Error fetching criteria:", error);
        }
    };

    useEffect(() => {
        getCriteriaConfiguration();
    }, []);

    const handleAddCriteria = () => {
        const criterion = criteria.find((c) => c.criteriaName === selectedCriteria);
        if (criterion) {
            setAddedCriteria([...addedCriteria, { ...criterion, weight: null }]);
            setCriteria(criteria.filter((c) => c.criteriaName !== selectedCriteria));
            setSelectedCriteria("");
            setHasChanges(true);
        }
    };

    const handleDeleteCriteria = (index) => {
        const deletedCriterion = addedCriteria[index];
        setAddedCriteria(addedCriteria.filter((_, i) => i !== index));
        setCriteria([...criteria, deletedCriterion]);
        setHasChanges(true);
    };

    const handleSaveChanges = () => {
        // Save logic (e.g., API call) here
        console.log("Saving changes:", addedCriteria);
        setHasChanges(false);
    };

    const handleCancelChanges = () => {
        // Reset to initial state
        getCriteriaConfiguration();
        setAddedCriteria([]);
        setHasChanges(false);
    };

    const CustomStepIcon = (props) => {
        const { active, completed } = props;

        return (
            <Box
                sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    backgroundColor: active ? "primary.main" : "white",
                    border: `2px solid ${active ? "primary.main" : "grey.400"}`,
                    outline: "1px solid black",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: active ? "white" : "grey.400",
                    transition: "background-color 0.3s, border-color 0.3s",
                }}
            >
                <Typography
                    variant="caption"
                    sx={{ fontWeight: "bold", fontSize: "0.75rem" }}
                >
                    {props.icon}
                </Typography>
            </Box>
        );
    };

    return (
        <Box sx={{ p: 3 }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
                <Link underline="hover" color="inherit" href="#">
                    Ranking Decision List
                </Link>
                <Typography color="text.primary">Edit Ranking Decision</Typography>
            </Breadcrumbs>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <TextField label="Ranking Decision Name" defaultValue="Decision Name" size="small" sx={{ width: "50%" }} />
                <TextField label="Status" value={decisionStatus} size="small" sx={{ width: "20%" }} disabled />
            </Box>

            <Stepper alternativeLabel sx={{ mb: 3 }} activeStep={activeStep}>
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel StepIconComponent={CustomStepIcon}>
                            {label}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>

            {activeStep === 0 && (
                <>


                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Criteria Name</TableCell>
                                    <TableCell align="center">Weight</TableCell>
                                    <TableCell align="center">No. of Options</TableCell>
                                    <TableCell align="center">Max Score</TableCell>
                                    <TableCell align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {criteria.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{row.criteriaName}</TableCell>
                                        <TableCell align="center">{row.weight || "-"}</TableCell>
                                        <TableCell align="center">{row.numOptions}</TableCell>
                                        <TableCell align="center">{row.maxScore}</TableCell>
                                        <TableCell align="center">
                                            <IconButton onClick={() => handleDeleteCriteria(index)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {decisionStatus === "Draft" && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                                <Select
                                    value={selectedCriteria}
                                    onChange={(e) => setSelectedCriteria(e.target.value)}
                                    displayEmpty
                                    sx={{ width: "60%" }}
                                >
                                    <MenuItem value="" disabled>
                                        Select to Add a New Criteria
                                    </MenuItem>
                                    {criteria.map((c, index) => (
                                        <MenuItem key={index} value={c.criteriaName}>
                                            {c.criteriaName}
                                        </MenuItem>
                                    ))}
                                </Select>

                                <Button
                                    variant="contained"
                                    disabled={!selectedCriteria}
                                    onClick={handleAddCriteria}
                                >
                                    <AddIcon />
                                </Button>
                            </Box>

                            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={!hasChanges}
                                    onClick={handleSaveChanges}
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="outlined"
                                    disabled={!hasChanges}
                                    onClick={handleCancelChanges}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </div>
                    )}
                </>
            )}

            {activeStep === 1 && <Typography>Title Configuration Content</Typography>}
            {activeStep === 2 && <Typography>Task & Price Configuration Content</Typography>}
        </Box>
    );
};

export default CriteriaConfiguration;
