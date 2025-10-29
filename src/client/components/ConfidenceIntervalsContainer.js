import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Text, Button, Stack, Divider } from '@chakra-ui/react';
import OneSampleMeanCI from './OneSampleMeanCI';
import TwoSampleMeanCI from './TwoSampleMeanCI';
import ProportionCI from './ProportionCI';
import PairedMeanCI from './PairedMeanCI';
import TwoProportionCI from './TwoProportionCI';
function ConfidenceIntervalsContainer(_a) {
    var _b = _a.dataset, dataset = _b === void 0 ? [] : _b, _c = _a.dataset2, dataset2 = _c === void 0 ? [] : _c, _d = _a.pairedData, pairedData = _d === void 0 ? { before: [], after: [] } : _d, _e = _a.isGeneratedDataset, isGeneratedDataset = _e === void 0 ? false : _e, distributionInfo = _a.distributionInfo, basicStats = _a.basicStats;
    // Primary category: mean difference and proportion
    var _f = useState('mean'), primaryCategory = _f[0], setPrimaryCategory = _f[1]; // 'mean' or 'proportion'
    // Secondary category: specific type under mean difference
    var _g = useState('oneSample'), meanSubType = _g[0], setMeanSubType = _g[1]; // 'oneSample', 'twoSample', 'paired'
    // Secondary category: specific type under proportion
    var _h = useState('oneProportion'), proportionSubType = _h[0], setProportionSubType = _h[1]; // 'oneProportion', 'twoProportion'
    // Render corresponding confidence interval component based on selected type
    var renderIntervalComponent = function () {
        if (primaryCategory === 'mean') {
            switch (meanSubType) {
                case 'oneSample':
                    return _jsx(OneSampleMeanCI, { dataset: dataset, isGeneratedDataset: isGeneratedDataset, distributionInfo: distributionInfo });
                case 'twoSample':
                    return _jsx(TwoSampleMeanCI, { dataset1: dataset, dataset2: dataset2 });
                case 'paired':
                    return _jsx(PairedMeanCI, { pairedData: pairedData });
                default:
                    return _jsx(OneSampleMeanCI, { dataset: dataset });
            }
        }
        else if (primaryCategory === 'proportion') {
            switch (proportionSubType) {
                case 'oneProportion':
                    return _jsx(ProportionCI, { dataset: dataset });
                case 'twoProportion':
                    return _jsx(TwoProportionCI, {});
                default:
                    return _jsx(ProportionCI, { dataset: dataset });
            }
        }
        return _jsx(OneSampleMeanCI, { dataset: dataset, basicStats: basicStats });
    };
    return (_jsxs(Box, { p: 6, bg: "white", rounded: "lg", shadow: "md", children: [_jsx(Text, { fontSize: "xl", fontWeight: "bold", mb: 6, textAlign: "center", children: "Confidence Interval Analysis" }), _jsxs(Stack, { direction: "row", gap: 4, mb: 4, justifyContent: "center", children: [_jsx(Button, { variant: primaryCategory === 'mean' ? "solid" : "outline", colorScheme: "blue", size: "lg", onClick: function () { return setPrimaryCategory('mean'); }, children: "Mean Difference" }), _jsx(Button, { variant: primaryCategory === 'proportion' ? "solid" : "outline", colorScheme: "blue", size: "lg", onClick: function () { return setPrimaryCategory('proportion'); }, children: "Proportion" })] }), _jsx(Divider, { mb: 4 }), primaryCategory === 'mean' && (_jsxs(Stack, { direction: "row", gap: 2, mb: 6, flexWrap: "wrap", justifyContent: "center", children: [_jsx(Button, { variant: meanSubType === 'oneSample' ? "solid" : "outline", colorScheme: "green", onClick: function () { return setMeanSubType('oneSample'); }, children: "One Sample Mean" }), _jsx(Button, { variant: meanSubType === 'twoSample' ? "solid" : "outline", colorScheme: "green", onClick: function () { return setMeanSubType('twoSample'); }, children: "Two Sample Mean Difference" }), _jsx(Button, { variant: meanSubType === 'paired' ? "solid" : "outline", colorScheme: "green", onClick: function () { return setMeanSubType('paired'); }, children: "Paired Sample Mean Difference" })] })), primaryCategory === 'proportion' && (_jsxs(Stack, { direction: "row", gap: 2, mb: 6, flexWrap: "wrap", justifyContent: "center", children: [_jsx(Button, { variant: proportionSubType === 'oneProportion' ? "solid" : "outline", colorScheme: "green", onClick: function () { return setProportionSubType('oneProportion'); }, children: "One Proportion" }), _jsx(Button, { variant: proportionSubType === 'twoProportion' ? "solid" : "outline", colorScheme: "green", onClick: function () { return setProportionSubType('twoProportion'); }, children: "Two Proportion Difference" })] })), _jsx(Box, { p: 4, children: renderIntervalComponent() })] }));
}
export default ConfidenceIntervalsContainer;
