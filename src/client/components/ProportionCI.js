import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Text, FormControl, FormLabel, Input, Select, Button, Card, CardBody, Grid, Alert } from '@chakra-ui/react';
import { calculateProportionConfidenceInterval } from '../utils/statistics';
function ProportionCI(_a) {
    var _b = _a.dataset, dataset = _b === void 0 ? [] : _b;
    // One proportion parameters
    var _c = useState(''), successCount = _c[0], setSuccessCount = _c[1];
    var _d = useState(''), sampleSize = _d[0], setSampleSize = _d[1];
    var _e = useState('0.95'), confidenceLevel = _e[0], setConfidenceLevel = _e[1];
    var _f = useState('wilson'), method = _f[0], setMethod = _f[1];
    var _g = useState(null), results = _g[0], setResults = _g[1];
    var _h = useState(null), error = _h[0], setError = _h[1];
    useEffect(function () {
        // If dataset is provided, automatically calculate number of successes and sample size
        if (dataset.length > 0) {
            // Assume dataset is binary (0 and 1), count number of 1s as successes
            var count = dataset.filter(function (value) { return value === 1; }).length;
            setSuccessCount(count.toString());
            setSampleSize(dataset.length.toString());
        }
    }, [dataset]);
    var handleCalculate = function () {
        setError(null);
        try {
            var y = parseInt(successCount);
            var n = parseInt(sampleSize);
            var cl = parseFloat(confidenceLevel);
            if (isNaN(y) || isNaN(n) || isNaN(cl) || y < 0 || n <= 0 || y > n) {
                throw new Error('Please enter valid success count and sample size');
            }
            var result = calculateProportionConfidenceInterval(y, n, cl, { method: method });
            setResults(result);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Calculation error');
        }
    };
    return (_jsxs(Box, { children: [_jsx(Text, { fontSize: "lg", mb: 6, children: "One-Proportion Confidence Interval Calculation" }), _jsxs(Grid, { templateColumns: { base: '1fr', md: 'repeat(2, 1fr)' }, gap: 6, mb: 6, children: [_jsxs(FormControl, { children: [_jsx(FormLabel, { fontSize: "sm", children: "Success Count (y)" }), _jsx(Input, { type: "number", value: successCount, onChange: function (e) { return setSuccessCount(e.target.value); }, min: "0" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { fontSize: "sm", children: "Sample Size (n)" }), _jsx(Input, { type: "number", value: sampleSize, onChange: function (e) { return setSampleSize(e.target.value); }, min: "1" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { fontSize: "sm", children: "Confidence Level" }), _jsxs(Select, { value: confidenceLevel, onChange: function (e) { return setConfidenceLevel(e.target.value); }, children: [_jsx("option", { value: "0.90", children: "90%" }), _jsx("option", { value: "0.95", children: "95%" }), _jsx("option", { value: "0.99", children: "99%" })] })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { fontSize: "sm", children: "Calculation Method" }), _jsxs(Select, { value: method, onChange: function (e) { return setMethod(e.target.value); }, children: [_jsx("option", { value: "wald", children: "Wald Interval" }), _jsx("option", { value: "wilson", children: "Wilson Score Interval" })] })] })] }), _jsx(Button, { onClick: handleCalculate, colorScheme: "blue", width: "100%", mb: 6, children: "Calculate Confidence Interval" }), error && (_jsx(Alert, { status: "error", mt: 4, children: error })), results && (_jsx(Card, { children: _jsxs(CardBody, { children: [_jsxs(Grid, { templateColumns: { base: '1fr', md: 'repeat(2, 1fr)' }, gap: 4, mb: 4, children: [_jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "Sample Proportion (p\u0302)" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: results.proportion !== undefined ? results.proportion.toFixed(4) : 'N/A' })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "Standard Error" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: results.standardError !== undefined ? results.standardError.toFixed(4) : 'N/A' })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "Margin of Error" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: results.marginOfError !== undefined ? results.marginOfError.toFixed(4) : 'N/A' })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "Calculation Method" }), _jsx(Text, { fontSize: "lg", fontWeight: "bold", children: results.method || 'N/A' })] }) })] }), _jsxs(Box, { mt: 4, children: [_jsxs(Text, { fontSize: "sm", color: "gray.600", children: [confidenceLevel === '0.95' ? '95%' : confidenceLevel === '0.90' ? '90%' : '99%', " Confidence Interval:"] }), _jsxs(Text, { fontWeight: "bold", fontSize: "lg", children: ["[", results.lower !== undefined ? results.lower.toFixed(4) : 'N/A', ",", results.upper !== undefined ? results.upper.toFixed(4) : 'N/A', "]"] })] })] }) }))] }));
}
export default ProportionCI;
