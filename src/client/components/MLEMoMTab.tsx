import { useState, useEffect } from 'react';
import { Box, Text, Card, CardBody, Grid, Select, Button, Alert, AlertIcon, AlertDescription } from '@chakra-ui/react';
import { calculateMLE, calculateMoM } from '../utils/statistics';
import { EstimationResult, MLEMoMTabProps } from '../types';

function MLEMoMTab({ dataset, distribution, basicStats, isGeneratedDataset }: MLEMoMTabProps) {
  const [selectedDistribution, setSelectedDistribution] = useState<string>('normal');
  const [estimationResults, setEstimationResults] = useState<EstimationResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Automatically update selected distribution when dataset or distribution changes
    if (distribution && dataset.length > 0) {
      setSelectedDistribution(distribution.type || 'normal');
      handleEstimate();
    }
  }, [dataset, distribution, basicStats]);

  const handleDistributionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistribution(e.target.value);
  };

  const handleEstimate = () => {
    if (dataset.length === 0) {
      setError('Please import or generate data first');
      return;
    }

    setError(null);
    const results: EstimationResult[] = [];

    try {
      // Calculate MLE estimates
      const mleParams = calculateMLE(dataset, selectedDistribution, basicStats);
      results.push({
        method: 'Maximum Likelihood Estimation (MLE)',
        params: mleParams
      });

      // Calculate MoM estimates
      const momParams = calculateMoM(dataset, selectedDistribution, basicStats);
      results.push({
        method: 'Method of Moments (MoM)',
        params: momParams
      });

      setEstimationResults(results);
    } catch (err) {
      setError(`Estimation calculation failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Distribution options
  const distributionOptions = [
    { value: 'normal', label: 'Normal Distribution' },
    { value: 'exponential', label: 'Exponential Distribution' },
    { value: 'gamma', label: 'Gamma Distribution' },
    { value: 'beta', label: 'Beta Distribution' },
    { value: 'poisson', label: 'Poisson Distribution' },
    { value: 'uniform', label: 'Uniform Distribution' }
  ];

  return (
    <Box p={6}>
      <Grid gridTemplateColumns="1fr 2fr" gap={6}>
        <Box>
          <Card>
            <CardBody>
              <Text fontSize="lg" fontWeight="bold" mb={4}>Parameter Estimation</Text>
              
              {/* Only show manual selection option when distribution is unknown */}
              {!isGeneratedDataset ? (
                <Box mb={4}>
                  <Text mb={2}>Select Distribution Type:</Text>
                  <Select
                    value={selectedDistribution}
                    onChange={handleDistributionChange}
                    width="full"
                  >
                    {distributionOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </Box>
              ) : distribution ? (
                <Box mb={4} bg="blue.50" p={4} borderRadius="md">
                  <Text fontWeight="medium" mb={2}>Auto-detection Result:</Text>
                  <Text fontSize="sm" mb={1}>Distribution Type: {distribution.name}</Text>
                  {distribution.parameters && Object.entries(distribution.parameters).length > 0 && (
                    <Text fontSize="sm" mt={1}>Parameters: {Object.entries(distribution.parameters)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(', ')}
                    </Text>
                  )}
                  <Text fontSize="sm" mt={2} color="blue.700">
                    Using {distribution.name} for Maximum Likelihood Estimation and Method of Moments
                  </Text>
                </Box>
              ) : null}
              
              <Button
                colorScheme="blue"
                width="full"
                onClick={handleEstimate}
              >
                Perform Estimation
              </Button>
            </CardBody>
          </Card>
        </Box>

        <Box>
          {error && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {estimationResults.length > 0 && (
            <>
              {estimationResults.map((result, index) => (
                <Card key={index} mb={4}>
                  <CardBody>
                    <Text fontSize="md" fontWeight="bold" mb={2}>
                      {result.method}
                    </Text>
                    <Grid gridTemplateColumns="repeat(2, 1fr)" gap={2}>
                      {Object.entries(result.params).map(([param, value]) => (
                        <Box key={param}>
                          <Text fontSize="sm" color="gray.600">
                            {param}:
                          </Text>
                          <Text fontWeight="bold">
                            {typeof value === 'number' ? value.toFixed(4) : value}
                          </Text>
                        </Box>
                      ))}
                    </Grid>
                  </CardBody>
                </Card>
              ))}
            </>
          )}

          {estimationResults.length === 0 && !error && (
            <Alert status="info">
              <AlertIcon />
              <AlertDescription>Please select a distribution type and click the 'Perform Estimation' button</AlertDescription>
            </Alert>
          )}
        </Box>
      </Grid>
    </Box>
  );
}

export default MLEMoMTab;