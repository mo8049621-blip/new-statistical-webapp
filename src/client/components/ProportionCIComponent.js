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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Text, Tabs, Tab, FormControl, FormLabel, Input, Select, Button, Card, CardBody, Grid, Alert, AlertIcon, AlertDescription } from '@chakra-ui/react';
import { calculateProportionConfidenceInterval, calculateTwoProportionConfidenceInterval } from '../utils/statistics';
var ProportionCIComponent = function () {
    // One proportion parameters
    var _a = useState('185'), singleSuccessCount = _a[0], setSingleSuccessCount = _a[1];
    var _b = useState('351'), singleSampleSize = _b[0], setSingleSampleSize = _b[1];
    var _c = useState('0.95'), singleConfidenceLevel = _c[0], setSingleConfidenceLevel = _c[1];
    var _d = useState('wald'), singleMethod = _d[0], setSingleMethod = _d[1];
    // Two proportion parameters
    var _e = useState('45'), successCount1 = _e[0], setSuccessCount1 = _e[1];
    var _f = useState('100'), sampleSize1 = _f[0], setSampleSize1 = _f[1];
    var _g = useState('30'), successCount2 = _g[0], setSuccessCount2 = _g[1];
    var _h = useState('100'), sampleSize2 = _h[0], setSampleSize2 = _h[1];
    var _j = useState('0.95'), twoConfidenceLevel = _j[0], setTwoConfidenceLevel = _j[1];
    var _k = useState('wald'), twoMethod = _k[0], setTwoMethod = _k[1];
    var _l = useState(null), singleResults = _l[0], setSingleResults = _l[1];
    var _m = useState(null), twoResults = _m[0], setTwoResults = _m[1];
    var _o = useState('single'), activeTab = _o[0], setActiveTab = _o[1];
    var _p = useState(null), singleError = _p[0], setSingleError = _p[1];
    var _q = useState(null), twoError = _q[0], setTwoError = _q[1];
    var _r = useState(false), isSingleCalculated = _r[0], setIsSingleCalculated = _r[1];
    var _s = useState(false), isTwoCalculated = _s[0], setIsTwoCalculated = _s[1];
    // Set Example Data
    var setExampleData = function () {
        setSuccessCount1('45');
        setSampleSize1('100');
        setSuccessCount2('30');
        setSampleSize2('100');
        setTwoConfidenceLevel('0.95');
        setTwoMethod('wald');
        setTwoError('');
        setTwoResults(null);
        setIsTwoCalculated(false);
    };
    // Generate Random Data
    var generateRandomData = function () {
        var n1 = Math.floor(Math.random() * 50) + 50; // Sample size between 50-100
        var n2 = Math.floor(Math.random() * 50) + 50;
        var p1 = Math.random() * 0.8 + 0.1; // Probability between 0.1-0.9
        var p2 = Math.random() * 0.8 + 0.1;
        var y1 = Math.floor(n1 * p1);
        var y2 = Math.floor(n2 * p2);
        setSuccessCount1(y1.toString());
        setSampleSize1(n1.toString());
        setSuccessCount2(y2.toString());
        setSampleSize2(n2.toString());
        setTwoError('');
        setTwoResults(null);
        setIsTwoCalculated(false);
    };
    var handleSingleProportionCalculate = function () {
        // Reset state
        setSingleError(null);
        setSingleResults(null);
        setIsSingleCalculated(true);
        try {
            var successCount = parseInt(singleSuccessCount, 10);
            var n = parseInt(singleSampleSize, 10);
            var confidenceLevel = parseFloat(singleConfidenceLevel);
            // Input validation
            if (!singleSuccessCount || !singleSampleSize || !singleConfidenceLevel) {
                throw new Error('Please fill in all required fields');
            }
            if (isNaN(successCount) || isNaN(n) || isNaN(confidenceLevel)) {
                throw new Error('Please enter valid numbers');
            }
            if (n <= 0) {
                throw new Error('Sample size must be greater than 0');
            }
            if (successCount < 0 || successCount > n) {
                throw new Error('Number of successes must be between 0 and sample size');
            }
            if (confidenceLevel <= 0 || confidenceLevel >= 1) {
                throw new Error('Confidence level must be between 0 and 1');
            }
            // Call statistical function and get results
            var results = calculateProportionConfidenceInterval(successCount, n, confidenceLevel, { method: singleMethod });
            // Convert result format to match component expected property names
            // Calculate standard error
            var standardError = Math.sqrt((results.proportion * (1 - results.proportion)) / n);
            var formattedResults = __assign(__assign({}, results), { sampleProportion: results.proportion, lowerBound: results.lower, upperBound: results.upper, confidenceLevel: confidenceLevel, standardError: standardError });
            setSingleResults(formattedResults);
        }
        catch (error) {
            setSingleError(error.message);
        }
    };
    var handleTwoProportionCalculate = function () {
        // Reset state
        setTwoError('');
        setTwoResults(null);
        setIsTwoCalculated(true);
        try {
            var y1 = parseInt(successCount1, 10);
            var n1 = parseInt(sampleSize1, 10);
            var y2 = parseInt(successCount2, 10);
            var n2 = parseInt(sampleSize2, 10);
            var confidenceLevel = parseFloat(twoConfidenceLevel);
            // Input validation
            if (!successCount1 || !sampleSize1 || !successCount2 || !sampleSize2 || !twoConfidenceLevel) {
                throw new Error('Please fill in all required fields');
            }
            if (isNaN(y1) || isNaN(n1) || isNaN(y2) || isNaN(n2) || isNaN(confidenceLevel)) {
                throw new Error('Please enter valid numbers');
            }
            if (n1 <= 0 || n2 <= 0) {
                throw new Error('Sample size must be greater than 0');
            }
            if (y1 < 0 || y1 > n1 || y2 < 0 || y2 > n2) {
                throw new Error('Number of successes must be between 0 and corresponding sample size');
            }
            if (confidenceLevel <= 0 || confidenceLevel >= 1) {
                throw new Error('Confidence level must be between 0 and 1');
            }
            // Calculate sample proportions
            var p1 = y1 / n1;
            var p2 = y2 / n2;
            // Call statistical function and get results, ensure options object is correctly passed
            var results = calculateTwoProportionConfidenceInterval(y1, n1, y2, n2, confidenceLevel, { method: twoMethod });
            // Ensure results exist
            if (!results) {
                throw new Error('Calculation result is empty');
            }
            // Convert result format to match component expected property names
            var formattedResults = {
                sampleProportion1: p1,
                sampleProportion2: p2,
                proportionDifference: p1 - p2,
                lowerBound: results.lower !== undefined ? results.lower : null,
                upperBound: results.upper !== undefined ? results.upper : null,
                confidenceLevel: confidenceLevel,
                // Directly use properties from results without recalculation
                criticalValue: results.criticalValue || null,
                standardError: Math.sqrt((p1 * (1 - p1)) / n1 + (p2 * (1 - p2)) / n2),
                marginOfError: results.marginOfError || null
            };
            // Ensure results are set
            setTwoResults(formattedResults);
        }
        catch (error) {
            setTwoError(error.message);
            setTwoResults(null);
        }
    };
    return (_jsxs(Box, { p: 6, bg: "white", rounded: "lg", shadow: "md", children: [_jsx(Text, { fontSize: "xl", fontWeight: "bold", mb: 6, textAlign: "center", children: "Proportion Confidence Interval Calculation" }), _jsx(Tabs, { index: activeTab === 'single' ? 0 : 1, onChange: function (index) { return setActiveTab(index === 0 ? 'single' : 'two'); }, mb: 6, children: _jsxs(Box, { borderBottomWidth: "1px", borderBottomColor: "gray.200", children: [_jsx(Tab, { px: 4, py: 2, children: "Single Proportion CI" }), _jsx(Tab, { px: 4, py: 2, children: "Two Proportion Difference CI" })] }) }), activeTab === 'single' && (_jsxs(Box, { children: [_jsxs(Grid, { templateColumns: { base: '1fr', md: 'repeat(2, 1fr)' }, gap: 6, mb: 6, children: [_jsxs(FormControl, { children: [_jsx(FormLabel, { fontSize: "sm", children: "Success Count (y)" }), _jsx(Input, { type: "number", value: singleSuccessCount, onChange: function (e) { return setSingleSuccessCount(e.target.value); }, min: "0" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { fontSize: "sm", children: "Sample Size (n)" }), _jsx(Input, { type: "number", value: singleSampleSize, onChange: function (e) { return setSingleSampleSize(e.target.value); }, min: "1" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { fontSize: "sm", children: "Confidence Level" }), _jsxs(Select, { value: singleConfidenceLevel, onChange: function (e) { return setSingleConfidenceLevel(e.target.value); }, children: [_jsx("option", { value: "0.90", children: "90%" }), _jsx("option", { value: "0.95", children: "95%" }), _jsx("option", { value: "0.99", children: "99%" }), _jsx("option", { value: "", children: "Custom" })] }), singleConfidenceLevel && !['0.90', '0.95', '0.99'].includes(singleConfidenceLevel) && (_jsx(Input, { type: "number", step: "0.01", value: singleConfidenceLevel, onChange: function (e) { return setSingleConfidenceLevel(e.target.value); }, min: "0.01", max: "0.99", mt: 2 }))] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { fontSize: "sm", children: "Calculation Method" }), _jsxs(Select, { value: singleMethod, onChange: function (e) { return setSingleMethod(e.target.value); }, children: [_jsx("option", { value: "wald", children: "Wald Interval" }), _jsx("option", { value: "wilson", children: "Wilson Score Interval" })] })] })] }), _jsx(Box, { mt: 6, children: _jsx(Button, { onClick: handleSingleProportionCalculate, colorScheme: "blue", size: "lg", width: "100%", children: "Calculate Single Proportion CI" }) }), singleError && (_jsxs(Alert, { status: "error", mt: 4, children: [_jsx(AlertIcon, {}), _jsx(AlertDescription, { children: singleError })] })), isSingleCalculated && !singleError && !singleResults && (_jsxs(Alert, { status: "warning", mt: 4, children: [_jsx(AlertIcon, {}), _jsx(AlertDescription, { children: "Unable to calculate results, please check if input values are valid" })] })), singleResults && (_jsx(Card, { mt: 6, children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "lg", fontWeight: "semibold", mb: 4, children: "Calculation Results" }), _jsxs(Grid, { templateColumns: { base: '1fr', md: 'repeat(2, 1fr)' }, gap: 4, children: [_jsxs(Box, { children: [_jsx(Text, { fontSize: "sm", color: "gray.600", children: "Sample Proportion (\u0302p):" }), _jsx(Text, { fontWeight: "medium", children: singleResults.sampleProportion ? singleResults.sampleProportion.toFixed(4) : 'Cannot calculate' })] }), _jsxs(Box, { children: [_jsx(Text, { fontSize: "sm", color: "gray.600", children: "Critical Value (z*):" }), _jsx(Text, { fontWeight: "medium", children: singleResults.criticalValue ? singleResults.criticalValue.toFixed(4) : 'Cannot calculate' })] }), _jsxs(Box, { children: [_jsx(Text, { fontSize: "sm", color: "gray.600", children: "Standard Error:" }), _jsx(Text, { fontWeight: "medium", children: singleResults.standardError ? singleResults.standardError.toFixed(6) : 'Cannot calculate' })] }), _jsxs(Box, { children: [_jsx(Text, { fontSize: "sm", color: "gray.600", children: "Margin of Error:" }), _jsx(Text, { fontWeight: "medium", children: singleResults.marginOfError ? singleResults.marginOfError.toFixed(4) : 'Cannot calculate' })] })] }), _jsxs(Box, { mt: 4, children: [_jsxs(Text, { fontSize: "sm", color: "gray.600", children: [singleResults.confidenceLevel ? singleResults.confidenceLevel * 100 : '--', "% Confidence Interval:"] }), _jsx(Text, { fontWeight: "bold", fontSize: "lg", children: singleResults.lowerBound !== undefined && singleResults.upperBound !== undefined
                                                ? "[".concat(singleResults.lowerBound.toFixed(4), ", ").concat(singleResults.upperBound.toFixed(4), "]")
                                                : 'Cannot calculate' })] })] }) }))] })), activeTab === 'two' && (_jsxs(Box, { children: [_jsxs(Grid, { templateColumns: { base: '1fr', md: 'repeat(2, 1fr)' }, gap: 6, mb: 6, children: [_jsxs(Box, { children: [_jsx(Text, { fontSize: "sm", fontWeight: "medium", color: "gray.700", mb: 3, children: "Population 1" }), _jsxs(Grid, { gap: 4, children: [_jsxs(FormControl, { children: [_jsx(FormLabel, { fontSize: "xs", color: "gray.500", children: "Success Count (y\u2081)" }), _jsx(Input, { type: "number", value: successCount1, onChange: function (e) { return setSuccessCount1(e.target.value); }, min: "0" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { fontSize: "xs", color: "gray.500", children: "Sample Size (n\u2081)" }), _jsx(Input, { type: "number", value: sampleSize1, onChange: function (e) { return setSampleSize1(e.target.value); }, min: "1" })] })] })] }), _jsxs(Box, { children: [_jsx(Text, { fontSize: "sm", fontWeight: "medium", color: "gray.700", mb: 3, children: "Population 2" }), _jsxs(Grid, { gap: 4, children: [_jsxs(FormControl, { children: [_jsx(FormLabel, { fontSize: "xs", color: "gray.500", children: "Success Count (y\u2082)" }), _jsx(Input, { type: "number", value: successCount2, onChange: function (e) { return setSuccessCount2(e.target.value); }, min: "0" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { fontSize: "xs", color: "gray.500", children: "Sample Size (n\u2082)" }), _jsx(Input, { type: "number", value: sampleSize2, onChange: function (e) { return setSampleSize2(e.target.value); }, min: "1" })] })] })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { fontSize: "sm", children: "Confidence Level" }), _jsxs(Select, { value: twoConfidenceLevel, onChange: function (e) { return setTwoConfidenceLevel(e.target.value); }, children: [_jsx("option", { value: "0.90", children: "90%" }), _jsx("option", { value: "0.95", children: "95%" }), _jsx("option", { value: "0.99", children: "99%" }), _jsx("option", { value: "", children: "Custom" })] }), twoConfidenceLevel && !['0.90', '0.95', '0.99'].includes(twoConfidenceLevel) && (_jsx(Input, { type: "number", step: "0.01", value: twoConfidenceLevel, onChange: function (e) { return setTwoConfidenceLevel(e.target.value); }, min: "0.01", max: "0.99", mt: 2 }))] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { fontSize: "sm", children: "Calculation Method" }), _jsxs(Select, { value: twoMethod, onChange: function (e) { return setTwoMethod(e.target.value); }, children: [_jsx("option", { value: "wald", children: "Wald Interval" }), _jsx("option", { value: "continuity", children: "Continuity Correction" })] })] })] }), _jsxs(Grid, { templateColumns: { base: '1fr', md: 'repeat(3, 1fr)' }, gap: 4, mt: 6, children: [_jsx(Button, { onClick: setExampleData, colorScheme: "green", size: "lg", width: "100%", children: "Example Data" }), _jsx(Button, { onClick: generateRandomData, colorScheme: "purple", size: "lg", width: "100%", children: "Random Data" }), _jsx(Button, { onClick: handleTwoProportionCalculate, colorScheme: "blue", size: "lg", width: "100%", children: "Calculate" })] }), twoError && (_jsxs(Alert, { status: "error", mt: 4, children: [_jsx(AlertIcon, {}), _jsx(AlertDescription, { children: twoError })] })), isTwoCalculated && !twoError && !twoResults && (_jsxs(Alert, { status: "warning", mt: 4, children: [_jsx(AlertIcon, {}), _jsx(AlertDescription, { children: "Unable to calculate results, please check if input values are valid" })] })), twoResults && (_jsx(Card, { mt: 6, children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "lg", fontWeight: "semibold", mb: 4, children: "Calculation Results" }), _jsxs(Grid, { templateColumns: { base: '1fr', md: 'repeat(2, 1fr)' }, gap: 4, children: [_jsxs(Box, { children: [_jsx(Text, { fontSize: "sm", color: "gray.600", children: "Sample Proportion 1 (\u0302p\u2081):" }), _jsx(Text, { fontWeight: "medium", children: twoResults.sampleProportion1 ? twoResults.sampleProportion1.toFixed(4) : 'Cannot calculate' })] }), _jsxs(Box, { children: [_jsx(Text, { fontSize: "sm", color: "gray.600", children: "Sample Proportion 2 (\u0302p\u2082):" }), _jsx(Text, { fontWeight: "medium", children: twoResults.sampleProportion2 ? twoResults.sampleProportion2.toFixed(4) : 'Cannot calculate' })] }), _jsxs(Box, { children: [_jsx(Text, { fontSize: "sm", color: "gray.600", children: "Proportion Difference (\u0302p\u2081 - \u0302p\u2082):" }), _jsx(Text, { fontWeight: "medium", children: twoResults.proportionDifference ? twoResults.proportionDifference.toFixed(4) : 'Cannot calculate' })] }), _jsxs(Box, { children: [_jsx(Text, { fontSize: "sm", color: "gray.600", children: "Critical Value (z*):" }), _jsx(Text, { fontWeight: "medium", children: twoResults.criticalValue ? twoResults.criticalValue.toFixed(4) : 'Cannot calculate' })] }), _jsxs(Box, { children: [_jsx(Text, { fontSize: "sm", color: "gray.600", children: "Standard Error:" }), _jsx(Text, { fontWeight: "medium", children: twoResults.standardError ? twoResults.standardError.toFixed(6) : 'Cannot calculate' })] }), _jsxs(Box, { children: [_jsx(Text, { fontSize: "sm", color: "gray.600", children: "Margin of Error:" }), _jsx(Text, { fontWeight: "medium", children: twoResults.marginOfError ? twoResults.marginOfError.toFixed(4) : 'Cannot calculate' })] })] }), _jsxs(Box, { mt: 4, children: [_jsxs(Text, { fontSize: "sm", color: "gray.600", children: [twoResults.confidenceLevel ? twoResults.confidenceLevel * 100 : '--', "% Confidence Interval:"] }), _jsx(Text, { fontWeight: "bold", fontSize: "lg", children: twoResults.lowerBound !== undefined && twoResults.upperBound !== undefined
                                                ? "[".concat(twoResults.lowerBound.toFixed(4), ", ").concat(twoResults.upperBound.toFixed(4), "]")
                                                : 'Cannot calculate' })] })] }) }))] }))] }));
};
export default ProportionCIComponent;
