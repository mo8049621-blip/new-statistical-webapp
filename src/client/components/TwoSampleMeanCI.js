import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Text, Grid, Card, CardBody, Select, FormControl, FormLabel, Input, Button, Alert, ButtonGroup } from '@chakra-ui/react';
import { calculateTwoSampleConfidenceInterval } from '../utils/statistics';
function TwoSampleMeanCI(_a) {
    var _b = _a.dataset1, dataset1 = _b === void 0 ? [] : _b, _c = _a.dataset2, dataset2 = _c === void 0 ? [] : _c;
    // Data input state
    var _d = useState(''), sample1Data = _d[0], setSample1Data = _d[1];
    var _e = useState(''), sample2Data = _e[0], setSample2Data = _e[1];
    useEffect(function () {
        if (dataset1.length > 0) {
            setSample1Data(dataset1.join(', '));
        }
        if (dataset2.length > 0) {
            setSample2Data(dataset2.join(', '));
        }
    }, [dataset1, dataset2]);
    // Parameter input state
    var _f = useState(''), sample1Size = _f[0], setSample1Size = _f[1];
    var _g = useState(''), sample1Mean = _g[0], setSample1Mean = _g[1];
    var _h = useState(''), sample1Std = _h[0], setSample1Std = _h[1];
    var _j = useState(''), sample2Size = _j[0], setSample2Size = _j[1];
    var _k = useState(''), sample2Mean = _k[0], setSample2Mean = _k[1];
    var _l = useState(''), sample2Std = _l[0], setSample2Std = _l[1];
    // Analysis options
    var _m = useState('0.95'), confidenceLevel = _m[0], setConfidenceLevel = _m[1];
    var _o = useState('welch'), method = _o[0], setMethod = _o[1];
    var _p = useState('data'), inputMode = _p[0], setInputMode = _p[1];
    // Result state
    var _q = useState(null), result = _q[0], setResult = _q[1];
    var _r = useState(null), error = _r[0], setError = _r[1];
    // Calculate confidence interval for difference in two sample means
    var calculateTwoSampleCI = function () {
        setError(null);
        try {
            if (inputMode === 'data') {
                // Calculate statistics from raw data
                var data1 = sample1Data
                    .split(/[\s,]+/)
                    .filter(function (val) { return val.trim() !== ''; })
                    .map(function (val) { return parseFloat(val); })
                    .filter(function (val) { return !isNaN(val); });
                var data2 = sample2Data
                    .split(/[\s,]+/)
                    .filter(function (val) { return val.trim() !== ''; })
                    .map(function (val) { return parseFloat(val); })
                    .filter(function (val) { return !isNaN(val); });
                if (data1.length === 0 || data2.length === 0) {
                    throw new Error('Both samples need valid data');
                }
                var confLevel = parseFloat(confidenceLevel);
                // Use our statistical function to calculate confidence interval
                var ciResult = calculateTwoSampleConfidenceInterval(data1, data2, confLevel, { method: method });
                setResult(ciResult);
            }
            else {
                // Handling for statistical input mode can be added later
                throw new Error('Statistical input mode not yet implemented');
            }
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Calculation error');
        }
    };
    return (_jsxs(Box, { children: [_jsx(Text, { fontSize: "lg", mb: 4, children: "Two-Sample Mean Difference Confidence Interval Calculation" }), _jsx(Card, { mb: 6, children: _jsxs(CardBody, { children: [_jsxs(ButtonGroup, { mb: 4, variant: "outline", borderBottomWidth: "1px", borderBottomColor: "gray.200", children: [_jsx(Button, { px: 4, py: 2, variant: inputMode === 'data' ? 'solid' : 'outline', colorScheme: "blue", onClick: function () { return setInputMode('data'); }, children: "Input Raw Data" }), _jsx(Button, { px: 4, py: 2, variant: inputMode === 'stats' ? 'solid' : 'outline', colorScheme: "blue", onClick: function () { return setInputMode('stats'); }, children: "Input Statistics" })] }), inputMode === 'data' && (_jsxs(Grid, { templateColumns: { base: '1fr', md: 'repeat(2, 1fr)' }, gap: 6, children: [_jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Sample 1 Data (separated by spaces or commas)" }), _jsx("textarea", { value: sample1Data, onChange: function (e) { return setSample1Data(e.target.value); }, placeholder: "Example: 1.2 3.4 5.6 7.8 9.0", style: {
                                                width: '100%',
                                                height: '100px',
                                                padding: '8px',
                                                borderRadius: '4px',
                                                border: '1px solid #d1d5db',
                                                resize: 'vertical'
                                            } })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Sample 2 Data (separated by spaces or commas)" }), _jsx("textarea", { value: sample2Data, onChange: function (e) { return setSample2Data(e.target.value); }, placeholder: "Example: 2.1 4.3 6.5 8.7 10.9", style: {
                                                width: '100%',
                                                height: '100px',
                                                padding: '8px',
                                                borderRadius: '4px',
                                                border: '1px solid #d1d5db',
                                                resize: 'vertical'
                                            } })] })] })), inputMode === 'stats' && (_jsxs(Grid, { templateColumns: { base: '1fr', md: 'repeat(2, 1fr)' }, gap: 6, children: [_jsxs(Box, { children: [_jsx(Text, { fontWeight: "medium", mb: 2, children: "Sample 1 Statistics" }), _jsxs(FormControl, { mb: 2, children: [_jsx(FormLabel, { fontSize: "sm", children: "Sample Size (n\u2081)" }), _jsx(Input, { type: "number", value: sample1Size, onChange: function (e) { return setSample1Size(e.target.value); }, min: "1" })] }), _jsxs(FormControl, { mb: 2, children: [_jsx(FormLabel, { fontSize: "sm", children: "Sample Mean (x\u0304\u2081)" }), _jsx(Input, { type: "number", step: "any", value: sample1Mean, onChange: function (e) { return setSample1Mean(e.target.value); } })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { fontSize: "sm", children: "Sample Standard Deviation (s\u2081)" }), _jsx(Input, { type: "number", step: "any", value: sample1Std, onChange: function (e) { return setSample1Std(e.target.value); }, min: "0" })] })] }), _jsxs(Box, { children: [_jsx(Text, { fontWeight: "medium", mb: 2, children: "Sample 2 Statistics" }), _jsxs(FormControl, { mb: 2, children: [_jsx(FormLabel, { fontSize: "sm", children: "Sample Size (n\u2082)" }), _jsx(Input, { type: "number", value: sample2Size, onChange: function (e) { return setSample2Size(e.target.value); }, min: "1" })] }), _jsxs(FormControl, { mb: 2, children: [_jsx(FormLabel, { fontSize: "sm", children: "Sample Mean (x\u0304\u2082)" }), _jsx(Input, { type: "number", step: "any", value: sample2Mean, onChange: function (e) { return setSample2Mean(e.target.value); } })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { fontSize: "sm", children: "Sample Standard Deviation (s\u2082)" }), _jsx(Input, { type: "number", step: "any", value: sample2Std, onChange: function (e) { return setSample2Std(e.target.value); }, min: "0" })] })] })] })), _jsxs(Grid, { templateColumns: { base: '1fr', md: 'repeat(2, 1fr)' }, gap: 4, mt: 6, children: [_jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Confidence Level" }), _jsxs(Select, { value: confidenceLevel, onChange: function (e) { return setConfidenceLevel(e.target.value); }, children: [_jsx("option", { value: "0.90", children: "90%" }), _jsx("option", { value: "0.95", children: "95%" }), _jsx("option", { value: "0.99", children: "99%" })] })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Variance Treatment Method" }), _jsxs(Select, { value: method, onChange: function (e) { return setMethod(e.target.value); }, children: [_jsx("option", { value: "pooled", children: "Assuming Equal Variances (Pooled)" }), _jsx("option", { value: "welch", children: "Not Assuming Equal Variances (Welch)" })] })] })] }), _jsx(Button, { onClick: calculateTwoSampleCI, mt: 6, colorScheme: "blue", width: "100%", children: "Calculate Confidence Interval" })] }) }), error && (_jsx(Alert, { status: "error", mt: 4, children: error })), result && (_jsxs(Box, { mt: 6, children: [_jsx(Text, { fontSize: "lg", fontWeight: "bold", mb: 4, children: "Calculation Results" }), _jsxs(Grid, { templateColumns: { base: '1fr', md: 'repeat(2, 1fr)' }, gap: 4, children: [_jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "Mean Difference" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: result.meanDiff.toFixed(4) })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "CI Lower Bound" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: result.lower.toFixed(4) })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "CI Upper Bound" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: result.upper.toFixed(4) })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "Margin of Error" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: result.marginOfError.toFixed(4) })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "Calculation Method" }), _jsx(Text, { fontSize: "lg", fontWeight: "bold", children: result.method })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "Critical Value" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: result.criticalValue.toFixed(4) })] }) })] })] }))] }));
}
export default TwoSampleMeanCI;
