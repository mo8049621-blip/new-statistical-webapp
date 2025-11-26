import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useToast
} from '@chakra-ui/react';
import { DownloadOptions as DownloadOptionsType, ModuleSelection } from './types.ts';
import { generateDefaultFilename } from './FileExporters.ts';
import { useAnalysisResult } from '../../hooks/useAnalysisResult.ts';

interface DownloadOptionsProps {
  analysisType: string;
  datasetInfo?: string;
  onDownload: (options: DownloadOptionsType) => void;
  onClose: () => void;
  isSaveMode?: boolean;
}

// Supported modules list
const SUPPORTED_MODULES: ModuleSelection[] = [
  { id: 'BasicStatisticsTab', name: 'Basic Statistics', selected: true },
  { id: 'HypothesisTestingTab', name: 'Hypothesis Testing', selected: true },
  { id: 'PowerFunction', name: 'Power Function', selected: true },
  { id: 'ConfidenceIntervalsContainer', name: 'Confidence Intervals', selected: true },
  { id: 'MLEAndMOMModule', name: 'MLE/MOM Estimation', selected: true },
  { id: 'SampleSizeCalculationModule', name: 'Sample Size Calculation', selected: true }
];

const DownloadOptions: React.FC<DownloadOptionsProps> = ({
  analysisType,
  datasetInfo,
  onDownload,
  onClose,
  isSaveMode = false
}) => {
  const [format, setFormat] = useState<'csv' | 'json' | 'xlsx'>('csv');
  const [includeRawData, setIncludeRawData] = useState(true);
  const [includeAnalysisResults, setIncludeAnalysisResults] = useState(true);
  const [filename, setFilename] = useState('');
  const [modules, setModules] = useState<ModuleSelection[]>(SUPPORTED_MODULES);
  const toast = useToast();
  const { saveResult, generateDefaultName } = useAnalysisResult();

  // Generate default filename
  useEffect(() => {
    const defaultName = generateDefaultFilename(analysisType, datasetInfo, format);
    setFilename(defaultName);
  }, [analysisType, datasetInfo, format]);

  // Handle module selection change
  const handleModuleChange = (moduleId: string, selected: boolean) => {
    setModules(prev => 
      prev.map(module => 
        module.id === moduleId ? { ...module, selected } : module
      )
    );
  };

  // Select all/unselect all
  const handleSelectAll = (selected: boolean) => {
    setModules(prev => 
      prev.map(module => ({ ...module, selected }))
    );
  };

  // Select raw data only
  const handleSelectRawDataOnly = () => {
    setIncludeRawData(true);
    setIncludeAnalysisResults(false);
  };

  // Select analysis results only
  const handleSelectAnalysisResultsOnly = () => {
    setIncludeRawData(false);
    setIncludeAnalysisResults(true);
  };

  // Handle save
  const handleSave = () => {
    try {
      // Assume data for saving is prepared in parent component
      toast({
        title: 'Save Successful',
        description: `Analysis result has been saved as: ${filename}`,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      onClose();
    } catch (error: any) {
      toast({
        title: 'Save Failed',
        description: error.message || 'Unknown error',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  // Handle download
  const handleDownload = () => {
    const options: DownloadOptionsType = {
      format,
      includeRawData,
      includeAnalysisResults,
      filename: filename || generateDefaultFilename(analysisType, datasetInfo, format)
    };
    onDownload(options);
    toast({
      title: 'Download Started',
      description: `Downloading file: ${options.filename}`,
      status: 'info',
      duration: 2000,
      isClosable: true
    });
    onClose();
  };

  return (
    <Box p={6} maxW="500px" mx="auto">
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        {isSaveMode ? 'Save Analysis Result' : 'Export Data'}
      </Text>

      {/* Content Selection */}
      <FormControl mb={4}>
        <FormLabel fontWeight="bold">Content Selection</FormLabel>
        <Stack spacing={2} mb={2}>
          <Checkbox 
            isChecked={includeRawData}
            onChange={(e) => setIncludeRawData(e.target.checked)}
          >
            Include Raw Data
          </Checkbox>
          <Checkbox 
            isChecked={includeAnalysisResults}
            onChange={(e) => setIncludeAnalysisResults(e.target.checked)}
          >
            Include Analysis Results
          </Checkbox>
        </Stack>
        <Stack direction="row" gap={2} mb={4}>
          <Button size="sm" variant="ghost" onClick={() => handleSelectAll(true)}>
            Select All
          </Button>
          <Button size="sm" variant="ghost" onClick={handleSelectRawDataOnly}>
            Raw Data Only
          </Button>
          <Button size="sm" variant="ghost" onClick={handleSelectAnalysisResultsOnly}>
            Analysis Results Only
          </Button>
        </Stack>
        
        {/* Module Selection */}
        <FormLabel mt={2} fontWeight="medium">Select Modules (Analysis Results Only)</FormLabel>
        <Box maxH="200px" overflowY="auto" border="1px" borderColor="gray.200" rounded="md" p={2}>
          <Stack spacing={1}>
            {modules.map(module => (
              <Checkbox
                key={module.id}
                isChecked={module.selected}
                onChange={(e) => handleModuleChange(module.id, e.target.checked)}
                isDisabled={!includeAnalysisResults}
              >
                {module.name}
              </Checkbox>
            ))}
          </Stack>
        </Box>
      </FormControl>

      {/* Format Selection */}
      <FormControl mb={4}>
        <FormLabel fontWeight="bold">Format Selection</FormLabel>
        <RadioGroup value={format} onChange={(value: any) => setFormat(value)}>
          <Stack spacing={2} direction="row">
            <Radio value="csv" colorScheme="blue">CSV</Radio>
            <Radio value="json" colorScheme="blue">JSON</Radio>
            <Radio value="xlsx" colorScheme="blue">XLSX</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>

      {/* Filename Setting */}
      <FormControl mb={6}>
        <FormLabel fontWeight="bold">Filename</FormLabel>
        <Input 
          value={filename} 
          onChange={(e) => setFilename(e.target.value)} 
          maxLength={50}
          placeholder="Enter filename"
        />
        <Text fontSize="sm" color="gray.500">{filename.length}/50</Text>
      </FormControl>

      {/* Action Buttons */}
      <Stack direction="row" justify="flex-end" gap={2}>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          colorScheme="blue" 
          onClick={isSaveMode ? handleSave : handleDownload}
          disabled={!includeRawData && !includeAnalysisResults}
        >
          {isSaveMode ? 'Confirm Save' : 'Confirm Export'}
        </Button>
      </Stack>
    </Box>
  );
};

export default DownloadOptions;