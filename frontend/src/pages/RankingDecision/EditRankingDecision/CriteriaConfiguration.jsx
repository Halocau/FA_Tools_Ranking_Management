import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, TextField, Button } from '@mui/material';
import { MdDeleteForever } from 'react-icons/md';
import Select from "react-select";
// API
import DecisionCriteriaAPI from "../../../api/DecisionCriteriaAPI.js";
import CriteriaAPI from "../../../api/CriteriaAPI.js"

const CriteriaConfiguration = ({ criteria, decisionStatus, page, pageSize, goToNextStep, showErrorMessage, id, fetchData }) => {

    const [rows, setRows] = useState([]);

    const [criteriaList, setCriteriaList] = useState([]);

    const [selectedCriteria, setSelectedCriteria] = useState(null);

    const getCriteriaList = async () => {
        const data = await CriteriaAPI.searchCriteria();
        console.log(data);
        setCriteriaList(data.result);
    }

    useEffect(() => {
        getCriteriaList();
    }, [])

    // Xử lý khi người dùng chỉnh sửa một ô
    const handleCellEditCriteriaCommit = (newRow, oldRow) => {
        const updatedRow = { ...oldRow, ...newRow };
        if (newRow.weight !== oldRow.weight) {
            updatedRow.weight = newRow.weight;
            setRows((prevRows) =>
                prevRows.map((item) =>
                    item.id === updatedRow.id ? updatedRow : item
                )
            );
            return updatedRow;
        };
    };


    // Tính tổng weight
    const calculateTotalWeight = () => {
        const totalWeight = rows.reduce((total, row) => total + Number(row.weight || 0), 0);
        console.log(totalWeight)
        return totalWeight;
    };

    // Hàm lưu dữ liệu
    const handleSaveChanges = () => {
        const totalWeight = calculateTotalWeight();
        if (totalWeight === 100) {
            console.log("Tổng weight hợp lệ. Lưu dữ liệu...");
            goToNextStep();
        } else {
            showErrorMessage('Tổng weight phải bằng 100');
        }
    };

    const handleAddCriteria = async () => {

        const newCriteria = criteriaList.find(
            (criteria) => criteria.criteriaId === selectedCriteria.value
        );

        console.log(newCriteria);
        // const newRow = {
        //     id: rows.length + 1,
        //     criteria_name: 'New Criteria',
        //     weight: 0,
        //     max_score: 1,
        //     num_options: 1,
        // };

        // try {
        //     // Gửi dữ liệu mới lên backend

        //     const response = await DecisionCriteriaAPI.addDecisionCriteria(newRow);

        //     // Nếu thành công, cập nhật rows với tiêu chí mới
        //     if (response.status === 200) {
        //         setRows([...rows, newRow]);
        //         // Có thể thêm thông báo thành công tại đây
        //         console.log("Tiêu chí mới đã được thêm thành công!");
        //     } else {
        //         throw new Error('Không thể thêm tiêu chí');
        //     }
        // } catch (error) {
        //     // Xử lý lỗi nếu có vấn đề khi gọi API
        //     console.error('Lỗi khi thêm tiêu chí:', error);
        //     // Có thể hiển thị thông báo lỗi cho người dùng tại đây
        // }
    };


    // Xóa một dòng
    const handleDeleteRowData = (id) => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    };

    // Map dữ liệu criteria thành rows
    useEffect(() => {
        console.log(criteria)
        if (criteria) {
            const mappedRows = criteria.map((item, index) => ({
                id: item.criteriaId,
                index: index + 1 + (page - 1) * pageSize,
                criteria_name: item.criteriaName,
                weight: item.weight || 0,
                num_options: item.numOptions < 1 ? "0" : item.numOptions,
                max_score: item.maxScore == null ? "" : item.maxScore,
            }));
            setRows(mappedRows);
        }
    }, [criteria, page, pageSize]);

    // Cột của DataGrid
    const columnsCriteria = [
        { field: 'criteria_name', headerName: 'Criteria Name', width: 500 },
        {
            field: 'weight',
            headerName: 'Weight',
            width: 150,
            align: 'center',
            editable: decisionStatus === 'Draft',
            renderCell: (params) =>
                decisionStatus === 'Draft' ? (
                    <TextField
                        sx={{
                            marginTop: '7px',
                            textAlign: 'center',  // Căn giữa giá trị trong TextField
                        }}
                        value={params.value || ''}
                        onChange={(e) => {
                            // Hiển thị giá trị nhập nhưng chưa cập nhật vào state
                            const newWeight = e.target.value;
                            setRows((prevRows) =>
                                prevRows.map((row) =>
                                    row.id === params.row.id
                                        ? { ...row, weight: newWeight }
                                        : row
                                )
                            );
                        }}
                        onBlur={() => {
                            // Cập nhật vào state khi người dùng rời khỏi ô
                            setRows((prevRows) =>
                                prevRows.map((row) =>
                                    row.id === params.row.id
                                        ? { ...row, weight: params.value }
                                        : row
                                )
                            );
                        }}
                        onFocus={(e) => {
                            e.target.select(); // Tự động chọn toàn bộ giá trị khi người dùng nhấp vào
                        }}
                        variant="outlined"
                        size="small"
                        fullWidth
                        type="number"
                        inputMode="numeric"
                    />
                ) : (
                    params.value
                ),
        },
        { field: 'num_options', headerName: 'No of Options', width: 150, align: 'center', headerAlign: 'center' },
        { field: 'max_score', headerName: 'Max Score', width: 150, align: 'center', headerAlign: 'center' },
        {
            field: 'action',
            headerName: 'Action',
            width: 200,
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

    return (
        <Box sx={{
            width: "100%",
            height: "100%",
            marginTop: '20px',
            border: '2px solid black',
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            // overflow: 'hidden', // Loại bỏ thanh cuộn bên ngoài
        }}>
            <Box>
                <DataGrid
                    rows={rows}
                    columns={columnsCriteria}
                    pageSize={pageSize}
                    autoHeight
                    processRowUpdate={(newRow, oldRow) => handleCellEditCriteriaCommit(newRow, oldRow)}
                    onProcessRowUpdateError={(error) => {
                        console.error('Cập nhật bị lỗi:', error);
                    }}
                />
                {/* Button criteria */}
                {decisionStatus === 'Draft' && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, marginTop: '20px' }}>
                        {/*Dropdown list để chọn criteria muốn add */}
                        {/* Nút Add Criteria ở bên trái */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <Select
                                isSearchable={true}
                                placeholder="Add New Criteria ..."
                                options={criteriaList
                                    .filter(
                                        (criteria) => !rows.some((row) => row.id === criteria.criteriaId) // Exclude criteria already in DataGrid
                                    )
                                    .map((criteria) => ({
                                        value: criteria.criteriaId, // Use criteriaId as the value
                                        label: criteria.criteriaName, // Display criteriaName in the dropdown
                                    }))}
                                styles={{
                                    menu: (provided) => ({
                                        ...provided,
                                        maxHeight: 300, // Limit dropdown height to 300px
                                        overflowY: 'auto', // Enable scrolling for overflow
                                        width: 300,
                                    }),
                                }}

                                menuPlacement="top" // Display dropdown upwards

                                onChange={(selectedOption) => {
                                    setSelectedCriteria(selectedOption);
                                    // Handle the selection logic here, for example:
                                    // setSelectedCriteria(selectedOption);
                                }}

                            />
                            <Button variant="contained" color="success" onClick={handleAddCriteria}>
                                Add Criteria
                            </Button>
                        </Box>
                        {/* Nút Save và Cancel ở bên phải */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button
                                variant="contained"
                                color="error"
                            // onClick={handleCancelChanges}
                            // disabled={!hasChanges} // Bật/tắt dựa trên trạng thái
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSaveChanges}
                            // disabled={!isSaveButtonEnabled} // Bật/tắt dựa trên trạng thái
                            >
                                Save
                            </Button>


                        </Box>
                    </Box>

                )}
            </Box>
        </Box >
    );
};

export default CriteriaConfiguration;
