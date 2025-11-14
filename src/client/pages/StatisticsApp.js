var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { Box, Container, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, Divider, Alert, AlertIcon, Input, Button, Text, Checkbox, Stack, Textarea, Grid } from '@chakra-ui/react';
import FileUploader from '../components/FileUploader';
import DistributionGenerator from '../components/DistributionGenerator';
import ConfidenceIntervalsContainer from '../components/ConfidenceIntervalsContainer';
import BasicStatisticsTab from '../components/BasicStatisticsTab';
import MLEMoMTab from '../components/MLEMoMTab';
import HypothesisTestingTab from '../components/HypothesisTestingTab';
import SampleSizeCalculator from '../components/SampleSizeCalculator';
import { calculateMean, calculateStd, calculateMedian, calculateSkewness, calculateKurtosis } from '../utils/statistics';
var StatisticsApp = function () {
    var _a, _b;
    // Dataset state management
    var _c = useState([]), dataset1 = _c[0], setDataset1 = _c[1];
    var _d = useState([]), dataset2 = _d[0], setDataset2 = _d[1];
    var _e = useState({ sample1: [], sample2: [] }), pairedData = _e[0], setPairedData = _e[1];
    // Data updated flag for user notification
    var _f = useState(false), dataUpdated = _f[0], setDataUpdated = _f[1];
    // Flag indicating if dataset is system generated
    var _g = useState(false), isDatasetGenerated = _g[0], setIsDatasetGenerated = _g[1];
    // Store dataset distribution information
    var _h = useState(null), dataset1Distribution = _h[0], setDataset1Distribution = _h[1];
    // Saved datasets list
    var _j = useState([]), savedDatasets = _j[0], setSavedDatasets = _j[1];
    // Dataset name input
    var _k = useState(''), datasetName = _k[0], setDatasetName = _k[1];
    // Currently selected dataset ID
    var _l = useState(null), selectedDatasetId = _l[0], setSelectedDatasetId = _l[1];
    // Direct data input
    var _m = useState(''), directDataInput = _m[0], setDirectDataInput = _m[1];
    // Get currently selected dataset
    var getSelectedDataset = function (id) {
        if (!id)
            return [];
        var dataset = savedDatasets.find(function (d) { return d.id === id; });
        return dataset ? dataset.data : [];
    };
    // Calculate basic statistics for the currently used dataset
    var currentDataset = useMemo(function () {
        if (selectedDatasetId) {
            var dataset = savedDatasets.find(function (d) { return d.id === selectedDatasetId; });
            return dataset ? dataset.data : [];
        }
        return dataset1;
    }, [selectedDatasetId, dataset1, savedDatasets]);
    // Calculate basic statistics
    var basicStats = useMemo(function () {
        var datasetToAnalyze = [];
        if (selectedDatasetId) {
            var dataset = savedDatasets.find(function (d) { return d.id === selectedDatasetId; });
            datasetToAnalyze = dataset ? dataset.data : [];
        }
        else {
            datasetToAnalyze = dataset1;
        }
        if (datasetToAnalyze.length === 0)
            return null;
        return {
            mean: calculateMean(datasetToAnalyze),
            std: calculateStd(datasetToAnalyze),
            median: calculateMedian(datasetToAnalyze),
            skewness: calculateSkewness(datasetToAnalyze),
            kurtosis: calculateKurtosis(datasetToAnalyze),
            count: datasetToAnalyze.length,
            min: Math.min.apply(Math, datasetToAnalyze),
            max: Math.max.apply(Math, datasetToAnalyze)
        };
    }, [selectedDatasetId, savedDatasets, dataset1]);
    // Determine if data might come from normal distribution (simple heuristic based on skewness and kurtosis)
    var isLikelyNormal = useMemo(function () {
        if (!basicStats || currentDataset.length < 30)
            return null;
        // If skewness and kurtosis are within reasonable range, data might be normally distributed
        var skewnessWithinRange = Math.abs(basicStats.skewness) < 0.5;
        var kurtosisWithinRange = Math.abs(basicStats.kurtosis) < 0.5;
        return skewnessWithinRange && kurtosisWithinRange;
    }, [basicStats, currentDataset.length]);
    // Handle data generation event
    // Data generation handler - preserved for backward compatibility
    // Handle direct data input or upload (with source information)
    var handleDirectDataChange = function (data) {
        setDataset1(data);
        setDirectDataInput(data.join(', '));
        setIsDatasetGenerated(false); // Mark as user input or uploaded data
        setDataset1Distribution(null); // Clear distribution information
        setPairedData({ sample1: [], sample2: [] });
        setDataUpdated(true);
        setTimeout(function () { return setDataUpdated(false); }, 3000);
    };
    var handleDataset1Change = function (data, distributionInfo) {
        setDataset1(data);
        setDirectDataInput(data.join(', '));
        if (distributionInfo && distributionInfo.type && distributionInfo.parameters) {
            setDataset1Distribution({
                type: distributionInfo.type,
                name: distributionInfo.name || distributionInfo.type,
                parameters: distributionInfo.parameters
            });
            setIsDatasetGenerated(true);
        }
        else {
            setDataset1Distribution(null);
            setIsDatasetGenerated(false);
        }
        setDataUpdated(true);
        setTimeout(function () { return setDataUpdated(false); }, 3000);
    };
    var handleDataset2Change = function (data) {
        setDataset2(data);
        setDataUpdated(true);
        setTimeout(function () { return setDataUpdated(false); }, 3000);
    };
    var handlePairedDataChange = function (sample1, sample2, distributionInfo) {
        setPairedData({ sample1: sample1, sample2: sample2 });
        if (distributionInfo && distributionInfo.type && distributionInfo.parameters) {
            setDataset1Distribution({
                type: distributionInfo.type,
                name: distributionInfo.name || distributionInfo.type,
                parameters: distributionInfo.parameters
            });
            setIsDatasetGenerated(true);
        }
        setDataUpdated(true);
        setTimeout(function () { return setDataUpdated(false); }, 3000);
    };
    // Paired data generation handling removed as it's not used
    // Handle direct data input
    var handleDirectDataInput = function () {
        try {
            // Parse data
            var dataArray = directDataInput
                .split(/[\s,]+/)
                .filter(function (val) { return val.trim() !== ''; })
                .map(function (val) { return parseFloat(val); })
                .filter(function (val) { return !isNaN(val); });
            if (dataArray.length === 0) {
                throw new Error('Please enter valid data');
            }
            handleDirectDataChange(dataArray);
        }
        catch (error) {
            alert(error instanceof Error ? error.message : 'Error parsing data');
        }
    };
    // Save dataset
    var saveDataset = function (data, name) {
        if (!name.trim()) {
            alert('Please enter dataset name');
            return;
        }
        var newDataset = {
            id: "dataset_".concat(Date.now()),
            name: name.trim(),
            data: __spreadArray([], data, true),
            timestamp: Date.now()
        };
        setSavedDatasets(__spreadArray(__spreadArray([], savedDatasets, true), [newDataset], false));
        setDatasetName('');
        alert('Dataset saved successfully!');
    };
    // Delete dataset
    var deleteDataset = function (id) {
        setSavedDatasets(savedDatasets.filter(function (dataset) { return dataset.id !== id; }));
        // If deleting currently selected dataset, clear selection
        if (selectedDatasetId === id)
            setSelectedDatasetId(null);
    };
    // Select historical dataset
    var handleHistoryDatasetSelect = function (id) {
        var dataset = savedDatasets.find(function (d) { return d.id === id; });
        if (dataset) {
            setDataset1(dataset.data);
            setDirectDataInput(dataset.data.join(', '));
            setSelectedDatasetId(id);
            setDataset2([]);
            setPairedData({ sample1: [], sample2: [] });
            setIsDatasetGenerated(false); // Historical datasets default to user data
            setDataset1Distribution(null); // Clear distribution information
            setDataUpdated(true);
            setTimeout(function () { return setDataUpdated(false); }, 3000);
        }
    };
    return (_jsxs(Container, { maxW: "container.lg", py: 4, children: [_jsx(Heading, { as: "h1", size: "lg", mb: 4, textAlign: "center", children: "Statistical Analysis Tool" }), _jsxs(Box, { mb: 6, bg: "white", p: 4, borderRadius: "lg", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", children: [_jsx(Heading, { as: "h2", size: "md", mb: 3, color: "blue.600", children: "Data Input & Generation" }), _jsxs(Tabs, { isFitted: true, children: [_jsxs(TabList, { mb: 3, children: [_jsx(Tab, { children: "Data Upload" }), _jsx(Tab, { children: "Data Generation" }), _jsx(Tab, { children: "History Data" })] }), _jsxs(TabPanels, { children: [_jsx(TabPanel, { children: _jsxs(Box, { p: 4, children: [_jsx(Heading, { as: "h3", size: "sm", mb: 3, color: "blue.700", children: "Direct Data Input" }), _jsxs(Stack, { spacing: 3, mb: 6, children: [_jsx(Textarea, { value: directDataInput, onChange: function (e) { return setDirectDataInput(e.target.value); }, placeholder: "e.g., 1.2 3.4 5.6 7.8 9.0", size: "md", height: "100px", resize: "vertical" }), _jsx(Button, { onClick: handleDirectDataInput, colorScheme: "blue", width: "100%", children: "Apply Data" })] }), _jsx(Heading, { as: "h3", size: "sm", mb: 3, color: "blue.700", children: "CSV File Upload" }), _jsx(FileUploader, { onDataChange: function (data, distributionInfo) {
                                                        handleDirectDataChange(data);
                                                        // Update distribution state if there's distribution information
                                                        if (distributionInfo && distributionInfo.type) {
                                                            setDataset1Distribution({
                                                                type: distributionInfo.type,
                                                                name: distributionInfo.name || distributionInfo.type,
                                                                parameters: {}
                                                            });
                                                            setIsDatasetGenerated(false);
                                                        }
                                                        else {
                                                            setDataset1Distribution(null);
                                                            setIsDatasetGenerated(false);
                                                        }
                                                    } })] }) }), _jsx(TabPanel, { children: _jsxs(Box, { p: 4, children: [_jsx(Heading, { as: "h3", size: "sm", mb: 3, color: "blue.700", children: "Sample Generation Type" }), _jsxs(Tabs, { variant: "enclosed", mb: 4, children: [_jsxs(TabList, { children: [_jsx(Tab, { children: "Single Sample" }), _jsx(Tab, { children: "Two Samples" }), _jsx(Tab, { children: "Paired Samples" })] }), _jsxs(TabPanels, { children: [_jsx(TabPanel, { children: _jsx(DistributionGenerator, { onDataChange: function (data, distributionInfo) {
                                                                            handleDataset1Change(data, distributionInfo);
                                                                        } }) }), _jsx(TabPanel, { children: _jsxs(Stack, { spacing: 6, children: [_jsxs(Box, { children: [_jsx(Heading, { as: "h3", size: "sm", mb: 3, color: "blue.700", children: "Sample 1 Generation" }), _jsx(DistributionGenerator, { onDataChange: function (data, distributionInfo) {
                                                                                            handleDataset1Change(data, distributionInfo);
                                                                                        } })] }), _jsxs(Box, { children: [_jsx(Heading, { as: "h3", size: "sm", mb: 3, color: "blue.700", children: "Sample 2 Generation" }), _jsx(DistributionGenerator, { onDataChange: function (data) {
                                                                                            handleDataset2Change(data);
                                                                                        } })] })] }) }), _jsx(TabPanel, { children: _jsxs(Stack, { spacing: 6, children: [_jsxs(Box, { children: [_jsx(Heading, { as: "h3", size: "sm", mb: 3, color: "blue.700", children: "Pre-test Data Generation" }), _jsx(DistributionGenerator, { onDataChange: function (data, distributionInfo) {
                                                                                            handlePairedDataChange(data, pairedData.sample2, distributionInfo);
                                                                                        } })] }), _jsxs(Box, { children: [_jsx(Heading, { as: "h3", size: "sm", mb: 3, color: "blue.700", children: "Post-test Data Generation" }), _jsx(DistributionGenerator, { onDataChange: function (data, distributionInfo) {
                                                                                            handlePairedDataChange(pairedData.sample1, data, distributionInfo);
                                                                                        } })] })] }) })] })] })] }) }), _jsx(TabPanel, { children: _jsxs(Stack, { spacing: 3, children: [dataset1.length > 0 && (_jsxs(Alert, { status: "info", mb: 3, size: "sm", children: [_jsx(AlertIcon, {}), "You can save and manage current dataset in the 'Dataset Management' section below"] })), _jsxs(Box, { children: [_jsx(Text, { fontSize: "sm", mb: 2, fontWeight: "medium", children: "Select History Dataset:" }), savedDatasets.length === 0 ? (_jsx(Text, { fontSize: "sm", color: "gray.500", children: "No saved datasets yet" })) : (_jsx(Box, { maxHeight: "200px", overflowY: "auto", borderWidth: 1, borderColor: "gray.200", borderRadius: "lg", children: savedDatasets.map(function (dataset) { return (_jsxs(Box, { p: 2, borderBottomWidth: 1, borderBottomColor: "gray.100", _hover: { bg: "gray.50" }, display: "flex", alignItems: "center", justifyContent: "space-between", children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center' }, children: [_jsx(Checkbox, { isChecked: selectedDatasetId === dataset.id, onChange: function () { return handleHistoryDatasetSelect(dataset.id); }, mr: 2 }), _jsxs("div", { children: [_jsx(Text, { fontSize: "sm", fontWeight: "medium", children: dataset.name }), _jsxs(Text, { fontSize: "xs", color: "gray.500", children: [dataset.data.length, " observations"] })] })] }), _jsx(Button, { size: "xs", colorScheme: "red", onClick: function () { return deleteDataset(dataset.id); }, children: "Delete" })] }, dataset.id)); }) }))] })] }) })] })] })] }), _jsx(Divider, { my: 4 }), _jsxs(Box, { bg: "white", p: 4, borderRadius: "lg", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", mb: 4, children: [_jsx(Heading, { as: "h2", size: "md", mb: 3, color: "blue.600", children: "Dataset Management" }), dataUpdated && (_jsxs(Alert, { status: "success", mb: 4, size: "sm", children: [_jsx(AlertIcon, {}), "Data has been updated. You can start analysis or save"] })), dataset1.length > 0 && (_jsxs(Box, { mb: 4, p: 3, borderWidth: 1, borderColor: "blue.200", borderRadius: "lg", bg: "blue.50", children: [_jsx(Text, { fontSize: "sm", fontWeight: "medium", mb: 2, children: "Save current generated dataset:" }), _jsxs(Stack, { direction: "row", gap: 2, children: [_jsx(Input, { value: datasetName, onChange: function (e) { return setDatasetName(e.target.value); }, placeholder: "Enter dataset name", size: "md", flex: 1 }), _jsx(Button, { colorScheme: "blue", onClick: function () { return saveDataset(dataset1, datasetName || "Dataset_".concat(new Date().toLocaleTimeString())); }, children: "Save Dataset" })] })] })), savedDatasets.length > 0 && (_jsxs(Box, { children: [_jsx(Text, { fontSize: "sm", fontWeight: "medium", mb: 2, children: "Select dataset for analysis:" }), _jsx(Box, { maxHeight: 200, overflowY: "auto", borderWidth: 1, borderColor: "gray.200", borderRadius: "lg", children: savedDatasets.map(function (dataset) { return (_jsxs(Box, { p: 2, borderBottomWidth: 1, borderBottomColor: "gray.100", _hover: { bg: "gray.50" }, display: "flex", alignItems: "center", justifyContent: "space-between", children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center' }, children: [_jsx(Checkbox, { isChecked: selectedDatasetId === dataset.id, onChange: function () { return handleHistoryDatasetSelect(dataset.id); }, mr: 2 }), _jsxs("div", { children: [_jsx(Text, { fontSize: "sm", fontWeight: "medium", children: dataset.name }), _jsxs(Text, { fontSize: "xs", color: "gray.500", children: [dataset.data.length, " observations \u00B7 ", new Date(dataset.timestamp).toLocaleString()] })] })] }), _jsx(Button, { size: "xs", colorScheme: "red", onClick: function () { return deleteDataset(dataset.id); }, children: "Delete" })] }, dataset.id)); }) })] })), selectedDatasetId && (_jsxs(Box, { mt: 3, p: 3, borderWidth: 1, borderColor: "green.200", borderRadius: "lg", bg: "green.50", children: [_jsx(Text, { fontSize: "sm", fontWeight: "medium", children: "Currently selected dataset:" }), _jsx(Text, { fontSize: "sm", children: (_a = savedDatasets.find(function (d) { return d.id === selectedDatasetId; })) === null || _a === void 0 ? void 0 : _a.name }), _jsxs(Text, { fontSize: "sm", children: ["Number of data points: ", getSelectedDataset(selectedDatasetId).length] })] })), savedDatasets.length === 0 && (_jsxs(Alert, { status: "info", mb: 4, size: "sm", children: [_jsx(AlertIcon, {}), "No saved datasets yet. Generate data to save"] }))] }), _jsxs(Box, { bg: "white", p: 4, borderRadius: "lg", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", children: [_jsx(Heading, { as: "h2", size: "md", mb: 3, color: "blue.600", children: "Statistical Analysis" }), (currentDataset.length > 0) && (_jsxs(Box, { mb: 4, p: 3, borderWidth: 1, borderColor: "green.200", borderRadius: "lg", bg: "green.50", children: [_jsx(Text, { fontSize: "sm", fontWeight: "medium", children: "Currently using dataset:" }), selectedDatasetId ? (_jsxs(Text, { fontSize: "sm", children: ["Name: ", (_b = savedDatasets.find(function (d) { return d.id === selectedDatasetId; })) === null || _b === void 0 ? void 0 : _b.name] })) : null, basicStats && (_jsxs(Box, { mt: 2, children: [_jsxs(Grid, { gridTemplateColumns: "repeat(2, 1fr)", gap: 2, children: [_jsxs(Text, { fontSize: "sm", children: ["Count: ", basicStats.count] }), _jsxs(Text, { fontSize: "sm", children: ["Mean: ", basicStats.mean.toFixed(4)] }), _jsxs(Text, { fontSize: "sm", children: ["Standard Deviation: ", basicStats.std.toFixed(4)] }), _jsxs(Text, { fontSize: "sm", children: ["Median: ", basicStats.median.toFixed(4)] }), _jsxs(Text, { fontSize: "sm", children: ["Minimum: ", basicStats.min.toFixed(4)] }), _jsxs(Text, { fontSize: "sm", children: ["Maximum: ", basicStats.max.toFixed(4)] }), basicStats.count >= 30 && (_jsxs(_Fragment, { children: [_jsxs(Text, { fontSize: "sm", children: ["Skewness: ", basicStats.skewness.toFixed(4)] }), _jsxs(Text, { fontSize: "sm", children: ["Kurtosis: ", basicStats.kurtosis.toFixed(4)] })] }))] }), !isDatasetGenerated && !dataset1Distribution && isLikelyNormal !== null && (_jsxs(Text, { fontSize: "sm", mt: 2, color: isLikelyNormal ? "blue.600" : "orange.600", children: ["Data Distribution Hint: ", isLikelyNormal
                                                ? "Data likely follows normal distribution, parametric methods can be considered for statistical analysis"
                                                : "Data may not follow normal distribution, distribution testing or non-parametric methods are recommended"] }))] }))] })), _jsxs(Tabs, { isFitted: true, variant: "enclosed", children: [_jsxs(TabList, { mb: 4, children: [_jsx(Tab, { children: "Basic Statistics" }), _jsx(Tab, { children: "Confidence Intervals" }), _jsx(Tab, { children: "MLE & MOM" }), _jsx(Tab, { children: "Hypothesis Testing" }), _jsx(Tab, { children: "Sample Size Calculation" })] }), _jsxs(TabPanels, { children: [_jsx(TabPanel, { children: _jsx(BasicStatisticsTab, { dataset: selectedDatasetId ? getSelectedDataset(selectedDatasetId) : dataset1, basicStats: basicStats }) }), _jsx(TabPanel, { children: _jsx(ConfidenceIntervalsContainer, { dataset: currentDataset, dataset2: dataset2, pairedData: pairedData ? { before: pairedData.sample1, after: pairedData.sample2 } : undefined, isGeneratedDataset: !selectedDatasetId && isDatasetGenerated, distributionInfo: !selectedDatasetId && dataset1Distribution || undefined, basicStats: basicStats }) }), _jsx(TabPanel, { children: _jsx(MLEMoMTab, { dataset: currentDataset, distribution: !selectedDatasetId ? dataset1Distribution : null, isGeneratedDataset: !selectedDatasetId, basicStats: basicStats }) }), _jsx(TabPanel, { children: _jsx(HypothesisTestingTab, { dataset: currentDataset, dataset2: dataset2, pairedData: pairedData && pairedData.sample1.length > 0 && pairedData.sample2.length > 0 ? { before: pairedData.sample1, after: pairedData.sample2 } : undefined, isGeneratedDataset: !selectedDatasetId, distributionInfo: dataset1Distribution, basicStats: basicStats }) }), _jsx(TabPanel, { children: _jsx(SampleSizeCalculator, { basicStats: basicStats }) })] })] })] }), dataset1.length === 0 && (_jsxs(Alert, { status: "info", mb: 4, size: "sm", children: [_jsx(AlertIcon, {}), "Please generate data first using the data generator above"] }))] }));
};
export default StatisticsApp;
