// Statistical calculation utility functions
// math library import removed as it's no longer needed for current implementation
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/**
 * Calculate MLE estimates
 */
export var calculateMLE = function (data, distType, basicStats) {
    var results = {};
    var n = data.length;
    // Prefer using passed statistics, calculate if not provided
    var mean = basicStats === null || basicStats === void 0 ? void 0 : basicStats.mean;
    var variance = (basicStats === null || basicStats === void 0 ? void 0 : basicStats.variance) || ((basicStats === null || basicStats === void 0 ? void 0 : basicStats.std) ? basicStats.std * basicStats.std : undefined);
    switch (distType) {
        case 'normal': {
            if (!mean || !variance) {
                mean = data.reduce(function (sum, val) { return sum + val; }, 0) / n;
                variance = data.reduce(function (sum, val) { return sum + Math.pow(val - mean, 2); }, 0) / n;
            }
            var std = Math.sqrt(variance);
            results.mean = mean;
            results.std = std;
            break;
        }
        case 'uniform': {
            var min = Math.min.apply(Math, data);
            var max = Math.max.apply(Math, data);
            results.a = min;
            results.b = max;
            break;
        }
        case 'exponential': {
            if (!mean) {
                mean = data.reduce(function (sum, val) { return sum + val; }, 0) / n;
            }
            results.lambda = 1 / mean;
            break;
        }
        case 'poisson': {
            if (!mean) {
                mean = data.reduce(function (sum, val) { return sum + val; }, 0) / n;
            }
            results.lambda = mean;
            break;
        }
        case 'gamma': {
            // MoM estimation for gamma distribution as alternative to MLE
            if (!mean || !variance) {
                mean = data.reduce(function (sum, val) { return sum + val; }, 0) / n;
                variance = data.reduce(function (sum, val) { return sum + Math.pow(val - mean, 2); }, 0) / n;
            }
            // Use MoM estimation as simplified MLE
            results.shape = Math.max(0.001, Math.pow(mean, 2) / variance);
            results.scale = variance / mean;
            break;
        }
        case 'beta': {
            // MoM estimation for beta distribution as alternative to MLE
            if (!mean || !variance) {
                mean = data.reduce(function (sum, val) { return sum + val; }, 0) / n;
                variance = data.reduce(function (sum, val) { return sum + Math.pow(val - mean, 2); }, 0) / n;
            }
            // Use MoM estimation as simplified MLE
            var s = (mean * (1 - mean) / variance) - 1;
            results.alpha = mean * s;
            results.beta = (1 - mean) * s;
            break;
        }
        default:
            throw new Error("Unsupported distribution type: ".concat(distType));
    }
    return results;
};
/**
 * Calculate MoM estimates
 */
export var calculateMoM = function (data, distType, basicStats) {
    var results = {};
    var n = data.length;
    // Prefer using passed statistics, calculate if not provided
    var mean = basicStats === null || basicStats === void 0 ? void 0 : basicStats.mean;
    var variance = (basicStats === null || basicStats === void 0 ? void 0 : basicStats.variance) || ((basicStats === null || basicStats === void 0 ? void 0 : basicStats.std) ? basicStats.std * basicStats.std : undefined);
    switch (distType) {
        case 'normal': {
            if (!mean || !variance) {
                mean = data.reduce(function (sum, val) { return sum + val; }, 0) / n;
                variance = data.reduce(function (sum, val) { return sum + Math.pow(val - mean, 2); }, 0) / n;
            }
            var std = Math.sqrt(variance);
            results.mean = mean;
            results.std = std;
            break;
        }
        case 'uniform': {
            if (!mean || !variance) {
                mean = data.reduce(function (sum, val) { return sum + val; }, 0) / n;
                variance = data.reduce(function (sum, val) { return sum + Math.pow(val - mean, 2); }, 0) / n;
            }
            var range = Math.sqrt(12 * variance);
            results.a = mean - range / 2;
            results.b = mean + range / 2;
            break;
        }
        case 'exponential': {
            if (!mean) {
                mean = data.reduce(function (sum, val) { return sum + val; }, 0) / n;
            }
            results.lambda = 1 / mean;
            break;
        }
        case 'poisson': {
            if (!mean) {
                mean = data.reduce(function (sum, val) { return sum + val; }, 0) / n;
            }
            results.lambda = mean;
            break;
        }
        case 'gamma': {
            if (!mean || !variance) {
                mean = data.reduce(function (sum, val) { return sum + val; }, 0) / n;
                variance = data.reduce(function (sum, val) { return sum + Math.pow(val - mean, 2); }, 0) / n;
            }
            // MoM estimates: shape = mean^2 / variance, scale = variance / mean
            results.shape = Math.max(0.001, Math.pow(mean, 2) / variance);
            results.scale = variance / mean;
            break;
        }
        case 'beta': {
            if (!mean || !variance) {
                mean = data.reduce(function (sum, val) { return sum + val; }, 0) / n;
                variance = data.reduce(function (sum, val) { return sum + Math.pow(val - mean, 2); }, 0) / n;
            }
            // MoM estimation
            var s = (mean * (1 - mean) / variance) - 1;
            results.alpha = mean * s;
            results.beta = (1 - mean) * s;
            break;
        }
        default:
            throw new Error("Unsupported distribution type: ".concat(distType));
    }
    return results;
};
/**
 * Calculate skewness
 */
export var calculateSkewness = function (data, basicStats) {
    if (!data || data.length === 0) {
        throw new Error('Data array cannot be empty');
    }
    // Calculate sample statistics, prefer using passed statistics
    var n = (basicStats === null || basicStats === void 0 ? void 0 : basicStats.count) || data.length;
    var mean = (basicStats === null || basicStats === void 0 ? void 0 : basicStats.mean) || calculateMean(data);
    var std = calculateStd(data);
    // Ensure standard deviation is not zero
    if (std === 0) {
        return 0;
    }
    var thirdMoment = data.reduce(function (sum, val) { return sum + Math.pow(val - mean, 3); }, 0) / n;
    return thirdMoment / Math.pow(std, 3);
};
/**
 * Calculate kurtosis
 */
export var calculateKurtosis = function (data, basicStats) {
    if (!data || data.length === 0) {
        throw new Error('Data array cannot be empty');
    }
    // Calculate sample statistics, prefer using passed statistics
    var n = (basicStats === null || basicStats === void 0 ? void 0 : basicStats.count) || data.length;
    var mean = (basicStats === null || basicStats === void 0 ? void 0 : basicStats.mean) || calculateMean(data);
    var std = (basicStats === null || basicStats === void 0 ? void 0 : basicStats.std) || calculateStd(data);
    // Ensure standard deviation is not zero
    if (std === 0) {
        return 0;
    }
    var fourthMoment = data.reduce(function (sum, val) { return sum + Math.pow(val - mean, 4); }, 0) / n;
    return (fourthMoment / Math.pow(std, 4)) - 3; // Subtract 3 to get excess kurtosis
};
/**
 * Calculate mean of array
 */
export var calculateMean = function (data) {
    if (!data || data.length === 0) {
        throw new Error('Data array cannot be empty');
    }
    var sum = data.reduce(function (acc, val) { return acc + val; }, 0);
    return sum / data.length;
};
/**
 * Calculate median of array
 */
export var calculateMedian = function (data) {
    if (!data || data.length === 0) {
        throw new Error('Data array cannot be empty');
    }
    var sortedData = __spreadArray([], data, true).sort(function (a, b) { return a - b; });
    var n = sortedData.length;
    if (n % 2 === 0) {
        return (sortedData[n / 2 - 1] + sortedData[n / 2]) / 2;
    }
    else {
        return sortedData[Math.floor(n / 2)];
    }
};
/**
 * Calculate mode of array
 */
export var calculateMode = function (data) {
    if (!data || data.length === 0) {
        throw new Error('Data array cannot be empty');
    }
    var frequencyMap = {};
    var maxFreq = 0;
    // Calculate frequency and find maximum frequency
    data.forEach(function (num) {
        frequencyMap[num] = (frequencyMap[num] || 0) + 1;
        maxFreq = Math.max(maxFreq, frequencyMap[num]);
    });
    // Collect all numbers with maximum frequency
    var modes = [];
    Object.entries(frequencyMap).forEach(function (_a) {
        var num = _a[0], freq = _a[1];
        if (freq === maxFreq) {
            modes.push(Number(num));
        }
    });
    return modes;
};
/**
 * Calculate variance of array
 */
export var calculateVariance = function (data) {
    if (!data || data.length === 0) {
        throw new Error('Data array cannot be empty');
    }
    var mean = calculateMean(data);
    var sumSquaredDiffs = data.reduce(function (acc, val) { return acc + Math.pow(val - mean, 2); }, 0);
    return sumSquaredDiffs / data.length;
};
/**
 * Calculate standard deviation of array
 */
export var calculateStd = function (data) {
    return Math.sqrt(calculateVariance(data));
};
/**
 * Calculate quartiles of array
 */
export var calculateQuartiles = function (data) {
    if (!data || data.length === 0) {
        throw new Error('Data array cannot be empty');
    }
    var sortedData = __spreadArray([], data, true).sort(function (a, b) { return a - b; });
    var n = sortedData.length;
    var q1 = sortedData[Math.floor(n * 0.25)];
    var q3 = sortedData[Math.floor(n * 0.75)];
    var iqr = q3 - q1;
    return { q1: q1, q3: q3, iqr: iqr };
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
export var calculateConfidenceInterval = function (data, confidenceLevel, options) {
    if (confidenceLevel === void 0) { confidenceLevel = 0.95; }
    if (options === void 0) { options = {}; }
    if (!data || data.length === 0) {
        throw new Error('Data array cannot be empty');
    }
    var _a = options.isNormal, isNormal = _a === void 0 ? false : _a, _b = options.knownVariance, knownVariance = _b === void 0 ? false : _b, populationVariance = options.populationVariance;
    var n = data.length;
    var mean = calculateMean(data);
    // Calculate standard error
    var standardError;
    var std;
    if (knownVariance && populationVariance !== undefined) {
        // Known variance case
        standardError = Math.sqrt(populationVariance) / Math.sqrt(n);
        std = Math.sqrt(populationVariance);
    }
    else {
        // Unknown variance case, use sample standard deviation
        std = calculateStd(data);
        standardError = std / Math.sqrt(n);
    }
    // Determine whether to use z-distribution or t-distribution
    var criticalValue;
    var method;
    if (knownVariance) {
        // Known variance, use z-distribution
        // Calculate z critical value based on confidence level
        switch (confidenceLevel) {
            case 0.90:
                criticalValue = 1.645;
                break;
            case 0.95:
                criticalValue = 1.96;
                break;
            case 0.99:
                criticalValue = 2.576;
                break;
            default:
                // For other confidence levels, use approximation
                var alpha = 1 - confidenceLevel;
                // Use inverse error function to approximate z-value
                // Using Taylor expansion approximation
                var zApprox = Math.sqrt(2) * inverseErrorFunction(2 * (1 - alpha / 2) - 1);
                criticalValue = Math.abs(zApprox);
        }
        method = knownVariance ? 'Z-distribution (known variance)' : 'Z-distribution (unknown variance, large sample)';
    }
    else {
        // Unknown variance
        if (isNormal || n <= 30) {
            // Normal distribution or small sample, use t-distribution
            // Using approximate t-critical value table
            var df = n - 1;
            criticalValue = getApproximateTCriticalValue(df, confidenceLevel);
            method = 't distribution (normal, unknown variance)';
        }
        else {
            // Non-normal large sample, use z-distribution approximation
            switch (confidenceLevel) {
                case 0.90:
                    criticalValue = 1.645;
                    break;
                case 0.95:
                    criticalValue = 1.96;
                    break;
                case 0.99:
                    criticalValue = 2.576;
                    break;
                default:
                    var alpha = 1 - confidenceLevel;
                    var zApprox = Math.sqrt(2) * inverseErrorFunction(2 * (1 - alpha / 2) - 1);
                    criticalValue = Math.abs(zApprox);
            }
            method = 'Z-distribution (non-normal, large sample, unknown variance)';
        }
    }
    // Calculate margin of error
    var marginOfError = criticalValue * standardError;
    // Calculate confidence interval
    var lower = mean - marginOfError;
    var upper = mean + marginOfError;
    return { lower: lower, upper: upper, marginOfError: marginOfError, method: method, criticalValue: criticalValue };
};
/**
 * Approximate calculation of t-distribution critical value
 * @param df Degrees of freedom for t-distribution
 * @param confidenceLevel Confidence level
 * @returns t critical value
 */
var getApproximateTCriticalValue = function (df, confidenceLevel) {
    // Common t-critical values table for degrees of freedom and confidence levels (approximate)
    var tTable = {
        1: { 0.90: 6.314, 0.95: 12.706, 0.99: 63.657 },
        2: { 0.90: 2.920, 0.95: 4.303, 0.99: 9.925 },
        3: { 0.90: 2.353, 0.95: 3.182, 0.99: 5.841 },
        4: { 0.90: 2.132, 0.95: 2.776, 0.99: 4.604 },
        5: { 0.90: 2.015, 0.95: 2.571, 0.99: 4.032 },
        6: { 0.90: 1.943, 0.95: 2.447, 0.99: 3.707 },
        7: { 0.90: 1.895, 0.95: 2.365, 0.99: 3.499 },
        8: { 0.90: 1.860, 0.95: 2.306, 0.99: 3.355 },
        9: { 0.90: 1.833, 0.95: 2.262, 0.99: 3.250 },
        10: { 0.90: 1.812, 0.95: 2.228, 0.99: 3.169 },
        11: { 0.90: 1.796, 0.95: 2.201, 0.99: 3.106 },
        12: { 0.90: 1.782, 0.95: 2.179, 0.99: 3.055 },
        13: { 0.90: 1.771, 0.95: 2.160, 0.99: 3.012 },
        14: { 0.90: 1.761, 0.95: 2.145, 0.99: 2.977 },
        15: { 0.90: 1.753, 0.95: 2.131, 0.99: 2.947 },
        16: { 0.90: 1.746, 0.95: 2.120, 0.99: 2.921 },
        17: { 0.90: 1.740, 0.95: 2.110, 0.99: 2.898 },
        18: { 0.90: 1.734, 0.95: 2.101, 0.99: 2.878 },
        19: { 0.90: 1.729, 0.95: 2.093, 0.99: 2.861 },
        20: { 0.90: 1.725, 0.95: 2.086, 0.99: 2.845 },
        21: { 0.90: 1.721, 0.95: 2.080, 0.99: 2.831 },
        22: { 0.90: 1.717, 0.95: 2.074, 0.99: 2.819 },
        23: { 0.90: 1.714, 0.95: 2.069, 0.99: 2.807 },
        24: { 0.90: 1.711, 0.95: 2.064, 0.99: 2.797 },
        25: { 0.90: 1.708, 0.95: 2.060, 0.99: 2.787 },
        30: { 0.90: 1.697, 0.95: 2.042, 0.99: 2.750 },
        40: { 0.90: 1.684, 0.95: 2.021, 0.99: 2.704 },
        50: { 0.90: 1.676, 0.95: 2.009, 0.99: 2.678 },
        60: { 0.90: 1.671, 0.95: 2.000, 0.99: 2.660 },
        100: { 0.90: 1.660, 0.95: 1.984, 0.99: 2.626 },
        1000: { 0.90: 1.646, 0.95: 1.962, 0.99: 2.581 },
        10000: { 0.90: 1.645, 0.95: 1.960, 0.99: 2.576 }
    };
    // Find closest degrees of freedom
    var closestDf = df;
    while (!(closestDf in tTable) && closestDf > 1) {
        closestDf--;
    }
    // If exact degrees of freedom not found, use largest available
    if (!(closestDf in tTable)) {
        closestDf = Math.max.apply(Math, Object.keys(tTable).map(Number));
    }
    // Return corresponding t-critical value, use 0.95 if confidence level doesn't exist
    var dfEntry = tTable[closestDf];
    return dfEntry[confidenceLevel] || dfEntry[0.95] || 1.96; // Default 95% confidence level
};
// Calculate t-distribution critical value (general function)
export function getTCriticalValue(confidenceLevel, degreesOfFreedom) {
    return getApproximateTCriticalValue(degreesOfFreedom, confidenceLevel);
}
// Calculate z-distribution critical value (general function)
export function getZCriticalValue(confidenceLevel) {
    // Common z-critical values for confidence levels (two-tailed test)
    var zTable = {
        0.90: 1.645,
        0.95: 1.96,
        0.99: 2.576
    };
    return zTable[confidenceLevel] || 1.96; // Default 95%
}
// Calculate sample standard deviation (using sample variance, n-1 degrees of freedom)
export function calculateStdDev(data) {
    if (!data || data.length === 0) {
        throw new Error('Data array cannot be empty');
    }
    var mean = calculateMean(data);
    var sumSquaredDiffs = data.reduce(function (acc, val) { return acc + Math.pow(val - mean, 2); }, 0);
    var sampleVariance = sumSquaredDiffs / (data.length - 1);
    return Math.sqrt(sampleVariance);
}
// Calculate pooled variance for two samples (assuming equal variances)
export function calculatePooledVariance(data1, data2) {
    var n1 = data1.length;
    var n2 = data2.length;
    var var1 = data1.reduce(function (sum, val) { return sum + Math.pow(val - calculateMean(data1), 2); }, 0) / (n1 - 1);
    var var2 = data2.reduce(function (sum, val) { return sum + Math.pow(val - calculateMean(data2), 2); }, 0) / (n2 - 1);
    return ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2);
}
// Calculate differences for paired data
export function calculateDifferences(before, after) {
    if (before.length !== after.length) {
        throw new Error('Pre and post sample lengths must be the same');
    }
    return before.map(function (val, index) { return after[index] - val; });
}
// Single sample mean confidence interval
export function calculateOneSampleMeanCI(data, confidenceLevel, knownVariance) {
    var n = data.length;
    var mean = calculateMean(data);
    var standardError;
    var marginOfError;
    var method;
    if (knownVariance !== undefined) {
        // Use z-test (known variance)
        standardError = Math.sqrt(knownVariance) / Math.sqrt(n);
        var zCritical = getZCriticalValue(confidenceLevel);
        marginOfError = zCritical * standardError;
        method = 'z-test (known variance)';
    }
    else {
        // Use t-test (unknown variance)
        var stdDev = calculateStdDev(data);
        standardError = stdDev / Math.sqrt(n);
        var degreesOfFreedom = n - 1;
        var tCritical = getTCriticalValue(confidenceLevel, degreesOfFreedom);
        marginOfError = tCritical * standardError;
        method = 't-test (unknown variance)';
    }
    return {
        mean: mean,
        standardError: standardError,
        marginOfError: marginOfError,
        lowerBound: mean - marginOfError,
        upperBound: mean + marginOfError,
        method: method
    };
}
// Two-sample mean difference confidence interval
export function calculateTwoSampleMeanCI(data1, data2, confidenceLevel, assumeEqualVariances) {
    if (assumeEqualVariances === void 0) { assumeEqualVariances = false; }
    var n1 = data1.length;
    var n2 = data2.length;
    var mean1 = calculateMean(data1);
    var mean2 = calculateMean(data2);
    var meanDifference = mean1 - mean2;
    var standardError;
    var degreesOfFreedom;
    if (assumeEqualVariances) {
        // Assuming equal variances
        var pooledVariance = calculatePooledVariance(data1, data2);
        standardError = Math.sqrt(pooledVariance * (1 / n1 + 1 / n2));
        degreesOfFreedom = n1 + n2 - 2;
    }
    else {
        // Not assuming equal variances (Welch-Satterthwaite)
        var var1 = data1.reduce(function (sum, val) { return sum + Math.pow(val - mean1, 2); }, 0) / (n1 - 1);
        var var2 = data2.reduce(function (sum, val) { return sum + Math.pow(val - mean2, 2); }, 0) / (n2 - 1);
        standardError = Math.sqrt(var1 / n1 + var2 / n2);
        // Calculate Welch-Satterthwaite degrees of freedom
        var dfNumerator = Math.pow(var1 / n1 + var2 / n2, 2);
        var dfDenominator = Math.pow(var1, 2) / (Math.pow(n1, 2) * (n1 - 1)) + Math.pow(var2, 2) / (Math.pow(n2, 2) * (n2 - 1));
        degreesOfFreedom = dfNumerator / dfDenominator;
    }
    var tCritical = getTCriticalValue(confidenceLevel, Math.round(degreesOfFreedom));
    var marginOfError = tCritical * standardError;
    return {
        meanDifference: meanDifference,
        standardError: standardError,
        marginOfError: marginOfError,
        lowerBound: meanDifference - marginOfError,
        upperBound: meanDifference + marginOfError,
        method: assumeEqualVariances ? 'Pooled variance t-test' : 'Welch-Satterthwaite t-test',
        degreesOfFreedom: degreesOfFreedom
    };
}
// Paired sample mean difference confidence interval
export function calculatePairedMeanCI(before, after, confidenceLevel) {
    var differences = calculateDifferences(before, after);
    var n = differences.length;
    var meanDifference = calculateMean(differences);
    var stdDevDifference = calculateStdDev(differences);
    var standardError = stdDevDifference / Math.sqrt(n);
    var degreesOfFreedom = n - 1;
    var tCritical = getTCriticalValue(confidenceLevel, degreesOfFreedom);
    var marginOfError = tCritical * standardError;
    return {
        meanDifference: meanDifference,
        standardError: standardError,
        marginOfError: marginOfError,
        lowerBound: meanDifference - marginOfError,
        upperBound: meanDifference + marginOfError,
        method: 'Paired t-test'
    };
}
// Single proportion confidence interval function is defined below, keeping reference here for backward compatibility
// Two-proportion difference confidence interval function is defined below, keeping reference here for backward compatibility
/**
 * Inverse error function approximation
 * @param x Input value, range [-1,1]
 * @returns Inverse error function value
 */
var inverseErrorFunction = function (x) {
    // Approximate calculation of inverse error function
    // Using Taylor expansion approximation
    var a = 0.140012;
    var sign = x >= 0 ? 1 : -1;
    var absX = Math.abs(x);
    if (absX >= 1) {
        return sign * Infinity;
    }
    var logTerm = Math.log(1 - absX * absX);
    var sqrtTerm = Math.sqrt(-logTerm - 2 * Math.log(2) - a * logTerm);
    return sign * sqrtTerm;
};
/**
 * Calculate descriptive statistics
 */
export var calculateDescriptiveStats = function (data, confidenceLevel, options) {
    if (confidenceLevel === void 0) { confidenceLevel = 0.95; }
    if (!data || data.length === 0) {
        throw new Error('Data array cannot be empty');
    }
    var sortedData = __spreadArray([], data, true).sort(function (a, b) { return a - b; });
    var n = sortedData.length;
    return __assign(__assign({ mean: calculateMean(data), median: calculateMedian(data), mode: calculateMode(data), variance: calculateVariance(data), std: calculateStd(data), skewness: calculateSkewness(data), kurtosis: calculateKurtosis(data), min: sortedData[0], max: sortedData[n - 1], range: sortedData[n - 1] - sortedData[0] }, calculateQuartiles(data)), { count: n, confidenceInterval: calculateConfidenceInterval(data, confidenceLevel, options || { isNormal: false, knownVariance: false }) });
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
export var calculateProportionConfidenceInterval = function (successes, trials, confidenceLevel, options) {
    if (confidenceLevel === void 0) { confidenceLevel = 0.95; }
    if (options === void 0) { options = {}; }
    if (trials <= 0) {
        throw new Error('Total number of trials must be greater than 0');
    }
    if (successes < 0 || successes > trials) {
        throw new Error('Number of successes must be between 0 and total number of trials');
    }
    if (confidenceLevel <= 0 || confidenceLevel >= 1) {
        throw new Error('Confidence level must be between 0 and 1');
    }
    var _a = options.method, method = _a === void 0 ? 'wald' : _a;
    var proportion = successes / trials;
    // Calculate critical value (z-value)
    var criticalValue;
    switch (confidenceLevel) {
        case 0.90:
            criticalValue = 1.645;
            break;
        case 0.95:
            criticalValue = 1.96;
            break;
        case 0.99:
            criticalValue = 2.576;
            break;
        default:
            // For other confidence levels, use inverse error function to approximate z-value
            var alpha = 1 - confidenceLevel;
            var zApprox = Math.sqrt(2) * inverseErrorFunction(2 * (1 - alpha / 2) - 1);
            criticalValue = Math.abs(zApprox);
    }
    var lower;
    var upper;
    var methodName;
    if (method === 'wilson') {
        // Wilson score interval
        var n = trials;
        var z = criticalValue;
        var zSquared = z * z;
        var pTilde = (successes + zSquared / 2) / (n + zSquared);
        var denominator = n + zSquared;
        var numerator = z * Math.sqrt((proportion * (1 - proportion) * n + zSquared / 4) / n);
        lower = pTilde - numerator / denominator;
        upper = pTilde + numerator / denominator;
        methodName = 'Wilson score interval';
    }
    else {
        // Wald interval (normal approximation)
        var standardError = Math.sqrt((proportion * (1 - proportion)) / trials);
        var marginOfError_1 = criticalValue * standardError;
        lower = proportion - marginOfError_1;
        upper = proportion + marginOfError_1;
        methodName = 'Wald interval (normal approximation)';
    }
    // Ensure result is within [0, 1] range
    lower = Math.max(0, lower);
    upper = Math.min(1, upper);
    var marginOfError = (upper - lower) / 2;
    return {
        lower: lower,
        upper: upper,
        marginOfError: marginOfError,
        method: methodName,
        criticalValue: criticalValue,
        proportion: proportion
    };
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
export var calculateTwoProportionConfidenceInterval = function (successes1, trials1, successes2, trials2, confidenceLevel, options) {
    if (confidenceLevel === void 0) { confidenceLevel = 0.95; }
    if (options === void 0) { options = {}; }
    // Parameter validation
    if (trials1 <= 0 || trials2 <= 0) {
        throw new Error('Total number of trials must be greater than 0');
    }
    if (successes1 < 0 || successes1 > trials1 || successes2 < 0 || successes2 > trials2) {
        throw new Error('Number of successes must be between 0 and total number of trials');
    }
    if (confidenceLevel <= 0 || confidenceLevel >= 1) {
        throw new Error('Confidence level must be between 0 and 1');
    }
    var _a = options.method, method = _a === void 0 ? 'wald' : _a;
    // Calculate sample proportions
    var proportion1 = successes1 / trials1;
    var proportion2 = successes2 / trials2;
    var proportionDiff = proportion1 - proportion2;
    // Calculate critical value (z-value)
    var criticalValue;
    switch (confidenceLevel) {
        case 0.90:
            criticalValue = 1.645;
            break;
        case 0.95:
            criticalValue = 1.96;
            break;
        case 0.99:
            criticalValue = 2.576;
            break;
        default:
            var alpha = 1 - confidenceLevel;
            var zApprox = Math.sqrt(2) * inverseErrorFunction(2 * (1 - alpha / 2) - 1);
            criticalValue = Math.abs(zApprox);
    }
    var lower;
    var upper;
    var methodName;
    if (method === 'continuity') {
        // Continuity correction method
        var p1 = (successes1 + 0.5) / trials1;
        var p2 = (successes2 + 0.5) / trials2;
        var pDiff = p1 - p2;
        var standardError = Math.sqrt((p1 * (1 - p1)) / trials1 + (p2 * (1 - p2)) / trials2);
        var marginOfError_2 = criticalValue * standardError;
        lower = pDiff - marginOfError_2;
        upper = pDiff + marginOfError_2;
        methodName = 'Continuity correction method';
    }
    else {
        // Wald interval (normal approximation)
        var standardError = Math.sqrt((proportion1 * (1 - proportion1)) / trials1 + (proportion2 * (1 - proportion2)) / trials2);
        var marginOfError_3 = criticalValue * standardError;
        lower = proportionDiff - marginOfError_3;
        upper = proportionDiff + marginOfError_3;
        methodName = 'Wald interval (normal approximation)';
    }
    // Ensure result is within [-1, 1] range
    lower = Math.max(-1, lower);
    upper = Math.min(1, upper);
    var marginOfError = (upper - lower) / 2;
    return {
        lower: lower,
        upper: upper,
        marginOfError: marginOfError,
        method: methodName,
        criticalValue: criticalValue,
        proportionDiff: proportionDiff,
        proportion1: proportion1,
        proportion2: proportion2
    };
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
export var calculateTwoSampleConfidenceInterval = function (data1, data2, confidenceLevel, options) {
    if (confidenceLevel === void 0) { confidenceLevel = 0.95; }
    if (options === void 0) { options = {}; }
    if (!data1 || !data2 || data1.length === 0 || data2.length === 0) {
        throw new Error('Data array cannot be empty');
    }
    var _a = options.method, method = _a === void 0 ? 'welch' : _a;
    var n1 = data1.length;
    var n2 = data2.length;
    // 计算样本均值和标准差
    var mean1 = calculateMean(data1);
    var mean2 = calculateMean(data2);
    var meanDiff = mean1 - mean2;
    var criticalValue;
    var standardError;
    var methodName;
    if (method === 'paired') {
        // 配对样本t检验
        if (n1 !== n2) {
            throw new Error('配对样本的数据长度必须相同');
        }
        // 计算差值
        var differences = data1.map(function (x, i) { return x - data2[i]; });
        var stdDiff = calculateStd(differences);
        // 标准误
        standardError = stdDiff / Math.sqrt(n1);
        // 临界值
        criticalValue = getApproximateTCriticalValue(n1 - 1, confidenceLevel);
        methodName = '配对样本t检验';
    }
    else if (method === 'pooled') {
        // Pooled t-interval（方差相等假设）
        var var1 = calculateVariance(data1);
        var var2 = calculateVariance(data2);
        // 合并方差
        var pooledVar = ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2);
        // 标准误
        standardError = Math.sqrt(pooledVar * (1 / n1 + 1 / n2));
        // 临界值
        criticalValue = getApproximateTCriticalValue(n1 + n2 - 2, confidenceLevel);
        methodName = '合并方差t检验';
    }
    else {
        // Welch's t-interval（方差不等）
        var var1 = calculateVariance(data1);
        var var2 = calculateVariance(data2);
        // 标准误
        standardError = Math.sqrt(var1 / n1 + var2 / n2);
        // 计算自由度（Welch-Satterthwaite公式）
        var numerator = Math.pow(var1 / n1 + var2 / n2, 2);
        var denominator = Math.pow(var1, 2) / (Math.pow(n1, 2) * (n1 - 1)) + Math.pow(var2, 2) / (Math.pow(n2, 2) * (n2 - 1));
        var df = Math.floor(numerator / denominator);
        // 临界值
        criticalValue = getApproximateTCriticalValue(df, confidenceLevel);
        methodName = 'Welch t检验';
    }
    // 计算边际误差
    var marginOfError = criticalValue * standardError;
    // 计算置信区间
    var lower = meanDiff - marginOfError;
    var upper = meanDiff + marginOfError;
    return {
        lower: lower,
        upper: upper,
        marginOfError: marginOfError,
        method: methodName,
        criticalValue: criticalValue,
        meanDiff: meanDiff
    };
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
export var calculateSampleSizeForMean = function (confidenceLevel, marginOfError, options) {
    if (marginOfError <= 0) {
        throw new Error('边际误差必须大于0');
    }
    var _a = options || {}, populationStd = _a.populationStd, estimatedStd = _a.estimatedStd, _b = _a.useTDistribution, useTDistribution = _b === void 0 ? false : _b;
    // 检查是否提供了标准差信息
    if (populationStd === undefined && estimatedStd === undefined) {
        throw new Error('当方差未知时，必须提供估计的标准差');
    }
    // 使用提供的标准差，如果总体标准差未知则使用估计值
    var std = populationStd !== undefined ? populationStd : estimatedStd;
    // 计算临界值（z值）
    var criticalValue;
    switch (confidenceLevel) {
        case 0.90:
            criticalValue = 1.645;
            break;
        case 0.95:
            criticalValue = 1.96;
            break;
        case 0.99:
            criticalValue = 2.576;
            break;
        default:
            var alpha = 1 - confidenceLevel;
            var zApprox = Math.sqrt(2) * inverseErrorFunction(2 * (1 - alpha / 2) - 1);
            criticalValue = Math.abs(zApprox);
    }
    // 初步计算样本量（使用z分布）
    var n = Math.pow((criticalValue * std) / marginOfError, 2);
    // 如果使用t分布，需要进行迭代调整
    if (useTDistribution && std === estimatedStd) {
        var previousN = 0;
        // 迭代直到收敛
        while (Math.abs(n - previousN) > 0.5) {
            previousN = n;
            // 使用近似的自由度（n-1）计算t临界值
            var df = Math.max(1, Math.floor(n) - 1);
            var tCriticalValue = getApproximateTCriticalValue(df, confidenceLevel);
            n = Math.pow((tCriticalValue * std) / marginOfError, 2);
        }
    }
    // 向上取整到最近的整数
    return Math.ceil(n);
};
/**
 * 计算比例的所需样本量
 * @param confidenceLevel 置信水平
 * @param marginOfError 边际误差（置信区间的一半宽度）
 * @param options 可选参数
 * @param options.estimatedProportion 估计的比例（已知时）
 * @param options.useConservativeEstimate 是否使用保守估计（p=0.5时方差最大）
 * @returns 所需的最小样本量
 */
export var calculateSampleSizeForProportion = function (confidenceLevel, marginOfError, options) {
    if (marginOfError <= 0) {
        throw new Error('边际误差必须大于0');
    }
    var _a = options || {}, estimatedProportion = _a.estimatedProportion, _b = _a.useConservativeEstimate, useConservativeEstimate = _b === void 0 ? false : _b;
    // 使用提供的比例估计值，如果未提供且不使用保守估计，则抛出错误
    if (estimatedProportion === undefined && !useConservativeEstimate) {
        throw new Error('当不使用保守估计时，必须提供估计的比例');
    }
    // 如果使用保守估计，使用p=0.5（此时方差最大）
    var p = useConservativeEstimate ? 0.5 : estimatedProportion;
    // 确保比例在有效范围内
    if (p < 0 || p > 1) {
        throw new Error('估计的比例必须在0到1之间');
    }
    // 计算临界值（z值）
    var criticalValue;
    switch (confidenceLevel) {
        case 0.90:
            criticalValue = 1.645;
            break;
        case 0.95:
            criticalValue = 1.96;
            break;
        case 0.99:
            criticalValue = 2.576;
            break;
        default:
            var alpha = 1 - confidenceLevel;
            var zApprox = Math.sqrt(2) * inverseErrorFunction(2 * (1 - alpha / 2) - 1);
            criticalValue = Math.abs(zApprox);
    }
    // 计算样本量
    var n = Math.pow(criticalValue, 2) * p * (1 - p) / Math.pow(marginOfError, 2);
    // 向上取整到最近的整数
    return Math.ceil(n);
};
/**
 * 误差函数的实现
 * @param x 输入值
 * @returns 误差函数值
 */
var erf = function (x) {
    // 误差函数的近似实现
    var a1 = 0.254829592;
    var a2 = -0.284496736;
    var a3 = 1.421413741;
    var a4 = -1.453152027;
    var a5 = 1.061405429;
    var p = 0.3275911;
    var sign = x >= 0 ? 1 : -1;
    var absX = Math.abs(x);
    // 使用近似公式
    var t = 1.0 / (1.0 + p * absX);
    var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
    return sign * y;
};
/**
 * 计算正态分布的累积分布函数值
 */
var normalCDF = function (x) {
    return 0.5 * (1 + erf(x / Math.sqrt(2)));
};
/**
 * 计算t分布的累积分布函数值的近似实现
 */
var tCDF = function (x, df) {
    // 使用近似算法计算t分布CDF
    // 对于大自由度，使用正态分布近似
    if (df >= 30) {
        return normalCDF(x);
    }
    // 使用简化的近似方法
    // 基于t分布与正态分布的关系进行近似
    var absX = Math.abs(x);
    var zValue = normalCDF(absX);
    // 对小自由度进行修正
    var correction = 1 / (4 * df) - 7 / (96 * df * df) + 127 / (9216 * df * df * df);
    var pApprox;
    if (x < 0) {
        pApprox = 1 - zValue + correction * (absX * absX + 1) * (zValue - 0.5);
    }
    else {
        pApprox = zValue + correction * (absX * absX + 1) * (0.5 - zValue);
    }
    // 确保结果在[0,1]范围内
    return Math.min(1, Math.max(0, pApprox));
};
/**
 * 计算t分布的p值
 * @param tValue t统计量的值
 * @param df 自由度
 * @param tail 检验类型: 'two' (双侧), 'left' (左侧), 'right' (右侧)
 * @returns p值
 */
export var calculateTTestPValue = function (tValue, df, tail) {
    try {
        if (tail === 'two') {
            return 2 * Math.min(tCDF(tValue, df), 1 - tCDF(tValue, df));
        }
        else if (tail === 'left') {
            return tCDF(tValue, df);
        }
        else { // right
            return 1 - tCDF(tValue, df);
        }
    }
    catch (error) {
        // 如果mathjs计算失败，使用正态分布近似
        console.warn('t分布计算失败，使用正态分布近似');
        if (tail === 'two') {
            return 2 * (1 - normalCDF(Math.abs(tValue)));
        }
        else if (tail === 'left') {
            return normalCDF(tValue);
        }
        else { // right
            return 1 - normalCDF(tValue);
        }
    }
};
/**
 * 执行单样本均值的Z检验（方差已知）
 * @param data 样本数据
 * @param mu0 原假设的均值
 * @param sigma 总体标准差
 * @param alpha 显著性水平
 * @param testType 检验类型: 'two' (双侧), 'left' (左侧), 'right' (右侧)
 * @returns 检验结果
 */
export var performZTest = function (data, mu0, sigma, alpha, testType) {
    if (alpha === void 0) { alpha = 0.05; }
    if (testType === void 0) { testType = 'two'; }
    if (!data || data.length === 0) {
        throw new Error('数据数组不能为空');
    }
    var n = data.length;
    var mean = calculateMean(data);
    var standardError = sigma / Math.sqrt(n);
    var zValue = (mean - mu0) / standardError;
    // 计算p值
    var pValue;
    if (testType === 'left') {
        pValue = normalCDF(zValue);
    }
    else if (testType === 'right') {
        pValue = 1 - normalCDF(zValue);
    }
    else {
        pValue = 2 * (1 - normalCDF(Math.abs(zValue)));
    }
    // 计算临界值
    var criticalValue;
    if (testType === 'left') {
        criticalValue = -Math.sqrt(2) * inverseErrorFunction(2 * (1 - alpha) - 1);
    }
    else if (testType === 'right') {
        criticalValue = Math.sqrt(2) * inverseErrorFunction(2 * (1 - alpha) - 1);
    }
    else {
        criticalValue = Math.sqrt(2) * inverseErrorFunction(2 * (1 - alpha / 2) - 1);
    }
    // 判断是否拒绝原假设
    var rejected;
    if (testType === 'left') {
        rejected = zValue <= criticalValue;
    }
    else if (testType === 'right') {
        rejected = zValue >= criticalValue;
    }
    else {
        rejected = Math.abs(zValue) >= criticalValue;
    }
    // 计算置信区间
    var confidenceInterval = null;
    var zCritical = Math.sqrt(2) * inverseErrorFunction(2 * (1 - alpha / 2) - 1);
    if (testType === 'two') {
        confidenceInterval = {
            lower: mean - zCritical * standardError,
            upper: mean + zCritical * standardError
        };
    }
    else if (testType === 'left') {
        confidenceInterval = {
            lower: -Infinity,
            upper: mean + zCritical * standardError
        };
    }
    else if (testType === 'right') {
        confidenceInterval = {
            lower: mean - zCritical * standardError,
            upper: Infinity
        };
    }
    return {
        testType: 'Z-test',
        mean: mean,
        zValue: zValue,
        pValue: pValue,
        criticalValue: criticalValue,
        rejected: rejected,
        confidenceInterval: confidenceInterval,
        method: "Z\u68C0\u9A8C\uFF08\u65B9\u5DEE\u5DF2\u77E5\uFF0C".concat(testType === 'two' ? '双侧' : testType === 'left' ? '左侧' : '右侧', "\u68C0\u9A8C\uFF09")
    };
};
/**
 * 执行单样本均值的t检验（方差未知）
 * @param data 样本数据
 * @param mu0 原假设的均值
 * @param alpha 显著性水平
 * @param testType 检验类型: 'two' (双侧), 'left' (左侧), 'right' (右侧)
 * @returns 检验结果
 */
export var performTTest = function (data, mu0, alpha, testType) {
    if (alpha === void 0) { alpha = 0.05; }
    if (testType === void 0) { testType = 'two'; }
    if (!data || data.length === 0) {
        throw new Error('数据数组不能为空');
    }
    var n = data.length;
    var mean = calculateMean(data);
    var std = calculateStd(data);
    var standardError = std / Math.sqrt(n);
    var df = n - 1;
    var tValue = (mean - mu0) / standardError;
    // 计算p值
    var pValue = calculateTTestPValue(tValue, df, testType);
    // 计算临界值
    var criticalValue;
    if (testType === 'left') {
        criticalValue = -getApproximateTCriticalValue(df, 1 - alpha);
    }
    else if (testType === 'right') {
        criticalValue = getApproximateTCriticalValue(df, 1 - alpha);
    }
    else {
        criticalValue = getApproximateTCriticalValue(df, 1 - alpha / 2);
    }
    // 判断是否拒绝原假设
    var rejected;
    if (testType === 'left') {
        rejected = tValue <= criticalValue;
    }
    else if (testType === 'right') {
        rejected = tValue >= criticalValue;
    }
    else {
        rejected = Math.abs(tValue) >= criticalValue;
    }
    // 计算置信区间
    var confidenceInterval = null;
    var tCritical = getApproximateTCriticalValue(df, 1 - alpha / 2);
    if (testType === 'two') {
        confidenceInterval = {
            lower: mean - tCritical * standardError,
            upper: mean + tCritical * standardError
        };
    }
    else if (testType === 'left') {
        confidenceInterval = {
            lower: -Infinity,
            upper: mean + tCritical * standardError
        };
    }
    else if (testType === 'right') {
        confidenceInterval = {
            lower: mean - tCritical * standardError,
            upper: Infinity
        };
    }
    return {
        testType: 't-test',
        mean: mean,
        std: std,
        tValue: tValue,
        df: df,
        pValue: pValue,
        criticalValue: criticalValue,
        rejected: rejected,
        confidenceInterval: confidenceInterval,
        method: "t\u68C0\u9A8C\uFF08\u65B9\u5DEE\u672A\u77E5\uFF0C".concat(testType === 'two' ? '双侧' : testType === 'left' ? '左侧' : '右侧', "\u68C0\u9A8C\uFF09")
    };
};
/**
 * 生成直方图数据
 */
export var generateHistogramData = function (data, numBins) {
    if (!data || data.length === 0) {
        throw new Error('数据数组不能为空');
    }
    var n = data.length;
    var binsCount = numBins || Math.ceil(Math.sqrt(n));
    var min = Math.min.apply(Math, data);
    var max = Math.max.apply(Math, data);
    var binWidth = (max - min) / binsCount;
    var bins = [];
    var _loop_1 = function (i) {
        var binMin = min + i * binWidth;
        var binMax = binMin + binWidth;
        var count = data.filter(function (val) { return val >= binMin && val < binMax; }).length;
        bins.push({
            name: "".concat(binMin.toFixed(2), "-").concat(binMax.toFixed(2)),
            value: count,
        });
    };
    for (var i = 0; i < binsCount; i++) {
        _loop_1(i);
    }
    return bins;
};
