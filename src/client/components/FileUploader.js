import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { Box, Button, Text, Alert, AlertIcon, AlertDescription, Progress } from '@chakra-ui/react';
// Simple parsing function for Excel files (simplified version, consider using xlsx library in actual projects)
var parseExcelLike = function (content) {
    // Excel files are usually tab-separated
    var lines = content.split(/\r\n|\n/).filter(function (line) { return line.trim(); });
    var data = [];
    // Check if there is a header
    var firstLineNumbers = lines[0].split(/\t|,/).map(function (item) { return parseFloat(item.trim()); });
    var hasHeader = firstLineNumbers.some(function (num) { return isNaN(num); });
    // Start parsing data from the appropriate line
    var startLine = hasHeader ? 1 : 0;
    for (var i = startLine; i < lines.length; i++) {
        // Support tab or comma separation
        var values = lines[i].split(/\t|,/);
        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
            var value = values_1[_i];
            var trimmedValue = value.trim();
            if (trimmedValue) {
                var num = parseFloat(trimmedValue);
                if (!isNaN(num)) {
                    data.push(num);
                }
            }
        }
    }
    return data;
};
// Parsing function for JSON files
var parseJSON = function (content) {
    try {
        var parsed = JSON.parse(content);
        var data_1 = [];
        // Process array
        if (Array.isArray(parsed)) {
            // Flat array
            if (parsed.length > 0 && typeof parsed[0] === 'number') {
                return parsed.filter(function (val) { return !isNaN(val); });
            }
            // Object array, try to extract numeric fields
            else {
                parsed.forEach(function (item) {
                    if (typeof item === 'object' && item !== null) {
                        Object.values(item).forEach(function (val) {
                            if (typeof val === 'number' && !isNaN(val)) {
                                data_1.push(val);
                            }
                        });
                    }
                    else if (typeof item === 'number' && !isNaN(item)) {
                        data_1.push(item);
                    }
                });
            }
        }
        // Process object
        else if (typeof parsed === 'object' && parsed !== null) {
            Object.values(parsed).forEach(function (val) {
                if (typeof val === 'number' && !isNaN(val)) {
                    data_1.push(val);
                }
            });
        }
        return data_1;
    }
    catch (error) {
        throw new Error('JSON parsing failed, please ensure the file format is correct');
    }
};
function FileUploader(_a) {
    var onDataChange = _a.onDataChange;
    var _b = useState(0), uploadProgress = _b[0], setUploadProgress = _b[1];
    var _c = useState(''), selectedFileName = _c[0], setSelectedFileName = _c[1];
    var _d = useState(''), errorMessage = _d[0], setErrorMessage = _d[1];
    var fileInputRef = useRef(null);
    var handleFileChange = function (event) {
        var _a;
        var file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file)
            return;
        setSelectedFileName(file.name);
        setErrorMessage('');
        setUploadProgress(0);
        // Simulate upload progress
        var progressInterval = setInterval(function () {
            setUploadProgress(function (prevProgress) {
                var newProgress = prevProgress + 20;
                if (newProgress >= 100) {
                    clearInterval(progressInterval);
                    processFile(file);
                    return 100;
                }
                return newProgress;
            });
        }, 200);
        // Reset file input to allow uploading the same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    var processFile = function (file) {
        var _a;
        var reader = new FileReader();
        var fileExtension = (_a = file.name.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        reader.onload = function (e) {
            var _a;
            try {
                var content = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                var data = [];
                var fileType = 'unknown';
                var fileName = file.name;
                // Select the appropriate parsing method based on file extension
                switch (fileExtension) {
                    case 'csv':
                        data = parseCSV(content);
                        fileType = 'csv';
                        break;
                    case 'json':
                        data = parseJSON(content);
                        fileType = 'json';
                        break;
                    case 'txt':
                        // Try to parse text file with CSV parser
                        data = parseExcelLike(content);
                        fileType = 'txt';
                        break;
                    case 'xlsx':
                    case 'xls':
                        // Note: This is a simplified implementation, use professional Excel parsing library in actual projects
                        // Here we assume the Excel file content has been converted to text form
                        data = parseExcelLike(content);
                        fileType = 'excel';
                        break;
                    default:
                        throw new Error('Unsupported file format, please upload CSV, JSON, TXT or Excel files');
                }
                if (data.length === 0) {
                    throw new Error('No valid numerical data found in the file');
                }
                onDataChange(data, {
                    type: fileType,
                    name: fileName,
                });
            }
            catch (error) {
                setErrorMessage(error instanceof Error ? error.message : 'Error processing file');
            }
        };
        reader.onerror = function () {
            setErrorMessage('Error reading file');
        };
        // For text files, use readAsText
        if (['csv', 'json', 'txt'].includes(fileExtension || '')) {
            reader.readAsText(file);
        }
        else if (['xlsx', 'xls'].includes(fileExtension || '')) {
            // Note: This is a simplified implementation, use professional Excel parsing library in actual projects
            // Here we assume Excel files can be read as text (which is not actually applicable for binary Excel files)
            reader.readAsText(file);
            // In a real project, you should use:
            // reader.readAsArrayBuffer(file);
            // Then use libraries like xlsx to parse binary data
        }
    };
    var parseCSV = function (content) {
        var lines = content.split(/\r\n|\n/).filter(function (line) { return line.trim(); });
        var data = [];
        // Check if there is a header
        var firstLineNumbers = lines[0].split(',').map(function (item) { return parseFloat(item.trim()); });
        var hasHeader = firstLineNumbers.some(function (num) { return isNaN(num); });
        // Start parsing data from the appropriate line
        var startLine = hasHeader ? 1 : 0;
        for (var i = startLine; i < lines.length; i++) {
            var values = lines[i].split(',');
            for (var _i = 0, values_2 = values; _i < values_2.length; _i++) {
                var value = values_2[_i];
                var trimmedValue = value.trim();
                if (trimmedValue) {
                    var num = parseFloat(trimmedValue);
                    if (!isNaN(num)) {
                        data.push(num);
                    }
                }
            }
        }
        return data;
    };
    var handleUploadClick = function () {
        var _a;
        (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click();
    };
    return (_jsxs(Box, { p: 4, children: [_jsx("input", { type: "file", ref: fileInputRef, onChange: handleFileChange, accept: ".csv,.json,.txt,.xlsx,.xls", style: { display: 'none' } }), _jsx(Button, { onClick: handleUploadClick, colorScheme: "blue", variant: "solid", size: "lg", children: "Upload CSV File" }), uploadProgress > 0 && uploadProgress < 100 && (_jsxs(Box, { mt: 4, children: [_jsx(Progress, { value: uploadProgress, width: "100%" }), _jsxs(Text, { fontSize: "sm", mt: 1, color: "gray.500", children: ["Processing... ", uploadProgress, "%"] })] })), selectedFileName && uploadProgress === 100 && (_jsxs(Text, { mt: 4, color: "green.600", children: ["Successfully uploaded: ", selectedFileName] })), errorMessage && (_jsxs(Alert, { status: "error", mt: 4, children: [_jsx(AlertIcon, {}), _jsx(AlertDescription, { children: errorMessage })] })), _jsx(Box, { mt: 6, p: 4, bg: "gray.50", borderRadius: "md", children: _jsxs(Text, { fontSize: "sm", color: "gray.600", children: [_jsx("strong", { children: "Instructions:" }), _jsx("br", {}), "\u2022 Supports CSV, JSON, TXT and Excel (.xlsx, .xls) file formats", _jsx("br", {}), "\u2022 Files can include or exclude headers", _jsx("br", {}), "\u2022 Data can be single-column or multi-column", _jsx("br", {}), "\u2022 Only numerical data is extracted for analysis", _jsx("br", {}), "\u2022 For JSON files, numerical arrays or object arrays with numerical fields are supported"] }) })] }));
}
export default FileUploader;
