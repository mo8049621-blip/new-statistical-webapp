import { useContext } from 'react';
import { AnalysisResultContext } from '../components/AnalysisResultManager/AnalysisResultContext';
import { AnalysisResultContextType } from '../components/DataDownloader/types';

/**
 * 分析结果管理Hook
 * 提供对分析结果的保存、获取、切换、删除等操作
 */
export function useAnalysisResult(): AnalysisResultContextType {
  const context = useContext(AnalysisResultContext);
  
  if (!context) {
    throw new Error('useAnalysisResult must be used within an AnalysisResultProvider');
  }
  
  return context;
}