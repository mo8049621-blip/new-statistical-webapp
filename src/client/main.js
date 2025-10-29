import { jsx as _jsx } from "react/jsx-runtime";
import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './App';
var rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error('Root element not found');
}
var root = createRoot(rootElement);
root.render(_jsx(React.StrictMode, { children: _jsx(App, {}) }));
