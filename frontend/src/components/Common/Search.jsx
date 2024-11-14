import React, { useState } from 'react';

// Search component
const SearchComponent = ({ onSearch, placeholder = "Search...", delay = 300 }) => {
    const [query, setQuery] = useState("");
    const [typingTimeout, setTypingTimeout] = useState(null);

    const handleInputChange = (event) => {
        const newQuery = event.target.value;
        setQuery(newQuery);

        if (typingTimeout) clearTimeout(typingTimeout);

        setTypingTimeout(
            setTimeout(() => {
                onSearch(newQuery);
            }, delay)
        );
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch(query);
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder={placeholder}
                style={styles.input}
            />
            <button type="submit" style={styles.button}>Search</button>
        </form>
    );
};

// Custom styles for the component
const styles = {
    form: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        width: '50%',
    },
    input: {
        padding: '10px',
        fontSize: '16px',
        borderRadius: '20px',
        border: '1px solid #ccc',
        flexGrow: 1,
        marginBottom: '0px',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#007bff',
        color: '#fff',
        cursor: 'pointer',
    },
};

export default SearchComponent;
