import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AnalysisResult, AnalysisResultContextType, AnalysisResultProviderProps } from '../DataDownloader/types';

// Create Context
export const AnalysisResultContext = createContext<AnalysisResultContextType | undefined>(undefined);

// Storage key name
const STORAGE_KEY = 'analysis_results';
// Maximum saved count
const MAX_RESULTS = 20;
// Maximum size per result (50MB)
const MAX_RESULT_SIZE = 50 * 1024 * 1024;

/**
 * Analysis Result Provider Component
 */
export const AnalysisResultProvider: React.FC<AnalysisResultProviderProps> = ({ children }) => {
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);

  // Load data from localStorage
  useEffect(() => {
    try {
      const storedResults = localStorage.getItem(STORAGE_KEY);
      if (storedResults) {
        const parsedResults = JSON.parse(storedResults);
        if (Array.isArray(parsedResults)) {
          setAnalysisResults(parsedResults);
        }
      }
    } catch (error) {
      console.error('Failed to load analysis results from localStorage:', error);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(analysisResults));
    } catch (error) {
      console.error('Failed to save analysis results to localStorage:', error);
    }
  }, [analysisResults]);

  /**
   * Generate unique ID
   */
  const generateUniqueId = (): string => {
    return `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  /**
   * Generate default name
   */
  const generateDefaultName = (analysisType: string): string => {
    const timestamp = new Date().toLocaleString();
    return `${analysisType} - ${timestamp}`;
  };

  /**
   * Check if result size exceeds limit
   */
  const checkResultSize = (result: any): boolean => {
    const resultSize = new Blob([JSON.stringify(result)]).size;
    return resultSize <= MAX_RESULT_SIZE;
  };

  /**
   * Save analysis result
   */
  const saveResult = (data: {
    name: string;
    analysisType: string;
    data: any;
    results: any;
    parameters: any;
    format?: string;
  }): string => {
    // 检查存储空间是否已满
    if (analysisResults.length >= MAX_RESULTS) {
      throw new Error(`Maximum number of saved results (${MAX_RESULTS}) reached, please delete some old data`);
    }

    const newResult: AnalysisResult = {
      id: generateUniqueId(),
      name: data.name,
      analysisType: data.analysisType,
      data: data.data,
      results: data.results,
      parameters: data.parameters,
      format: data.format,
      timestamp: Date.now()
    };

    // 检查结果大小
    if (!checkResultSize(newResult)) {
      throw new Error('Analysis result is too large, please simplify data before saving');
    }

    // 添加到列表开头（最新的在前）
    setAnalysisResults(prev => [newResult, ...prev]);
    
    return newResult.id;
  };

  /**
   * Load analysis result
   */
  const loadResult = (id: string): void => {
    const result = analysisResults.find(r => r.id === id);
    if (result) {
      setCurrentResult(result);
    } else {
      throw new Error('Specified analysis result not found');
    }
  };

  /**
   * Update analysis result name
   */
  const updateResultName = (id: string, newName: string): void => {
    setAnalysisResults(prev => prev.map(result => 
      result.id === id ? { ...result, name: newName } : result
    ));
  };

  /**
   * Delete analysis result
   */
  const deleteResult = (id: string): void => {
    setAnalysisResults(prev => prev.filter(result => result.id !== id));
    // 如果当前加载的结果被删除，则清空当前结果
    if (currentResult?.id === id) {
      setCurrentResult(null);
    }
  };

  /**
   * Clear all analysis results
   */
  const clearAllResults = (): void => {
    setAnalysisResults([]);
    setCurrentResult(null);
  };

  const contextValue: AnalysisResultContextType = {
    analysisResults,
    currentResult,
    saveResult,
    loadResult,
    updateResultName,
    deleteResult,
    clearAllResults,
    generateUniqueId,
    generateDefaultName
  };

  return (
    <AnalysisResultContext.Provider value={contextValue}>
      {children}
    </AnalysisResultContext.Provider>
  );
};