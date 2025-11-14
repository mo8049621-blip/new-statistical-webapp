import { useState } from 'react';
import { Box, Text, Grid, Card, CardBody, Select, FormControl, FormLabel, Button, Input, Alert, AlertDescription } from '@chakra-ui/react';
import { calculateTwoSampleConfidenceInterval } from '../utils/statistics';

const TwoSampleCIComponent = () => {
  const [data1, setData1] = useState<string>('');
  const [data2, setData2] = useState<string>('');
  const [confidenceLevel, setConfidenceLevel] = useState<number>(0.95);
  const [method, setMethod] = useState<'pooled' | 'welch' | 'paired'>('welch');
  const [result, setResult] = useState<{
    lower: number;
    upper: number;
    marginOfError: number;
    method: string;
    criticalValue: number;
    meanDiff: number;
    mean1: number;
    mean2: number;
    n1: number;
    n2: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parseData = (input: string): number[] => {
    // Try multiple format parsing: comma-separated, space-separated, line-separated
    try {
      // First try to parse directly as JSON array
      if (input.trim().startsWith('[') && input.trim().endsWith(']')) {
        return JSON.parse(input);
      }
      // Otherwise parse by comma, space, newline, etc.
      return input
        .split(/[,\s\n]+/)
        .filter(item => item.trim() !== '')
        .map(item => parseFloat(item.trim()))
        .filter(num => !isNaN(num));
    } catch (e) {
      throw new Error('Data format error, please enter valid number list');
    }
  };

  const calculate = () => {
    setError(null);
    setResult(null);

    try {
      // Parse input data
      const dataset1 = parseData(data1);
      const dataset2 = parseData(data2);

      if (dataset1.length === 0 || dataset2.length === 0) {
        throw new Error('Dataset cannot be empty');
      }

      // If paired sample, check if lengths are the same
      if (method === 'paired' && dataset1.length !== dataset2.length) {
        throw new Error('Paired samples must have the same length');
      }

      // Calculate confidence interval for the difference between two means
      const ciResult = calculateTwoSampleConfidenceInterval(dataset1, dataset2, confidenceLevel, { method });

      // Calculate sample means
      const mean1 = dataset1.reduce((sum, val) => sum + val, 0) / dataset1.length;
      const mean2 = dataset2.reduce((sum, val) => sum + val, 0) / dataset2.length;

      setResult({
        ...ciResult,
        mean1,
        mean2,
        n1: dataset1.length,
        n2: dataset2.length
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error occurred during calculation');
    }
  };

  const handleDemoData = () => {
    // Set example data (two normal distribution samples)
    const demo1 = Array(20).fill(0).map(() => 5 + Math.random() * 2); // Sample with mean around 5
    const demo2 = Array(20).fill(0).map(() => 6 + Math.random() * 2); // Sample with mean around 6
    
    setData1(demo1.join(', '));
    setData2(demo2.join(', '));
    setMethod('welch');
    setConfidenceLevel(0.95);
    setError(null);
    setResult(null);
  };

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <Text fontSize="2xl" fontWeight="bold" mb={6}>Confidence Interval for Two Sample Means Difference</Text>
      
      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6} mb={8}>
        {/* First dataset input */}
        <FormControl>
          <FormLabel>Dataset 1</FormLabel>
          <Text fontSize="sm" color="gray.500" mb={2}>Enter comma-separated or space-separated list of numbers, e.g.: 1, 2, 3, 4, 5</Text>
          <Input
            as="textarea"
            placeholder="Enter numbers for first dataset..."
            value={data1}
            onChange={(e) => setData1(e.target.value)}
            rows={6}
          />
        </FormControl>

        {/* Second dataset input */}
        <FormControl>
          <FormLabel>Dataset 2</FormLabel>
          <Text fontSize="sm" color="gray.500" mb={2}>Enter comma-separated or space-separated list of numbers, e.g.: 6, 7, 8, 9, 10</Text>
          <Input
            as="textarea"
            placeholder="Enter numbers for second dataset..."
            value={data2}
            onChange={(e) => setData2(e.target.value)}
            rows={6}
          />
        </FormControl>
      </Grid>

      <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4} mb={6}>
        {/* Confidence level selection */}
        <FormControl>
          <FormLabel>Confidence Level</FormLabel>
          <Select 
            value={confidenceLevel} 
            onChange={(e) => setConfidenceLevel(parseFloat(e.target.value))}
          >
            <option value={0.90}>90%</option>
            <option value={0.95}>95%</option>
            <option value={0.99}>99%</option>
          </Select>
        </FormControl>

        {/* Method selection */}
        <FormControl>
          <FormLabel>Calculation Method</FormLabel>
          <Select 
            value={method} 
            onChange={(e) => setMethod(e.target.value as 'pooled' | 'welch' | 'paired')}
          >
            <option value="pooled">Pooled Variance t-test</option>
            <option value="welch">Welch t-test (Unequal Variances)</option>
            <option value="paired">Paired Samples t-test</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>&nbsp;</FormLabel>
          <Button 
            colorScheme="blue" 
            width="100%"
            onClick={calculate}
          >
            Calculate Confidence Interval
          </Button>
        </FormControl>

        <FormControl>
          <FormLabel>&nbsp;</FormLabel>
          <Button 
            variant="outline" 
            width="100%"
            onClick={handleDemoData}
          >
            Use Example Data
          </Button>
        </FormControl>
      </Grid>

      {/* Error message */}
      {error && (
        <Alert status="error" mb={6}>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Result display */}
      {result && (
        <>
          <Text fontSize="xl" fontWeight="bold" mb={4}>Calculation Results</Text>
          
          <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4} mb={8}>
            <Card>
              <CardBody>
                <Text fontSize="sm" color="gray.500">Dataset 1 Mean</Text>
                <Text fontSize="2xl" fontWeight="bold">{result.mean1.toFixed(4)}</Text>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Text fontSize="sm" color="gray.500">Dataset 2 Mean</Text>
                <Text fontSize="2xl" fontWeight="bold">{result.mean2.toFixed(4)}</Text>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Text fontSize="sm" color="gray.500">Mean Difference</Text>
                <Text fontSize="2xl" fontWeight="bold">{result.meanDiff.toFixed(4)}</Text>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Text fontSize="sm" color="gray.500">{Math.round(confidenceLevel * 100)}% Confidence Interval Lower Bound</Text>
                <Text fontSize="2xl" fontWeight="bold">{result.lower.toFixed(4)}</Text>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Text fontSize="sm" color="gray.500">{Math.round(confidenceLevel * 100)}% Confidence Interval Upper Bound</Text>
                <Text fontSize="2xl" fontWeight="bold">{result.upper.toFixed(4)}</Text>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Text fontSize="sm" color="gray.500">Margin of Error</Text>
                <Text fontSize="2xl" fontWeight="bold">{result.marginOfError.toFixed(4)}</Text>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Text fontSize="sm" color="gray.500">Critical Value</Text>
                <Text fontSize="2xl" fontWeight="bold">{result.criticalValue.toFixed(4)}</Text>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Text fontSize="sm" color="gray.500">Sample Size 1</Text>
                <Text fontSize="2xl" fontWeight="bold">{result.n1}</Text>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Text fontSize="sm" color="gray.500">Sample Size 2</Text>
                <Text fontSize="2xl" fontWeight="bold">{result.n2}</Text>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Text fontSize="sm" color="gray.500">Calculation Method</Text>
                <Text fontSize="2xl" fontWeight="bold">{result.method}</Text>
              </CardBody>
            </Card>
          </Grid>

          <Box p={4} borderWidth={1} borderRadius={4} bgColor="#f0f9ff" mb={4}>
            <Text fontSize="lg" fontWeight="bold" mb={2}>Confidence Interval Interpretation</Text>
            <Text>
              We are {Math.round(confidenceLevel * 100)}% confident that the difference between the two population means (μ₁ - μ₂) falls within the interval
              [{result.lower.toFixed(4)}, {result.upper.toFixed(4)}].
              {result.lower <= 0 && result.upper >= 0 && (
                <Text mt={2} color="orange.600">
                  Note: Since the confidence interval includes 0, we cannot reject the hypothesis that the two means are equal at the current confidence level.
                </Text>
              )}
              {result.lower > 0 && (
                <Text mt={2} color="green.600">
                  Conclusion: The population mean of Dataset 1 is significantly greater than that of Dataset 2.
                </Text>
              )}
              {result.upper < 0 && (
                <Text mt={2} color="green.600">
                  Conclusion: The population mean of Dataset 1 is significantly less than that of Dataset 2.
                </Text>
              )}
            </Text>
          </Box>
        </>
      )}

      <Box p={4} borderWidth={1} borderRadius={4} bgColor="#f9fafb" mt={8}>
        <Text fontSize="lg" fontWeight="bold" mb={2}>Instructions</Text>
        <Text mb={2}>1. Enter two datasets, supporting multiple formats (comma, space, or line-separated)</Text>
        <Text mb={2}>2. Select confidence level (90%, 95%, or 99%)</Text>
        <Text mb={2}>3. Select appropriate calculation method:</Text>
        <Text ml={4} mb={1}>- Pooled Variance t-test: Suitable for independent samples with equal variances</Text>
        <Text ml={4} mb={1}>- Welch t-test: Suitable for independent samples with unequal variances</Text>
        <Text ml={4} mb={1}>- Paired Samples t-test: Suitable for related paired data</Text>
        <Text>4. Click the "Calculate Confidence Interval" button to view results</Text>
      </Box>
    </Box>
  );
};

export default TwoSampleCIComponent;