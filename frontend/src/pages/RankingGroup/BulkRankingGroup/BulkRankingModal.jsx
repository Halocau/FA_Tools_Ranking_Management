import React, { useEffect, useState } from "react";
import { Box, Button, Link, Modal, Typography, TextField, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ClearIcon from "@mui/icons-material/Clear"; // Import the Clear icon
import FileUploadAPI from "../../../api/FileUploadAPI";
import * as XLSX from "xlsx"; // Import SheetJS library

//API
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
    const [fileError, setFileError] = useState(""); // Track file error
    const [data, setData] = useState(null);
    const [criteriaList, setListCriteria] = useState([]);
    const [newBulkRanking, setNewBulkRanking] = useState({});
    const [employeeCriteriaData, setEmployeeCriteriaData] = useState([]);
    console.log("Criteria:", criteriaList);
    console.log("Data: ", data);

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
            const response = await EmployeeAPI.upsertEmployeeList(form);
            showSuccessMessage("Successfully upload data to employee list!!!");
        } catch (error) {
            showErrorMessage("Failed to upload data to employee list!!!");
        }
    }

    const uploadEmployeeCriteria = async (form) => {
        try {
            const response = await EmployeeCriteriaAPI.upsertEmployeeCriteriaList(form);
            showSuccessMessage("Successfully upload data to employee criteria list!!!");
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
                const mappedData = mapExcelDataToOptionIds(sheetData, criteriaList);
                setEmployeeCriteriaData(mappedData);
                console.log("Mapped Data:", mappedData); // Log mapped data for debugging
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


    const mapExcelDataToOptionIds = (excelData, criteriaList) => {
        const criteriaNameToOptionsMap = criteriaList.reduce((map, criteria) => {
            map[criteria.criteriaName] = criteria.options;
            return map;
        }, {});

        // Extract header row and data rows
        const headers = excelData[0];
        const dataRows = excelData.slice(1);

        // Normalize headers
        const normalizedHeaders = headers.map((header) =>
            header.trim().replace(/\r?\n|\r/g, "")
        );

        const result = dataRows.map((row) => {
            const rowResult = {};

            row.forEach((cellValue, colIndex) => {
                const columnHeader = normalizedHeaders[colIndex];

                // Skip non-criteria columns
                if (!criteriaNameToOptionsMap[columnHeader]) {
                    rowResult[columnHeader] = cellValue; // Keep non-criteria data (e.g., Employer ID)
                    return;
                }

                // Match criteria column
                const options = criteriaNameToOptionsMap[columnHeader];
                const [scoreStr, ...optionNameParts] = cellValue.split(" - ");
                const score = parseInt(scoreStr.trim(), 10);
                const optionName = optionNameParts.join(" - ").trim();

                const matchedOption = options.find(
                    (option) =>
                        option.score === score && option.optionName === optionName
                );

                if (matchedOption) {
                    rowResult[columnHeader] = matchedOption.optionId; // Store optionId
                } else {
                    rowResult[columnHeader] = null; // Mark unmatched
                    console.warn(
                        `No matching option found for cell value: "${cellValue}" in column: "${columnHeader}"`
                    );
                }
            });
            return rowResult;
        });
        return result;
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

    const handleEmployeeUpload = async (newBulkRanking) => {
        try {
            // Map the data to match the required employee form structure
            const employees = data.map((item) => ({
                employeeId: item["Employer ID"], // Extract Employer ID
                employeeName: item["Employer Name"], // Extract Employer Name
                groupId: currentGroup.groupId, // groupId from currentGroup
                rankingTitleId: 1, // Default as 1
                bulkImportId: newBulkRanking.historyId, // From newBulkRanking.historyId
                rankingDecisionId: currentGroup.decisionId, // From currentGroup.decisionId
            }));

            // Call the uploadEmployee function with the mapped data
            await uploadEmployee(employees);

            console.log("Employee upload process completed successfully!");
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
            console.log("Uploading file:", file); // Debugging step
            const formData = new FormData();
            formData.append("file", file); // Ensure the key matches the backend requirement
            console.log("FormData contents:", Array.from(formData.entries())); // Debugging step
            const form = {
                file: file,
                folder: 'upload'
            }
            const response = await FileUploadAPI.uploadFile(form);
            // console.log("Response:", response);
            const filePath = `D:\\upload\\${response.fileName}`;
            // Construct the payload for bulk ranking upload
            const data = {
                fileName: response.fileName,
                filePath: filePath,
                rankingGroupId: currentGroup.groupId, // Assume currentGroup is provided with a groupId field
                uploadBy: 1, // Default uploadBy value
                status: "ok", // Default status
                note: "1", // Default note
            };

            // Call the function to add a new bulk ranking
            const newBulkRanking = await addNewBulkRanking(data);
            setNewBulkRanking(newBulkRanking);

            // Call the function to upload employees
            await handleEmployeeUpload(newBulkRanking);

            // Call the function to upload employee criteria
            const output = extractEmployeeCriteriaOptions(criteriaList, data);
            await uploadEmployeeCriteria(output);
            showSuccessMessage("Successfully upload!!!");
            handleCloseModal();
        } catch (error) {
            console.error("Error uploading file:", error);
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
