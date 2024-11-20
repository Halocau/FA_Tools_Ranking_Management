import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, TextField, Button } from '@mui/material';
import { MdDeleteForever } from 'react-icons/md';
import { useNavigate, useParams } from "react-router-dom";
// API
import DecisionCriteriaAPI from "../../../api/DecisionCriteriaAPI.js";
import CriteriaAPI from "../../../api/CriteriaAPI.js";

const CriteriaConfiguration = ({ decisionStatus, goToNextStep, showErrorMessage }) => {
    // Data 
    const { id } = useParams(); // Get the ID from the URL
    const [criteria, setCriteria] = useState([]);
    const [originalCriteria, setOriginalCriteria] = useState([]);  // Lưu dữ liệu gốc
    // Row table
    const [rows, setRows] = useState([]);
    // State Cancel and Save
    const [hasChanges, setHasChanges] = useState(false); // kiểm tra thay đổi
    //Select to Add a new Criteria
    const [listcriteria, setListCriteria] = useState([]);

    //// Load data getCriteriaConfiguration
    const getCriteriaConfiguration = async () => {
        try {
            const response = await DecisionCriteriaAPI.getDecisionCriteriaByDecisionId(id);
            console.log(response)
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

            // Kiểm tra sự thay đổi so với `originalCriteria`
            const hasAnyChanges = updatedRows.some(
                (row, index) => row.weight !== originalCriteria[index]?.weight
            );
            setHasChanges(hasAnyChanges);

            return updatedRows;
        });
    };

    //////////////////////////////////// Remove ////////////////////////////////////
    // Hàm hủy thay đổi, đặt lại  giá trị ban đầu của 1 hàng
    const handleDeleteRowData = (id) => {
        setRows((prevRows) => {
            // Tìm chỉ số của hàng cần xóa giá trị
            const rowIndex = prevRows.findIndex((row) => row.id === id);
            if (rowIndex !== -1) {
                // Tạo một bản sao của hàng hiện tại
                const updatedRow = { ...prevRows[rowIndex] };

                // Xóa các giá trị trong các ô, giữ lại id và các thuộc tính cố định
                Object.keys(updatedRow).forEach((key) => {
                    if (key === "weight") {
                        // Tìm giá trị weight ban đầu từ originalCriteria
                        const originalRow = originalCriteria.find((row) => row.id === id);
                        if (originalRow) {
                            updatedRow[key] = originalRow.weight; // Đặt lại giá trị weight ban đầu
                        }
                    }
                });
                // Cập nhật lại hàng trong mảng
                const updatedRows = [...prevRows];
                updatedRows[rowIndex] = updatedRow;
                return updatedRows;
            }
            return prevRows;
        });
    };

    //////////////////////////////////// Cancel ////////////////////////////////////
    useEffect(() => {
        // Kiểm tra xem có bất kỳ ô nào đã được thay đổi không
        const hasAnyChanges = rows.some((row, index) => row.weight !== originalCriteria[index]?.weight);

        setHasChanges(hasAnyChanges);
    }, [rows, originalCriteria]); // Theo dõi sự thay đổi của rows và originalCriteria
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
    // Hàm save, kiểm tra weight nếu bằng 100 thì chuyển sang bước tiếp
    const handleSaveChanges = () => {
        const totalWeight = calculateTotalWeight();
        if (totalWeight === 100) {
            console.log("Tổng weight hợp lệ. Lưu dữ liệu...");
            goToNextStep();
        } else {
            showErrorMessage('Tổng weight phải bằng 100');
        }
    };
    //////////////////////////////////// Select to Add a new Criteria ////////////////////////////////////
    const handleAddCriteria = async () => {
        const newRow = {
            id: rows.length + 1,
            criteria_name: 'New Criteria',
            weight: 0,
            max_score: 1,
            num_options: 1,
        };

        try {
            const response = await DecisionCriteriaAPI.addDecisionCriteria(newRow);
            if (response.status === 200) {
                setRows([...rows, newRow]);
                console.log("Tiêu chí mới đã được thêm thành công!");
            } else {
                throw new Error('Không thể thêm tiêu chí');
            }
        } catch (error) {
            console.error('Lỗi khi thêm tiêu chí:', error);
        }
    };
    //////////////////////////////////// Column Criteria ////////////////////////////////////
    const columnsCriteria = [
        { field: 'index', headerName: 'ID', width: 20 },  // Thêm cột chỉ mục
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
                            setRows((prevRows) =>
                                prevRows.map((row) =>
                                    row.id === params.row.id ? { ...row, weight: updatedValue } : row
                                )
                            );
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
                index: index + 1,  // Chỉ số thứ tự bắt đầu từ 1
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
            <Box>
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
                            <Button variant="contained" color="success" onClick={handleAddCriteria}>
                                Add Criteria
                            </Button>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            {hasChanges && (
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleCancelChanges}
                                >
                                    Cancel
                                </Button>
                            )}
                            {hasChanges && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSaveChanges}
                                >
                                    Save
                                </Button>
                            )}
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default CriteriaConfiguration;