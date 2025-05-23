import React, { useEffect, useState, useRef } from "react";

// Mui
import { Box, Button, Link, Modal, Typography, IconButton, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ClearIcon from "@mui/icons-material/Clear"; // Import the Clear icon
import UploadFileIcon from '@mui/icons-material/UploadFile';

// XLSX library
import * as XLSX from "xlsx"; // Import SheetJS library

//API
import FileUploadAPI from "../../../api/FileUploadAPI";
import EmployeeCriteriaAPI from "../../../api/EmployeeCriteriaAPI";
import EmployeeAPI from "../../../api/EmployeeAPI";
import DecisionCriteriaAPI from "../../../api/DecisionCriteriaAPI";
import { isValid } from "date-fns";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

const BulkRankingModal = ({ open, handleClose, showSuccessMessage, showErrorMessage, currentGroup, addNewBulkRanking, fetchBulkRankings }) => {
    // State of file name is in input fields
    const [selectedFile, setSelectedFile] = useState(null);
    // State of file inputed
    const [file, setFile] = useState(null);
    // State of data of file inputed
    const [data, setData] = useState(null);
    // Criteria of current decision applied for current ranking group
    const [criteriaList, setListCriteria] = useState([]);
    // State of status of upload
    const [status, setStatus] = useState('Success');
    // State of note for upload
    const [note, setNote] = useState('');
    // State of error message
    const [errorMessage, setErrorMessage] = useState('');
    // State of loading indicator
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef(null); // Reference to the file input

    //Function to fetch criteria of current decision
    const getCriteriaList = async () => {
        try {
            const response = await DecisionCriteriaAPI.optionCriteria(currentGroup.decisionId);
            setListCriteria(response);
        } catch (error) {
            console.error("Error fetching criteria:", error);
        }
    };
    //Fetch criteria of current decision
    useEffect(() => {
        if (currentGroup.decisionId) {
            getCriteriaList();
        }
    }, [currentGroup.decisionId]);

    // Function to handle upload employee data
    const uploadEmployee = async (form) => {
        try {
            await EmployeeAPI.upsertEmployeeList(form);
        } catch (error) {
            showErrorMessage("Failed to upload data to employee list!!!");
        }
    }

    // Function to handle upload each criteria fields of employee
    const uploadEmployeeCriteria = async (form) => {
        try {
            await EmployeeCriteriaAPI.upsertEmployeeCriteriaList(form);
        } catch (error) {
            showErrorMessage("Failed to upload data to employee criteria list!!!");
        }
    }

    // Function to validate headers
    const validateHeaders = (headers, requiredColumns, criteriaList) => {
        // Ensure headers is defined and contains valid data
        if (!Array.isArray(headers) || headers.length === 0) {
            return {
                isValid: false,
                errorMessage: "Headers must be a non-empty array.",
            };
        }

        // Normalize headers by trimming and removing special characters
        const normalizedHeaders = headers.map((header) => header.trim());
        // Normalize required columns and criteria names
        const normalizedRequiredColumns = requiredColumns.map((col) => col.trim());
        const normalizedCriteriaNames = criteriaList.map((criteria) =>
            criteria.criteriaName.trim()
        );
        // Find missing columns and criteria
        const missingColumns = normalizedRequiredColumns.filter(
            (col) => !normalizedHeaders.includes(col)
        );
        const missingCriteria = normalizedCriteriaNames.filter(
            (criteriaName) => !normalizedHeaders.includes(criteriaName)
        );
        console.log(normalizedHeaders, normalizedCriteriaNames);
        console.log(missingColumns, missingCriteria);
        // Combine results
        if (missingColumns.length > 0 || missingCriteria.length > 0) {
            const errorMessageParts = [];
            if (missingColumns.length > 0) {
                errorMessageParts.push(`Missing required columns: ${missingColumns.join(", ")}`);
            }
            if (missingCriteria.length > 0) {
                errorMessageParts.push(`Missing required criteria: ${missingCriteria.join(", ")}`);
            }
            return {
                isValid: false,
                errorMessage: errorMessageParts.join("; "),
            };
        }

        return { isValid: true, errorMessage: "" };
    };

    // File change handler
    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
            setSelectedFile(file.name);
            setFile(file); // Store the file object in state

            const reader = new FileReader();

            // Event handler for when file is read
            reader.onload = (event) => {
                try {
                    const arrayBuffer = event.target.result;

                    // Attempt to read the workbook
                    const workbook = XLSX.read(arrayBuffer, { type: "array" });
                    if (!workbook || workbook.SheetNames.length === 0) {
                        throw new Error("Unable to read the file or no sheets found.");
                    }

                    const sheetName = workbook.SheetNames[0]; // Read the first sheet
                    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
                        header: 1, // Extract raw rows, with the first row as headers
                    });

                    // Ensure sheetData contains at least headers
                    if (!sheetData || sheetData.length === 0) {
                        throw new Error("Sheet is empty or contains invalid data.");
                    }

                    // Extract headers and validate required columns
                    const headers = sheetData[0] || []; // The first row contains headers
                    const requiredColumns = ["Employer ID", "Employer Name"];

                    const validationHeaders = validateHeaders(headers, requiredColumns, criteriaList);
                    if (!validationHeaders.isValid) {
                        console.log("Fail Header", isValid.errorMessage);
                        // Set error if validation fails
                        setStatus("Failed");
                        setNote("Wrong value template. Re-download latest template and try again.");
                        setData([]); // Clear data state
                        return;
                    }

                    // Convert sheet to JSON excluding the header row
                    const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                    console.log("JsonData", jsonData);
                    setData(jsonData); // Update data state with extracted data
                    // validateData(jsonData);

                } catch (error) {
                    showErrorMessage("Failed to process the file. Ensure it is a valid template.");
                    handleRemoveFile();
                    setData([]); // Clear data state
                }
            };

            // Event handler for when file fails to read
            reader.onerror = () => {
                console.error("Error reading file.");
                showErrorMessage("Error reading file. Please try again.");
                handleRemoveFile();
                setData([]); // Clear data state
            };

            reader.readAsArrayBuffer(file);
        } else {
            showErrorMessage("Invalid file format. Please upload a .xlsx or .xls file.");
            handleRemoveFile();
            setData([]); // Clear data state
        }
    };

    // Handle closing the modal and resetting the file
    const handleCloseModal = () => {
        fetchBulkRankings();
        setData([]);
        handleRemoveFile();
        setErrorMessage('');
        handleClose(); // Call the original handleClose to close the modal
    };

    // Handle removing the selected file
    const handleRemoveFile = () => {
        setStatus("Success");
        setNote("");
        setFile(null); // Reset file if invalid
        setSelectedFile(null); // Reset the selected file
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset the input value
        }
    };

    const handleEmployeeUpload = async (newBulkRanking) => {
        try {

            // Map the data to match the required employee form structure
            const employees = data.map((item) => ({
                employeeId: item["Employer ID"], // Extract Employer ID
                employeeName: item["Employer Name"], // Extract Employer Name
                groupId: currentGroup.groupId, // groupId from currentGroup
                bulkImportId: newBulkRanking.historyId, // From newBulkRanking.historyId
                rankingDecisionId: currentGroup.decisionId, // From currentGroup.decisionId
            }));

            // Call the uploadEmployee function with the mapped data
            await uploadEmployee(employees);

        } catch (error) {
            console.error("Error during employee upload process:", error);
        }
    };


    function extractEmployeeCriteriaOptions() {
        const result = [];

        // Create a lookup for criteria options by criteriaName and score
        const criteriaLookup = {};
        criteriaList.forEach(criteria => {
            const optionsLookup = {};
            criteria.options.forEach(option => {
                optionsLookup[option.score] = option.optionId; // Map score to optionId
            });
            criteriaLookup[criteria.criteriaName] = {
                criteriaId: criteria.criteriaId,
                options: optionsLookup
            };
        });

        // Map data to employeeId, criteriaId, and optionId
        data.forEach(employee => {
            const employeeId = employee["Employer ID"];
            for (const key in employee) {
                if (key !== "Employer ID" && key !== "Employer Name") {
                    const criteriaName = key.trim(); // Remove unwanted whitespace or line breaks
                    const [score] = employee[key].split(" - ").map(s => parseInt(s.trim())); // Extract score

                    if (criteriaLookup[criteriaName]) {
                        const { criteriaId, options } = criteriaLookup[criteriaName];
                        const optionId = options[score];
                        result.push({ employeeId, criteriaId, optionId });
                    }
                }
            }
        });

        return result;
    }

    const checkEmployeeIds = (output, employerData) => {
        const employeeIds = output.map(obj => obj.employeeId);
        const employerIds = employerData.map(obj => obj["Employer ID"]);
        console.log(employeeIds, employerIds);
        var check = true;
        employerIds.forEach(id => {
            if (!employeeIds.includes(id)) {
                check = false;
            }
        }
        );
        return check;
    };

    const validateCriteriaNames = (data, criteriaList) => {
        const criteriaNames = criteriaList.map(criteria => criteria.criteriaName);
        return data.every(obj => {
            return criteriaNames.every(criteriaName => criteriaName in obj);
        });
    };

    // Handle file upload
    const handleFileUpload = async () => {
        if (!file) {
            showErrorMessage("Please select a file before uploading.");
            return;
        }
        console.log(data);
        setLoading(true);
        try {
            var tempStatus = status;
            var tempNote = note;

            const output = extractEmployeeCriteriaOptions(criteriaList, data);

            if (!checkEmployeeIds(output, data) || !validateCriteriaNames(data, criteriaList)) {
                tempStatus = "Failed";
                tempNote = "Wrong value input for criteria options. Update and try again.";
            }

            const form = {
                file: file,
                folder: 'upload'
            }
            const response = await FileUploadAPI.uploadFile(form);
            const filePath = `D:\\upload\\${response.fileName}`;

            const bulkRankingform = {
                fileName: response.fileName,
                filePath: filePath,
                rankingGroupId: currentGroup.groupId, // Assume currentGroup is provided with a groupId field
                uploadBy: 1, // Default uploadBy value
                status: tempStatus, // Default status
                note: tempNote, // Default note
            };
            // Call the function to add a new bulk ranking
            const newBulkRanking = await addNewBulkRanking(bulkRankingform);

            if (tempStatus === 'Success') {
                // Call the function to upload employees
                await handleEmployeeUpload(newBulkRanking);

                // Call the function to upload employee criteria
                await uploadEmployeeCriteria(output);
                showSuccessMessage("Successfully upload!!!");
            }

            if (tempStatus === 'Failed') {
                throw new Error("Failed to upload data from excel file!!!");
            }
            handleCloseModal();

        } catch (error) {
            console.error("Error during upload process:", error);
            showErrorMessage("Failed to upload data from excel file!!!");
            handleCloseModal();
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={handleCloseModal} >
            <Box sx={modalStyle}>
                {/* Header */}
                <Box
                    sx={{
                        marginTop: -4,
                        width: "119%",
                        marginLeft: -4,
                        height: "40px",
                        backgroundColor: "#1976d2",
                        color: "white",
                        padding: "10px",
                        borderRadius: "4px",
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    <Typography
                        variant="a"
                        sx={{
                            fontWeight: "bold",
                            position: "absolute",
                            left: "50%",
                            transform: "translateX(-50%)",
                        }}
                    >
                        Bulk Ranking
                    </Typography>
                    <IconButton onClick={handleCloseModal} sx={{ color: "white" }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Body */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', justifyItems: 'center', marginTop: '20px' }}>
                    <Typography variant="body1">Select file:</Typography>
                    <Box
                        sx={{
                            width: '15vw',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            padding: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="body2" noWrap>
                            {selectedFile ? selectedFile : 'No file selected'}
                        </Typography>
                        <label htmlFor="file-upload">
                            <input
                                id="file-upload"
                                ref={fileInputRef}
                                type="file"
                                accept=".xls,.xlsx"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                            <IconButton
                                color="primary"
                                component="span"
                                size="small"
                                aria-label="upload file"
                            >
                                <UploadFileIcon sx={{ color: 'black' }} />
                            </IconButton>
                        </label>
                    </Box>
                </div>
                {/* Validation Message */}
                {errorMessage && (
                    <Typography variant="body2" color="error" style={{ marginTop: '10px' }}>
                        {errorMessage}
                    </Typography>
                )}
                {/* Display selected file as a clickable link with clear icon */}
                {selectedFile && (
                    <Box mt={2} display="flex" alignItems="center" >
                        <Typography variant="body2" mr={2} noWrap>
                            Selected File:{" "}
                            <Link
                                href="#"
                                sx={{
                                    textDecoration: "underline",
                                    color: "primary.main",
                                    fontWeight: "bold",
                                }}
                                onClick={(e) => {
                                    e.preventDefault();
                                }}
                            >
                                {selectedFile}
                            </Link>
                        </Typography>
                        <IconButton onClick={handleRemoveFile} sx={{ color: "error.main" }}>
                            <ClearIcon /> {/* Clear icon to remove the selected file */}
                        </IconButton>
                    </Box>
                )}

                {/* Footer */}
                <Box mt={2} display="flex" justifyContent="space-between">
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleCloseModal} // Close and reset the file
                        sx={{ textTransform: "none", fontWeight: "bold" }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleFileUpload(file)} // Pass selectedFile to onUpload
                        sx={{ textTransform: "none", fontWeight: "bold" }}
                    >
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Upload"}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

BulkRankingModal.defaultProps = {
    open: false, // Set default value as false
};

export default BulkRankingModal;
