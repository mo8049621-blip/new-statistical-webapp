import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Box, Text } from '@chakra-ui/react';

var PowerFunctionChart = function (_a) {
    var powerData = _a.powerData,
        _b = _a.title,
        title = _b === void 0 ? 'Power Function' : _b,
        _c = _a.xLabel,
        xLabel = _c === void 0 ? 'True Mean Difference (μ - μ₀)' : _c,
        _d = _a.yLabel,
        yLabel = _d === void 0 ? 'Power' : _d;
    return (_jsxs(Box, { children: [_jsx(Text, { fontSize: "lg", fontWeight: "bold", mb: 4, children: title }), _jsxs(Box, { height: "400px", width: "100%", children: [_jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(LineChart, { data: powerData, margin: { top: 20, right: 30, left: 20, bottom: 30 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "mu", label: { value: xLabel, position: 'insideBottom', offset: -10 }, domain: ['auto', 'auto'], tickFormatter: function (value) { return value.toFixed(2); } }), _jsx(YAxis, { domain: [0, 1], label: { value: yLabel, angle: -90, position: 'insideLeft' }, tickFormatter: function (value) { return value.toFixed(2); } }), _jsx(Tooltip, { formatter: function (value) { return [Number(value).toFixed(4), 'Power']; }, labelFormatter: function (value) { return "Mean: ".concat(parseFloat(value).toFixed(4)); } }), _jsx(Legend, {}), _jsx(Line, { type: "monotone", dataKey: "power", name: "Power Function", stroke: "#3b82f6", strokeWidth: 2, dot: { r: 3 }, activeDot: { r: 5 } })] }) })] })] }));
};

export default PowerFunctionChart;