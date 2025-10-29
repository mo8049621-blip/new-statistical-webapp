import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Button, Grid, Text } from '@chakra-ui/react';
import { generatePairedNormalData } from '../utils/dataGenerators';
function PairedDataGenerator(_a) {
    var onDataGenerated = _a.onDataGenerated;
    var _b = useState('30'), sampleSize = _b[0], setSampleSize = _b[1];
    var _c = useState('50'), meanBefore = _c[0], setMeanBefore = _c[1];
    var _d = useState('5'), meanDifference = _d[0], setMeanDifference = _d[1];
    var _e = useState('10'), stdDev = _e[0], setStdDev = _e[1];
    var _f = useState('0.8'), correlation = _f[0], setCorrelation = _f[1];
    var handleGenerate = function () {
        try {
            var n = parseInt(sampleSize);
            var muBefore = parseFloat(meanBefore);
            var muDiff = parseFloat(meanDifference);
            var sigma = parseFloat(stdDev);
            var corr = parseFloat(correlation);
            if (isNaN(n) || isNaN(muBefore) || isNaN(muDiff) || isNaN(sigma) || isNaN(corr) ||
                n < 1 || n > 10000 || sigma <= 0 || corr < -1 || corr > 1) {
                throw new Error('Please enter valid parameter values');
            }
            var _a = generatePairedNormalData(n, muBefore, muDiff, sigma, corr), before = _a.before, after = _a.after;
            onDataGenerated({
                before: before,
                after: after,
                params: {
                    sampleSize: n,
                    meanBefore: muBefore,
                    meanDifference: muDiff,
                    stdDev: sigma,
                    correlation: corr
                }
            });
        }
        catch (error) {
            alert(error instanceof Error ? error.message : 'Error during data generation');
        }
    };
    return (_jsxs(Box, { children: [_jsxs(Grid, { templateColumns: { base: '1fr', md: 'repeat(2, 1fr)' }, gap: 6, mb: 6, children: [_jsxs(FormControl, { children: [_jsx(FormLabel, { fontSize: "sm", children: "Sample Size (n)" }), _jsx(Input, { type: "number", value: sampleSize, onChange: function (e) { return setSampleSize(e.target.value); }, min: "1", max: "10000" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { fontSize: "sm", children: "Pre-test Mean (\u03BC\u2081)" }), _jsx(Input, { type: "number", value: meanBefore, onChange: function (e) { return setMeanBefore(e.target.value); }, step: "0.1" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { fontSize: "sm", children: "Mean Difference (\u03BC\u2082 - \u03BC\u2081)" }), _jsx(Input, { type: "number", value: meanDifference, onChange: function (e) { return setMeanDifference(e.target.value); }, step: "0.1" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { fontSize: "sm", children: "Standard Deviation (\u03C3)" }), _jsx(Input, { type: "number", value: stdDev, onChange: function (e) { return setStdDev(e.target.value); }, step: "0.1", min: "0.001" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { fontSize: "sm", children: "Correlation Coefficient (r)" }), _jsx(Input, { type: "number", value: correlation, onChange: function (e) { return setCorrelation(e.target.value); }, step: "0.01", min: "-1", max: "1" }), _jsx(Text, { fontSize: "xs", color: "gray.500", mt: 1, children: "It is recommended to use a high positive correlation coefficient (0.6-0.9) to simulate realistic paired data" })] })] }), _jsx(Button, { onClick: handleGenerate, colorScheme: "green", width: "100%", children: "Generate Paired Data" })] }));
}
export default PairedDataGenerator;
