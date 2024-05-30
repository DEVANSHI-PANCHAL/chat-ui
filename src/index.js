import React from 'react';
import { createRoot } from 'react-dom/client'; // Updated import for React 18
import './index.css';
import App from './App';

const container = document.getElementById('my-react-app');
const root = createRoot(container); // Create a root using the new API
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
