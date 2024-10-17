import React, { useEffect } from 'react';
import useRankingGroup from '../hooks/useRankingGroup';
export default function TestComponent() {

    const unusedVariable = "I'm unused!"; // Unused variable

    const { data, error, loading, fetchAllRankingGroups } = useRankingGroup();

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }

    useEffect(() => {
        fetchAllRankingGroups();
    }, [data, error, loading]);
    console.log(data);
    return (
        <div>
            <h1>Hello World</h1>
            <img src="image.png" /> {/* Missing alt attribute */}
        </div>
    );
}
