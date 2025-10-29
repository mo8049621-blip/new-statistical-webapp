import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Text, Button, VStack, HStack, Card, CardBody, Table, Tr, Th, Td, Alert, Select, Textarea } from '@chakra-ui/react';
import { calculateTwoSampleConfidenceInterval } from '../utils/statistics';
function PairedMeanCI(_a) {
    var _b = _a.pairedData, pairedData = _b === void 0 ? { before: [], after: [] } : _b;
    var _c = useState(''), beforeData = _c[0], setBeforeData = _c[1];
    var _d = useState(''), afterData = _d[0], setAfterData = _d[1];
    var _e = useState('0.95'), confidenceLevel = _e[0], setConfidenceLevel = _e[1];
    var _f = useState(null), result = _f[0], setResult = _f[1];
    var _g = useState(''), error = _g[0], setError = _g[1];
    useEffect(function () {
        if (pairedData && pairedData.before && pairedData.after && pairedData.before.length > 0 && pairedData.after.length > 0) {
            setBeforeData(pairedData.before.join(', '));
            setAfterData(pairedData.after.join(', '));
        }
    }, [pairedData]);
    var parseData = function (dataStr) {
        return dataStr
            .split(/[,\s]+/)
            .filter(function (s) { return s.trim() !== ''; })
            .map(function (s) {
            var num = parseFloat(s);
            if (isNaN(num))
                throw new Error('Invalid data format, please enter numbers');
            return num;
        });
    };
    var handleCalculate = function () {
        try {
            setError('');
            var before = parseData(beforeData);
            var after = parseData(afterData);
            var confidence = parseFloat(confidenceLevel);
            if (before.length === 0 || after.length === 0) {
                throw new Error('Data cannot be empty');
            }
            if (before.length !== after.length) {
                throw new Error('Before and after datasets must have the same length');
            }
            var ciResult = calculateTwoSampleConfidenceInterval(before, after, confidence, { method: 'paired' });
            setResult(ciResult);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Calculation error');
            setResult(null);
        }
    };
    var differences = result ? beforeData.split(/[,\s]+/).map(function (_, i) {
        var before = parseFloat(beforeData.split(/[,\s]+/)[i]);
        var after = parseFloat(afterData.split(/[,\s]+/)[i]);
        return before - after;
    }).filter(function (n) { return !isNaN(n); }) : [];
    return (_jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "xl", fontWeight: "bold", mb: 6, textAlign: "center", children: "Paired Samples Mean Difference Confidence Interval" }), error && (_jsx(Alert, { status: "error", mb: 4, children: error })), _jsxs(VStack, { spacing: 4, align: "stretch", children: [_jsxs(Box, { children: [_jsx(Text, { fontWeight: "medium", mb: 2, children: "Pre-test Data (comma or space separated)" }), _jsx(Textarea, { value: beforeData, onChange: function (e) { return setBeforeData(e.target.value); }, placeholder: "Example: 10.2, 11.5, 9.8, 12.1", size: "lg", rows: 3 })] }), _jsxs(Box, { children: [_jsx(Text, { fontWeight: "medium", mb: 2, children: "Post-test Data (comma or space separated)" }), _jsx(Textarea, { value: afterData, onChange: function (e) { return setAfterData(e.target.value); }, placeholder: "Example: 12.5, 13.2, 11.8, 14.2", size: "lg", rows: 3 })] }), _jsxs(HStack, { children: [_jsxs(Box, { flex: 1, children: [_jsx(Text, { fontWeight: "medium", mb: 2, children: "Confidence Level" }), _jsxs(Select, { value: confidenceLevel, onChange: function (e) { return setConfidenceLevel(e.target.value); }, size: "lg", children: [_jsx("option", { value: "0.90", children: "90%" }), _jsx("option", { value: "0.95", children: "95%" }), _jsx("option", { value: "0.99", children: "99%" }), _jsx("option", { value: "0.999", children: "99.9%" })] })] }), _jsx(Button, { onClick: handleCalculate, colorScheme: "blue", size: "lg", children: "Calculate Confidence Interval" })] })] }), result && (_jsxs(Box, { mt: 6, p: 4, borderWidth: 1, borderRadius: "lg", bg: "gray.50", children: [_jsx(Text, { fontSize: "lg", fontWeight: "bold", mb: 4, children: "Calculation Results" }), _jsx(Table, { variant: "simple", mb: 4, children: _jsxs("tbody", { children: [_jsxs(Tr, { children: [_jsx(Th, { children: "Statistic" }), _jsx(Td, { children: result.method })] }), _jsxs(Tr, { children: [_jsx(Th, { children: "Mean Difference" }), _jsx(Td, { children: result.meanDiff.toFixed(4) })] }), _jsxs(Tr, { children: [_jsx(Th, { children: "Critical Value" }), _jsx(Td, { children: result.criticalValue.toFixed(4) })] }), _jsxs(Tr, { children: [_jsx(Th, { children: "Margin of Error" }), _jsx(Td, { children: result.marginOfError.toFixed(4) })] }), _jsxs(Tr, { children: [_jsx(Th, { children: "Confidence Interval" }), _jsxs(Td, { children: ["[", result.lower.toFixed(4), ", ", result.upper.toFixed(4), "]"] })] })] }) }), differences.length > 0 && (_jsxs(Box, { mt: 4, children: [_jsx(Text, { fontWeight: "medium", mb: 2, children: "Difference Data Statistics" }), _jsxs(Table, { variant: "simple", children: [_jsx("thead", { children: _jsxs(Tr, { children: [_jsx(Th, { children: "Index" }), _jsx(Th, { children: "Pre-test Value" }), _jsx(Th, { children: "Post-test Value" }), _jsx(Th, { children: "Difference" })] }) }), _jsxs("tbody", { children: [differences.slice(0, 10).map(function (diff, i) { return (_jsxs(Tr, { children: [_jsx(Td, { children: i + 1 }), _jsx(Td, { children: parseFloat(beforeData.split(/[,\s]+/)[i]).toFixed(2) }), _jsx(Td, { children: parseFloat(afterData.split(/[,\s]+/)[i]).toFixed(2) }), _jsx(Td, { children: diff.toFixed(2) })] }, i)); }), differences.length > 10 && (_jsx(Tr, { children: _jsx(Td, { colSpan: 4, textAlign: "center", children: "..." }) }))] })] })] }))] }))] }) }));
}
export default PairedMeanCI;
