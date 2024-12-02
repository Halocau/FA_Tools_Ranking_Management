import React, { useEffect, useState, useRef } from "react";

// Mui
import { Box, Button, Link, Modal, Typography, IconButton } from "@mui/material";
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

const BulkRankingModal = ({ open, handleClose, showSuccessMessage, showErrorMessage, currentGroup, addNewBulkRanking }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [file, setFile] = useState(null);
    const [data, setData] = useState(null);
    const [criteriaList, setListCriteria] = useState([]);
    const [status, setStatus] = useState('Success');
    const [note, setNote] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const fileInputRef = useRef(null); // Reference to the file input

    const getCriteriaList = async () => {
        try {
            const response = await DecisionCriteriaAPI.optionCriteria(currentGroup.decisionId);
            setListCriteria(response);
        } catch (error) {
            console.error("Error fetching criteria:", error);
        }
    };

    useEffect(() => {
        if (currentGroup.decisionId) {
            getCriteriaList();
        }
    }, [currentGroup.decisionId]);

    const uploadEmployee = async (form) => {
        try {
            await EmployeeAPI.upsertEmployeeList(form);
        } catch (error) {
            showErrorMessage("Failed to upload data to employee list!!!");
        }
    }

    const uploadEmployeeCriteria = async (form) => {
        try {
            await EmployeeCriteriaAPI.upsertEmployeeCriteriaList(form);
        } catch (error) {
            showErrorMessage("Failed to upload data to employee criteria list!!!");
        }
    }

    // Validation function to check for required columns
    const validateColumns = (headers, requiredColumns) => {
        const missingColumns = requiredColumns.filter((col) => !headers.includes(col));
        if (missingColumns.length > 0) {
            return {
                isValid: false,
                errorMessage: `Missing required columns: ${missingColumns.join(", ")}`,
            };
        }
        return { isValid: true, errorMessage: "" };
    };

    const validateHeadersAgainstCriteria = (headers, criteriaList) => {
        // Normalize headers by trimming and removing special characters
        const normalizedHeaders = headers.map((header) => header.trim().replace(/\r?\n|\r/g, ""));

        // Normalize criteria names
        const requiredCriteriaNames = criteriaList.map((criteria) =>
            criteria.criteriaName.trim().replace(/\r?\n|\r/g, "")
        );

        // Find missing criteria
        const missingCriteria = requiredCriteriaNames.filter(
            (criteriaName) => !normalizedHeaders.includes(criteriaName)
        );

        if (missingCriteria.length > 0) {
            return {
                isValid: false,
                errorMessage: `Missing required criteria: ${missingCriteria.join(", ")}`,
            };
        }
        return { isValid: true, errorMessage: "" };
    };

    const validateData = (data) => {
        // Validate each item in the data array
        data.forEach((item, index) => {
            console.log(item);
            for (const [key, value] of Object.entries(item)) {
                if (value == null || value === "") {
                    setStatus("Failed");
                    setNote("Wrong value template. Re-download latest template and try again.");
                    setData([]); // Clear data state
                    return;
                }
            }
        });
    };

    console.log(data);
    // File change handler
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
            setSelectedFile(file.name);
            setFile(file); // Store the file object in state

            // Parse the file to extract data
            const reader = new FileReader();
            reader.onload = (event) => {
                const arrayBuffer = event.target.result;
                const workbook = XLSX.read(arrayBuffer, { type: "array" });
                const sheetName = workbook.SheetNames[0]; // Read the first sheet
                const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
                    header: 1, // Extract raw rows, with the first row as headers
                });

                // Extract headers and validate required columns
                const headers = sheetData[0] || []; // The first row contains headers
                const requiredColumns = ["Employer ID", "Employer Name"];
                const validationResult = validateColumns(headers, requiredColumns);

                if (!validationResult.isValid) {
                    setStatus("Failed");
                    setNote("Wrong value input for criteria options. Please update and try again.");
                    setData([]); // Clear data state
                    return;
                }

                const validationResult2 = validateHeadersAgainstCriteria(headers, criteriaList);
                if (!validationResult2.isValid) {
                    // Set error if validation fails
                    setStatus("Failed");
                    setNote("Wrong value template. Re-download latest template and try again.");
                    setData([]); // Clear data state
                    return;
                }

                // Convert sheet to JSON excluding the header row
                const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                setData(jsonData); // Update data state with extracted data

            };
            reader.readAsArrayBuffer(file);
        } else {
            setSelectedFile(null);
            setFile(null); // Reset file if invalid
            setData([]); // Clear data state
            setErrorMessage("Invalid file format. Please upload a .xlsx or .xls file.");
        }
    };


    // Handle closing the modal and resetting the file
    const handleCloseModal = () => {
        setStatus("Success");
        setNote("");
        setData([]);
        setFile(null);
        setErrorMessage('');
        setSelectedFile(null); // Reset selected file when closing the modal
        handleClose(); // Call the original handleClose to close the modal
    };

    // Handle removing the selected file
    const handleRemoveFile = () => {
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



    const handleFileUpload = async () => {
        if (!file) {
            alert("Please select a file before uploading.");
            return;
        }
        try {
            const formData = new FormData();
            formData.append("file", file); // Ensure the key matches the backend requirement
            const form = {
                file: file,
                folder: 'upload'
            }
            const response = await FileUploadAPI.uploadFile(form);
            const filePath = `D:\\upload\\${response.fileName}`;

            // Construct the payload for bulk ranking upload
            const data = {
                fileName: response.fileName,
                filePath: filePath,
                rankingGroupId: currentGroup.groupId, // Assume currentGroup is provided with a groupId field
                uploadBy: 1, // Default uploadBy value
                status: status, // Default status
                note: note, // Default note
            };
            const newBulkRanking = await addNewBulkRanking(data);

            if (status === 'Success') {
                // Call the function to add a new bulk ranking
                // Call the function to upload employees
                await handleEmployeeUpload(newBulkRanking);

                // Call the function to upload employee criteria
                const output = extractEmployeeCriteriaOptions(criteriaList, data);
                await uploadEmployeeCriteria(output);
                showSuccessMessage("Successfully upload!!!");
            }
            if (status === 'Failed') {
                throw new Error("Failed to upload data from excel file!!!");
            }
            handleCloseModal();

        } catch (error) {
            showErrorMessage("Failed to upload data from excel file!!!");
            handleCloseModal();
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
                        Upload
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
