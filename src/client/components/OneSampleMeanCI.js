var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Box, Text, Grid, Card, CardBody, Select, FormControl, FormLabel, Switch, Input, Button, Alert, AlertIcon, AlertDescription } from '@chakra-ui/react';
import { calculateConfidenceInterval, calculateMean } from '../utils/statistics';
function OneSampleMeanCI(_a) {
    var _b = _a.dataset, dataset = _b === void 0 ? [] : _b, _c = _a.isGeneratedDataset, isGeneratedDataset = _c === void 0 ? false : _c, distributionInfo = _a.distributionInfo, basicStats = _a.basicStats;
    // Confidence interval calculation options
    var _d = useState({
        confidenceLevel: 0.95,
        isNormal: false, // Default: not assuming normal distribution
        knownVariance: false, // Default: unknown variance
        populationVariance: 0
    }), ciOptions = _d[0], setCiOptions = _d[1];
    // Calculate sample variance (for auto-filling when dataset is generated)
    var calculateSampleVariance = function (data) {
        if (data.length <= 1)
            return 0;
        var mean = ((basicStats === null || basicStats === void 0 ? void 0 : basicStats.mean) || data.reduce(function (sum, val) { return sum + val; }, 0) / data.length);
        var variance = data.reduce(function (sum, val) { return sum + Math.pow(val - mean, 2); }, 0) / (data.length - 1);
        return variance;
    };
    // Check if dataset is empty
    var isDatasetEmpty = dataset.length === 0 && (!basicStats || basicStats.count === 0);
    // Get sample statistics, prioritize passed-in statistics
    var sampleSize = (basicStats === null || basicStats === void 0 ? void 0 : basicStats.count) || dataset.length || 0;
    var sampleMean = (basicStats === null || basicStats === void 0 ? void 0 : basicStats.mean) || (dataset.length > 0 ? calculateMean(dataset) : 0);
    var sampleVariance = (basicStats === null || basicStats === void 0 ? void 0 : basicStats.variance) || (sampleSize > 1 && dataset.length > 0 ? calculateSampleVariance(dataset) : 0);
    // When dataset changes and distribution info is available, set parameters based on actual distribution type
    React.useEffect(function () {
        if (isGeneratedDataset && dataset.length > 0 && distributionInfo) {
            var variance_1 = calculateSampleVariance(dataset);
            // Only assume population is normally distributed when distribution type is normal
            var isActualNormal_1 = distributionInfo.type === 'normal';
            setCiOptions(function (prev) { return (__assign(__assign({}, prev), { populationVariance: variance_1, isNormal: isActualNormal_1, knownVariance: true // For generated data, we know the distribution parameters
             })); });
        }
    }, [dataset, isGeneratedDataset, distributionInfo]);
    // Calculation result state
    var _e = useState(null), result = _e[0], setResult = _e[1];
    var handleCalculate = function () {
        try {
            if (dataset.length === 0) {
                throw new Error('Please select or generate a dataset above first');
            }
            // Calculate mean, prefer using passed statistics
            var mean = sampleMean;
            // Calculate confidence interval
            var confidenceInterval = calculateConfidenceInterval(dataset, ciOptions.confidenceLevel, {
                isNormal: ciOptions.isNormal,
                knownVariance: ciOptions.knownVariance,
                populationVariance: ciOptions.populationVariance
            });
            setResult({
                mean: mean,
                confidenceInterval: confidenceInterval
            });
        }
        catch (error) {
            alert(error instanceof Error ? error.message : 'An error occurred during calculation');
        }
    };
    // If dataset is empty, show prompt
    if (isDatasetEmpty) {
        return (_jsx(Box, { p: 4, children: _jsxs(Alert, { status: "info", mt: 4, children: [_jsx(AlertIcon, {}), _jsx(AlertDescription, { children: "Please upload or generate data first, then calculate confidence intervals." })] }) }));
    }
    return (_jsxs(Box, { children: [_jsx(Text, { fontSize: "lg", mb: 4, children: "One-Sample Mean Confidence Interval Calculation" }), dataset.length === 0 && (_jsxs(Alert, { status: "warning", mb: 4, children: [_jsx(AlertIcon, {}), "Please select or generate a dataset in the data input and generation area above"] })), _jsx(Card, { mb: 6, children: _jsxs(CardBody, { children: [_jsxs(Grid, { templateColumns: { base: '1fr', md: 'repeat(2, 1fr)' }, gap: 4, mb: 4, children: [_jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Confidence Level" }), _jsxs(Select, { value: ciOptions.confidenceLevel, onChange: function (e) { return setCiOptions(__assign(__assign({}, ciOptions), { confidenceLevel: parseFloat(e.target.value) })); }, children: [_jsx("option", { value: "0.90", children: "90%" }), _jsx("option", { value: "0.95", children: "95%" }), _jsx("option", { value: "0.99", children: "99%" }), _jsx("option", { value: "0.999", children: "99.9%" })] })] }), !isGeneratedDataset && (_jsxs(_Fragment, { children: [_jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Population is Normally Distributed" }), _jsx(Switch, { isChecked: ciOptions.isNormal, onChange: function (e) { return setCiOptions(__assign(__assign({}, ciOptions), { isNormal: e.target.checked })); } })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Known Population Variance" }), _jsx(Switch, { isChecked: ciOptions.knownVariance, onChange: function (e) { return setCiOptions(__assign(__assign({}, ciOptions), { knownVariance: e.target.checked })); } })] }), ciOptions.knownVariance && (_jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Population Variance Value" }), _jsx(Input, { type: "number", min: "0", step: "any", value: ciOptions.populationVariance, onChange: function (e) { return setCiOptions(__assign(__assign({}, ciOptions), { populationVariance: parseFloat(e.target.value) || 0 })); } })] }))] })), isGeneratedDataset && dataset.length > 0 && distributionInfo && (_jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Dataset Distribution Information" }), _jsxs(Box, { p: 3, bg: "green.50", borderRadius: "md", borderWidth: 1, borderColor: "green.200", children: [_jsxs(Text, { children: ["\u2022 Distribution Type: ", distributionInfo.name] }), _jsxs(Text, { children: ["\u2022 ", distributionInfo.type === 'normal' ? 'Assuming population is normally distributed' : 'Using t-distribution or normal approximation based on Central Limit Theorem'] }), _jsxs(Text, { children: ["\u2022 Automatically using sample variance: ", ciOptions.populationVariance.toFixed(6)] }), _jsxs(Text, { children: ["\u2022 Sample Size: ", sampleSize] }), _jsxs(Text, { children: ["\u2022 Sample Mean: ", sampleMean.toFixed(4)] }), _jsxs(Text, { children: ["\u2022 Sample Variance: ", sampleVariance.toFixed(6)] }), Object.entries(distributionInfo.parameters).map(function (_a) {
                                                    var key = _a[0], value = _a[1];
                                                    return (_jsxs(Text, { children: ["\u2022 ", key, ": ", value.toFixed(4)] }, key));
                                                })] })] }))] }), _jsx(Button, { onClick: handleCalculate, colorScheme: "blue", width: "100%", disabled: dataset.length === 0, children: "Calculate Confidence Interval" })] }) }), result && (_jsxs(Grid, { templateColumns: { base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 4, children: [_jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "Sample Mean" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: result.mean.toFixed(4) })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "CI Lower Bound" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: result.confidenceInterval.lower.toFixed(4) })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "CI Upper Bound" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: result.confidenceInterval.upper.toFixed(4) })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "Margin of Error" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: result.confidenceInterval.marginOfError.toFixed(4) })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "Calculation Method" }), _jsx(Text, { fontSize: "lg", fontWeight: "bold", children: result.confidenceInterval.method })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "Critical Value" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: result.confidenceInterval.criticalValue.toFixed(4) })] }) })] }))] }));
}
export default OneSampleMeanCI;
