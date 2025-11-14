import React, { useState } from 'react';
import { Box, Text, Grid, Select, FormControl, FormLabel, Input, Button, Card, CardBody, Alert, AlertIcon, Stack } from '@chakra-ui/react';
import { performZTest, performTTest } from '../utils/statistics';
import { HypothesisTestingTabProps } from '../types';

const HypothesisTestingTab: React.FC<HypothesisTestingTabProps> = ({ dataset, dataset2: _dataset2, pairedData: _pairedData, isGeneratedDataset: _isGeneratedDataset, distributionInfo: _distributionInfo, basicStats: _basicStats }) => {
  // Test parameter state
  const [mu0, setMu0] = useState<number>(0);
  const [alpha, setAlpha] = useState<string>('0.05');
  const [testType, setTestType] = useState<'two' | 'left' | 'right'>('two');
  const [varianceType, setVarianceType] = useState<'known' | 'unknown'>('unknown');
  const [sigma, setSigma] = useState<number>(1);
  const [testResult, setTestResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Perform hypothesis test
  const handleTest = () => {
    try {
      setError(null);
      
      // Validate input parameters
      const alphaNum = parseFloat(alpha);
      if (isNaN(alphaNum) || alphaNum <= 0 || alphaNum >= 1) {
        throw new Error('Significance level must be between 0 and 1');
      }
      
      if (varianceType === 'known' && (!sigma || sigma <= 0)) {
        throw new Error('When variance is known, a valid population standard deviation must be provided');
      }

      // Statistic calculation is now done inside performZTest and performTTest functions
      
      let result;
      if (varianceType === 'known') {
        // Execute Z test
        result = performZTest(dataset, mu0, sigma, alphaNum);
      } else {
        // Execute t test
        result = performTTest(dataset, mu0, alphaNum);
      }
      
      setTestResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during hypothesis testing');
      setTestResult(null);
    }
  };

  // Format infinity values
  const formatInfinity = (value: number): string => {
    if (value === Infinity) return '∞';
    if (value === -Infinity) return '-∞';
    return value.toFixed(4);
  };

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" mb={4}>One-Sample Mean Hypothesis Testing</Text>
      
      <Card mb={6}>
        <CardBody>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
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

            {/* Variance type */}
            <FormControl>
              <FormLabel>Variance Type</FormLabel>
              <Select 
                value={varianceType} 
                onChange={(e) => setVarianceType(e.target.value as 'known' | 'unknown')}
              >
                <option value="known">Known Variance</option>
                <option value="unknown">Unknown Variance</option>
              </Select>
            </FormControl>

            {/* Population standard deviation (shown when variance is known) */}
            {varianceType === 'known' && (
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
            )}
          </Grid>

          <Button 
            onClick={handleTest} 
            mt={4} 
            colorScheme="blue" 
            size="lg"
          >
            Perform Hypothesis Test
          </Button>
        </CardBody>
        </Card>

      {/* Error message */}
      {error && (
        <Alert status="error" mb={6}>
          <AlertIcon />
          <Text>{error}</Text>
        </Alert>
      )}

      {/* Test results */}
      {testResult && (
        <Card>
          <CardBody>
            <Text fontSize="lg" fontWeight="bold" mb={4}>Test Results</Text>
            
            <Stack spacing={3}>
              <Box>
                <Text fontWeight="bold">Test Method:</Text>
                <Text>{testResult.method}</Text>
              </Box>
              
              <Box>
                <Text fontWeight="bold">Hypotheses:</Text>
                <Text>H₀: μ = {mu0}</Text>
                <Text>H₁: {testType === 'two' ? 'μ ≠ ' : testType === 'left' ? 'μ < ' : 'μ > '}{mu0}</Text>
              </Box>
              
              <Box>
                <Text fontWeight="bold">Sample Statistics:</Text>
                <Text>Sample Mean = {testResult.mean.toFixed(4)}</Text>
                {testResult.testType === 't-test' && (
                  <Text>Sample Standard Deviation = {testResult.std.toFixed(4)}</Text>
                )}
                <Text>Sample Size = {dataset.length}</Text>
                {testResult.testType === 't-test' && (
                  <Text>Degrees of Freedom = {testResult.df}</Text>
                )}

              </Box>
              
              <Box>
                <Text fontWeight="bold">Test Statistic:</Text>
                <Text>{testResult.testType === 'Z-test' ? 'Z Statistic' : 't Statistic'} = {testResult.testType === 'Z-test' ? testResult.zValue.toFixed(4) : testResult.tValue.toFixed(4)}</Text>
              </Box>
              
              <Box>
                <Text fontWeight="bold">Critical Value:</Text>
                <Text>{testResult.testType === 'Z-test' ? 'Z' : 't'}{testType === 'two' ? 'α/2' : 'α'} = {testResult.criticalValue.toFixed(4)}</Text>
              </Box>
              
              <Box>
                <Text fontWeight="bold">p-value:</Text>
                <Text>{testResult.pValue.toFixed(6)}</Text>
              </Box>
              
              <Box>
                <Text fontWeight="bold">Confidence Interval:</Text>
                {testResult.confidenceInterval && (
                  <Text>[{formatInfinity(testResult.confidenceInterval.lower)}, {formatInfinity(testResult.confidenceInterval.upper)}]</Text>
                )}
              </Box>
              
              <Box>
                <Text fontWeight="bold">Conclusion:</Text>
                <Text color={testResult.rejected ? "red.600" : "green.600"}>
                  {testResult.rejected 
                    ? `At significance level α = ${alpha}, reject the null hypothesis H₀` 
                    : `At significance level α = ${alpha}, fail to reject the null hypothesis H₀`
                  }
                </Text>
              </Box>
              
              <Box>
                <Text fontWeight="bold">Decision Criteria:</Text>
                <Text>p-value Method: {testResult.pValue <= parseFloat(alpha) ? 'p-value ≤ α, reject H₀' : 'p-value > α, fail to reject H₀'}</Text>
                <Text>Critical Value Method: {testResult.rejected ? 'Test statistic falls in rejection region, reject H₀' : 'Test statistic does not fall in rejection region, fail to reject H₀'}</Text>
                {testResult.confidenceInterval && (
                  <Text>Confidence Interval Method: {testResult.rejected ? `μ₀ = ${mu0} is not in the confidence interval, reject H₀` : `μ₀ = ${mu0} is in the confidence interval, fail to reject H₀`}</Text>
                )}

              </Box>
            </Stack>
          </CardBody>
        </Card>
      )}
    </Box>
  );
};

export default HypothesisTestingTab;