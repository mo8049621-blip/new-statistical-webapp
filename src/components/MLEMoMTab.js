import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Text, Card, CardBody, Grid, Select, Button, Alert, AlertIcon, AlertDescription } from '@chakra-ui/react';
import { calculateMLE, calculateMoM } from '../utils/statistics';
function MLEMoMTab(_a) {
    var dataset = _a.dataset, distribution = _a.distribution, basicStats = _a.basicStats, isGeneratedDataset = _a.isGeneratedDataset;
    var _b = useState('normal'), selectedDistribution = _b[0], setSelectedDistribution = _b[1];
    var _c = useState([]), estimationResults = _c[0], setEstimationResults = _c[1];
    var _d = useState(null), error = _d[0], setError = _d[1];
    useEffect(function () {
        // Automatically update selected distribution when dataset or distribution changes
        if (distribution && dataset.length > 0) {
            setSelectedDistribution(distribution.type || 'normal');
            handleEstimate();
        }
    }, [dataset, distribution, basicStats]);
    var handleDistributionChange = function (e) {
        setSelectedDistribution(e.target.value);
    };
    var handleEstimate = function () {
        if (dataset.length === 0) {
            setError('Please import or generate data first');
            return;
        }
        setError(null);
        var results = [];
        try {
            // Calculate MLE estimates
            var mleParams = calculateMLE(dataset, selectedDistribution, basicStats);
            results.push({
                method: 'Maximum Likelihood Estimation (MLE)',
                params: mleParams
            });
            // Calculate MoM estimates
            var momParams = calculateMoM(dataset, selectedDistribution, basicStats);
            results.push({
                method: 'Method of Moments (MoM)',
                params: momParams
            });
            setEstimationResults(results);
        }
        catch (err) {
            setError("Estimation calculation failed: ".concat(err instanceof Error ? err.message : 'Unknown error'));
        }
    };
    // Distribution options
    var distributionOptions = [
        { value: 'normal', label: 'Normal Distribution' },
        { value: 'exponential', label: 'Exponential Distribution' },
        { value: 'gamma', label: 'Gamma Distribution' },
        { value: 'beta', label: 'Beta Distribution' },
        { value: 'poisson', label: 'Poisson Distribution' },
        { value: 'uniform', label: 'Uniform Distribution' }
    ];
    return (_jsx(Box, { p: 6, children: _jsxs(Grid, { gridTemplateColumns: "1fr 2fr", gap: 6, children: [_jsx(Box, { children: _jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "lg", fontWeight: "bold", mb: 4, children: "Parameter Estimation" }), !isGeneratedDataset ? (_jsxs(Box, { mb: 4, children: [_jsx(Text, { mb: 2, children: "Select Distribution Type:" }), _jsx(Select, { value: selectedDistribution, onChange: handleDistributionChange, width: "full", children: distributionOptions.map(function (option) { return (_jsx("option", { value: option.value, children: option.label }, option.value)); }) })] })) : distribution ? (_jsxs(Box, { mb: 4, bg: "blue.50", p: 4, borderRadius: "md", children: [_jsx(Text, { fontWeight: "medium", mb: 2, children: "Auto-detection Result:" }), _jsxs(Text, { fontSize: "sm", mb: 1, children: ["Distribution Type: ", distribution.name] }), distribution.parameters && Object.entries(distribution.parameters).length > 0 && (_jsxs(Text, { fontSize: "sm", mt: 1, children: ["Parameters: ", Object.entries(distribution.parameters)
                                                    .map(function (_a) {
                                                    var key = _a[0], value = _a[1];
                                                    return "".concat(key, ": ").concat(value);
                                                })
                                                    .join(', ')] })), _jsxs(Text, { fontSize: "sm", mt: 2, color: "blue.700", children: ["Using ", distribution.name, " for Maximum Likelihood Estimation and Method of Moments"] })] })) : null, _jsx(Button, { colorScheme: "blue", width: "full", onClick: handleEstimate, children: "Perform Estimation" })] }) }) }), _jsxs(Box, { children: [error && (_jsxs(Alert, { status: "error", mb: 4, children: [_jsx(AlertIcon, {}), _jsx(AlertDescription, { children: error })] })), estimationResults.length > 0 && (_jsx(_Fragment, { children: estimationResults.map(function (result, index) { return (_jsx(Card, { mb: 4, children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "md", fontWeight: "bold", mb: 2, children: result.method }), _jsx(Grid, { gridTemplateColumns: "repeat(2, 1fr)", gap: 2, children: Object.entries(result.params).map(function (_a) {
                                                var param = _a[0], value = _a[1];
                                                return (_jsxs(Box, { children: [_jsxs(Text, { fontSize: "sm", color: "gray.600", children: [param, ":"] }), _jsx(Text, { fontWeight: "bold", children: typeof value === 'number' ? value.toFixed(4) : value })] }, param));
                                            }) })] }) }, index)); }) })), estimationResults.length === 0 && !error && (_jsxs(Alert, { status: "info", children: [_jsx(AlertIcon, {}), _jsx(AlertDescription, { children: "Please select a distribution type and click the 'Perform Estimation' button" })] }))] })] }) }));
}
export default MLEMoMTab;
