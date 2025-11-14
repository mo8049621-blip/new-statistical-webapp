// Data generation utility functions
// Generate normal distribution data
export function generateNormalData(n, mean, stdDev) {
    var data = [];
    for (var i = 0; i < n; i++) {
        // Generate normal distribution random numbers using Box-Muller transform
        var u = 0, v = 0;
        while (u === 0)
            u = Math.random();
        while (v === 0)
            v = Math.random();
        var z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        data.push(mean + stdDev * z);
    }
    return data;
}
// Generate uniform distribution data
export function generateUniformData(n, min, max) {
    var data = [];
    for (var i = 0; i < n; i++) {
        data.push(min + Math.random() * (max - min));
    }
    return data;
}
// Generate binomial distribution data
export function generateBinomialData(n, p) {
    var data = [];
    for (var i = 0; i < n; i++) {
        data.push(Math.random() < p ? 1 : 0);
    }
    return data;
}
// Generate paired normal data
export function generatePairedNormalData(n, meanBefore, meanDifference, stdDev, correlation) {
    var before = [];
    var after = [];
    for (var i = 0; i < n; i++) {
        // Generate normal distribution random numbers using Box-Muller transform
        var u1 = 0, v1 = 0;
        while (u1 === 0)
            u1 = Math.random();
        while (v1 === 0)
            v1 = Math.random();
        var z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * v1);
        var u2 = 0, v2 = 0;
        while (u2 === 0)
            u2 = Math.random();
        while (v2 === 0)
            v2 = Math.random();
        var z2 = Math.sqrt(-2.0 * Math.log(u2)) * Math.cos(2.0 * Math.PI * v2);
        // Generate correlated paired data
        var x = meanBefore + stdDev * z1;
        var y = (meanBefore + meanDifference) +
            correlation * stdDev * z1 +
            Math.sqrt(1 - correlation * correlation) * stdDev * z2;
        before.push(x);
        after.push(y);
    }
    return { before: before, after: after };
}
