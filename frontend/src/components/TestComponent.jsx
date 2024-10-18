import React, { useEffect } from 'react';
import useLogin from '../hooks/useLogin';
import useRankingGroup from '../hooks/useRankingGroup';
export default function TestComponent() {

    const { data: loginData, error: loginError, loading: loginLoading, login } = useLogin();

    useEffect(() => {
        login("quatbt", "111");
    }, []);

    // Log data after it has been fetched and updated
    console.log("Fetched Data:", loginData);

    return (
        <div>
            <h1>Hello World</h1>
            <img src="image.png" /> {/* Missing alt attribute */}
            {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
        </div>
    );
}
