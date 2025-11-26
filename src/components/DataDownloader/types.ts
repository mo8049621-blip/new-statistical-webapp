/**
 * Type definitions for Data Analysis Download functionality
 */

/**
 * Export data structure interface
 */
export interface ExportData {
  rawData: any[] | null;
  analysisResults: any | null;
  metadata: any;
}

/**
 * Analysis result interface
 */
export interface AnalysisResult {
  id: string;             // Unique identifier
  name: string;           // Custom name
  analysisType: string;   // Analysis type
  data: any;              // Raw data
  results: any;           // Analysis results
  parameters: any;        // Analysis parameters
  timestamp: number;      // Save timestamp
  format?: string;        // File format preference
}

/**
 * Download options interface
 */
export interface DownloadOptions {
  format: 'csv' | 'json' | 'xlsx'; // Export format
  includeRawData: boolean;         // Whether to include raw data
  includeAnalysisResults: boolean; // Whether to include analysis results
  filename: string;                // Filename
}

/**
 * Module selection item
 */
export interface ModuleSelection {
  id: string;             // Module ID
  name: string;           // Module name
  selected: boolean;      // Whether selected
}

/**
 * DataDownloader component Props
 */
export interface DataDownloaderProps {
  data: any;                      // Raw dataset
  analysisResults: any;           // Analysis result data
  analysisType: string;           // Analysis type identifier
  datasetInfo?: string;           // Dataset information
  parameters?: any;               // Analysis parameter configuration
  buttonText?: string;            // Button text
  buttonVariant?: string;         // Button variant
  showSaveButton?: boolean;       // Whether to show save button
  className?: string;             // CSS class name
}

/**
 * AnalysisResultProvider Props
 */
export interface AnalysisResultProviderProps {
  children: React.ReactNode;
}

/**
 * AnalysisResultContext interface
 */
export interface AnalysisResultContextType {
  // State
  analysisResults: AnalysisResult[];
  currentResult: AnalysisResult | null;
  
  // Operation methods
  saveResult: (data: {
    name: string;
    analysisType: string;
    data: any;
    results: any;
    parameters: any;
    format?: string;
  }) => string;
  
  loadResult: (id: string) => void;
  
  updateResultName: (id: string, newName: string) => void;
  
  deleteResult: (id: string) => void;
  
  clearAllResults: () => void;
  
  // Helper methods
  generateUniqueId: () => string;
  
  generateDefaultName: (analysisType: string) => string;
}