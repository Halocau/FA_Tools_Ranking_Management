import React, { useEffect, useState } from "react";
import { MdDeleteForever } from "react-icons/md";
// MUI
import {
  InputAdornment,
  Box,
  Button,
  Typography,
  TextField,
  Modal,
  IconButton,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import CircleIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Stepper, Step, StepButton } from "@mui/material";

const TitleConfiguration = ({
  criteria,
  title,
  rankTitle,
  decisionStatus,
  goToNextStep,
  showErrorMessage,
}) => {
  // // Data
  // const { id } = useParams(); // Get the ID from the URL
  // const [title, setTitle] = useState([]);
  const [columnsTitle, setColumnsTitle] = useState([]);

  // Row table
  const [originalRows, setOriginalRows] = useState([]); // Lưu dữ liệu gốc
  const [rows, setRows] = useState([]);
  // State Cancel and Save
  const [hasChanges, setHasChanges] = useState(false); // kiểm tra thay đổi
  //Select to Add a new Title
  const [listtitle, setListTitle] = useState([]);

  // Load data getTitleConfiguration
  // chưa có API

  ///////////////////////////// Hàm cập nhập thay đổi ///////////////////////////
  // Hàm cập nhập thay đổi data
  const handleCellEditTitleCommit = ({ id, field, value }) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      const rowIndex = updatedRows.findIndex((row) => row.id === id);

      if (rowIndex !== -1) {
        updatedRows[rowIndex][field] = value;

        const currentRow = updatedRows[rowIndex];
        const allCriteriaFilled = criteria.every(
          (criteria) => currentRow[criteria.criteriaName]
        );

        if (allCriteriaFilled) {
          updatedRows[rowIndex].rankScore =
            calculateRankScore(currentRow).toFixed(2);
        } else {
          updatedRows[rowIndex].rankScore = "";
        }
      }

      // Kiểm tra nếu có thay đổi trong bảng và cập nhật hasChanges
      const hasAnyChanges = updatedRows.some((row) =>
        Object.keys(row).some(
          (key) => key !== "id" && key !== "titleName" && row[key] !== ""
        )
      );
      setHasChanges(hasAnyChanges); // Cập nhật trạng thái hasChanges
      return updatedRows;
    });
  };
  //////////////////////////////////// Remove ////////////////////////////////////
  // Hàm hủy thay đổi, đặt lại  giá trị ban đầu của 1 hàng
  const handleDeleteRowData = (id) => {
    setRows((prevRows) => {
      const rowIndex = prevRows.findIndex((row) => row.id === id);

      if (rowIndex !== -1) {
        const updatedRow = { ...prevRows[rowIndex] };
        const originalRow = originalRows.find((row) => row.id === id);

        // Khôi phục giá trị từ originalRow nếu có
        Object.keys(updatedRow).forEach((key) => {
          if (key !== "id" && key !== "titleName") {
            updatedRow[key] = originalRow ? originalRow[key] : ""; // Khôi phục giá trị gốc
          }
        });

        const updatedRows = [...prevRows];
        updatedRows[rowIndex] = updatedRow;
        return updatedRows;
      }

      return prevRows;
    });
  };

  //////////////////////////////////// Cancel /////////////////////////////////////
  // Theo dõi sự thay đổi của rows và originalRows
  useEffect(() => {
    const checkForChanges = () => {
      // Kiểm tra sự khác biệt giữa rows và originalRows
      const hasAnyChanges = rows.some((row, index) => {
        const originalRow = originalRows[index];

        // Kiểm tra nếu có sự khác biệt giữa row và originalRow
        return Object.keys(row).some((key) => {
          if (
            key !== "id" &&
            key !== "titleName" &&
            row[key] !== originalRow[key]
          ) {
            return true;
          }
          return false;
        });
      });

      setHasChanges(hasAnyChanges);
    };

    // Gọi hàm kiểm tra thay đổi
    checkForChanges();
  }, [rows, originalRows]);

  //// Hàm hủy thay đổi, đặt lại  giá trị ban đầu của tất cả
  const handleCancelChanges = () => {
    // Đặt lại tất cả các ô trong bảng về giá trị ban đầu
    setRows((prevRows) => {
      // Duyệt qua tất cả các hàng và reset giá trị ô (giữ lại id và titleName)
      const resetRows = prevRows.map((row, index) => {
        // Lấy giá trị ban đầu từ originalRows (vì chúng đã được lưu lại)
        const originalRow = originalRows[index];

        const updatedRow = { ...row };

        // Khôi phục lại giá trị của mỗi ô từ originalRow
        Object.keys(updatedRow).forEach((key) => {
          if (key !== "id" && key !== "titleName") {
            // Giữ lại id và index (hoặc các cột cố định khác)
            updatedRow[key] = originalRow[key]; // Khôi phục giá trị gốc
            // updatedRow[key] = ''; // Khôi phục giá trị gốc
          }
        });
        return updatedRow;
      });

      return resetRows;
    });
  };

  //////////////////////////////////// Save ///////////////////////////////////////
  // Hàm tính toán RankScore
  const calculateRankScore = (row) => {
    return criteria.reduce((score, criteria) => {
      const chosenValue = parseInt(row[criteria.criteriaName]) || 0;
      const weight = criteria.weight;
      const numOptions = criteria.numOptions;

      return score + chosenValue * (weight / numOptions);
    }, 0);
  };
  // Hàm save, kiểm tra weight nếu bằng 100 thì chuyển sang bước tiếp
  const handleSaveChanges = () => {
    // Kiểm tra xem tất cả rankScore đã được tính toán chưa
    const allRankScoresCalculated = rows.every(
      (row) => row.rankScore && row.rankScore !== ""
    );
    console.log(rows);
    if (!allRankScoresCalculated) {
      showErrorMessage("Tất cả Rank Score phải được tính toán");
      return; // Dừng hàm nếu có hàng chưa tính toán rankScore
    }

    showSuccessMessage("Title Configuration successfully updated.");
    console.log("Title Configuration successfully updated.”");
    // goToNextStep(); // Chuyển bước tiếp theo
  };

  //////////////////////////////////// Select to Add a new Title //////////////////
  const handleAddTitle = () => {
    const newTitle = {
      id: rows.length + 1,
      titleName: "New Title",
      rankScore: "",
      ...title.reduce((acc, title) => {
        acc[title.titleName] = ""; // Chỗ này sẽ là ô trống cho mỗi tiêu chí mới
        return acc;
      }, {}),
    };
    setRows([...rows, newTitle]);
  };

  //////////////////////////////////// Update cấu hình cột và bảng ///////////////
  const updateTableConfig = (criteria, title, decisionStatus) => {
    // Cột từ tiêu chí
    const criteriaColumns = criteria.map((criteria) => ({
      field: criteria.criteriaName,
      headerName: criteria.criteriaName,
      width: 140,
      editable: decisionStatus === "Draft",
      renderCell: (params) => (
        <Select
          value={params.value || ""}
          onChange={(e) =>
            handleCellEditTitleCommit({
              id: params.row.id,
              field: params.field,
              value: e.target.value,
            })
          }
          fullWidth
          sx={{
            height: "30px",
            ".MuiSelect-select": {
              padding: "4px",
            },
          }}
        >
          {rankTitle.map((title, index) => (
            <MenuItem key={index} value={title}>
              {title}
            </MenuItem>
          ))}
        </Select>
      ),
    }));

    // Cột cố định
    const fixedColumns = [
      { field: "titleName", headerName: "Title Name", width: 100 },
      {
        field: "rankScore",
        headerName: "Rank Score",
        width: 100,
        editable: decisionStatus === "Draft",
        align: "center",
        headerAlign: "center",
      },
    ];

    const actionColumn = [
      {
        field: "action",
        headerName: "Action",
        width: 130,
        renderCell: (params) =>
          decisionStatus === "Draft" && (
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
      rankScore: title.rankScore,
      ...criteria.reduce((acc, criteria) => {
        acc[criteria.criteriaName] =
          title.criteriaSelections &&
          title.criteriaSelections[criteria.criteriaName]
            ? title.criteriaSelections[criteria.criteriaName]
            : "";
        return acc;
      }, {}),
    }));

    // Trả về cột và hàng
    return {
      columns: [...fixedColumns, ...criteriaColumns, ...actionColumn],
      rows: updatedRows,
    };
  };
  // Load data to  Title
  useEffect(() => {
    if (criteria && title) {
      const { columns, rows } = updateTableConfig(
        criteria,
        title,
        decisionStatus
      );

      // Cập nhật cột
      setColumnsTitle(columns);

      // Chỉ gọi setOriginalRows nếu chưa có dữ liệu ban đầu
      if (originalRows.length === 0) {
        setOriginalRows(rows); // Lưu trữ dữ liệu ban đầu
      }

      // Cập nhật hàng
      setRows(rows);
    }
  }, [criteria, title, decisionStatus, originalRows]);
  return (
    <div>
      <Box
        sx={{
          width: "100%",
          height: 500,
          marginTop: "10px",
          border: "2px solid black",
          borderRadius: "8px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflow: "hidden",
        }}
      >
        <Box sx={{ width: "100%", height: 400, marginTop: "10px" }}>
          <DataGrid
            rows={rows}
            columns={columnsTitle}
            getRowId={(row) => row.id}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
          {decisionStatus === "Draft" && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                marginTop: "20px",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleAddTitle}
                >
                  Add Title
                </Button>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                {hasChanges && (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleCancelChanges} // Gọi hàm hủy thay đổi
                  >
                    Cancel
                  </Button>
                )}
                {hasChanges && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveChanges} // Gọi hàm lưu thay đổi
                  >
                    Save
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default TitleConfiguration;
