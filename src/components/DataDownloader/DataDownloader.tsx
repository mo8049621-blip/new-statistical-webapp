import React, { useState } from 'react';
import { Button, Modal, ModalContent, ModalHeader, Text, ModalCloseButton, ModalOverlay } from '@chakra-ui/react';
import { DataDownloaderProps, DownloadOptions as DownloadOptionsType } from './types.ts';
import { exportToCSV, exportToJSON, exportToXLSX } from './FileExporters.ts';
import DownloadOptions from './DownloadOptions';
import { useAnalysisResult } from '../../hooks/useAnalysisResult';

const DataDownloader: React.FC<DataDownloaderProps> = ({
  data,
  analysisResults,
  analysisType,
  datasetInfo,
  buttonText = 'Export Data',
  buttonVariant = 'primary',
  showSaveButton = true,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaveMode, setIsSaveMode] = useState(false);
  const { saveResult } = useAnalysisResult();

  // Handle export operation
  const handleDownload = (options: DownloadOptionsType) => {
    try {
      // Prepare data for export based on options
      const exportData = {
        rawData: options.includeRawData ? data : null,
        analysisResults: options.includeAnalysisResults ? analysisResults : null,
        metadata: {
          analysisType,
          datasetInfo,
          exportTime: new Date().toISOString(),
          exportOptions: options
        }
      };

      // Select export method based on format
      switch (options.format) {
        case 'csv':
          exportToCSV(exportData, options.filename);
          break;
        case 'json':
          exportToJSON(exportData, options.filename);
          break;
        case 'xlsx':
          exportToXLSX(exportData, options.filename);
          break;
        default:
          throw new Error(`Unsupported export format: ${options.format}`);
      }

      // Optional: Log export history
      // logExportHistory({ analysisType, format: options.format, timestamp: new Date() });
    } catch (error: any) {
      console.error('Export failed:', error);
      throw new Error(`Export failed: ${error.message || 'Unknown error'}`);
    }
  };

  // Handle saving analysis result
  const handleSave = () => {
    try {
      // Prepare data for saving
      const saveData = {
        name: `${analysisType}_${datasetInfo || 'unnamed'}_${new Date().toISOString().split('T')[0]}`,
        analysisType,
        data,
        results: analysisResults,
        parameters: {} // Removed undefined variable reference
      };

      // Save result using Context
      saveResult(saveData);
      
    } catch (error: any) {
      console.error('Save failed:', error);
      throw new Error(`Save failed: ${error.message || 'Unknown error'}`);
    }
  };

  // Open export options
  const openExportOptions = () => {
    setIsSaveMode(false);
    setIsOpen(true);
  };

  // Open save options
  const openSaveOptions = () => {
    setIsSaveMode(true);
    setIsOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsOpen(false);
  };

  // Handle confirm operation
  const handleConfirm = (options: DownloadOptionsType) => {
    if (isSaveMode) {
      // In save mode, update the name of the saved data
      const saveData = {
        name: options.filename,
        analysisType,
        data,
        results: analysisResults,
        parameters: {}
      };
      saveResult(saveData);
    } else {
      // In export mode
      handleDownload(options);
    }
  };

  return (
    <>
      {/* Action buttons */}
      <div className={className}>
        <Button
          onClick={openExportOptions}
          variant={buttonVariant}
          mr={showSaveButton ? 2 : 0}
        >
          {buttonText}
        </Button>
        
        {showSaveButton && (
          <Button
            onClick={openSaveOptions}
            variant={buttonVariant === 'primary' ? 'secondary' : 'primary'}
          >
            Save Result
          </Button>
        )}
      </div>

      {/* Export/Save options modal */}
      <Modal isOpen={isOpen} onClose={closeModal} isCentered>
        <ModalOverlay />
        <ModalContent maxW="550px">
          <ModalHeader>
            <Text fontSize="xl" fontWeight="bold">
              {isSaveMode ? 'Save Analysis Result' : 'Export Data'}
            </Text>
            <ModalCloseButton />
          </ModalHeader>
          
          <DownloadOptions
            analysisType={analysisType}
            datasetInfo={datasetInfo}
            onDownload={handleConfirm}
            onClose={closeModal}
            isSaveMode={isSaveMode}
          />
        </ModalContent>
      </Modal>
    </>
  );
};

export default DataDownloader;