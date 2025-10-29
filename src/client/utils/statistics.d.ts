/**
 * Calculate MLE estimates
 */
export declare const calculateMLE: (data: number[], distType: string, basicStats?: any) => Record<string, number>;
/**
 * Calculate MoM estimates
 */
export declare const calculateMoM: (data: number[], distType: string, basicStats?: any) => Record<string, number>;
/**
 * Calculate skewness
 */
export declare const calculateSkewness: (data: number[], basicStats?: {
    count: number;
    mean: number;
} | null) => number;
/**
 * Calculate kurtosis
 */
export declare const calculateKurtosis: (data: number[], basicStats?: {
    count: number;
    mean: number;
    std: number;
} | null) => number;
/**
 * Calculate mean of array
 */
export declare const calculateMean: (data: number[]) => number;
/**
 * Calculate median of array
 */
export declare const calculateMedian: (data: number[]) => number;
/**
 * Calculate mode of array
 */
export declare const calculateMode: (data: number[]) => number[];
/**
 * Calculate variance of array
 */
export declare const calculateVariance: (data: number[]) => number;
/**
 * Calculate standard deviation of array
 */
export declare const calculateStd: (data: number[]) => number;
/**
 * Calculate quartiles of array
 */
export declare const calculateQuartiles: (data: number[]) => {
    q1: number;
    q3: number;
    iqr: number;
};
/**
 * Calculate confidence interval for mean
 * Supports four cases:
 * 1. Normal distribution, known variance
 * 2. Non-normal distribution, known variance (large sample)
 * 3. Normal distribution, unknown variance (using t-distribution)
 * 4. Non-normal distribution, unknown variance (large sample)
 *
 * @param data Data array
 * @param confidenceLevel Confidence level, default is 0.95 (95%)
 * @param options Optional parameters
 * @param options.isNormal Whether to assume normal distribution, default is false
 * @param options.knownVariance Whether variance is known, default is false
 * @param options.populationVariance Population variance (if known)
 * @returns Object containing confidence interval lower bound, upper bound, margin of error, and method used
 */
export declare const calculateConfidenceInterval: (data: number[], confidenceLevel?: number, options?: {
    isNormal?: boolean;
    knownVariance?: boolean;
    populationVariance?: number;
}) => {
    lower: number;
    upper: number;
    marginOfError: number;
    method: string;
    criticalValue: number;
};
export declare function getTCriticalValue(confidenceLevel: number, degreesOfFreedom: number): number;
export declare function getZCriticalValue(confidenceLevel: number): number;
export declare function calculateStdDev(data: number[]): number;
export declare function calculatePooledVariance(data1: number[], data2: number[]): number;
export declare function calculateDifferences(before: number[], after: number[]): number[];
export declare function calculateOneSampleMeanCI(data: number[], confidenceLevel: number, knownVariance?: number): {
    mean: number;
    standardError: number;
    marginOfError: number;
    lowerBound: number;
    upperBound: number;
    method: string;
};
export declare function calculateTwoSampleMeanCI(data1: number[], data2: number[], confidenceLevel: number, assumeEqualVariances?: boolean): {
    meanDifference: number;
    standardError: number;
    marginOfError: number;
    lowerBound: number;
    upperBound: number;
    method: string;
    degreesOfFreedom: number;
};
export declare function calculatePairedMeanCI(before: number[], after: number[], confidenceLevel: number): {
    meanDifference: number;
    standardError: number;
    marginOfError: number;
    lowerBound: number;
    upperBound: number;
    method: string;
};
/**
 * Calculate descriptive statistics
 */
export declare const calculateDescriptiveStats: (data: number[], confidenceLevel?: number, options?: {
    isNormal?: boolean;
    knownVariance?: boolean;
}) => {
    mean: number;
    median: number;
    mode: number[];
    variance: number;
    std: number;
    skewness: number;
    kurtosis: number;
    min: number;
    max: number;
    range: number;
    q1: number;
    q3: number;
    iqr: number;
    count: number;
    confidenceInterval: {
        lower: number;
        upper: number;
        marginOfError: number;
        method: string;
        criticalValue: number;
    };
};
/**
 * Calculate confidence interval for a single proportion
 * Supports two methods:
 * 1. Wald interval (normal approximation)
 * 2. Wilson score interval (more accurate for small samples)
 *
 * @param successes Number of successes
 * @param trials Total number of trials
 * @param confidenceLevel Confidence level, default is 0.95 (95%)
 * @param options Optional parameters
 * @param options.method Method: 'wald' (normal approximation) or 'wilson' (Wilson score interval)
 * @returns 包含置信区间下限、上限、边际误差和使用的方法的对象
 */
export declare const calculateProportionConfidenceInterval: (successes: number, trials: number, confidenceLevel?: number, options?: {
    method?: "wald" | "wilson";
}) => {
    lower: number;
    upper: number;
    marginOfError: number;
    method: string;
    criticalValue: number;
    proportion: number;
};
/**
 * Calculate confidence interval for the difference between two proportions
 * Supports two methods:
 * 1. Normal approximation (Wald interval)
 * 2. Continuity correction method
 *
 * @param successes1 Number of successes in first sample
 * @param trials1 Total number of trials in first sample
 * @param successes2 Number of successes in second sample
 * @param trials2 Total number of trials in second sample
 * @param confidenceLevel Confidence level, default is 0.95 (95%)
 * @param options Optional parameters
 * @param options.method Method: 'wald' (normal approximation) or 'continuity' (continuity correction)
 * @returns 包含置信区间下限、上限、边际误差和使用的方法的对象
 */
export declare const calculateTwoProportionConfidenceInterval: (successes1: number, trials1: number, successes2: number, trials2: number, confidenceLevel?: number, options?: {
    method?: "wald" | "continuity";
}) => {
    lower: number;
    upper: number;
    marginOfError: number;
    method: string;
    criticalValue: number;
    proportionDiff: number;
    proportion1: number;
    proportion2: number;
};
/**
 * Calculate confidence interval for the difference between two means
 * Supports three cases:
 * 1. Two independent samples, equal variances (Pooled t-interval)
 * 2. Two independent samples, unequal variances (Welch's t-interval)
 * 3. Paired samples (Paired t-interval)
 *
 * @param data1 First sample data
 * @param data2 Second sample data
 * @param confidenceLevel Confidence level, default is 0.95 (95%)
 * @param options Optional parameters
 * @param options.method Method: 'pooled' (equal variances), 'welch' (unequal variances), 'paired' (paired samples)
 * @param options.isNormal Whether to assume normal distribution, default is true
 * @returns 包含置信区间下限、上限、边际误差和使用的方法的对象
 */
export declare const calculateTwoSampleConfidenceInterval: (data1: number[], data2: number[], confidenceLevel?: number, options?: {
    method?: "pooled" | "welch" | "paired";
    isNormal?: boolean;
}) => {
    lower: number;
    upper: number;
    marginOfError: number;
    method: string;
    criticalValue: number;
    meanDiff: number;
};
/**
 * 生成直方图数据
 */
/**
 * 计算均值的所需样本量
 * @param confidenceLevel 置信水平
 * @param marginOfError 边际误差（置信区间的一半宽度）
 * @param options 可选参数
 * @param options.populationStd 总体标准差（已知时）
 * @param options.estimatedStd 估计的标准差（方差未知时）
 * @param options.useTDistribution 是否使用t分布（小样本时更准确）
 * @returns 所需的最小样本量
 */
export declare const calculateSampleSizeForMean: (confidenceLevel: number, marginOfError: number, options?: {
    populationStd?: number;
    estimatedStd?: number;
    useTDistribution?: boolean;
}) => number;
/**
 * 计算比例的所需样本量
 * @param confidenceLevel 置信水平
 * @param marginOfError 边际误差（置信区间的一半宽度）
 * @param options 可选参数
 * @param options.estimatedProportion 估计的比例（已知时）
 * @param options.useConservativeEstimate 是否使用保守估计（p=0.5时方差最大）
 * @returns 所需的最小样本量
 */
export declare const calculateSampleSizeForProportion: (confidenceLevel: number, marginOfError: number, options?: {
    estimatedProportion?: number;
    useConservativeEstimate?: boolean;
}) => number;
/**
 * 计算t分布的p值
 * @param tValue t统计量的值
 * @param df 自由度
 * @param tail 检验类型: 'two' (双侧), 'left' (左侧), 'right' (右侧)
 * @returns p值
 */
export declare const calculateTTestPValue: (tValue: number, df: number, tail: "two" | "left" | "right") => number;
/**
 * 执行单样本均值的Z检验（方差已知）
 * @param data 样本数据
 * @param mu0 原假设的均值
 * @param sigma 总体标准差
 * @param alpha 显著性水平
 * @param testType 检验类型: 'two' (双侧), 'left' (左侧), 'right' (右侧)
 * @returns 检验结果
 */
export declare const performZTest: (data: number[], mu0: number, sigma: number, alpha?: number, testType?: "two" | "left" | "right") => {
    testType: "Z-test";
    mean: number;
    zValue: number;
    pValue: number;
    criticalValue: number;
    rejected: boolean;
    confidenceInterval: {
        lower: number;
        upper: number;
    } | null;
    method: string;
};
/**
 * 执行单样本均值的t检验（方差未知）
 * @param data 样本数据
 * @param mu0 原假设的均值
 * @param alpha 显著性水平
 * @param testType 检验类型: 'two' (双侧), 'left' (左侧), 'right' (右侧)
 * @returns 检验结果
 */
export declare const performTTest: (data: number[], mu0: number, alpha?: number, testType?: "two" | "left" | "right") => {
    testType: "t-test";
    mean: number;
    std: number;
    tValue: number;
    df: number;
    pValue: number;
    criticalValue: number;
    rejected: boolean;
    confidenceInterval: {
        lower: number;
        upper: number;
    } | null;
    method: string;
};
/**
 * 生成直方图数据
 */
export declare const generateHistogramData: (data: number[], numBins?: number) => {
    name: string;
    value: number;
}[];
