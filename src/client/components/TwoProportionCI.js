import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Text, Input, Button, VStack, HStack, Card, CardBody, Table, Tr, Th, Td, Alert, Select, RadioGroup, Radio, Stack } from '@chakra-ui/react';
import { calculateTwoProportionConfidenceInterval } from '../utils/statistics';
function TwoProportionCI() {
    var _a = useState(''), successes1 = _a[0], setSuccesses1 = _a[1];
    var _b = useState(''), trials1 = _b[0], setTrials1 = _b[1];
    var _c = useState(''), successes2 = _c[0], setSuccesses2 = _c[1];
    var _d = useState(''), trials2 = _d[0], setTrials2 = _d[1];
    var _e = useState(0.95), confidenceLevel = _e[0], setConfidenceLevel = _e[1];
    var _f = useState('wald'), method = _f[0], setMethod = _f[1];
    var _g = useState(null), result = _g[0], setResult = _g[1];
    var _h = useState(''), error = _h[0], setError = _h[1];
    var handleCalculate = function () {
        try {
            setError('');
            var s1 = parseInt(successes1, 10);
            var t1 = parseInt(trials1, 10);
            var s2 = parseInt(successes2, 10);
            var t2 = parseInt(trials2, 10);
            var confidence = confidenceLevel;
            // Parameter validation
            if (isNaN(s1) || isNaN(t1) || isNaN(s2) || isNaN(t2)) {
                throw new Error('Please enter valid integers');
            }
            if (t1 <= 0 || t2 <= 0) {
                throw new Error('Number of trials must be greater than 0');
            }
            if (s1 < 0 || s1 > t1 || s2 < 0 || s2 > t2) {
                throw new Error('Number of successes must be between 0 and number of trials');
            }
            var ciResult = calculateTwoProportionConfidenceInterval(s1, t1, s2, t2, confidence, { method: method });
            setResult(ciResult);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Calculation error');
            setResult(null);
        }
    };
    return (_jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "xl", fontWeight: "bold", mb: 6, textAlign: "center", children: "Two-Proportion Difference Confidence Interval" }), error && (_jsx(Alert, { status: "error", mb: 4, children: error })), _jsxs(VStack, { spacing: 4, align: "stretch", children: [_jsxs(Box, { p: 4, borderWidth: 1, borderRadius: "lg", children: [_jsx(Text, { fontWeight: "medium", mb: 4, children: "First Group Sample" }), _jsxs(HStack, { spacing: 4, children: [_jsxs(Box, { flex: 1, children: [_jsx(Text, { fontSize: "sm", mb: 1, children: "Number of Successes" }), _jsx(Input, { value: successes1, onChange: function (e) { return setSuccesses1(e.target.value); }, placeholder: "Example: 45", type: "number", min: "0", size: "lg" })] }), _jsxs(Box, { flex: 1, children: [_jsx(Text, { fontSize: "sm", mb: 1, children: "Total Number of Trials" }), _jsx(Input, { value: trials1, onChange: function (e) { return setTrials1(e.target.value); }, placeholder: "Example: 100", type: "number", min: "1", size: "lg" })] })] })] }), _jsxs(Box, { p: 4, borderWidth: 1, borderRadius: "lg", children: [_jsx(Text, { fontWeight: "medium", mb: 4, children: "Second Group Sample" }), _jsxs(HStack, { spacing: 4, children: [_jsxs(Box, { flex: 1, children: [_jsx(Text, { fontSize: "sm", mb: 1, children: "Number of Successes" }), _jsx(Input, { value: successes2, onChange: function (e) { return setSuccesses2(e.target.value); }, placeholder: "Example: 60", type: "number", min: "0", size: "lg" })] }), _jsxs(Box, { flex: 1, children: [_jsx(Text, { fontSize: "sm", mb: 1, children: "Total Number of Trials" }), _jsx(Input, { value: trials2, onChange: function (e) { return setTrials2(e.target.value); }, placeholder: "Example: 100", type: "number", min: "1", size: "lg" })] })] })] }), _jsxs(HStack, { spacing: 4, children: [_jsxs(Box, { flex: 1, children: [_jsx(Text, { fontWeight: "medium", mb: 2, children: "Confidence Level" }), _jsxs(Select, { value: confidenceLevel.toString(), onChange: function (e) { return setConfidenceLevel(parseFloat(e.target.value)); }, size: "lg", children: [_jsx("option", { value: "0.90", children: "90%" }), _jsx("option", { value: "0.95", children: "95%" }), _jsx("option", { value: "0.99", children: "99%" }), _jsx("option", { value: "0.999", children: "99.9%" })] })] }), _jsxs(Box, { flex: 1, children: [_jsx(Text, { fontWeight: "medium", mb: 2, children: "Calculation Method" }), _jsx(RadioGroup, { value: method, onChange: function (v) { return setMethod(v); }, children: _jsxs(Stack, { direction: "row", children: [_jsx(Radio, { value: "wald", children: "Wald Interval" }), _jsx(Radio, { value: "continuity", children: "Continuity Correction" })] }) })] })] }), _jsx(Button, { onClick: handleCalculate, colorScheme: "blue", size: "lg", children: "Calculate Confidence Interval" })] }), result && (_jsxs(Box, { mt: 6, p: 4, borderWidth: 1, borderRadius: "lg", bg: "gray.50", children: [_jsx(Text, { fontSize: "lg", fontWeight: "bold", mb: 4, children: "Calculation Results" }), _jsx(Table, { variant: "simple", children: _jsxs("tbody", { children: [_jsxs(Tr, { children: [_jsx(Th, { children: "Statistic" }), _jsx(Th, { children: "Value" })] }), _jsxs(Tr, { children: [_jsx(Th, { children: "Calculation Method" }), _jsx(Td, { children: result.method })] }), _jsxs(Tr, { children: [_jsx(Th, { children: "First Group Proportion" }), _jsxs(Td, { children: [(result.proportion1 * 100).toFixed(2), "%"] })] }), _jsxs(Tr, { children: [_jsx(Th, { children: "Second Group Proportion" }), _jsxs(Td, { children: [(result.proportion2 * 100).toFixed(2), "%"] })] }), _jsxs(Tr, { children: [_jsx(Th, { children: "Proportion Difference" }), _jsxs(Td, { children: [(result.proportionDiff * 100).toFixed(2), "%"] })] }), _jsxs(Tr, { children: [_jsx(Th, { children: "Critical Value" }), _jsx(Td, { children: result.criticalValue.toFixed(4) })] }), _jsxs(Tr, { children: [_jsx(Th, { children: "Margin of Error" }), _jsxs(Td, { children: [(result.marginOfError * 100).toFixed(2), "%"] })] }), _jsxs(Tr, { children: [_jsx(Th, { children: "Confidence Interval" }), _jsxs(Td, { children: ["[", (result.lower * 100).toFixed(2), "%, ", (result.upper * 100).toFixed(2), "%]"] })] })] }) }), _jsxs(Box, { mt: 4, p: 3, bg: "blue.50", borderRadius: "lg", children: [_jsx(Text, { fontWeight: "medium", children: "Result Interpretation" }), _jsxs(Text, { mt: 1, fontSize: "sm", children: ["We are ", confidenceLevel * 100, "% confident that the difference between the two population proportions lies between [", (result.lower * 100).toFixed(2), "%, ", (result.upper * 100).toFixed(2), "%].", result.lower > 0 && " This indicates that the proportion in the first population is significantly higher than in the second population.", result.upper < 0 && " This indicates that the proportion in the first population is significantly lower than in the second population.", result.lower <= 0 && result.upper >= 0 && " The two population proportions may not be significantly different."] })] })] }))] }) }));
}
export default TwoProportionCI;
