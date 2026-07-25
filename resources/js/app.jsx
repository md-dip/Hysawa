import React from 'react';
import { createRoot } from 'react-dom/client';

function App() {
    return (
        <div>
            <h1>SafePani Dashboard</h1>
            <p>React is working! ✅</p>
        </div>
    );
}

const root = createRoot(document.getElementById('app'));
root.render(<App />);