import React, { useState, useEffect } from 'react';
import { Box, Text, Grid, Select, FormControl, FormLabel, Input, Button, Card, CardBody, Alert, AlertIcon, Stack, Divider } from '@chakra-ui/react';
import { calculateZTestPower, calculateTTestPower, generatePowerFunctionData, calculateSampleSizeForPower } from '../utils/statistics';
import PowerFunctionChart from './PowerFunctionChart';

interface PowerFunctionProps {
  dataset?: number[];
}

const PowerFunction: React.FC<PowerFunctionProps> = ({ dataset }) => {
  // Power function parameters
  const [mu0, setMu0] = useState<number>(0);
  const [sigma, setSigma] = useState<number>(1);
  const [sampleSize, setSampleSize] = useState<number>(30);
  const [alpha, setAlpha] = useState<string>('0.05');
  const [testType, setTestType] = useState<'two' | 'left' | 'right'>('two');
  const [effectSize, setEffectSize] = useState<number>(0.5);
  const [hypothesisTestType, setHypothesisTestType] = useState<'z' | 't'>('z');
  
  // Results
  const [powerData, setPowerData] = useState<{ mu: number; power: number }[]>([]);
  const [currentPower, setCurrentPower] = useState<number | null>(null);
  const [requiredSampleSize, setRequiredSampleSize] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Calculate power function data when parameters change
  useEffect(() => {
    if (sigma <= 0 || sampleSize <= 0) return;
    
    try {
      setError(null);
      const alphaNum = parseFloat(alpha);
      const data = generatePowerFunctionData(mu0, sigma, sampleSize, alphaNum, testType, hypothesisTestType);
      setPowerData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating power function data');
    }
  }, [mu0, sigma, sampleSize, alpha, testType, hypothesisTestType]);

  // Calculate power for specific effect size
  const calculatePower = () => {
    try {
      setError(null);
      const alphaNum = parseFloat(alpha);
      const mu1 = mu0 + effectSize;
      const power = hypothesisTestType === 'z' 
        ? calculateZTestPower(mu0, mu1, sigma, sampleSize, alphaNum, testType)
        : calculateTTestPower(mu0, mu1, sigma, sampleSize, alphaNum, testType);
      setCurrentPower(power);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while calculating power');
    }
  };

  // Calculate required sample size for desired power
  const calculateRequiredSampleSize = () => {
    try {
      setError(null);
      const alphaNum = parseFloat(alpha);
      const beta = 0.2; // Default to 80% power
      const n = calculateSampleSizeForPower(mu0, mu0 + effectSize, sigma, alphaNum, beta, testType);
      setRequiredSampleSize(n);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while calculating sample size');
    }
  };

  // Update sample size from dataset if available
  useEffect(() => {
    if (dataset && dataset.length > 0) {
      setSampleSize(dataset.length);
    }
  }, [dataset]);

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" mb={4}>Power Function Analysis</Text>
      
      <Card mb={6}>
        <CardBody>
          <Text fontSize="lg" fontWeight="semibold" mb={4}>Parameters</Text>
          
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
            {/* Hypothesis test type */}
            <FormControl>
              <FormLabel>Hypothesis Test Type</FormLabel>
              <Select 
                value={hypothesisTestType} 
                onChange={(e) => setHypothesisTestType(e.target.value as 'z' | 't')}
              >
                <option value="z">Z-test</option>
                <option value="t">T-test</option>
              </Select>
            </FormControl>

            {/* Null hypothesis mean */}
            <FormControl>
              <FormLabel>Null Hypothesis Mean (μ₀)</FormLabel>
              <Input 
                type="number" 
                value={mu0} 
                onChange={(e) => setMu0(parseFloat(e.target.value) || 0)} 
                placeholder="Enter null hypothesis mean"
              />
            </FormControl>

            {/* Population standard deviation */}
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

            {/* Sample size */}
            <FormControl>
              <FormLabel>Sample Size (n)</FormLabel>
              <Input 
                type="number" 
                min="1" 
                value={sampleSize} 
                onChange={(e) => setSampleSize(parseInt(e.target.value) || 1)} 
                placeholder="Enter sample size"
              />
            </FormControl>

            {/* Significance level */}
            <FormControl>
              <FormLabel>Significance Level (α)</FormLabel>
              <Select 
                value={alpha} 
                onChange={(e) => setAlpha(e.target.value)}
              >
                <option value="0.01">0.01 (99% confidence level)</option>
                <option value="0.05">0.05 (95% confidence level)</option>
                <option value="0.10">0.10 (90% confidence level)</option>
              </Select>
            </FormControl>

            {/* Test type */}
            <FormControl>
              <FormLabel>Test Type</FormLabel>
              <Select 
                value={testType} 
                onChange={(e) => setTestType(e.target.value as 'two' | 'left' | 'right')}
              >
                <option value="two">Two-tailed Test (μ ≠ μ₀)</option>
                <option value="left">Left-tailed Test (μ &lt; μ₀)</option>
                <option value="right">Right-tailed Test (μ &gt; μ₀)</option>
              </Select>
            </FormControl>

            {/* Effect size */}
            <FormControl>
              <FormLabel>Effect Size (μ₁ - μ₀)</FormLabel>
              <Input 
                type="number" 
                step="any" 
                value={effectSize} 
                onChange={(e) => setEffectSize(parseFloat(e.target.value) || 0)} 
                placeholder="Enter effect size"
              />
            </FormControl>
          </Grid>

          <Stack direction={{ base: 'column', sm: 'row' }} spacing={4} mt={4}>
            <Button 
              onClick={calculatePower} 
              colorScheme="blue" 
              flex={1}
            >
              Calculate Power
            </Button>
            
            <Button 
              onClick={calculateRequiredSampleSize} 
              colorScheme="green" 
              flex={1}
            >
              Calculate Required Sample Size
            </Button>
          </Stack>
        </CardBody>
      </Card>

      {/* Error message */}
      {error && (
        <Alert status="error" mb={6}>
          <AlertIcon />
          <Text>{error}</Text>
        </Alert>
      )}

      {/* Results */}
      {(currentPower !== null || requiredSampleSize !== null) && (
        <Card mb={6}>
          <CardBody>
            <Text fontSize="lg" fontWeight="bold" mb={4}>Analysis Results</Text>
            
            <Stack spacing={3}>
              {currentPower !== null && !isNaN(currentPower) && (
                <Box>
                  <Text fontWeight="bold">Power for Given Effect Size:</Text>
                  <Text fontSize="xl" color="blue.600">{currentPower.toFixed(4)}</Text>
                  <Text fontSize="sm" color="gray.500">
                    For effect size (μ₁ - μ₀) = {effectSize}, sample size n = {sampleSize}, and significance level α = {alpha}
                  </Text>
                </Box>
              )}
              
              {requiredSampleSize !== null && !isNaN(requiredSampleSize) && (
                <Box>
                  <Text fontWeight="bold">Required Sample Size for 80% Power:</Text>
                  <Text fontSize="xl" color="green.600">{Math.round(requiredSampleSize)}</Text>
                  <Text fontSize="sm" color="gray.500">
                    For effect size (μ₁ - μ₀) = {effectSize}, significance level α = {alpha}, and desired power 0.80
                  </Text>
                </Box>
              )}
            </Stack>
          </CardBody>
        </Card>
      )}

      {/* Power function chart */}
      {powerData.length > 0 && (
        <Card>
          <CardBody>
            <PowerFunctionChart 
              powerData={powerData} 
              mu0={mu0}
              alpha={parseFloat(alpha)}
              effectSize={effectSize}
            />
          </CardBody>
        </Card>
      )}
    </Box>
  );
};

export default PowerFunction;