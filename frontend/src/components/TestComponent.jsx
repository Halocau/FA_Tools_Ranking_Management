import React from 'react';

export default function TestComponent() {
    const unusedVariable = "I'm unused!"; // Unused variable

    return (
        <div>
            <h1>Hello World</h1>
            <img src="image.png" /> {/* Missing alt attribute */}
        </div>
    );
}
