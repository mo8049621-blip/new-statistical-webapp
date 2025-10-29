import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Select, Button, Grid, Text, Card, CardBody } from '@chakra-ui/react';
import { generateNormalData, generateUniformData, generateBinomialData } from '../utils/dataGenerators';
function TwoSampleDataGenerator(_a) {
    var onDataGenerated = _a.onDataGenerated;
    // Sample 1 Parameters
    var _b = useState('50'), sample1Size = _b[0], setSample1Size = _b[1];
    var _c = useState('normal'), sample1Distribution = _c[0], setSample1Distribution = _c[1];
    var _d = useState('0'), sample1Mean = _d[0], setSample1Mean = _d[1];
    var _e = useState('1'), sample1StdDev = _e[0], setSample1StdDev = _e[1];
    var _f = useState('0'), sample1Min = _f[0], setSample1Min = _f[1];
    var _g = useState('1'), sample1Max = _g[0], setSample1Max = _g[1];
    var _h = useState('0.5'), sample1Probability = _h[0], setSample1Probability = _h[1];
    // Sample 2 Parameters
    var _j = useState('50'), sample2Size = _j[0], setSample2Size = _j[1];
    var _k = useState('normal'), sample2Distribution = _k[0], setSample2Distribution = _k[1];
    var _l = useState('1'), sample2Mean = _l[0], setSample2Mean = _l[1];
    var _m = useState('1'), sample2StdDev = _m[0], setSample2StdDev = _m[1];
    var _o = useState('0'), sample2Min = _o[0], setSample2Min = _o[1];
    var _p = useState('1'), sample2Max = _p[0], setSample2Max = _p[1];
    var _q = useState('0.5'), sample2Probability = _q[0], setSample2Probability = _q[1];
    var generateSample = function (distribution, size, params) {
        var n = parseInt(size.toString()) || 10;
        switch (distribution) {
            case 'normal':
                return generateNormalData(n, params.mean, params.stdDev);
            case 'uniform':
                return generateUniformData(n, params.min, params.max);
            case 'binomial':
                return generateBinomialData(n, params.probability);
            default:
                return [];
        }
    };
    var handleGenerate = function () {
        try {
            // Generate sample 1
            var params1 = {
                mean: parseFloat(sample1Mean),
                stdDev: parseFloat(sample1StdDev),
                min: parseFloat(sample1Min),
                max: parseFloat(sample1Max),
                probability: parseFloat(sample1Probability)
            };
            // Generate sample 2
            var params2 = {
                mean: parseFloat(sample2Mean),
                stdDev: parseFloat(sample2StdDev),
                min: parseFloat(sample2Min),
                max: parseFloat(sample2Max),
                probability: parseFloat(sample2Probability)
            };
            var sample1 = generateSample(sample1Distribution, parseInt(sample1Size), params1);
            var sample2 = generateSample(sample2Distribution, parseInt(sample2Size), params2);
            onDataGenerated({ sample1: sample1, sample2: sample2, params1: params1, params2: params2 });
        }
        catch (error) {
            alert(error instanceof Error ? error.message : 'An error occurred during data generation');
        }
    };
    var renderDistributionParams = function (distribution, index) {
        var setters = index === 1 ? {
            mean: setSample1Mean,
            stdDev: setSample1StdDev,
            min: setSample1Min,
            max: setSample1Max,
            probability: setSample1Probability
        } : {
            mean: setSample2Mean,
            stdDev: setSample2StdDev,
            min: setSample2Min,
            max: setSample2Max,
            probability: setSample2Probability
        };
        var values = index === 1 ? {
            mean: sample1Mean,
            stdDev: sample1StdDev,
            min: sample1Min,
            max: sample1Max,
            probability: sample1Probability
        } : {
            mean: sample2Mean,
            stdDev: sample2StdDev,
            min: sample2Min,
            max: sample2Max,
            probability: sample2Probability
        };
        switch (distribution) {
            case 'normal':
                return (_jsxs(Grid, { gap: 4, children: [_jsxs(FormControl, { children: [_jsx(FormLabel, { fontSize: "sm", children: "Mean (\u03BC)" }), _jsx(Input, { type: "number", value: values.mean, onChange: function (e) { return setters.mean(e.target.value); }, step: "0.1" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { fontSize: "sm", children: "Standard Deviation (\u03C3)" }), _jsx(Input, { type: "number", value: values.stdDev, onChange: function (e) { return setters.stdDev(e.target.value); }, step: "0.1", min: "0.001" })] })] }));
            case 'uniform':
                return (_jsxs(Grid, { gap: 4, children: [_jsxs(FormControl, { children: [_jsx(FormLabel, { fontSize: "sm", children: "Minimum Value (a)" }), _jsx(Input, { type: "number", value: values.min, onChange: function (e) { return setters.min(e.target.value); }, step: "0.1" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { fontSize: "sm", children: "Maximum Value (b)" }), _jsx(Input, { type: "number", value: values.max, onChange: function (e) { return setters.max(e.target.value); }, step: "0.1" })] })] }));
            case 'binomial':
                return (_jsxs(FormControl, { children: [_jsx(FormLabel, { fontSize: "sm", children: "Success Probability (p)" }), _jsx(Input, { type: "number", value: values.probability, onChange: function (e) { return setters.probability(e.target.value); }, step: "0.01", min: "0", max: "1" })] }));
            default:
                return null;
        }
    };
    return (_jsxs(Box, { children: [_jsxs(Grid, { templateColumns: { base: '1fr', md: 'repeat(2, 1fr)' }, gap: 6, mb: 6, children: [_jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", fontWeight: "medium", color: "gray.700", mb: 3, children: "Sample 1" }), _jsxs(Grid, { gap: 4, children: [_jsxs(FormControl, { children: [_jsx(FormLabel, { fontSize: "sm", children: "Sample Size" }), _jsx(Input, { type: "number", value: sample1Size, onChange: function (e) { return setSample1Size(e.target.value); }, min: "1", max: "10000" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { fontSize: "sm", children: "Distribution Type" }), _jsxs(Select, { value: sample1Distribution, onChange: function (e) { return setSample1Distribution(e.target.value); }, children: [_jsx("option", { value: "normal", children: "Normal Distribution" }), _jsx("option", { value: "uniform", children: "Uniform Distribution" }), _jsx("option", { value: "binomial", children: "Binomial Distribution" })] })] }), renderDistributionParams(sample1Distribution, 1)] })] }) }), _jsx(Card, { children: _jsxs(CardBody, { children: [_jsx(Text, { fontSize: "sm", fontWeight: "medium", color: "gray.700", mb: 3, children: "Sample 2" }), _jsxs(Grid, { gap: 4, children: [_jsxs(FormControl, { children: [_jsx(FormLabel, { fontSize: "sm", children: "Sample Size" }), _jsx(Input, { type: "number", value: sample2Size, onChange: function (e) { return setSample2Size(e.target.value); }, min: "1", max: "10000" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { fontSize: "sm", children: "Distribution Type" }), _jsxs(Select, { value: sample2Distribution, onChange: function (e) { return setSample2Distribution(e.target.value); }, children: [_jsx("option", { value: "normal", children: "Normal Distribution" }), _jsx("option", { value: "uniform", children: "Uniform Distribution" }), _jsx("option", { value: "binomial", children: "Binomial Distribution" })] })] }), renderDistributionParams(sample2Distribution, 2)] })] }) })] }), _jsx(Button, { onClick: handleGenerate, colorScheme: "green", width: "100%", children: "Generate Two Samples" })] }));
}
export default TwoSampleDataGenerator;
