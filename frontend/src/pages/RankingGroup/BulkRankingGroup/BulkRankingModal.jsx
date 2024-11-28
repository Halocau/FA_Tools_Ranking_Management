import React, { useEffect, useState } from "react";
import { Box, Button, Link, Modal, Typography, TextField, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ClearIcon from "@mui/icons-material/Clear"; // Import the Clear icon
import FileUploadAPI from "../../../api/FileUploadAPI";
import * as XLSX from "xlsx"; // Import SheetJS library

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

const BulkRankingModal = ({ open, handleClose, showSuccessMessage, showErrorMessage, currentGroup }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [file, setFile] = useState(null);
    const [fileError, setFileError] = useState(""); // Track file error
    const [data, setData] = useState(null);
    const [criteriaList, setListCriteria] = useState([]);

    console.log("Current Group:", criteriaList);

    const getCriteriaList = async () => {
        try {
            const response = await DecisionCriteriaAPI.optionCriteria(currentGroup.decisionId);
            setListCriteria(response);
        } catch (error) {
            console.error("Error fetching criteria:", error);
        }
    };

    useEffect(() => {
        getCriteriaList();
    }, [currentGroup.decisionId]);


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



    // File change handler
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.name.endsWith(".xlsx")) {
            console.log("Selected file:", file); // Debugging step
            setSelectedFile(file.name);
            setFile(file); // Store the file object in state
            setFileError("");

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
                // const requiredColumns = ["Employer ID", "Employer Name"];
                // const validationResult = validateColumns(headers, requiredColumns);

                // if (!validationResult.isValid) {
                //     // Set error if validation fails
                //     setFileError(validationResult.errorMessage);
                //     setData([]); // Clear data state
                //     return;
                // }

                console.log("Headers:", headers); // Log headers for debugging
                const validationResult2 = validateHeadersAgainstCriteria(headers, criteriaList);
                if (!validationResult2.isValid) {
                    // Set error if validation fails
                    setFileError(validationResult2.errorMessage);
                    setData([]); // Clear data state
                    return;
                }

                // Convert sheet to JSON excluding the header row
                const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                setData(jsonData); // Update data state with extracted data
                console.log("Extracted Data:", jsonData); // Log data for debugging
            };
            reader.readAsArrayBuffer(file);
        } else {
            setSelectedFile(null);
            setFile(null); // Reset file if invalid
            setData([]); // Clear data state
            setFileError("Please select a valid .xlsx file.");
            console.log("Invalid file selected."); // Debugging step
        }
    };


    // Handle closing the modal and resetting the file
    const handleCloseModal = () => {
        setSelectedFile(null); // Reset selected file when closing the modal
        setFileError(""); // Reset file error message
        handleClose(); // Call the original handleClose to close the modal
    };

    // Handle removing the selected file
    const handleRemoveFile = () => {
        setSelectedFile(null); // Reset the selected file
        setFileError(""); // Reset the error message
    };

    const handleFileUpload = async () => {
        if (!file) {
            alert("Please select a file before uploading.");
            return;
        }
        try {
            console.log("Uploading file:", file); // Debugging step
            const formData = new FormData();
            formData.append("file", file); // Ensure the key matches the backend requirement
            console.log("FormData contents:", Array.from(formData.entries())); // Debugging step
            const form = {
                file: file,
                folder: 'upload'
            }
            const response = await FileUploadAPI.uploadFile(form);
            showSuccessMessage("Successfully upload!!!");
            handleCloseModal();
        } catch (error) {
            showErrorMessage("Failed to upload data from excel file!!!");
        }
    };

    return (
        <Modal open={open} onClose={handleCloseModal}>
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
                <Box mt={2}>
                    <Typography variant="body1">Select a file to upload:</Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        type="file"
                        accept=".xlsx" // Only accept .xlsx files
                        onChange={handleFileChange}
                    />
                    {fileError && (
                        <Typography variant="body2" color="error" mt={1}>
                            {fileError} {/* Display error message */}
                        </Typography>
                    )}
                </Box>

                {/* Display selected file as a clickable link with clear icon */}
                {selectedFile && (
                    <Box mt={2} display="flex" alignItems="center">
                        <Typography variant="body2" mr={2}>
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
                                    // Handle file link click (you can choose to download, or show more details, etc.)
                                    alert(`You clicked on ${selectedFile}`);
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
