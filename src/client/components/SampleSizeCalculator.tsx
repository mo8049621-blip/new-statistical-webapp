import React, { useState, useEffect } from 'react';
import { calculateSampleSizeForMean, calculateSampleSizeForProportion } from '../utils/statistics';
import { 
  Card, 
  CardBody, 
  Text, 
  FormControl, 
  Radio, 
  RadioGroup, 
  Input, 
  Button, 
  Box, 
  Alert, 
  Divider, 
  Grid, 
  GridItem, 
  Switch, 
  FormLabel, 
  FormHelperText 
} from '@chakra-ui/react';
import { BasicStats } from '../types';

interface SampleSizeCalculatorProps {
  dataset?: number[];
  basicStats?: BasicStats | null;
}

const SampleSizeCalculator: React.FC<SampleSizeCalculatorProps> = ({ dataset, basicStats }) => {
  // Calculation Type: Mean or Proportion
  const [calculationType, setCalculationType] = useState<'mean' | 'proportion'>('mean');
  // Confidence Level
  const [confidenceLevel, setConfidenceLevel] = useState<number>(0.95);
  // Margin of Error (half-width of confidence interval)
  const [marginOfError, setMarginOfError] = useState<string>('');
  // Parameters for Mean Calculation
  const [meanParams, setMeanParams] = useState({
    populationStd: '',
    estimatedStd: '',
    useTDistribution: false
  });
  // Parameters for Proportion Calculation
  const [proportionParams, setProportionParams] = useState({
    estimatedProportion: '',
    useConservativeEstimate: true
  });
  // Calculation Result
  const [result, setResult] = useState<number | null>(null);
  // Error Message
  const [error, setError] = useState<string | null>(null);

  // Auto-populate standard deviation (if dataset or basic statistics are available)
  useEffect(() => {
    // Prefer using passed basic statistics
    if (basicStats && basicStats.std !== undefined) {
      setMeanParams(prev => ({ ...prev, estimatedStd: basicStats.std.toString() }));
    } 
    // Otherwise calculate using dataset
    else if (dataset && dataset.length > 0) {
      // Simple implementation for calculating standard deviation
      const mean = dataset.reduce((sum, val) => sum + val, 0) / dataset.length;
      const std = Math.sqrt(dataset.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (dataset.length - 1));
      setMeanParams(prev => ({ ...prev, estimatedStd: std.toString() }));
    }
  }, [dataset, basicStats]);

  // Handle calculation
  const handleCalculate = () => {
    try {
      setError(null);
      setResult(null);

      // Validate margin of error
      const margin = parseFloat(marginOfError);
      if (isNaN(margin) || margin <= 0) {
        throw new Error('Please enter a valid margin of error (must be greater than 0)');
      }

      let sampleSize: number;

      if (calculationType === 'mean') {
        // Mean sample size calculation
        const populationStd = meanParams.populationStd ? parseFloat(meanParams.populationStd) : undefined;
        const estimatedStd = meanParams.estimatedStd ? parseFloat(meanParams.estimatedStd) : undefined;

        // Validate standard deviation
        if (populationStd !== undefined && (isNaN(populationStd) || populationStd <= 0)) {
          throw new Error('Population standard deviation must be greater than 0');
        }
        if (estimatedStd !== undefined && (isNaN(estimatedStd) || estimatedStd <= 0)) {
          throw new Error('Estimated standard deviation must be greater than 0');
        }

        sampleSize = calculateSampleSizeForMean(confidenceLevel, margin, {
          populationStd,
          estimatedStd,
          useTDistribution: meanParams.useTDistribution
        });
      } else {
        // Proportion sample size calculation
        let estimatedProportion: number | undefined;
        if (!proportionParams.useConservativeEstimate) {
          estimatedProportion = parseFloat(proportionParams.estimatedProportion);
          if (isNaN(estimatedProportion) || estimatedProportion < 0 || estimatedProportion > 1) {
            throw new Error('Estimated proportion must be between 0 and 1');
          }
        }

        sampleSize = calculateSampleSizeForProportion(confidenceLevel, margin, {
          estimatedProportion,
          useConservativeEstimate: proportionParams.useConservativeEstimate
        });
      }

      setResult(sampleSize);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during calculation');
    }
  };

  // Reset form
  const handleReset = () => {
    setMarginOfError('');
    setMeanParams({
      populationStd: '',
      estimatedStd: '',
      useTDistribution: false
    });
    setProportionParams({
      estimatedProportion: '',
      useConservativeEstimate: true
    });
    setResult(null);
    setError(null);
  };

  return (
    <Card maxW="100%" margin="20px auto">
      <CardBody>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Sample Size Calculator
        </Text>
        
        <Text fontSize="sm" color="gray.600" mb={4}>
          Calculate the minimum sample size needed to achieve your desired precision based on the specified confidence level and margin of error.
        </Text>

        <Divider my={2} />

        {/* Calculation Type Selection */}
        <FormControl mb={3}>
          <FormLabel fontSize="lg" mb={2}>
            Calculation Type
          </FormLabel>
          <RadioGroup
            value={calculationType}
            onChange={(value) => {
              setCalculationType(value as 'mean' | 'proportion');
              setResult(null);
              setError(null);
            }}
          >
            <Box mr={4}>
              <Radio value="mean" />
              <Text ml={2} display="inline">Mean</Text>
            </Box>
            <Box>
              <Radio value="proportion" />
              <Text ml={2} display="inline">Proportion</Text>
            </Box>
          </RadioGroup>
        </FormControl>

        <Grid templateColumns={{ sm: '1fr 1fr' }} gap={4}>
          {/* Confidence Level */}
          <GridItem>
            <FormControl>
              <FormLabel>Confidence Level</FormLabel>
              <Input
                type="number"
                value={confidenceLevel}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value) && value > 0 && value < 1) {
                    setConfidenceLevel(value);
                    setResult(null);
                  }
                }}
                placeholder="e.g., 0.95"
                mb={2}
              />
            </FormControl>
          </GridItem>

          {/* Margin of Error */}
          <GridItem>
            <FormControl>
              <FormLabel>Margin of Error</FormLabel>
              <Input
                type="number"
                value={marginOfError}
                onChange={(e) => {
                  setMarginOfError(e.target.value);
                  setResult(null);
                }}
                placeholder={calculationType === 'mean' ? "e.g., 2.5" : "e.g., 0.03"}
                mb={2}
              />
            </FormControl>
          </GridItem>
        </Grid>

        {/* Mean-related Parameters */}
        {calculationType === 'mean' && (
          <Box mt={2} mb={3}>
            <FormLabel fontSize="lg" mb={2}>
                Mean Parameters
              </FormLabel>
            
            <Grid templateColumns={{ sm: '1fr 1fr' }} gap={4}>
              <GridItem>
                <FormControl>
                  <FormLabel>Population Standard Deviation (when known)</FormLabel>
                  <Input
                    type="number"
                    value={meanParams.populationStd}
                    onChange={(e) => {
                      setMeanParams({ ...meanParams, populationStd: e.target.value });
                      setResult(null);
                    }}
                    mb={2}
                  />
                </FormControl>
              </GridItem>
              
              <GridItem>
                <FormControl>
                  <FormLabel>Estimated Standard Deviation (when variance unknown)</FormLabel>
                  <Input
                    type="number"
                    value={meanParams.estimatedStd}
                    onChange={(e) => {
                      setMeanParams({ ...meanParams, estimatedStd: e.target.value });
                      setResult(null);
                    }}
                    mb={1}
                  />
                  <FormHelperText>Tip: When variance is unknown, standard deviation can be estimated from pilot studies or historical data</FormHelperText>
                </FormControl>
              </GridItem>
            </Grid>
            
            <Box mt={2}>
              <Switch
                id="use-t-distribution"
                isChecked={meanParams.useTDistribution}
                onChange={(e) => {
                  setMeanParams({ ...meanParams, useTDistribution: e.target.checked });
                  setResult(null);
                }}
              />
              <FormLabel htmlFor="use-t-distribution" mb={0} ml={2} display="inline">
                  Use t-distribution (more accurate for small samples)
                </FormLabel>
            </Box>
            
            <Alert status="info" mt={2}>
                <Text fontSize="sm">
                  When population variance is unknown, you must provide an estimated standard deviation. This can be obtained through:
                </Text>
                <ul style={{ marginTop: '5px', marginBottom: '5px', paddingLeft: '20px', fontSize: 'sm' }}>
                  <li>Results from previous or similar studies</li>
                  <li>Pilot study data</li>
                  <li>If range is known, standard deviation can be roughly estimated as range/6</li>
                </ul>
              </Alert>
          </Box>
        )}

        {/* Proportion-related Parameters */}
        {calculationType === 'proportion' && (
          <Box mt={2} mb={3}>
            <FormLabel fontSize="lg" mb={2}>
                Proportion Parameters
              </FormLabel>
            
            <Box mb={2}>
              <Switch
                id="use-conservative-estimate"
                isChecked={proportionParams.useConservativeEstimate}
                onChange={(e) => {
                  setProportionParams({ ...proportionParams, useConservativeEstimate: e.target.checked });
                  setResult(null);
                }}
              />
              <FormLabel htmlFor="use-conservative-estimate" mb={0} ml={2} display="inline">
                  Use conservative estimate (p=0.5, ensures maximum sample size)
                </FormLabel>
            </Box>
            
            {!proportionParams.useConservativeEstimate && (
              <FormControl>
                <FormLabel>Estimated Proportion</FormLabel>
                <Input
                  type="number"
                  value={proportionParams.estimatedProportion}
                  onChange={(e) => {
                    setProportionParams({ ...proportionParams, estimatedProportion: e.target.value });
                    setResult(null);
                  }}
                  placeholder="e.g., 0.65"
                  my={2}
                />
              </FormControl>
            )}
            
            <Alert status="info" mt={2}>
                <Text fontSize="sm">
                  Conservative estimate uses p=0.5 (where variance is maximized), ensuring the calculated sample size is large enough regardless of the actual proportion.
                  If you have previous research or theoretical basis to estimate the proportion, you can uncheck conservative estimate and enter your estimate.
                </Text>
              </Alert>
          </Box>
        )}

        {/* Action Buttons */}
        <Box mt={3} display="flex" gap={2}>
          <Button colorScheme="blue" onClick={handleCalculate}>
                Calculate Sample Size
              </Button>
              <Button variant="outline" colorScheme="gray" onClick={handleReset}>
                Reset
              </Button>
        </Box>

        {/* Error Message */}
        {error && (
          <Alert status="error" mt={3}>
            {error}
          </Alert>
        )}

        {/* Calculation Result - Optimized Display */}
        {result !== null && (
          <Card mt={4} bg="green.50" borderWidth={2} borderColor="green.300">
            <CardBody>
              <Text fontSize="lg" fontWeight="bold" mb={2} color="green.700">
                Calculation Result ✓
              </Text>
              <Text fontSize="1.5rem" fontWeight="bold" color="green.800" mb={3}>
                Minimum Required Sample Size: {result}
              </Text>
              <Text fontSize="sm" color="gray.700" mt={1}>
                Confidence Level: {(confidenceLevel * 100).toFixed(1)}%
              </Text>
              <Text fontSize="sm" color="gray.700">
                Margin of Error: {marginOfError}
              </Text>
            </CardBody>
          </Card>
        )}
      </CardBody>
    </Card>
  );
};

export default SampleSizeCalculator;