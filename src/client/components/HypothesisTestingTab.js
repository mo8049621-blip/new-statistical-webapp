import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Text, Grid, Select, FormControl, FormLabel, Input, Button, Card, CardBody, Alert, AlertIcon, Stack } from '@chakra-ui/react';
import { performZTest, performTTest } from '../utils/statistics';
var HypothesisTestingTab = function (_a) {
    var dataset = _a.dataset, _dataset2 = _a.dataset2, _pairedData = _a.pairedData, _isGeneratedDataset = _a.isGeneratedDataset, _distributionInfo = _a.distributionInfo, _basicStats = _a.basicStats;
    // Test parameter state
    var _b = useState(0), mu0 = _b[0], setMu0 = _b[1];
    var _c = useState('0.05'), alpha = _c[0], setAlpha = _c[1];
    var _d = useState('two'), testType = _d[0], setTestType = _d[1];
    var _e = useState('unknown'), varianceType = _e[0], setVarianceType = _e[1];
    var _f = useState(1), sigma = _f[0], setSigma = _f[1];
    var _g = useState(null), testResult = _g[0], setTestResult = _g[1];
    var _h = useState(null), error = _h[0], setError = _h[1];
    // Perform hypothesis test
    var handleTest = function () {
        try {
            setError(null);
            // Validate input parameters
            var alphaNum = parseFloat(alpha);
            if (isNaN(alphaNum) || alphaNum <= 0 || alphaNum >= 1) {
                throw new Error('Significance level must be between 0 and 1');
            }
            if (varianceType === 'known' && (!sigma || sigma <= 0)) {
                throw new Error('When variance is known, a valid population standard deviation must be provided');
            }
            // Statistic calculation is now done inside performZTest and performTTest functions
            var result = void 0;
            if (varianceType === 'known') {
                // Execute Z test
                result = performZTest(dataset, mu0, sigma, alphaNum);
            }
            else {
                // Execute t test
                result = performTTest(dataset, mu0, alphaNum);
            }
            setTestResult(result);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during hypothesis testing');
            setTestResult(null);
        }
    };
    // Format infinity values
    var formatInfinity = function (value) {
        if (value === Infinity)
            return '∞';
        if (value === -Infinity)
            return '-∞';
        return value.toFixed(4);
    };
    return (_jsxs(Box, { children: [_jsx(Text, { fontSize: "xl", fontWeight: "bold", mb: 4, children: "One-Sample Mean Hypothesis Testing" }), _jsx(Card, { mb: 6, children: _jsxs(CardBody, { children: [_jsxs(Grid, { templateColumns: { base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 4, children: [_jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Null Hypothesis Mean (\u03BC\u2080)" }), _jsx(Input, { type: "number", value: mu0, onChange: function (e) { return setMu0(parseFloat(e.target.value) || 0); }, placeholder: "Enter null hypothesis mean" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Significance Level (\u03B1)" }), _jsxs(Select, { value: alpha, onChange: function (e) { return setAlpha(e.target.value); }, children: [_jsx("option", { value: "0.01", children: "0.01 (99% confidence level)" }), _jsx("option", { value: "0.05", children: "0.05 (95% confidence level)" }), _jsx("option", { value: "0.10", children: "0.10 (90% confidence level)" })] })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Test Type" }), _jsxs(Select, { value: testType, onChange: function (e) { return setTestType(e.target.value); }, children: [_jsx("option", { value: "two", children: "Two-tailed Test (\u03BC \u2260 \u03BC\u2080)" }), _jsx("option", { value: "left", children: "Left-tailed Test (\u03BC < \u03BC\u2080)" }), _jsx("option", { value: "right", children: "Right-tailed Test (\u03BC > \u03BC\u2080)" })] })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Variance Type" }), _jsxs(Select, { value: varianceType, onChange: function (e) { return setVarianceType(e.target.value); }, children: [_jsx("option", { value: "known", children: "Known Variance" }), _jsx("option", { value: "unknown", children: "Unknown Variance" })] })] }), varianceType === 'known' && (_jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Population Standard Deviation (\u03C3)" }), _jsx(Input, { type: "number", min: "0", step: "any", value: sigma, onChange: function (e) { return setSigma(parseFloat(e.target.value) || 0); }, placeholder: "Enter population standard deviation" })] }))] }), _jsx(Button, { onClick: handleTest, mt: 4, colorScheme: "blue", size: "lg", children: "Perform Hypothesis Test" })] }) }), error && (_jsxs(Alert, { status: "error", mb: 6, children: [_jsx(AlertIcon, {}), _jsx(Text, { children: error })] })), testResult && (_jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "lg", fontWeight: "bold", mb: 4, children: "Test Results" }), _jsxs(Stack, { spacing: 3, children: [_jsxs(Box, { children: [_jsx(Text, { fontWeight: "bold", children: "Test Method:" }), _jsx(Text, { children: testResult.method })] }), _jsxs(Box, { children: [_jsx(Text, { fontWeight: "bold", children: "Hypotheses:" }), _jsxs(Text, { children: ["H\u2080: \u03BC = ", mu0] }), _jsxs(Text, { children: ["H\u2081: ", testType === 'two' ? 'μ ≠ ' : testType === 'left' ? 'μ < ' : 'μ > ', mu0] })] }), _jsxs(Box, { children: [_jsx(Text, { fontWeight: "bold", children: "Sample Statistics:" }), _jsxs(Text, { children: ["Sample Mean = ", testResult.mean.toFixed(4)] }), testResult.testType === 't-test' && (_jsxs(Text, { children: ["Sample Standard Deviation = ", testResult.std.toFixed(4)] })), _jsxs(Text, { children: ["Sample Size = ", dataset.length] }), testResult.testType === 't-test' && (_jsxs(Text, { children: ["Degrees of Freedom = ", testResult.df] }))] }), _jsxs(Box, { children: [_jsx(Text, { fontWeight: "bold", children: "Test Statistic:" }), _jsxs(Text, { children: [testResult.testType === 'Z-test' ? 'Z Statistic' : 't Statistic', " = ", testResult.testType === 'Z-test' ? testResult.zValue.toFixed(4) : testResult.tValue.toFixed(4)] })] }), _jsxs(Box, { children: [_jsx(Text, { fontWeight: "bold", children: "Critical Value:" }), _jsxs(Text, { children: [testResult.testType === 'Z-test' ? 'Z' : 't', testType === 'two' ? 'α/2' : 'α', " = ", testResult.criticalValue.toFixed(4)] })] }), _jsxs(Box, { children: [_jsx(Text, { fontWeight: "bold", children: "p-value:" }), _jsx(Text, { children: testResult.pValue.toFixed(6) })] }), _jsxs(Box, { children: [_jsx(Text, { fontWeight: "bold", children: "Confidence Interval:" }), testResult.confidenceInterval && (_jsxs(Text, { children: ["[", formatInfinity(testResult.confidenceInterval.lower), ", ", formatInfinity(testResult.confidenceInterval.upper), "]"] }))] }), _jsxs(Box, { children: [_jsx(Text, { fontWeight: "bold", children: "Conclusion:" }), _jsx(Text, { color: testResult.rejected ? "red.600" : "green.600", children: testResult.rejected
                                                ? "At significance level \u03B1 = ".concat(alpha, ", reject the null hypothesis H\u2080")
                                                : "At significance level \u03B1 = ".concat(alpha, ", fail to reject the null hypothesis H\u2080") })] }), _jsxs(Box, { children: [_jsx(Text, { fontWeight: "bold", children: "Decision Criteria:" }), _jsxs(Text, { children: ["p-value Method: ", testResult.pValue <= parseFloat(alpha) ? 'p-value ≤ α, reject H₀' : 'p-value > α, fail to reject H₀'] }), _jsxs(Text, { children: ["Critical Value Method: ", testResult.rejected ? 'Test statistic falls in rejection region, reject H₀' : 'Test statistic does not fall in rejection region, fail to reject H₀'] }), testResult.confidenceInterval && (_jsxs(Text, { children: ["Confidence Interval Method: ", testResult.rejected ? "\u03BC\u2080 = ".concat(mu0, " is not in the confidence interval, reject H\u2080") : "\u03BC\u2080 = ".concat(mu0, " is in the confidence interval, fail to reject H\u2080")] }))] })] })] }) }))] }));
};
export default HypothesisTestingTab;
