import { useState, useEffect } from 'react';
import { Box, Text, Grid, Select, FormControl, FormLabel, Input, Button, Card, CardBody, Alert, AlertIcon, Stack } from '@chakra-ui/react';
import PowerFunctionChart from './PowerFunctionChart';

const PowerFunction = ({ dataset }) => {
    // Parameter state
    const [alpha, setAlpha] = useState('0.05');
    const [mu0, setMu0] = useState(0);
    const [sigma, setSigma] = useState(1);
    const [n, setN] = useState(dataset.length);
    const [effectSize, setEffectSize] = useState(null);
    const [targetPower, setTargetPower] = useState('0.8');
    const [testResult, setTestResult] = useState(null);
    const [error, setError] = useState(null);

    // Update sample size when dataset changes
    useEffect(() => {
        if (dataset && dataset.length > 0) {
            setN(dataset.length);
        }
    }, [dataset]);

    // Calculate power function
    const calculatePower = () => {
        try {
            setError(null);
            // Validate input parameters
            const alphaNum = parseFloat(alpha);
            const targetPowerNum = parseFloat(targetPower);
            const sigmaNum = parseFloat(sigma);
            const nNum = parseInt(n);
            const mu0Num = parseFloat(mu0);

            if (isNaN(alphaNum) || alphaNum <= 0 || alphaNum >= 1) {
                throw new Error('Significance level must be between 0 and 1');
            }
            if (sigmaNum <= 0) {
                throw new Error('Population standard deviation must be positive');
            }
            if (nNum <= 0) {
                throw new Error('Sample size must be positive');
            }
            if (effectSize !== null && (isNaN(parseFloat(effectSize)) || parseFloat(effectSize) === 0)) {
                throw new Error('Effect size must be a non-zero number');
            }
            if (isNaN(targetPowerNum) || targetPowerNum <= 0 || targetPowerNum >= 1) {
                throw new Error('Target power must be between 0 and 1');
            }

            // Convert effect size to difference if provided
            let delta = 0;
            if (effectSize !== null && !isNaN(parseFloat(effectSize))) {
                delta = parseFloat(effectSize) * sigmaNum;
            }

            // Generate alternative hypotheses for plotting
            const muAlternatives = [];
            const step = sigmaNum / Math.sqrt(nNum);
            // Generate mu values around mu0 from mu0 - 3*sigma/sqrt(n) to mu0 + 3*sigma/sqrt(n)
            for (let i = -3; i <= 3; i += 0.1) {
                muAlternatives.push(mu0Num + i * step);
            }

            // Calculate power for each alternative hypothesis
            const powerData = [];
            muAlternatives.forEach(muAlternative => {
                const zStatistic = (muAlternative - mu0Num) / (sigmaNum / Math.sqrt(nNum));
                // For two-tailed test
                const power = 1 - (Math.abs(zStatistic) - 1.96 < 0 ? Math.abs(zStatistic) - 1.96 : Math.abs(zStatistic) + 1.96);
                powerData.push({
                    mu: muAlternative,
                    power: Math.min(Math.max(power, 0), 1) // Ensure power is between 0 and 1
                });
            });

            // Calculate required sample size for target power if effect size is provided
            let requiredSampleSize = null;
            if (effectSize !== null && !isNaN(parseFloat(effectSize))) {
                const deltaNum = parseFloat(effectSize) * sigmaNum;
                const zAlpha = 1.96; // For alpha = 0.05, two-tailed
                const zBeta = 0.84; // For power = 0.8
                requiredSampleSize = Math.ceil(((zAlpha + zBeta) * sigmaNum / deltaNum) ** 2);
            }

            setTestResult({
                alpha: alphaNum,
                mu0: mu0Num,
                sigma: sigmaNum,
                n: nNum,
                effectSize: effectSize !== null ? parseFloat(effectSize) : null,
                targetPower: targetPowerNum,
                powerData,
                requiredSampleSize
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during power calculation');
            setTestResult(null);
        }
    };

    return (
        <Box>
            <Text fontSize="xl" fontWeight="bold" mb={4}>Power Function Analysis</Text>
            <Card mb={6}>
                <CardBody>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
                        <FormControl>
                            <FormLabel>Significance Level (α)</FormLabel>
                            <Select value={alpha} onChange={(e) => setAlpha(e.target.value)}>
                                <option value="0.01">0.01 (99% confidence level)</option>
                                <option value="0.05">0.05 (95% confidence level)</option>
                                <option value="0.10">0.10 (90% confidence level)</option>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Null Hypothesis Mean (μ₀)</FormLabel>
                            <Input 
                                type="number" 
                                value={mu0} 
                                onChange={(e) => setMu0(parseFloat(e.target.value) || 0)} 
                                placeholder="Enter null hypothesis mean"
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Population Standard Deviation (σ)</FormLabel>
                            <Input 
                                type="number" 
                                min="0" 
                                step="any" 
                                value={sigma} 
                                onChange={(e) => setSigma(parseFloat(e.target.value) || 0)} 
                                placeholder="Enter population standard deviation"
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Sample Size (n)</FormLabel>
                            <Input 
                                type="number" 
                                min="1" 
                                value={n} 
                                onChange={(e) => setN(parseInt(e.target.value) || 1)} 
                                placeholder="Enter sample size"
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Effect Size (Cohen's d)</FormLabel>
                            <Input 
                                type="number" 
                                step="any" 
                                value={effectSize || ''} 
                                onChange={(e) => setEffectSize(e.target.value === '' ? null : parseFloat(e.target.value))} 
                                placeholder="Enter effect size (optional)"
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Target Power</FormLabel>
                            <Select value={targetPower} onChange={(e) => setTargetPower(e.target.value)}>
                                <option value="0.80">0.80</option>
                                <option value="0.85">0.85</option>
                                <option value="0.90">0.90</option>
                                <option value="0.95">0.95</option>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Button onClick={calculatePower} mt={4} colorScheme="blue" size="lg">
                        Calculate Power Function
                    </Button>
                </CardBody>
            </Card>
            {error && (
                <Alert status="error" mb={6}>
                    <AlertIcon />
                    <Text>{error}</Text>
                </Alert>
            )}
            {testResult && (
                <Stack spacing={6}>
                    <Card>
                        <CardBody>
                            <Text fontSize="lg" fontWeight="bold" mb={4}>Analysis Results</Text>
                            <Stack spacing={3}>
                                <Box>
                                    <Text fontWeight="bold">Test Parameters:</Text>
                                    <Text>Null Hypothesis Mean (μ₀) = {testResult.mu0}</Text>
                                    <Text>Population Standard Deviation (σ) = {testResult.sigma.toFixed(4)}</Text>
                                    <Text>Sample Size (n) = {testResult.n}</Text>
                                    <Text>Significance Level (α) = {testResult.alpha}</Text>
                                    {testResult.effectSize !== null && (
                                        <Text>Effect Size (d) = {testResult.effectSize.toFixed(4)}</Text>
                                    )}
                                    <Text>Target Power = {testResult.targetPower}</Text>
                                </Box>
                                {testResult.requiredSampleSize !== null && (
                                    <Box>
                                        <Text fontWeight="bold">Required Sample Size:</Text>
                                        <Text color="blue.600" fontSize="lg">{testResult.requiredSampleSize}</Text>
                                        <Text>Sample size needed to achieve {testResult.targetPower * 100}% power for effect size {testResult.effectSize.toFixed(4)}</Text>
                                    </Box>
                                )}
                            </Stack>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardBody>
                            <Text fontSize="lg" fontWeight="bold" mb={4}>Power Function Curve</Text>
                            <PowerFunctionChart
                                powerData={testResult.powerData}
                                title="Power Function Curve"
                                xLabel="True Mean Difference (μ - μ₀)"
                                yLabel="Power"
                            />
                        </CardBody>
                    </Card>
                </Stack>
            )}
        </Box>
    );
};

export default PowerFunction;