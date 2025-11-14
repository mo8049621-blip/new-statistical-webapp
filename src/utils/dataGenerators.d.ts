export declare function generateNormalData(n: number, mean: number, stdDev: number): number[];
export declare function generateUniformData(n: number, min: number, max: number): number[];
export declare function generateBinomialData(n: number, p: number): number[];
export declare function generatePairedNormalData(n: number, meanBefore: number, meanDifference: number, stdDev: number, correlation: number): {
    before: number[];
    after: number[];
};
