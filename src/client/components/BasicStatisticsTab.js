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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Text, Grid, GridItem, Card, CardBody, Select, FormControl, FormLabel, Switch, NumberInput } from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { generateHistogramData, calculateConfidenceInterval, calculateMean, calculateMedian, calculateMode, calculateVariance, calculateStd, calculateQuartiles } from '../utils/statistics';
function BasicStatisticsTab(_a) {
    var _b, _c, _d, _e, _f;
    var dataset = _a.dataset, propsBasicStats = _a.basicStats;
    var _g = useState(null), stats = _g[0], setStats = _g[1];
    // Confidence interval calculation options
    var _h = useState({
        confidenceLevel: 0.95,
        isNormal: false,
        knownVariance: false,
        populationVariance: 0
    }), ciOptions = _h[0], setCiOptions = _h[1];
    var _j = useState([]), histogramData = _j[0], setHistogramData = _j[1];
    var _k = useState([]), timeSeriesData = _k[0], setTimeSeriesData = _k[1];
    useEffect(function () {
        if (dataset && dataset.length > 0) {
            calculateStats(dataset);
            createHistogramData(dataset);
            generateTimeSeriesData(dataset);
        }
    }, [dataset, ciOptions, propsBasicStats]);
    var calculateStats = function (data) {
        // Prefer using passed statistics
        if (propsBasicStats) {
            var sortedData = __spreadArray([], data, true).sort(function (a, b) { return a - b; });
            var n = sortedData.length;
            var _a = calculateQuartiles(data), q1 = _a.q1, q3 = _a.q3, iqr = _a.iqr;
            // Calculate confidence interval
            var confidenceInterval = calculateConfidenceInterval(data, ciOptions.confidenceLevel, {
                isNormal: ciOptions.isNormal,
                knownVariance: ciOptions.knownVariance,
                populationVariance: ciOptions.populationVariance
            });
            // Calculate minimum, maximum, and range
            var min = sortedData[0];
            var max = sortedData[n - 1];
            var range = max - min;
            setStats({
                mean: propsBasicStats.mean || 0,
                median: propsBasicStats.median || 0,
                mode: propsBasicStats.mode ? (Array.isArray(propsBasicStats.mode) ? propsBasicStats.mode : [propsBasicStats.mode]) : [],
                variance: propsBasicStats.variance || (propsBasicStats.std ? propsBasicStats.std * propsBasicStats.std : 0),
                std: propsBasicStats.std || 0,
                min: min,
                max: max,
                range: range,
                q1: q1,
                q3: q3,
                iqr: iqr,
                confidenceInterval: confidenceInterval
            });
        }
        else {
            var sortedData = __spreadArray([], data, true).sort(function (a, b) { return a - b; });
            var n = sortedData.length;
            // Use shared statistical functions
            var mean = calculateMean(data);
            var median = calculateMedian(data);
            var mode = calculateMode(data);
            var variance = calculateVariance(data);
            var std = calculateStd(data);
            var _b = calculateQuartiles(data), q1 = _b.q1, q3 = _b.q3, iqr = _b.iqr;
            // Calculate confidence interval
            var confidenceInterval = calculateConfidenceInterval(data, ciOptions.confidenceLevel, {
                isNormal: ciOptions.isNormal,
                knownVariance: ciOptions.knownVariance,
                populationVariance: ciOptions.populationVariance
            });
            // Calculate minimum, maximum, and range
            var min = sortedData[0];
            var max = sortedData[n - 1];
            var range = max - min;
            setStats({
                mean: mean,
                median: median,
                mode: mode,
                variance: variance,
                std: std,
                min: min,
                max: max,
                range: range,
                q1: q1,
                q3: q3,
                iqr: iqr,
                confidenceInterval: confidenceInterval
            });
        }
    };
    var handleCIOptionChange = function (field, value) {
        setCiOptions(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[field] = value, _a)));
        });
        // Recalculate statistics
        if (dataset && dataset.length > 0) {
            calculateStats(dataset);
        }
    };
    var createHistogramData = function (data) {
        var histogramData = generateHistogramData(data);
        setHistogramData(histogramData);
    };
    var generateTimeSeriesData = function (data) {
        var timeData = data.map(function (value, index) { return ({
            index: index,
            value: value,
        }); });
        setTimeSeriesData(timeData);
    };
    if (!stats) {
        return _jsx(Text, { children: "Calculating statistics..." });
    }
    return (_jsxs(Box, { p: 4, children: [_jsx(Text, { fontSize: "xl", fontWeight: "bold", mb: 6, children: "Basic Statistical Analysis Results" }), _jsxs(Box, { mb: 6, p: 4, borderWidth: 1, borderRadius: 4, bgColor: "#f5f5f5", children: [_jsx(Text, { fontSize: "lg", fontWeight: "bold", mb: 4, children: "Confidence Interval Settings" }), _jsxs(Grid, { templateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 4, children: [_jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Confidence Level" }), _jsxs(Select, { value: ciOptions.confidenceLevel, onChange: function (e) { return handleCIOptionChange('confidenceLevel', parseFloat(e.target.value)); }, children: [_jsx("option", { value: 0.90, children: "90%" }), _jsx("option", { value: 0.95, children: "95%" }), _jsx("option", { value: 0.99, children: "99%" })] })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Distribution Assumption" }), _jsxs(Select, { value: ciOptions.isNormal ? 'normal' : 'nonNormal', onChange: function (e) { return handleCIOptionChange('isNormal', e.target.value === 'normal'); }, children: [_jsx("option", { value: "normal", children: "Normal Distribution" }), _jsx("option", { value: "nonNormal", children: "Non-Normal Distribution" })] })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Known Variance" }), _jsx(Switch, { isChecked: ciOptions.knownVariance, onChange: function (e) { return handleCIOptionChange('knownVariance', e.target.checked); } })] }), ciOptions.knownVariance && (_jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Population Variance Value" }), _jsx(NumberInput, { min: 0, step: 0.0001, value: ciOptions.populationVariance, onChange: function (value) { return handleCIOptionChange('populationVariance', parseFloat(value || '0')); } })] }))] })] }), _jsxs(Grid, { templateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 4, mb: 8, children: [_jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "Mean" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: stats.mean !== undefined ? stats.mean.toFixed(4) : 'N/A' })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "Median" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: stats.median !== undefined ? stats.median.toFixed(4) : 'N/A' })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "Mode" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: stats.mode && stats.mode.length > 0 ? stats.mode.map(function (m) { return typeof m === 'number' ? m.toFixed(4) : m; }).join(', ') : 'No mode' })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "Standard Deviation" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: stats.std !== undefined ? stats.std.toFixed(4) : 'N/A' })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "Minimum" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: stats.min !== undefined ? stats.min.toFixed(4) : 'N/A' })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "Maximum" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: stats.max !== undefined ? stats.max.toFixed(4) : 'N/A' })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "Interquartile Range" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: stats.iqr !== undefined ? stats.iqr.toFixed(4) : 'N/A' })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "Sample Size" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: dataset && dataset.length !== undefined ? dataset.length : 0 })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsxs(Text, { fontSize: "sm", color: "gray.500", children: [Math.round(ciOptions.confidenceLevel * 100), "% CI Lower Bound"] }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: ((_b = stats.confidenceInterval) === null || _b === void 0 ? void 0 : _b.lower) !== undefined ? stats.confidenceInterval.lower.toFixed(4) : 'N/A' })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsxs(Text, { fontSize: "sm", color: "gray.500", children: [Math.round(ciOptions.confidenceLevel * 100), "% CI Upper Bound"] }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: ((_c = stats.confidenceInterval) === null || _c === void 0 ? void 0 : _c.upper) !== undefined ? stats.confidenceInterval.upper.toFixed(4) : 'N/A' })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "Margin of Error" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: ((_d = stats.confidenceInterval) === null || _d === void 0 ? void 0 : _d.marginOfError) !== undefined ? stats.confidenceInterval.marginOfError.toFixed(4) : 'N/A' })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "Calculation Method" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: ((_e = stats.confidenceInterval) === null || _e === void 0 ? void 0 : _e.method) || 'N/A' })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "Critical Value" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: ((_f = stats.confidenceInterval) === null || _f === void 0 ? void 0 : _f.criticalValue) !== undefined ? stats.confidenceInterval.criticalValue.toFixed(4) : 'N/A' })] }) })] }), _jsxs(Grid, { templateColumns: "1fr 1fr", gap: 6, children: [_jsxs(GridItem, { children: [_jsx(Text, { fontSize: "lg", fontWeight: "bold", mb: 4, children: "Histogram" }), _jsx(Box, { height: "400px", width: "100%", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: histogramData, margin: { top: 20, right: 30, left: 20, bottom: 70 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name", angle: -45, textAnchor: "end", height: 80 }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "value", fill: "#3b82f6" })] }) }) })] }), _jsxs(GridItem, { children: [_jsx(Text, { fontSize: "lg", fontWeight: "bold", mb: 4, children: "Time Series Plot" }), _jsx(Box, { height: "400px", width: "100%", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(LineChart, { data: timeSeriesData, margin: { top: 20, right: 30, left: 20, bottom: 20 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "index", label: { value: 'Index', position: 'insideBottomRight', offset: -10 } }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Line, { type: "monotone", dataKey: "value", stroke: "#8884d8" })] }) }) })] })] })] }));
}
export default BasicStatisticsTab;
