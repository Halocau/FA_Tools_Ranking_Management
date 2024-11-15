import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import '../../assets/css/Search.css'; // Import file CSS

const SearchComponent = ({ onSearch, placeholder = "Search Decision" }) => {
    const [searchValue, setSearchValue] = useState("");

    const handleInputChange = (event) => {
        setSearchValue(event.target.value);
    };

    const handleSearchSubmit = () => {
        onSearch(searchValue);
    };

    const clearSearch = () => {
        setSearchValue('');
        onSearch(''); // Clear search results when cleared
    };

    return (
        <div className="search-container">
            <TextField
                value={searchValue}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === "Enter" && handleSearchSubmit()}
                placeholder="Search Decision"
                variant="outlined"
                fullWidth
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start" sx={{ display: "flex", alignItems: "center" }}>
                            <SearchIcon
                                onClick={() => {
                                    setSearchValue(''); // Xóa text khi nhấn vào icon tìm kiếm
                                    handleSearchSubmit(); // Gọi hàm tìm kiếm (nếu cần thiết)
                                }}
                                sx={{
                                    cursor: 'pointer',
                                    marginRight: 1,
                                    transition: 'transform 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: 'scale(1.2)',
                                        color: 'primary.main',
                                    },
                                    '&:active': {
                                        transform: 'scale(1.1)',
                                    },
                                }}
                            />
                        </InputAdornment>
                    ),
                    endAdornment: searchValue && (
                        <InputAdornment position="end" sx={{ display: 'flex' }}>
                            <IconButton
                                onClick={clearSearch}
                                size="small"
                                sx={{ padding: '0' }}
                            >
                                <ClearIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                sx={{
                    flexGrow: 1,
                    marginRight: '16px',
                    maxWidth: '600px',
                    marginTop: '-10px',
                    '& .MuiInputBase-root': {
                        borderRadius: '20px',
                        height: '40px',
                    },
                }}
            />
        </div>
    );
};

export default SearchComponent;
