import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Text, Tabs, Tab, Card, CardBody } from '@chakra-ui/react';
import DistributionGenerator from './DistributionGenerator';
import PairedDataGenerator from './PairedDataGenerator';
import TwoSampleDataGenerator from './TwoSampleDataGenerator';
function DataGeneratorContainer(_a) {
    var onDataGenerated = _a.onDataGenerated, onPairedDataGenerated = _a.onPairedDataGenerated, onDirectDataChange = _a.onDirectDataChange;
    var _b = useState('single'), activeTab = _b[0], setActiveTab = _b[1];
    // Handle single sample data generation
    var handleSingleDataGenerated = function (data, distributionInfo) {
        onDataGenerated({ data: data, distributionInfo: distributionInfo }, 1);
    };
    // Handle two sample data generation
    var handleTwoSampleDataGenerated = function (data) {
        if ((data === null || data === void 0 ? void 0 : data.sample1) && (data === null || data === void 0 ? void 0 : data.sample2)) {
            onDataGenerated({ data: data.sample1 }, 1);
            onDataGenerated({ data: data.sample2 }, 2);
        }
    };
    // Handle paired data generation
    var handlePairedDataGenerated = function (data) {
        if ((data === null || data === void 0 ? void 0 : data.before) && (data === null || data === void 0 ? void 0 : data.after)) {
            onPairedDataGenerated(data.before, data.after);
            onDataGenerated({ data: data.before }, 1);
            onDataGenerated({ data: data.after }, 2);
        }
    };
    return (_jsx(Card, { mb: 6, children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "lg", fontWeight: "medium", mb: 4, children: "Data Generation" }), _jsx(Box, { borderBottomWidth: "1px", borderBottomColor: "gray.200", mb: 4, children: _jsxs(Tabs, { index: activeTab === 'single' ? 0 : activeTab === 'two' ? 1 : 2, onChange: function (index) { return setActiveTab(index === 0 ? 'single' : index === 1 ? 'two' : 'paired'); }, children: [_jsx(Tab, { px: 4, py: 2, children: "Single Sample Data" }), _jsx(Tab, { px: 4, py: 2, children: "Two Sample Data" }), _jsx(Tab, { px: 4, py: 2, children: "Paired Data" })] }) }), activeTab === 'single' && (_jsx(DistributionGenerator, { onDataChange: function (data) {
                        if (onDirectDataChange) {
                            // For direct data input like file upload, use specialized handling functions
                            onDirectDataChange(data);
                        }
                        else {
                            // Backward compatibility
                            handleSingleDataGenerated(data);
                        }
                    } })), activeTab === 'two' && (_jsx(TwoSampleDataGenerator, { onDataGenerated: handleTwoSampleDataGenerated })), activeTab === 'paired' && (_jsx(PairedDataGenerator, { onDataGenerated: handlePairedDataGenerated }))] }) }));
}
export default DataGeneratorContainer;
