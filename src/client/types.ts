// Shared type definitions

// Basic statistics interface
export interface BasicStats {
  mean: number;
  std: number;
  variance?: number;
  median: number;
  skewness: number;
  kurtosis: number;
  count: number;
  min: number;
  max: number;
  mode?: number | number[];
};

// Distribution information interface
export interface DistributionInfo {
  type: string;
  name: string;
  formula?: string;
  parameters?: Record<string, number | string>;
};

// Data input panel props interface
export interface DataInputPanelProps {
  onDataChange: (data: number[], distribution?: DistributionInfo | null) => void;
};

// File uploader props interface
export interface FileUploaderProps {
  onDataChange: (data: number[], distribution?: DistributionInfo | null) => void;
};

// Distribution generator props interface
export interface DistributionGeneratorProps {
  onDataChange: (data: number[], distribution?: DistributionInfo | null) => void;
};

// AI data generator props interface
export interface AIDataGeneratorProps {
  onDataChange: (data: number[], distribution?: DistributionInfo | null) => void;
};

// Basic statistics tab props interface
export interface BasicStatisticsTabProps {
  dataset: number[];
};

// MLE/MoM tab props interface
export interface MLEMoMTabProps {
  dataset: number[];
  distribution: DistributionInfo | null;
  isGeneratedDataset?: boolean;
  basicStats?: BasicStats | null;
};

// Confidence intervals container props interface
export interface ConfidenceIntervalsContainerProps {
  dataset: number[];
  dataset2?: number[];
  pairedData?: { before: number[]; after: number[] };
  isGeneratedDataset?: boolean;
  distributionInfo?: DistributionInfo | null;
  basicStats?: BasicStats | null;
};

// Hypothesis testing props interface
export interface HypothesisTestingTabProps {
  dataset: number[];
  dataset2?: number[];
  pairedData?: { before: number[]; after: number[] };
  isGeneratedDataset?: boolean;
  distributionInfo?: DistributionInfo | null;
  basicStats?: BasicStats | null;
};

// Distribution parameter interface
export interface DistributionParam {
  name: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
};

// Distribution configuration interface
export interface DistributionConfig {
  name: string;
  params: DistributionParam[];
  formula?: string;
};

// Parameter estimation result interface
export interface EstimationResult {
  method: string;
  params: Record<string, number>;
};