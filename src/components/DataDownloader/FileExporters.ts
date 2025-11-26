/**
 * File export utility functions
 * Supports data export in CSV, JSON, and XLSX formats
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
 * Export data to CSV format
 * @param data Data object to export
 * @param filename Filename
 */
export function exportToCSV(data: ExportData, filename: string): void {
  if (!data.rawData || data.rawData.length === 0) {
    throw new Error('No data to export');
  }

  // For CSV, we directly export the raw data array
  const exportArray = data.rawData;
  
  // Get all possible keys
  const headers = new Set<string>();
  exportArray.forEach(item => {
    if (typeof item === 'object' && item !== null) {
      Object.keys(item).forEach(key => headers.add(key));
    }
  });

  const headerArray = Array.from(headers);
  
  // Build CSV content
  let csvContent = headerArray.join(',') + '\n';
  
  exportArray.forEach(item => {
    const row = headerArray.map(header => {
      const value = item[header];
      // Handle values containing commas, quotes or newlines
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value !== undefined && value !== null ? value : '';
    });
    csvContent += row.join(',') + '\n';
  });

  // Create Blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadFile(blob, filename);
}

/**
 * Export data to JSON format
 * @param data Data object to export
 * @param filename Filename
 */
export function exportToJSON(data: ExportData, filename: string): void {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  downloadFile(blob, filename);
}

/**
 * Export data to XLSX format (simplified implementation, generates tab-separated text)
 * @param data Data object to export
 * @param filename Filename
 */
export function exportToXLSX(data: ExportData, filename: string): void {
  if (!data.rawData || data.rawData.length === 0) {
    throw new Error('No data to export');
  }

  // For XLSX, we directly export the raw data array
  const exportArray = data.rawData;
  
  // Get all possible keys
  const headers = new Set<string>();
  exportArray.forEach(item => {
    if (typeof item === 'object' && item !== null) {
      Object.keys(item).forEach(key => headers.add(key));
    }
  });

  const headerArray = Array.from(headers);
  
  // Build TSV content (tab-separated, Excel recognizable)
  let tsvContent = headerArray.join('\t') + '\n';
  
  exportArray.forEach(item => {
    const row = headerArray.map(header => {
      const value = item[header];
      return value !== undefined && value !== null ? value : '';
    });
    tsvContent += row.join('\t') + '\n';
  });

  // Create Blob and download
  const blob = new Blob([tsvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  downloadFile(blob, filename);
}

/**
 * Generate default filename
 * @param analysisType Analysis type
 * @param datasetInfo Dataset information (optional)
 * @param format File format (optional)
 * @returns Generated default filename
 */
export function generateDefaultFilename(analysisType: string, datasetInfo?: string, format?: string): string {
  const timestamp = new Date().toISOString()
    .replace(/[:.]/g, '')
    .slice(0, 14); // Format: YYYYMMDDHHmmss
  
  let filename = `${analysisType}_${timestamp}`;
  
  if (datasetInfo) {
    // Clean dataset info, remove characters that might cause filename issues
    const cleanDatasetInfo = datasetInfo.replace(/[^a-zA-Z0-9_]/g, '_');
    filename += `_${cleanDatasetInfo}`;
  }
  
  if (format) {
    filename += `.${format}`;
  }
  
  return filename;
}

/**
 * Generic file download function
 * @param blob File Blob object
 * @param filename Filename
 */
function downloadFile(blob: Blob, filename: string): void {
  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.href = url;
  link.download = filename;
  
  // Simulate click to download
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}