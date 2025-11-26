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

// Tail type for confidence intervals
export type TailType = 'two-tailed' | 'left-tailed' | 'right-tailed';

// Confidence intervals container props interface
export interface ConfidenceIntervalsContainerProps {
  dataset: number[];
  dataset2?: number[];
  pairedData?: { before: number[]; after: number[] };
  isGeneratedDataset?: boolean;
  distributionInfo?: DistributionInfo | null;
  basicStats?: BasicStats | null;
  tailType?: TailType;
  onTailTypeChange?: (tailType: TailType) => void;
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

// Confidence interval result interface
export interface ConfidenceIntervalResult {
  lowerBound: number;
  upperBound: number;
  tailType: TailType;
  confidenceLevel: number;
  method: string;
};

// Goodness-of-fit test interfaces
export type GoFTestType = 'kolmogorov-smirnov' | 'chi-square' | 'anderson-darling' | 'shapiro-wilk' | 'jarque-bera';

export type DistributionTypeForGoF = 'normal' | 'uniform' | 'exponential' | 'poisson' | 'gamma' | 'beta' | 'lognormal' | 'weibull' | 'binomial';

// Goodness-of-fit test result interface
export interface GoFTestResult {
  testType: GoFTestType;
  distributionType: DistributionTypeForGoF;
  statistic: number;
  pValue: number;
  criticalValue?: number;
  significanceLevel: number;
  isReject: boolean;
  sampleSize: number;
  degreesOfFreedom?: number;
  confidenceLevel?: number;
  testDetails?: {
    method: string;
    assumptions: string[];
    notes?: string;
  };
}

// Goodness-of-fit test parameters interface
export interface GoFTestParams {
  testType: GoFTestType;
  distributionType: DistributionTypeForGoF;
  significanceLevel: number;
  estimatedParameters?: Record<string, number>;
  customParameters?: Record<string, number>;
  binCount?: number;
  theoreticalBins?: { min: number; max: number; expected: number; observed: number }[];
}

// Goodness-of-fit test component props interface
export interface GoodnessOfFitTestProps {
  dataset: number[];
  isGeneratedDataset?: boolean;
  distributionInfo?: DistributionInfo | null;
  basicStats?: BasicStats | null;
  onTestComplete?: (result: GoFTestResult) => void;
};

// Test distribution option interface
export interface TestDistributionOption {
  type: DistributionTypeForGoF;
  name: string;
  description: string;
  supportedTests: GoFTestType[];
  requiresParameterEstimation: boolean;
  parameterNames: string[];
  formula?: string;
}

// Test method option interface
export interface TestMethodOption {
  type: GoFTestType;
  name: string;
  description: string;
  applicableDistributions: DistributionTypeForGoF[];
  assumptions: string[];
  strengths: string[];
  limitations: string[];
}
