import React, { useState } from 'react';
import { 
  Box, 
  Text, 
  Card, 
  CardBody, 
  FormControl, 
  FormLabel, 
  Input, 
  Select, 
  Button, 
  Grid, 
  GridItem, 
  Alert, 
  AlertIcon, 
  AlertDescription 
} from '@chakra-ui/react';
import PowerFunctionChart from './PowerFunctionChart';
import { calculateSampleSizeForPower } from '../utils/statistics';

interface PowerFunctionProps {
  // 可选参数，用于从假设检验结果中传递默认值
  defaultMu0?: number;
  defaultSigma?: number;
  defaultN?: number;
  defaultAlpha?: number;
  defaultTestType?: 'two' | 'left' | 'right';
  defaultVarianceType?: 'known' | 'unknown';
}

const PowerFunction: React.FC<PowerFunctionProps> = ({
  defaultMu0 = 0,
  defaultSigma = 1,
  defaultN = 30,
  defaultAlpha = 0.05,
  defaultTestType = 'two',
  defaultVarianceType = 'known'
}) => {
  // 状态管理
  const [mu0, setMu0] = useState<number>(defaultMu0);
  const [sigma, setSigma] = useState<number>(defaultSigma);
  const [n, setN] = useState<number>(defaultN);
  const [alpha, setAlpha] = useState<number>(defaultAlpha);
  const [testType, setTestType] = useState<'two' | 'left' | 'right'>(defaultTestType);
  const [varianceType, setVarianceType] = useState<'known' | 'unknown'>(defaultVarianceType);
  const [mu1, setMu1] = useState<number>(mu0 + 1); // 备择假设均值
  const [beta, setBeta] = useState<number>(0.2); // 第II类错误概率
  const [sampleSizeResult, setSampleSizeResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 计算样本量
  const handleCalculateSampleSize = () => {
    try {
      setError(null);
      if (sigma <= 0) throw new Error('Standard deviation must be positive');
      if (n <= 0) throw new Error('Sample size must be positive');
      if (alpha <= 0 || alpha >= 1) throw new Error('Alpha must be between 0 and 1');
      if (beta <= 0 || beta >= 1) throw new Error('Beta must be between 0 and 1');
      
      const result = calculateSampleSizeForPower(mu1, mu0, sigma, alpha, beta, testType);
      setSampleSizeResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setSampleSizeResult(null);
    }
  };

  return (
    <Card>
      <CardBody>
        <Text fontSize="2xl" fontWeight="bold" mb={6}>Power Function Analysis</Text>
        
        {error && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Grid gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6} mb={6}>
          <GridItem>
            <Text fontSize="lg" fontWeight="semibold" mb={3}>Test Parameters</Text>
            
            <FormControl mb={3}>
              <FormLabel htmlFor="mu0">Null Hypothesis Mean (μ₀)</FormLabel>
              <Input
                id="mu0"
                type="number"
                value={mu0}
                onChange={(e) => setMu0(Number(e.target.value))}
                step="0.1"
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel htmlFor="sigma">Standard Deviation (σ)</FormLabel>
              <Input
                id="sigma"
                type="number"
                value={sigma}
                onChange={(e) => setSigma(Number(e.target.value))}
                step="0.1"
                min="0.1"
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel htmlFor="n">Sample Size (n)</FormLabel>
              <Input
                id="n"
                type="number"
                value={n}
                onChange={(e) => setN(Number(e.target.value))}
                min="1"
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel htmlFor="alpha">Significance Level (α)</FormLabel>
              <Input
                id="alpha"
                type="number"
                value={alpha}
                onChange={(e) => setAlpha(Number(e.target.value))}
                step="0.01"
                min="0.01"
                max="0.99"
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel htmlFor="testType">Test Type</FormLabel>
              <Select
                id="testType"
                value={testType}
                onChange={(e) => setTestType(e.target.value as 'two' | 'left' | 'right')}
              >
                <option value="two">Two-tailed</option>
                <option value="left">Left-tailed</option>
                <option value="right">Right-tailed</option>
              </Select>
            </FormControl>

            <FormControl mb={3}>
              <FormLabel htmlFor="varianceType">Variance Type</FormLabel>
              <Select
                id="varianceType"
                value={varianceType}
                onChange={(e) => setVarianceType(e.target.value as 'known' | 'unknown')}
              >
                <option value="known">Population Variance Known (Z-test)</option>
                <option value="unknown">Population Variance Unknown (t-test)</option>
              </Select>
            </FormControl>
          </GridItem>

          <GridItem>
            <Text fontSize="lg" fontWeight="semibold" mb={3}>Sample Size Calculation</Text>
            
            <FormControl mb={3}>
              <FormLabel htmlFor="mu1">Alternative Mean (μ₁)</FormLabel>
              <Input
                id="mu1"
                type="number"
                value={mu1}
                onChange={(e) => setMu1(Number(e.target.value))}
                step="0.1"
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel htmlFor="beta">Type II Error Rate (β)</FormLabel>
              <Input
                id="beta"
                type="number"
                value={beta}
                onChange={(e) => setBeta(Number(e.target.value))}
                step="0.01"
                min="0.01"
                max="0.99"
              />
            </FormControl>

            <Button 
              colorScheme="blue" 
              size="lg" 
              w="100%" 
              mt={3}
              onClick={handleCalculateSampleSize}
            >
              Calculate Required Sample Size
            </Button>

            {sampleSizeResult !== null && (
              <Box mt={4} p={4} border="1px" borderColor="blue.200" borderRadius="md" bg="blue.50">
                <Text fontSize="xl" fontWeight="bold" color="blue.800">
                  Required Sample Size: {sampleSizeResult}
                </Text>
                <Text mt={2} color="blue.700">
                  To achieve {((1 - beta) * 100).toFixed(0)}% power with α = {alpha} 
                  when testing μ₀ = {mu0} vs μ₁ = {mu1}
                </Text>
              </Box>
            )}
          </GridItem>
        </Grid>

        <Box mt={8}>
          <Text fontSize="lg" fontWeight="semibold" mb={3}>Power Function Visualization</Text>
          <PowerFunctionChart 
            mu0={mu0}
            sigma={sigma}
            n={n}
            alpha={alpha}
            testType={testType}
            varianceType={varianceType}
          />
        </Box>
        
        <Box mt={6} p={4} bg="gray.50" borderRadius="md">
          <Text fontSize="sm" color="gray.700">
            <strong>Note:</strong> The power function shows the probability of rejecting the null hypothesis 
            when the true mean is μ. At μ = μ₀, the power equals α (the significance level).
            As μ moves away from μ₀, the power increases.
          </Text>
        </Box>
      </CardBody>
    </Card>
  );
};

export default PowerFunction;