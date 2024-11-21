import React, { useEffect, useState } from 'react';
import Select from "react-select";
import { MdDeleteForever } from 'react-icons/md';
import { useNavigate, useParams } from "react-router-dom";
// Mui
import { DataGrid } from '@mui/x-data-grid';
import { Box, TextField, Button, IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle'; // Dấu + icon
// API
import DecisionCriteriaAPI from "../../../api/DecisionCriteriaAPI.js";
import CriteriaAPI from "../../../api/CriteriaAPI.js";

const CriteriaConfiguration = ({ decisionStatus, goToNextStep, showErrorMessage, showSuccessMessage }) => {
    // Data 
    const { id } = useParams(); // Get the ID from the URL
    const [criteria, setCriteria] = useState([]);
    const [originalCriteria, setOriginalCriteria] = useState([]);  // Lưu dữ liệu gốc
    // Row table
    const [rows, setRows] = useState([]);
    // State Cancel and Save
    const [hasChanges, setHasChanges] = useState(false); // kiểm tra thay đổi
    //Select to Add a new Criteria
    const [selectedCriteria, setSelectedCriteria] = useState(null);
    const [listcriteria, setListCriteria] = useState([]);

    //// Load data getCriteriaConfiguration
    const getCriteriaConfiguration = async () => {
        try {
            const response = await DecisionCriteriaAPI.getDecisionCriteriaByDecisionId(id);
            // console.log(response)
            setCriteria(response.result);
            // setTotalElements(response.pageInfo.element);
            // setTotalPages(response.pageInfo.total);
        } catch (error) {
            console.error("Error fetching criteria:", error);
        }
    };
    useEffect(() => {
        getCriteriaConfiguration();
    }, []);
    // console.log(criteria);

    ///////////////////////////// Hàm cập nhập thay đổi ///////////////////////////
    // Hàm cập nhập thay đổi weight
    const handleCellEditCriteriaCommit = (newRow) => {
        console.log(newRow)
        // Cập nhật hàng mới
        const updatedRow = { ...newRow };
        // Cập nhật trạng thái `rows`
        setRows((prevRows) => {
            const updatedRows = prevRows.map((row) =>
                row.id === updatedRow.id ? updatedRow : row
            );
            return updatedRows;
        });
    };

    //////////////////////////////////// Remove ////////////////////////////////////
    // Hàm hủy thay đổi, đặt lại  giá trị ban đầu của 1 hàng
    // Hàm xóa hàng 
    const handleDeleteRowData = (id) => {
        setRows((prevRows) => {
            const rowIndex = prevRows.findIndex((row) => row.id === id);
            if (rowIndex !== -1) {
                // Lưu hàng bị xóa vào deletedRows
                // setDeletedRows((prevDeleted) => [...prevDeleted, prevRows[rowIndex]]);
                const updatedRows = [...prevRows];
                updatedRows.splice(rowIndex, 1); // Xóa hàng khỏi mảng rows
                return updatedRows;
            }
            return prevRows; // Nếu không tìm thấy, giữ nguyên
        });
    };

    //////////////////////////////////// Cancel ////////////////////////////////////
    // Hàm hủy thay đổi, đặt lại cột weight về giá trị ban đầu
    const handleCancelChanges = () => {
        setRows(originalCriteria);  // Đặt lại dữ liệu cũ
    };

    //////////////////////////////////// Save ////////////////////////////////////
    // Tính tổng weight
    const calculateTotalWeight = () => {
        const totalWeight = rows.reduce((total, row) => total + Number(row.weight || 0), 0);
        console.log(totalWeight)
        return totalWeight;
    };
    const handleSaveChanges = () => {
        // Bỏ qua kiểm tra weight nếu trạng thái là Finalized
        if (decisionStatus === 'Finalized') {
            console.log("Finalized: Lưu dữ liệu và chuyển bước...");
            goToNextStep();
            return;
        }

        // Kiểm tra tổng weight trong trạng thái khác
        const totalWeight = calculateTotalWeight();
        if (totalWeight === 100) {
            console.log("Tổng weight hợp lệ. Lưu dữ liệu...");
            showSuccessMessage("Criteria Configuration saved successfully!");
            goToNextStep();
        } else {
            // showErrorMessage('Tổng weight phải bằng 100');
            showErrorMessage('Error occurred updating Criteria Configuration. Please try again.');
        }
    };

    //////////////////////////////////// Select to Add a new Criteria ////////////////////////////////////
    const getListCriteria = async () => {
        try {
            const response = await CriteriaAPI.searchCriteria(
                '',
                0,
                20
            );
            setListCriteria(response.result);
        } catch (error) {
            console.error("Error fetching criteria:", error);
        }
    }
    useEffect(() => {
        getListCriteria();
    }, []);
    const handleAddCriteria = async () => {
        const addedCriteria = listcriteria.find(
            (criteria) => criteria.criteriaId === selectedCriteria.value
        );
        const newRows = {
            id: addedCriteria.criteriaId,
            criteria_name: addedCriteria.criteriaName,
            weight: addedCriteria.weight || 0,
            num_options: addedCriteria.numOptions < 1 ? "0" : addedCriteria.numOptions,
            max_score: addedCriteria.maxScore == null ? "" : addedCriteria.maxScore,
        }
        setRows((prevCriteria) => [...prevCriteria, newRows]);
        setSelectedCriteria(null);
    };

    //////////////////////////////////// Column Criteria ////////////////////////////////////
    const columnsCriteria = [
        // { field: 'index', headerName: 'ID', width: 20 },  // Thêm cột chỉ mục
        { field: 'criteria_name', headerName: 'Criteria Name', width: 500 },
        {
            field: 'weight',
            headerName: 'Weight',
            width: 150,
            align: 'center',
            editable: decisionStatus === 'Draft', // Chỉ cho phép chỉnh sửa khi status là 'Draft'
            renderCell: (params) =>
                decisionStatus === 'Draft' ? (
                    <TextField
                        sx={{
                            marginTop: '7px',
                            textAlign: 'center',
                        }}
                        value={params.value || ''} // Hiển thị giá trị hiện tại
                        onChange={(e) => {
                            // Chỉ cập nhật giá trị nội bộ TextField
                            const updatedValue = e.target.value;
                            params.row[params.field] = updatedValue; // Cập nhật trực tiếp giá trị
                        }}
                        onBlur={(e) => {
                            // Gọi processRowUpdate để cập nhật chính thức
                            const updatedRow = { ...params.row, weight: e.target.value };
                            handleCellEditCriteriaCommit(updatedRow);
                        }}
                        onFocus={(e) => {
                            e.target.select(); // Tự động chọn toàn bộ văn bản
                        }}
                        variant="outlined"
                        size="small"
                        fullWidth
                        type="number"
                        inputMode="numeric"
                    />
                ) : (
                    params.value // Hiển thị giá trị nếu không phải 'Draft'
                ),
        },
        { field: 'num_options', headerName: 'No of Options', width: 150, align: 'center', headerAlign: 'center' },
        { field: 'max_score', headerName: 'Max Score', width: 150, align: 'center', headerAlign: 'center' },
        {
            field: 'action',
            headerName: 'Action',
            width: 150,
            renderCell: (params) =>
                decisionStatus === 'Draft' && (
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteRowData(params.row.id)}
                    >
                        <MdDeleteForever />
                    </Button>
                ),
        },
    ];
    // Load data to Column Criteria
    useEffect(() => {
        if (criteria) {
            const mappedRows = criteria.map((criteria, index) => ({
                id: criteria.criteriaId,
                // index: index + 1,  // Chỉ số thứ tự bắt đầu từ 1
                criteria_name: criteria.criteriaName,
                weight: criteria.weight || 0,
                num_options: criteria.numOptions < 1 ? "0" : criteria.numOptions,
                max_score: criteria.maxScore == null ? "" : criteria.maxScore,
            }));
            setRows(mappedRows);
            setOriginalCriteria(mappedRows);  // Lưu lại dữ liệu gốc
        }
    }, [criteria]);


    return (
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
            overflow: 'hidden',
        }}>
            <Box sx={{ width: '100%', height: 400, marginTop: '10px' }}>
                <DataGrid
                    rows={rows}
                    columns={columnsCriteria}
                    getRowId={(row) => row.id}
                    processRowUpdate={(newRow) => {
                        handleCellEditCriteriaCommit(newRow); // Lưu thay đổi chính thức
                        return newRow; // Cần trả về `newRow` để cập nhật DataGrid
                    }}
                    experimentalFeatures={{ newEditingApi: true }} // Bật tính năng chỉnh sửa hàng mới
                />
                {/* Button criteria */}
                {decisionStatus === 'Draft' && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, marginTop: '20px' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <Select
                                isSearchable={true}
                                placeholder="Select to Add a new Criteria"
                                options={listcriteria
                                    .filter(
                                        (criteria) => !rows.some((row) => row.id === criteria.criteriaId)
                                    )
                                    .map((criteria) => ({
                                        value: criteria.criteriaId,
                                        label: criteria.criteriaName,
                                    }))}
                                styles={{
                                    menu: (provided) => ({
                                        ...provided,
                                        maxHeight: 300,
                                        overflowY: 'auto',
                                        width: 300,
                                    }),
                                }}
                                menuPlacement="top"
                                value={selectedCriteria} // Bind the selected option to the state
                                onChange={(option) => setSelectedCriteria(option)} // Update state on selection
                            />
                            <IconButton
                                onClick={handleAddCriteria}
                                color={selectedCriteria ? 'primary' : 'default'} // Màu xanh khi có criteria được chọn
                                disabled={!selectedCriteria} // Vô hiệu hóa khi không có criteria được chọn
                                sx={{ marginLeft: 1, transform: 'translateY(-7px)' }} // Dịch chuyển icon lên trên
                            >
                                <AddCircleIcon fontSize="large" />
                            </IconButton>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, marginBottom: '10px' }}>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleCancelChanges}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSaveChanges}
                            >
                                Save
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default CriteriaConfiguration;