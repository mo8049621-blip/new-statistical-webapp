import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import FileUploader from './FileUploader';
import DistributionGenerator from './DistributionGenerator';
import AIDataGenerator from './AIDataGenerator';
import { useState } from 'react';
function DataInputPanel(_a) {
    var onDataChange = _a.onDataChange;
    var _b = useState('distribution'), activePanel = _b[0], setActivePanel = _b[1];
    return (_jsxs(Box, { p: 6, border: "1px", borderColor: "gray.200", borderRadius: "md", bg: "white", children: [_jsxs(Tabs, { defaultIndex: 0, w: "100%", onChange: function (index) {
                    var panels = ['upload', 'distribution', 'ai'];
                    setActivePanel(panels[index]);
                }, children: [_jsxs(TabList, { mb: "4", gridTemplateColumns: "repeat(3, 1fr)", children: [_jsx(Tab, { children: "File Upload" }), _jsx(Tab, { children: "Distribution Generation" }), _jsx(Tab, { children: "AI Data Generation" })] }), _jsxs(TabPanels, { children: [_jsx(TabPanel, { children: _jsx(FileUploader, { onDataChange: onDataChange }) }), _jsx(TabPanel, { children: _jsx(DistributionGenerator, { onDataChange: onDataChange }) }), _jsx(TabPanel, { children: _jsx(AIDataGenerator, { onDataChange: onDataChange }) })] })] }), activePanel === 'upload' && (_jsx(FileUploader, { onDataChange: onDataChange })), activePanel === 'distribution' && (_jsx(DistributionGenerator, { onDataChange: onDataChange })), activePanel === 'ai' && (_jsx(AIDataGenerator, { onDataChange: onDataChange }))] }));
}
export default DataInputPanel;
