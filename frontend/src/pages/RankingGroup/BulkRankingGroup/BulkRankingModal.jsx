import React, { useState } from "react";
import { Box, Button, Link, Modal, Typography, TextField, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ClearIcon from "@mui/icons-material/Clear"; // Import the Clear icon

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

const BulkRankingModal = ({ open, handleClose, onUpload }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileError, setFileError] = useState(""); // Track file error

    // Handle file change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.name.endsWith(".xlsx")) {
            setSelectedFile(file.name);
            setFileError(""); // Clear any previous error
        } else {
            setSelectedFile(null);
            setFileError("Please select a valid .xlsx file."); // Show error message if file is not xlsx
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
                        onClick={() => onUpload(selectedFile)} // Pass selectedFile to onUpload
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
