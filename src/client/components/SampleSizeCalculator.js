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
import { useState, useEffect } from 'react';
import { calculateSampleSizeForMean, calculateSampleSizeForProportion } from '../utils/statistics';
import { Card, CardBody, Text, FormControl, Radio, RadioGroup, Input, Button, Box, Alert, Divider, Grid, GridItem, Switch, FormLabel, FormHelperText } from '@chakra-ui/react';
var SampleSizeCalculator = function (_a) {
    var dataset = _a.dataset, basicStats = _a.basicStats;
    // Calculation Type: Mean or Proportion
    var _b = useState('mean'), calculationType = _b[0], setCalculationType = _b[1];
    // Confidence Level
    var _c = useState(0.95), confidenceLevel = _c[0], setConfidenceLevel = _c[1];
    // Margin of Error (half-width of confidence interval)
    var _d = useState(''), marginOfError = _d[0], setMarginOfError = _d[1];
    // Parameters for Mean Calculation
    var _e = useState({
        populationStd: '',
        estimatedStd: '',
        useTDistribution: false
    }), meanParams = _e[0], setMeanParams = _e[1];
    // Parameters for Proportion Calculation
    var _f = useState({
        estimatedProportion: '',
        useConservativeEstimate: true
    }), proportionParams = _f[0], setProportionParams = _f[1];
    // Calculation Result
    var _g = useState(null), result = _g[0], setResult = _g[1];
    // Error Message
    var _h = useState(null), error = _h[0], setError = _h[1];
    // Auto-populate standard deviation (if dataset or basic statistics are available)
    useEffect(function () {
        // Prefer using passed basic statistics
        if (basicStats && basicStats.std !== undefined) {
            setMeanParams(function (prev) { return (__assign(__assign({}, prev), { estimatedStd: basicStats.std.toString() })); });
        }
        // Otherwise calculate using dataset
        else if (dataset && dataset.length > 0) {
            // Simple implementation for calculating standard deviation
            var mean_1 = dataset.reduce(function (sum, val) { return sum + val; }, 0) / dataset.length;
            var std_1 = Math.sqrt(dataset.reduce(function (sum, val) { return sum + Math.pow(val - mean_1, 2); }, 0) / (dataset.length - 1));
            setMeanParams(function (prev) { return (__assign(__assign({}, prev), { estimatedStd: std_1.toString() })); });
        }
    }, [dataset, basicStats]);
    // Handle calculation
    var handleCalculate = function () {
        try {
            setError(null);
            setResult(null);
            // Validate margin of error
            var margin = parseFloat(marginOfError);
            if (isNaN(margin) || margin <= 0) {
                throw new Error('Please enter a valid margin of error (must be greater than 0)');
            }
            var sampleSize = void 0;
            if (calculationType === 'mean') {
                // Mean sample size calculation
                var populationStd = meanParams.populationStd ? parseFloat(meanParams.populationStd) : undefined;
                var estimatedStd = meanParams.estimatedStd ? parseFloat(meanParams.estimatedStd) : undefined;
                // Validate standard deviation
                if (populationStd !== undefined && (isNaN(populationStd) || populationStd <= 0)) {
                    throw new Error('Population standard deviation must be greater than 0');
                }
                if (estimatedStd !== undefined && (isNaN(estimatedStd) || estimatedStd <= 0)) {
                    throw new Error('Estimated standard deviation must be greater than 0');
                }
                sampleSize = calculateSampleSizeForMean(confidenceLevel, margin, {
                    populationStd: populationStd,
                    estimatedStd: estimatedStd,
                    useTDistribution: meanParams.useTDistribution
                });
            }
            else {
                // Proportion sample size calculation
                var estimatedProportion = void 0;
                if (!proportionParams.useConservativeEstimate) {
                    estimatedProportion = parseFloat(proportionParams.estimatedProportion);
                    if (isNaN(estimatedProportion) || estimatedProportion < 0 || estimatedProportion > 1) {
                        throw new Error('Estimated proportion must be between 0 and 1');
                    }
                }
                sampleSize = calculateSampleSizeForProportion(confidenceLevel, margin, {
                    estimatedProportion: estimatedProportion,
                    useConservativeEstimate: proportionParams.useConservativeEstimate
                });
            }
            setResult(sampleSize);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during calculation');
        }
    };
    // Reset form
    var handleReset = function () {
        setMarginOfError('');
        setMeanParams({
            populationStd: '',
            estimatedStd: '',
            useTDistribution: false
        });
        setProportionParams({
            estimatedProportion: '',
            useConservativeEstimate: true
        });
        setResult(null);
        setError(null);
    };
    return (_jsx(Card, { maxW: "100%", margin: "20px auto", children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "2xl", fontWeight: "bold", mb: 4, children: "Sample Size Calculator" }), _jsx(Text, { fontSize: "sm", color: "gray.600", mb: 4, children: "Calculate the minimum sample size needed to achieve your desired precision based on the specified confidence level and margin of error." }), _jsx(Divider, { my: 2 }), _jsxs(FormControl, { mb: 3, children: [_jsx(FormLabel, { fontSize: "lg", mb: 2, children: "Calculation Type" }), _jsxs(RadioGroup, { value: calculationType, onChange: function (value) {
                                setCalculationType(value);
                                setResult(null);
                                setError(null);
                            }, children: [_jsxs(Box, { mr: 4, children: [_jsx(Radio, { value: "mean" }), _jsx(Text, { ml: 2, display: "inline", children: "Mean" })] }), _jsxs(Box, { children: [_jsx(Radio, { value: "proportion" }), _jsx(Text, { ml: 2, display: "inline", children: "Proportion" })] })] })] }), _jsxs(Grid, { templateColumns: { sm: '1fr 1fr' }, gap: 4, children: [_jsx(GridItem, { children: _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Confidence Level" }), _jsx(Input, { type: "number", value: confidenceLevel, onChange: function (e) {
                                            var value = parseFloat(e.target.value);
                                            if (!isNaN(value) && value > 0 && value < 1) {
                                                setConfidenceLevel(value);
                                                setResult(null);
                                            }
                                        }, placeholder: "e.g., 0.95", mb: 2 })] }) }), _jsx(GridItem, { children: _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Margin of Error" }), _jsx(Input, { type: "number", value: marginOfError, onChange: function (e) {
                                            setMarginOfError(e.target.value);
                                            setResult(null);
                                        }, placeholder: calculationType === 'mean' ? "e.g., 2.5" : "e.g., 0.03", mb: 2 })] }) })] }), calculationType === 'mean' && (_jsxs(Box, { mt: 2, mb: 3, children: [_jsx(FormLabel, { fontSize: "lg", mb: 2, children: "Mean Parameters" }), _jsxs(Grid, { templateColumns: { sm: '1fr 1fr' }, gap: 4, children: [_jsx(GridItem, { children: _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Population Standard Deviation (when known)" }), _jsx(Input, { type: "number", value: meanParams.populationStd, onChange: function (e) {
                                                    setMeanParams(__assign(__assign({}, meanParams), { populationStd: e.target.value }));
                                                    setResult(null);
                                                }, mb: 2 })] }) }), _jsx(GridItem, { children: _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Estimated Standard Deviation (when variance unknown)" }), _jsx(Input, { type: "number", value: meanParams.estimatedStd, onChange: function (e) {
                                                    setMeanParams(__assign(__assign({}, meanParams), { estimatedStd: e.target.value }));
                                                    setResult(null);
                                                }, mb: 1 }), _jsx(FormHelperText, { children: "Tip: When variance is unknown, standard deviation can be estimated from pilot studies or historical data" })] }) })] }), _jsxs(Box, { mt: 2, children: [_jsx(Switch, { id: "use-t-distribution", isChecked: meanParams.useTDistribution, onChange: function (e) {
                                        setMeanParams(__assign(__assign({}, meanParams), { useTDistribution: e.target.checked }));
                                        setResult(null);
                                    } }), _jsx(FormLabel, { htmlFor: "use-t-distribution", mb: 0, ml: 2, display: "inline", children: "Use t-distribution (more accurate for small samples)" })] }), _jsxs(Alert, { status: "info", mt: 2, children: [_jsx(Text, { fontSize: "sm", children: "When population variance is unknown, you must provide an estimated standard deviation. This can be obtained through:" }), _jsxs("ul", { style: { marginTop: '5px', marginBottom: '5px', paddingLeft: '20px', fontSize: 'sm' }, children: [_jsx("li", { children: "Results from previous or similar studies" }), _jsx("li", { children: "Pilot study data" }), _jsx("li", { children: "If range is known, standard deviation can be roughly estimated as range/6" })] })] })] })), calculationType === 'proportion' && (_jsxs(Box, { mt: 2, mb: 3, children: [_jsx(FormLabel, { fontSize: "lg", mb: 2, children: "Proportion Parameters" }), _jsxs(Box, { mb: 2, children: [_jsx(Switch, { id: "use-conservative-estimate", isChecked: proportionParams.useConservativeEstimate, onChange: function (e) {
                                        setProportionParams(__assign(__assign({}, proportionParams), { useConservativeEstimate: e.target.checked }));
                                        setResult(null);
                                    } }), _jsx(FormLabel, { htmlFor: "use-conservative-estimate", mb: 0, ml: 2, display: "inline", children: "Use conservative estimate (p=0.5, ensures maximum sample size)" })] }), !proportionParams.useConservativeEstimate && (_jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Estimated Proportion" }), _jsx(Input, { type: "number", value: proportionParams.estimatedProportion, onChange: function (e) {
                                        setProportionParams(__assign(__assign({}, proportionParams), { estimatedProportion: e.target.value }));
                                        setResult(null);
                                    }, placeholder: "e.g., 0.65", my: 2 })] })), _jsx(Alert, { status: "info", mt: 2, children: _jsx(Text, { fontSize: "sm", children: "Conservative estimate uses p=0.5 (where variance is maximized), ensuring the calculated sample size is large enough regardless of the actual proportion. If you have previous research or theoretical basis to estimate the proportion, you can uncheck conservative estimate and enter your estimate." }) })] })), _jsxs(Box, { mt: 3, display: "flex", gap: 2, children: [_jsx(Button, { colorScheme: "blue", onClick: handleCalculate, children: "Calculate Sample Size" }), _jsx(Button, { variant: "outline", colorScheme: "gray", onClick: handleReset, children: "Reset" })] }), error && (_jsx(Alert, { status: "error", mt: 3, children: error })), result !== null && (_jsx(Card, { mt: 4, bg: "green.50", borderWidth: 2, borderColor: "green.300", children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "lg", fontWeight: "bold", mb: 2, color: "green.700", children: "Calculation Result \u2713" }), _jsxs(Text, { fontSize: "1.5rem", fontWeight: "bold", color: "green.800", mb: 3, children: ["Minimum Required Sample Size: ", result] }), _jsxs(Text, { fontSize: "sm", color: "gray.700", mt: 1, children: ["Confidence Level: ", (confidenceLevel * 100).toFixed(1), "%"] }), _jsxs(Text, { fontSize: "sm", color: "gray.700", children: ["Margin of Error: ", marginOfError] })] }) }))] }) }));
};
export default SampleSizeCalculator;
