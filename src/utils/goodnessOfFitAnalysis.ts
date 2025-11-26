// Goodness of Fit Test related functions

// Helper functions for statistical calculations

/**
 * 误差函数的近似实现
 * @param x 输入值
 * @returns 误差函数值
 */
const erf = (x: number): number => {
  // 误差函数的近似实现
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  
  const sign = x >= 0 ? 1 : -1;
  const absX = Math.abs(x);
  
  // 使用近似公式
  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
  
  return sign * y;
};

/**
 * 计算正态分布的累积分布函数值
 */
const normalCDF = (x: number): number => {
  return 0.5 * (1 + erf(x / Math.sqrt(2)));
};



/**
 * 执行完整的goodness-of-fit检验
 */
export const executeGoFTest = (
  data: number[],
  testType: string,
  distributionType: string,
  significanceLevel: number = 0.05,
  parameters: Record<string, number> = {},
  options: { numBins?: number } = {}
): any => {
  let result: any = {};
  
  try {
    switch (testType) {
      case 'kolmogorov-smirnov':
        result = calculateKolmogorovSmirnovTest(data, distributionType, parameters);
        result.testType = 'kolmogorov-smirnov';
        result.distributionType = distributionType;
        result.significanceLevel = significanceLevel;
        result.isReject = result.statistic > result.criticalValue;
        break;
        
      case 'chi-square':
        result = calculateChiSquareTest(data, distributionType, parameters, options.numBins);
        result.testType = 'chi-square';
        result.distributionType = distributionType;
        result.significanceLevel = significanceLevel;
        result.criticalValue = chiSquareCDF(1 - significanceLevel, result.degreesOfFreedom);
        result.isReject = result.statistic > result.criticalValue;
        break;
        
      case 'anderson-darling':
        result = calculateAndersonDarlingTest(data, distributionType, parameters);
        result.testType = 'anderson-darling';
        result.distributionType = distributionType;
        result.significanceLevel = significanceLevel;
        result.isReject = result.pValue < significanceLevel;
        break;
        
      case 'jarque-bera':
        result = calculateJarqueBeraTest(data);
        result.testType = 'jarque-bera';
        result.distributionType = 'normal'; // JB test is for normality
        result.significanceLevel = significanceLevel;
        result.isReject = result.pValue < significanceLevel;
        break;
        
      default:
        throw new Error(`Unsupported test type: ${testType}`);
    }
    
    result.sampleSize = data.length;
    
    return result;
  } catch (error) {
    throw new Error(`GoF test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * 计算Kolmogorov-Smirnov检验
 */
const calculateKolmogorovSmirnovTest = (
  data: number[],
  distributionType: string,
  parameters: Record<string, number>
): {
  statistic: number;
  criticalValue: number;
  pValue: number;
} => {
  // 排序数据
  const sortedData = [...data].sort((a, b) => a - b);
  const n = sortedData.length;
  
  // 计算经验CDF
  const empiricalCDF = (x: number): number => {
    let count = 0;
    for (const value of sortedData) {
      if (value <= x) count++;
    }
    return count / n;
  };
  
  // 根据分布类型计算理论CDF
  let theoreticalCDF: (x: number) => number;
  switch (distributionType) {
    case 'normal': {
      const mean = parameters.mean || calculateMean(data);
      const std = parameters.std || calculateStd(data);
      theoreticalCDF = (x: number) => normalCDF((x - mean) / std);
      break;
    }
    case 'uniform': {
      const a = parameters.a || Math.min(...data);
      const b = parameters.b || Math.max(...data);
      theoreticalCDF = (x: number) => {
        if (x < a) return 0;
        if (x > b) return 1;
        return (x - a) / (b - a);
      };
      break;
    }
    case 'exponential': {
      const lambda = parameters.lambda || 1 / calculateMean(data);
      theoreticalCDF = (x: number) => {
        if (x < 0) return 0;
        return 1 - Math.exp(-lambda * x);
      };
      break;
    }
    case 'poisson': {
      const lambda = parameters.lambda || calculateMean(data);
      theoreticalCDF = (x: number) => {
        if (x < 0) return 0;
        const k = Math.floor(x);
        let cdf = 0;
        for (let i = 0; i <= k; i++) {
          cdf += Math.exp(-lambda) * Math.pow(lambda, i) / factorial(i);
        }
        return cdf;
      };
      break;
    }
    case 'binomial': {
      const n = parameters.n || Math.max(...data);
      const p = parameters.p || calculateMean(data) / n;
      theoreticalCDF = (x: number) => {
        if (x < 0) return 0;
        if (x >= n) return 1;
        const k = Math.floor(x);
        let cdf = 0;
        for (let i = 0; i <= k; i++) {
          cdf += binomialCoefficient(n, i) * Math.pow(p, i) * Math.pow(1 - p, n - i);
        }
        return cdf;
      };
      break;
    }
    default:
      throw new Error(`Unsupported distribution type: ${distributionType}`);
  }
  
  // 计算KS统计量
  let maxD = 0;
  for (let i = 0; i < n; i++) {
    const x = sortedData[i];
    const empCDF = empiricalCDF(x);
    const theoCDF = theoreticalCDF(x);
    
    // 计算相邻点之间的最大差值
    const d1 = Math.abs(empCDF - theoCDF);
    const d2 = i > 0 ? Math.abs(empiricalCDF(sortedData[i] - 1e-10) - theoreticalCDF(x)) : d1;
    
    maxD = Math.max(maxD, d1, d2);
  }
  
  // 计算临界值（近似）
  const criticalValue = 1.36 / Math.sqrt(n); // 对于α=0.05的双侧检验
  
  // 计算p值（简化近似）
  const pValue = 2 * Math.exp(-2 * n * maxD * maxD);
  
  return {
    statistic: maxD,
    criticalValue,
    pValue: Math.min(pValue, 1),
  };
};

/**
 * 计算卡方拟合优度检验
 */
const calculateChiSquareTest = (
  data: number[],
  distributionType: string,
  parameters: Record<string, number>,
  numBins: number = 10
): {
  statistic: number;
  degreesOfFreedom: number;
  observedFrequencies: number[];
  expectedFrequencies: number[];
  bins: { start: number; end: number }[];
} => {
  const n = data.length;
  
  // 创建等宽的bins
  const min = Math.min(...data);
  const max = Math.max(...data);
  const binWidth = (max - min) / numBins;
  
  const bins = [];
  for (let i = 0; i < numBins; i++) {
    bins.push({
      start: min + i * binWidth,
      end: min + (i + 1) * binWidth,
    });
  }
  
  // 计算观察频率
  const observedFrequencies = new Array(numBins).fill(0);
  for (const value of data) {
    for (let i = 0; i < numBins; i++) {
      if (i === numBins - 1) {
        // 最后一个bin包含上限
        if (value >= bins[i].start && value <= bins[i].end) {
          observedFrequencies[i]++;
          break;
        }
      } else {
        if (value >= bins[i].start && value < bins[i].end) {
          observedFrequencies[i]++;
          break;
        }
      }
    }
  }
  
  // 根据分布类型计算理论频率
  const expectedFrequencies = new Array(numBins).fill(0);
  switch (distributionType) {
    case 'normal': {
      const mean = parameters.mean || calculateMean(data);
      const std = parameters.std || calculateStd(data);
      
      for (let i = 0; i < numBins; i++) {
        const lower = (bins[i].start - mean) / std;
        const upper = (bins[i].end - mean) / std;
        const probability = normalCDF(upper) - normalCDF(lower);
        expectedFrequencies[i] = n * probability;
      }
      break;
    }
    case 'uniform': {
      const a = parameters.a || min;
      const b = parameters.b || max;
      const binProbability = binWidth / (b - a);
      
      for (let i = 0; i < numBins; i++) {
        expectedFrequencies[i] = n * binProbability;
      }
      break;
    }
    case 'exponential': {
      const lambda = parameters.lambda || 1 / calculateMean(data);
      
      for (let i = 0; i < numBins; i++) {
        const lower = Math.max(bins[i].start, 0);
        const upper = Math.max(bins[i].end, 0);
        const probability = (1 - Math.exp(-lambda * upper)) - (1 - Math.exp(-lambda * lower));
        expectedFrequencies[i] = n * probability;
      }
      break;
    }
    case 'poisson': {
      const lambda = parameters.lambda || calculateMean(data);
      
      for (let i = 0; i < numBins; i++) {
        const lower = Math.max(bins[i].start, 0);
        const upper = Math.max(bins[i].end, 0);
        
        // 计算CDF差值
        let lowerCDF = 0;
        let upperCDF = 0;
        const lowerK = Math.floor(lower);
        const upperK = Math.floor(upper);
        
        // 计算lowerCDF
        for (let k = 0; k <= lowerK; k++) {
          lowerCDF += Math.exp(-lambda) * Math.pow(lambda, k) / factorial(k);
        }
        
        // 计算upperCDF
        for (let k = 0; k <= upperK; k++) {
          upperCDF += Math.exp(-lambda) * Math.pow(lambda, k) / factorial(k);
        }
        
        const probability = upperCDF - lowerCDF;
        expectedFrequencies[i] = n * probability;
      }
      break;
    }
    case 'binomial': {
      const binomN = parameters.n || Math.max(...data);
      const p = parameters.p || calculateMean(data) / binomN;
      
      for (let i = 0; i < numBins; i++) {
        const lower = Math.max(bins[i].start, 0);
        const upper = Math.min(bins[i].end, binomN);
        
        // 计算CDF差值
        let lowerCDF = 0;
        let upperCDF = 0;
        const lowerK = Math.floor(lower);
        const upperK = Math.floor(upper);
        
        // 计算lowerCDF
        for (let k = 0; k <= lowerK; k++) {
          lowerCDF += binomialCoefficient(binomN, k) * Math.pow(p, k) * Math.pow(1 - p, binomN - k);
        }
        
        // 计算upperCDF
        for (let k = 0; k <= upperK; k++) {
          upperCDF += binomialCoefficient(binomN, k) * Math.pow(p, k) * Math.pow(1 - p, binomN - k);
        }
        
        const probability = upperCDF - lowerCDF;
        expectedFrequencies[i] = n * probability;
      }
      break;
    }
    default:
      throw new Error(`Unsupported distribution type: ${distributionType}`);
  }
  
  // 合并期望频率小于5的相邻bin
  let i = 0;
  while (i < expectedFrequencies.length) {
    if (expectedFrequencies[i] < 5) {
      if (i === 0) {
        // 合并第一个bin和第二个bin
        expectedFrequencies[i + 1] += expectedFrequencies[i];
        observedFrequencies[i + 1] += observedFrequencies[i];
        expectedFrequencies.splice(i, 1);
        observedFrequencies.splice(i, 1);
        bins.splice(i, 1);
      } else {
        // 合并当前bin和前一个bin
        expectedFrequencies[i - 1] += expectedFrequencies[i];
        observedFrequencies[i - 1] += observedFrequencies[i];
        bins[i - 1].end = bins[i].end;
        expectedFrequencies.splice(i, 1);
        observedFrequencies.splice(i, 1);
        bins.splice(i, 1);
      }
    } else {
      i++;
    }
  }
  
  // 计算卡方统计量
  let chiSquareStatistic = 0;
  for (let i = 0; i < expectedFrequencies.length; i++) {
    if (expectedFrequencies[i] > 0) {
      const diff = observedFrequencies[i] - expectedFrequencies[i];
      chiSquareStatistic += (diff * diff) / expectedFrequencies[i];
    }
  }
  
  // 计算自由度
  const numParameters = distributionType === 'normal' ? 2 : 1;
  const degreesOfFreedom = expectedFrequencies.length - 1 - numParameters;
  
  return {
    statistic: chiSquareStatistic,
    degreesOfFreedom,
    observedFrequencies,
    expectedFrequencies,
    bins,
  };
};

/**
 * 计算Anderson-Darling检验
 */
const calculateAndersonDarlingTest = (
  data: number[],
  distributionType: string,
  parameters: Record<string, number>
): {
  statistic: number;
  pValue: number;
} => {
  // 目前仅支持正态分布的Anderson-Darling检验
  if (distributionType !== 'normal') {
    throw new Error('Anderson-Darling test is currently only supported for normal distribution');
  }
  
  // 排序数据
  const sortedData = [...data].sort((a, b) => a - b);
  const n = sortedData.length;
  
  // 计算均值和标准差
  const mean = parameters.mean || calculateMean(data);
  const std = parameters.std || calculateStd(data);
  
  // 标准化数据
  const zValues = sortedData.map(x => (x - mean) / std);
  
  // 计算AD统计量
  let adStatistic = 0;
  for (let i = 0; i < n; i++) {
    const z = zValues[i];
    const cdf = normalCDF(z);
    const term = (2 * (i + 1) - 1) * (Math.log(cdf) + Math.log(1 - normalCDF(zValues[n - 1 - i])));
    adStatistic -= term;
  }
  adStatistic /= n;
  adStatistic -= n;
  
  // 计算修正的AD统计量（考虑参数估计）
  const adAdjusted = adStatistic * (1 + 4 / n - 25 / (n * n));
  
  // 计算p值（简化近似）
  let pValue;
  if (adAdjusted < 0.2) {
    pValue = 1 - Math.exp(-13.436 + 101.14 * adAdjusted - 223.73 * adAdjusted * adAdjusted);
  } else if (adAdjusted < 0.34) {
    pValue = 1 - Math.exp(-8.318 + 42.796 * adAdjusted - 59.938 * adAdjusted * adAdjusted);
  } else if (adAdjusted < 0.6) {
    pValue = Math.exp(0.9177 - 4.279 * adAdjusted - 1.38 * adAdjusted * adAdjusted);
  } else {
    pValue = Math.exp(1.2937 - 5.709 * adAdjusted + 0.0186 * adAdjusted * adAdjusted);
  }
  
  return {
    statistic: adAdjusted,
    pValue: Math.min(Math.max(pValue, 0), 1),
  };
};

/**
 * 计算Jarque-Bera检验
 */
const calculateJarqueBeraTest = (
  data: number[]
): {
  statistic: number;
  pValue: number;
  skewness: number;
  kurtosis: number;
} => {
  const n = data.length;
  
  // 计算偏度和峰度
  const skewness = calculateSkewness(data);
  const kurtosis = calculateKurtosis(data);
  
  // 计算JB统计量
  const jbStatistic = (n / 6) * (skewness * skewness + (1 / 4) * (kurtosis - 3) * (kurtosis - 3));
  
  // 计算自由度为2的卡方分布的p值（简化近似）
  const pValue = 1 - chiSquareCDF(jbStatistic, 2);
  
  return {
    statistic: jbStatistic,
    pValue: Math.min(Math.max(pValue, 0), 1),
    skewness,
    kurtosis,
  };
};

// Helper functions for GoF tests

// 计算阶乘
const factorial = (n: number): number => {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};

// 计算二项式系数
const binomialCoefficient = (n: number, k: number): number => {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  
  // 使用对数计算避免数值溢出
  let result = 0;
  for (let i = 1; i <= k; i++) {
    result += Math.log((n - k + i) / i);
  }
  return Math.exp(result);
};

/**
 * 计算数据的均值
 */
const calculateMean = (data: number[]): number => {
  if (data.length === 0) return 0;
  return data.reduce((sum, val) => sum + val, 0) / data.length;
};

/**
 * 计算数据的标准差
 */
const calculateStd = (data: number[]): number => {
  if (data.length <= 1) return 0;
  const mean = calculateMean(data);
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (data.length - 1);
  return Math.sqrt(variance);
};

/**
 * 计算偏度
 */
const calculateSkewness = (data: number[]): number => {
  if (data.length <= 2) return 0;
  
  const n = data.length;
  const mean = calculateMean(data);
  const std = calculateStd(data);
  
  if (std === 0) return 0;
  
  const skewness = data.reduce((sum, val) => sum + Math.pow((val - mean) / std, 3), 0) * n / ((n - 1) * (n - 2));
  
  return skewness;
};

/**
 * 计算峰度
 */
const calculateKurtosis = (data: number[]): number => {
  if (data.length <= 3) return 3; // 正态分布的峰度为3
  
  const n = data.length;
  const mean = calculateMean(data);
  const std = calculateStd(data);
  
  if (std === 0) return 3;
  
  const kurtosis = data.reduce((sum, val) => sum + Math.pow((val - mean) / std, 4), 0) * n * (n + 1) / ((n - 1) * (n - 2) * (n - 3)) - 3 * (n - 1) * (n - 1) / ((n - 2) * (n - 3));
  
  return kurtosis;
};

/**
 * 卡方分布的累积分布函数（近似）
 */
const chiSquareCDF = (x: number, df: number): number => {
  // 使用伽马函数的近似计算卡方CDF
  if (x <= 0) return 0;
  if (x === Infinity) return 1;
  
  return 1 - gammaLower(df / 2, x / 2) / gammaFunction(df / 2);
};

/**
 * 伽马函数的近似实现
 */
const gammaFunction = (z: number): number => {
  const p = [
    676.5203681218851,
   -1259.1392167224028,
     771.32342877765313,
    -176.61502916214059,
      12.507343278686905,
      -0.13857109526572012,
       9.9843695780195716e-6,
       1.5056327351493116e-7
  ];
  
  const g = 7;
  
  if (z < 0.5) {
    // Reflection formula
    return Math.PI / (Math.sin(Math.PI * z) * gammaFunction(1 - z));
  }
  
  z -= 1;
  let x = 0.99999999999980993;
  
  for (let i = 0; i < p.length; i++) {
    x += p[i] / (z + i + 1);
  }
  
  const t = z + g + 0.5;
  
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
};

/**
 * 下不完全伽马函数的近似实现
 */
const gammaLower = (s: number, x: number): number => {
  if (x <= 0) return 0;
  if (x >= s + 1) {
    // 使用互补形式以提高精度
    return gammaFunction(s) - gammaUpper(s, x);
  }
  
  // 使用级数展开
  let sum = 1 / s;
  let term = sum;
  let n = 1;
  const eps = 1e-10;
  
  while (Math.abs(term) > eps * sum) {
    term *= x / (s + n);
    sum += term;
    n++;
    
    // 防止无限循环
    if (n > 1000) break;
  }
  
  return Math.pow(x, s) * Math.exp(-x) * sum;
};

/**
 * 上不完全伽马函数的近似实现
 */
const gammaUpper = (s: number, x: number): number => {
  if (x <= 0) return gammaFunction(s);
  if (x < s + 1) {
    // 使用互补形式以提高精度
    return gammaFunction(s) - gammaLower(s, x);
  }
  
  // 使用连分数展开
  let a = 1 - s;
  let b = x + a + 1;
  let c = 0;
  let d = 1 / b;
  let h = d;
  let n = 1;
  const eps = 1e-10;
  
  while (true) {
    a += n;
    b += 2;
    c = b + a * c;
    d = b + a * d;
    if (Math.abs(d) < eps) d = eps;
    c = 1 / c;
    d = 1 / d;
    const delta = c * d;
    h *= delta;
    
    if (Math.abs(delta - 1) < eps) break;
    n++;
    
    // 防止无限循环
    if (n > 1000) break;
  }
  
  return Math.pow(x, s) * Math.exp(-x) * h;
};
