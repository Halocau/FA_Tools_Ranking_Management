import React, { useEffect } from 'react';
import useRankingGroup from '../hooks/useRankingGroup';
export default function TestComponent() {

    const unusedVariable = "I'm unused!"; // Unused variable

    const { data, error, loading, fetchAllRankingGroups } = useRankingGroup();

    // Trigger fetching data once when the component mounts
    useEffect(() => {
        fetchAllRankingGroups();
    }, []); // Empty array ensures this only runs once on mount

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    // Log data after it has been fetched and updated
    console.log("Fetched Data:", data);

    return (
        <div>
            <h1>Hello World</h1>
            <img src="image.png" /> {/* Missing alt attribute */}
        </div>
    );
}
