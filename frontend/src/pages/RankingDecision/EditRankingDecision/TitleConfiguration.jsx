const TitleConfiguration = ({ criteria, title, decisionStatus, page, pageSize, goToNextStep, showErrorMessage }) => {
    const [columnsTitle, setColumnsTitle] = useState([]);
    // Tạo cấu hình cột và hàng
    useEffect(() => {
        if (criteria && title) {
            // Cột từ tiêu chí
            const criteriaColumns = criteria.map((criteria) => ({
                field: criteria.criteriaName,
                headerName: criteria.criteriaName,
                width: 140,
                editable: true,
                renderCell: (params) => (
                    <Select
                        value={params.value || ''}
                        onChange={(e) => handleCellEditTitleCommit({ id: params.row.id, field: params.field, value: e.target.value })}
                        fullWidth
                        sx={{
                            height: '30px', // Chiều cao của box
                            '.MuiSelect-select': {
                                padding: '4px', // Padding trong box
                            },
                        }}

                    >
                        {rankTitles.map((title, index) => (
                            <MenuItem key={index} value={title}>
                                {title}
                            </MenuItem>
                        ))}
                    </Select>
                ),
            }));

            // Cột cố định
            const fixedColumns = [
                { field: 'titleName', headerName: 'Title Name', width: 100 },
                {
                    field: 'rankScore',
                    headerName: 'Rank Score',
                    width: 100,
                    editable: decisionStatus === 'Draft',
                    align: 'center',
                    headerAlign: 'center',
                },
            ]
            const actionColumn = [
                {
                    field: 'action', headerName: 'Action', width: 130,
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

            // Tạo hàng dữ liệu
            const updatedRows = title.map((title) => ({
                id: title.titleId,
                titleName: title.titleName,
                rankScore: '',
                ...criteria.reduce((acc, criteria) => {
                    acc[criteria.criteriaName] = '';
                    return acc;
                }, {}),
            }));

            // Cập nhật cột và hàng
            setColumnsTitle([...fixedColumns, ...criteriaColumns, ...actionColumn]);
            setTitle(updatedRows);
        }
    }, [criteria, title, decisionStatus]);

    // Xử lý khi chỉnh sửa ô
    const handleCellEditTitleCommit = ({ id, field, value }) => {
        setTitle((prevRows) => {
            const updatedRows = [...prevRows];
            const rowIndex = updatedRows.findIndex((row) => row.id === id);

            if (rowIndex !== -1) {
                // Cập nhật giá trị ô
                updatedRows[rowIndex] = {
                    ...updatedRows[rowIndex],
                    [field]: value,
                };

                // Tính toán rankScore nếu tất cả các tiêu chí đã được chọn
                const currentRow = updatedRows[rowIndex];
                const allCriteriaFilled = criteria.every((criteria) => currentRow[criteria.criteriaName]);

                if (allCriteriaFilled) {
                    // Công thức tính toán rankScore
                    const newRankScore = criteria.reduce((score, criteria) => {
                        const chosenValue = parseInt(currentRow[criteria.criteriaName]) || 0; // Giá trị lựa chọn
                        const weight = criteria.weight;
                        const numOptions = criteria.numOptions;

                        return score + (chosenValue * (weight / numOptions));
                    }, 0);

                    // Cập nhật rankScore
                    updatedRows[rowIndex].rankScore = newRankScore.toFixed(2); // Làm tròn 2 chữ số
                } else {
                    // Xóa rankScore nếu chưa đủ điều kiện
                    updatedRows[rowIndex].rankScore = '';
                }
            }
            return updatedRows;
        });
    };

    return (
        <div>
            <h3>Title Configuration</h3>
            {/* Nội dung của Title Configuration */}
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
                overflow: 'hidden', // Loại bỏ thanh cuộn bên ngoài
            }}>
                {
                    <Box sx={{ width: '100%', height: 400, marginTop: '10px' }}>
                        <DataGrid
                            // className="custom-data-grid"
                            rows={title}
                            columns={columnsTitle}
                            getRowId={(row) => row.id}
                            pageSize={5}
                            rowsPerPageOptions={[5]}

                        />

                        {/* Button Title */}
                        {decisionStatus === 'Draft' && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, marginTop: '20px' }}>
                                {/* Nút Add Criteria ở bên trái */}
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
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
                }

            </Box>
        </div>
    );
};

export default TitleConfiguration;
