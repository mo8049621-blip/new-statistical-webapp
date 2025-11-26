// Power analysis related functions

/**
 * 计算t检验的功效
 * @param mu1 备择假设的均值
 * @param mu0 原假设的均值
 * @param sigma 总体标准差
 * @param n 样本量
 * @param alpha 显著性水平
 * @param testType 检验类型: 'two' (双侧), 'left' (左侧), 'right' (右侧)
 * @returns 功效值
 */
export const calculateTTestPower = (
  mu1: number,
  mu0: number,
  sigma: number,
  n: number,
  alpha: number,
  testType: 'two' | 'left' | 'right'
): number => {
  const delta = mu1 - mu0;
  const se = sigma / Math.sqrt(n);
  const df = n - 1;
  
  // 使用t分布临界值
  const calculateTCritical = (alpha: number, df: number, testType: 'two' | 'left' | 'right'): number => {
    // 由于没有t分布的反函数，我们使用正态近似来计算临界值
    // 对于大自由度，这是相当准确的
    if (testType === 'two') {
      return Math.sqrt(2) * inverseErrorFunction(2 * (1 - alpha / 2) - 1);
    } else {
      return Math.sqrt(2) * inverseErrorFunction(2 * (1 - alpha) - 1);
    }
  };
  
  const tCritical = calculateTCritical(alpha, df, testType);
  
  if (testType === 'two') {
    const nonCentrality = Math.abs(delta) / se;
    // 使用正态近似来计算非中心t分布的功效
    return Math.min(Math.max(normalCDF(-tCritical + nonCentrality) + normalCDF(-tCritical - nonCentrality), 0), 1);
  } else if (testType === 'right') {
    const nonCentrality = delta / se;
    return Math.min(Math.max(normalCDF(-tCritical + nonCentrality), 0), 1);
  } else { // left
    const nonCentrality = delta / se;
    return Math.min(Math.max(normalCDF(-tCritical - nonCentrality), 0), 1);
  }
};

/**
 * 计算Z检验的功效
 * @param mu1 备择假设的均值
 * @param mu0 原假设的均值
 * @param sigma 总体标准差
 * @param n 样本量
 * @param alpha 显著性水平
 * @param testType 检验类型: 'two' (双侧), 'left' (左侧), 'right' (右侧)
 * @returns 功效值
 */
export const calculateZTestPower = (
  mu1: number,
  mu0: number,
  sigma: number,
  n: number,
  alpha: number,
  testType: 'two' | 'left' | 'right'
): number => {
  const delta = mu1 - mu0;
  const se = sigma / Math.sqrt(n);
  
  if (testType === 'two') {
    const zAlphaHalf = Math.sqrt(2) * inverseErrorFunction(2 * (1 - alpha / 2) - 1);
    return Math.min(Math.max(normalCDF(-zAlphaHalf + Math.abs(delta) / se) + normalCDF(-zAlphaHalf - Math.abs(delta) / se), 0), 1);
  } else if (testType === 'right') {
    const zAlpha = Math.sqrt(2) * inverseErrorFunction(2 * (1 - alpha) - 1);
    return Math.min(Math.max(normalCDF(-zAlpha + delta / se), 0), 1);
  } else { // left
    const zAlpha = Math.sqrt(2) * inverseErrorFunction(2 * (1 - alpha) - 1);
    return Math.min(Math.max(normalCDF(-zAlpha - delta / se), 0), 1);
  }
};

/**
 * 生成功效函数的数据点
 * @param mu0 原假设的均值
 * @param sigma 总体标准差
 * @param n 样本量
 * @param alpha 显著性水平
 * @param testType 检验类型: 'two' (双侧), 'left' (左侧), 'right' (右侧)
 * @param hypothesisTestType 假设检验类型: 'z' (Z检验), 't' (t检验)
 * @param startMu 起始均值
 * @param endMu 结束均值
 * @param step 步长
 * @returns 功效函数数据点数组
 */
export const generatePowerFunctionData = (
  mu0: number,
  sigma: number,
  n: number,
  alpha: number,
  testType: 'two' | 'left' | 'right',
  hypothesisTestType: 'z' | 't' = 'z',
  startMu: number = mu0 - 3 * sigma,
  endMu: number = mu0 + 3 * sigma,
  step: number = sigma / 10
): { mu: number; power: number }[] => {
  const data: { mu: number; power: number }[] = [];
  
  for (let mu = startMu; mu <= endMu; mu += step) {
    const power = hypothesisTestType === 'z' 
      ? calculateZTestPower(mu, mu0, sigma, n, alpha, testType)
      : calculateTTestPower(mu, mu0, sigma, n, alpha, testType);
    data.push({ mu, power });
  }
  
  return data;
};

/**
 * 计算所需的样本量以达到指定的功效
 * @param mu1 备择假设的均值
 * @param mu0 原假设的均值
 * @param sigma 总体标准差
 * @param alpha 显著性水平
 * @param beta 第II类错误概率（1 - 功效）
 * @param testType 检验类型: 'two' (双侧), 'left' (左侧), 'right' (右侧)
 * @returns 所需样本量（向上取整）
 */
export const calculateSampleSizeForPower = (
  mu1: number,
  mu0: number,
  sigma: number,
  alpha: number,
  beta: number,
  testType: 'two' | 'left' | 'right'
): number => {
  const delta = Math.abs(mu1 - mu0);
  
  // 计算临界值
  let zAlpha, zBeta;
  if (testType === 'two') {
    zAlpha = Math.sqrt(2) * inverseErrorFunction(2 * (1 - alpha / 2) - 1);
    zBeta = Math.sqrt(2) * inverseErrorFunction(2 * (1 - beta) - 1);
    const n = Math.pow((zAlpha + zBeta) * sigma / delta, 2);
    return Math.ceil(n);
  } else {
    zAlpha = Math.sqrt(2) * inverseErrorFunction(2 * (1 - alpha) - 1);
    zBeta = Math.sqrt(2) * inverseErrorFunction(2 * (1 - beta) - 1);
    const n = Math.pow((zAlpha + zBeta) * sigma / delta, 2);
    return Math.ceil(n);
  }
};

// Helper functions needed for power analysis

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
 * Inverse error function approximation
 * @param x Input value, range [-1,1]
 * @returns Inverse error function value
 */
const inverseErrorFunction = (x: number): number => {
  // Approximate calculation of inverse error function
  // Using Taylor expansion approximation
  const a = 0.140012;
  const sign = x >= 0 ? 1 : -1;
  const absX = Math.abs(x);
  
  // 边界检查：x必须在[-1, 1]范围内
  if (absX >= 1) {
    return sign * Infinity;
  }
  
  const arg = 1 - absX * absX;
  // 确保arg大于0，避免log(0)或log(负数)
  if (arg <= 0) {
    return sign * Infinity;
  }
  
  const logTerm = Math.log(arg);
  const sqrtArg = -logTerm - 2 * Math.log(2) - a * logTerm;
  
  // 确保sqrt的参数非负，避免NaN
  if (sqrtArg < 0) {
    return sign * Infinity;
  }
  
  const sqrtTerm = Math.sqrt(sqrtArg);
  
  return sign * sqrtTerm;
};
