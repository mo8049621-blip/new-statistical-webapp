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
import { useState } from 'react';
import { Box, Text, Grid, Card, CardBody, Select, FormControl, FormLabel, Button, Input, Alert, AlertDescription } from '@chakra-ui/react';
import { calculateTwoSampleConfidenceInterval } from '../utils/statistics';
var TwoSampleCIComponent = function () {
    var _a = useState(''), data1 = _a[0], setData1 = _a[1];
    var _b = useState(''), data2 = _b[0], setData2 = _b[1];
    var _c = useState(0.95), confidenceLevel = _c[0], setConfidenceLevel = _c[1];
    var _d = useState('welch'), method = _d[0], setMethod = _d[1];
    var _e = useState(null), result = _e[0], setResult = _e[1];
    var _f = useState(null), error = _f[0], setError = _f[1];
    var parseData = function (input) {
        // Try multiple format parsing: comma-separated, space-separated, line-separated
        try {
            // First try to parse directly as JSON array
            if (input.trim().startsWith('[') && input.trim().endsWith(']')) {
                return JSON.parse(input);
            }
            // Otherwise parse by comma, space, newline, etc.
            return input
                .split(/[,\s\n]+/)
                .filter(function (item) { return item.trim() !== ''; })
                .map(function (item) { return parseFloat(item.trim()); })
                .filter(function (num) { return !isNaN(num); });
        }
        catch (e) {
            throw new Error('Data format error, please enter valid number list');
        }
    };
    var calculate = function () {
        setError(null);
        setResult(null);
        try {
            // Parse input data
            var dataset1 = parseData(data1);
            var dataset2 = parseData(data2);
            if (dataset1.length === 0 || dataset2.length === 0) {
                throw new Error('Dataset cannot be empty');
            }
            // If paired sample, check if lengths are the same
            if (method === 'paired' && dataset1.length !== dataset2.length) {
                throw new Error('Paired samples must have the same length');
            }
            // Calculate confidence interval for the difference between two means
            var ciResult = calculateTwoSampleConfidenceInterval(dataset1, dataset2, confidenceLevel, { method: method });
            // Calculate sample means
            var mean1 = dataset1.reduce(function (sum, val) { return sum + val; }, 0) / dataset1.length;
            var mean2 = dataset2.reduce(function (sum, val) { return sum + val; }, 0) / dataset2.length;
            setResult(__assign(__assign({}, ciResult), { mean1: mean1, mean2: mean2, n1: dataset1.length, n2: dataset2.length }));
        }
        catch (e) {
            setError(e instanceof Error ? e.message : 'Error occurred during calculation');
        }
    };
    var handleDemoData = function () {
        // Set example data (two normal distribution samples)
        var demo1 = Array(20).fill(0).map(function () { return 5 + Math.random() * 2; }); // Sample with mean around 5
        var demo2 = Array(20).fill(0).map(function () { return 6 + Math.random() * 2; }); // Sample with mean around 6
        setData1(demo1.join(', '));
        setData2(demo2.join(', '));
        setMethod('welch');
        setConfidenceLevel(0.95);
        setError(null);
        setResult(null);
    };
    return (_jsxs(Box, { p: 6, maxW: "1200px", mx: "auto", children: [_jsx(Text, { fontSize: "2xl", fontWeight: "bold", mb: 6, children: "Confidence Interval for Two Sample Means Difference" }), _jsxs(Grid, { templateColumns: { base: '1fr', md: '1fr 1fr' }, gap: 6, mb: 8, children: [_jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Dataset 1" }), _jsx(Text, { fontSize: "sm", color: "gray.500", mb: 2, children: "Enter comma-separated or space-separated list of numbers, e.g.: 1, 2, 3, 4, 5" }), _jsx(Input, { as: "textarea", placeholder: "Enter numbers for first dataset...", value: data1, onChange: function (e) { return setData1(e.target.value); }, rows: 6 })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Dataset 2" }), _jsx(Text, { fontSize: "sm", color: "gray.500", mb: 2, children: "Enter comma-separated or space-separated list of numbers, e.g.: 6, 7, 8, 9, 10" }), _jsx(Input, { as: "textarea", placeholder: "Enter numbers for second dataset...", value: data2, onChange: function (e) { return setData2(e.target.value); }, rows: 6 })] })] }), _jsxs(Grid, { templateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 4, mb: 6, children: [_jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Confidence Level" }), _jsxs(Select, { value: confidenceLevel, onChange: function (e) { return setConfidenceLevel(parseFloat(e.target.value)); }, children: [_jsx("option", { value: 0.90, children: "90%" }), _jsx("option", { value: 0.95, children: "95%" }), _jsx("option", { value: 0.99, children: "99%" })] })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Calculation Method" }), _jsxs(Select, { value: method, onChange: function (e) { return setMethod(e.target.value); }, children: [_jsx("option", { value: "pooled", children: "Pooled Variance t-test" }), _jsx("option", { value: "welch", children: "Welch t-test (Unequal Variances)" }), _jsx("option", { value: "paired", children: "Paired Samples t-test" })] })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "\u00A0" }), _jsx(Button, { colorScheme: "blue", width: "100%", onClick: calculate, children: "Calculate Confidence Interval" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "\u00A0" }), _jsx(Button, { variant: "outline", width: "100%", onClick: handleDemoData, children: "Use Example Data" })] })] }), error && (_jsx(Alert, { status: "error", mb: 6, children: _jsx(AlertDescription, { children: error }) })), result && (_jsxs(_Fragment, { children: [_jsx(Text, { fontSize: "xl", fontWeight: "bold", mb: 4, children: "Calculation Results" }), _jsxs(Grid, { templateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 4, mb: 8, children: [_jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "Dataset 1 Mean" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: result.mean1.toFixed(4) })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "Dataset 2 Mean" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: result.mean2.toFixed(4) })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "Mean Difference" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: result.meanDiff.toFixed(4) })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsxs(Text, { fontSize: "sm", color: "gray.500", children: [Math.round(confidenceLevel * 100), "% Confidence Interval Lower Bound"] }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: result.lower.toFixed(4) })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsxs(Text, { fontSize: "sm", color: "gray.500", children: [Math.round(confidenceLevel * 100), "% Confidence Interval Upper Bound"] }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: result.upper.toFixed(4) })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "Margin of Error" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: result.marginOfError.toFixed(4) })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "Critical Value" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: result.criticalValue.toFixed(4) })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "Sample Size 1" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: result.n1 })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "Sample Size 2" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: result.n2 })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "Calculation Method" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: result.method })] }) })] }), _jsxs(Box, { p: 4, borderWidth: 1, borderRadius: 4, bgColor: "#f0f9ff", mb: 4, children: [_jsx(Text, { fontSize: "lg", fontWeight: "bold", mb: 2, children: "Confidence Interval Interpretation" }), _jsxs(Text, { children: ["We are ", Math.round(confidenceLevel * 100), "% confident that the difference between the two population means (\u03BC\u2081 - \u03BC\u2082) falls within the interval [", result.lower.toFixed(4), ", ", result.upper.toFixed(4), "].", result.lower <= 0 && result.upper >= 0 && (_jsx(Text, { mt: 2, color: "orange.600", children: "Note: Since the confidence interval includes 0, we cannot reject the hypothesis that the two means are equal at the current confidence level." })), result.lower > 0 && (_jsx(Text, { mt: 2, color: "green.600", children: "Conclusion: The population mean of Dataset 1 is significantly greater than that of Dataset 2." })), result.upper < 0 && (_jsx(Text, { mt: 2, color: "green.600", children: "Conclusion: The population mean of Dataset 1 is significantly less than that of Dataset 2." }))] })] })] })), _jsxs(Box, { p: 4, borderWidth: 1, borderRadius: 4, bgColor: "#f9fafb", mt: 8, children: [_jsx(Text, { fontSize: "lg", fontWeight: "bold", mb: 2, children: "Instructions" }), _jsx(Text, { mb: 2, children: "1. Enter two datasets, supporting multiple formats (comma, space, or line-separated)" }), _jsx(Text, { mb: 2, children: "2. Select confidence level (90%, 95%, or 99%)" }), _jsx(Text, { mb: 2, children: "3. Select appropriate calculation method:" }), _jsx(Text, { ml: 4, mb: 1, children: "- Pooled Variance t-test: Suitable for independent samples with equal variances" }), _jsx(Text, { ml: 4, mb: 1, children: "- Welch t-test: Suitable for independent samples with unequal variances" }), _jsx(Text, { ml: 4, mb: 1, children: "- Paired Samples t-test: Suitable for related paired data" }), _jsx(Text, { children: "4. Click the \"Calculate Confidence Interval\" button to view results" })] })] }));
};
export default TwoSampleCIComponent;
