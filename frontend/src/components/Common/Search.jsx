import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const SearchComponent = ({ onSearch, placeholder = "Search ..." }) => {
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
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '16px',
                width: '100%',
            }}
        >
            <TextField
                className="search-container"
                value={searchValue}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === "Enter" && handleSearchSubmit()}
                placeholder={placeholder}
                variant="outlined"
                fullWidth
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start" sx={{ display: "flex", alignItems: "center" }}>
                            <SearchIcon
                                onClick={() => {
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