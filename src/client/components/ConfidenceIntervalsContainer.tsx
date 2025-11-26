import { useState } from 'react';
import { Box, Text, Button, Stack, Divider } from '@chakra-ui/react';
import OneSampleMeanCI from './OneSampleMeanCI';
import TwoSampleMeanCI from './TwoSampleMeanCI';
import ProportionCI from './ProportionCI';
import PairedMeanCI from './PairedMeanCI';
import TwoProportionCI from './TwoProportionCI';
import { TailType } from '../utils/statistics';
import { ConfidenceIntervalsContainerProps, DistributionInfo } from '../types';

// Using the imported interface from types.ts

function ConfidenceIntervalsContainer({ 
  dataset = [], 
  dataset2 = [], 
  pairedData = { before: [], after: [] },
  isGeneratedDataset = false,
  distributionInfo,
  basicStats,
  tailType: externalTailType,
  onTailTypeChange: externalOnTailTypeChange
}: ConfidenceIntervalsContainerProps) {
  // Primary category: mean difference and proportion
  const [primaryCategory, setPrimaryCategory] = useState('mean'); // 'mean' or 'proportion'
  
  // Secondary category: specific type under mean difference
  const [meanSubType, setMeanSubType] = useState('oneSample'); // 'oneSample', 'twoSample', 'paired'
  
  // Secondary category: specific type under proportion
  const [proportionSubType, setProportionSubType] = useState('oneProportion'); // 'oneProportion', 'twoProportion'
  
  // Tail type for confidence intervals
  const [internalTailType, setInternalTailType] = useState<TailType>('two-tailed');
  
  // Use external tailType if provided, otherwise use internal state
  const tailType = externalTailType ?? internalTailType;
  
  // Handle tail type change
  const handleTailTypeChange = (newTailType: TailType) => {
    if (externalOnTailTypeChange) {
      externalOnTailTypeChange(newTailType);
    } else {
      setInternalTailType(newTailType);
    }
  };

  // Render corresponding confidence interval component based on selected type
  const renderIntervalComponent = () => {
    if (primaryCategory === 'mean') {
      switch (meanSubType) {
        case 'oneSample':
          return <OneSampleMeanCI 
            dataset={dataset} 
            isGeneratedDataset={isGeneratedDataset} 
            distributionInfo={distributionInfo || undefined}
            tailType={tailType}
            onTailTypeChange={handleTailTypeChange}
          />;
        case 'twoSample':
          return <TwoSampleMeanCI 
            dataset1={dataset} 
            dataset2={dataset2} 
            tailType={tailType}
            onTailTypeChange={handleTailTypeChange}
          />;
        case 'paired':
          return <PairedMeanCI 
            pairedData={pairedData} 
            tailType={tailType}
            onTailTypeChange={handleTailTypeChange}
          />;
        default:
          return <OneSampleMeanCI dataset={dataset} />;
      }
    } else if (primaryCategory === 'proportion') {
      switch (proportionSubType) {
        case 'oneProportion':
          return <ProportionCI dataset={dataset} />;
        case 'twoProportion':
          return <TwoProportionCI />;
        default:
          return <ProportionCI dataset={dataset} />;
      }
    }
    return <OneSampleMeanCI dataset={dataset} basicStats={basicStats || undefined} />;
  };

  return (
    <Box p={6} bg="white" rounded="lg" shadow="md">
      <Text fontSize="xl" fontWeight="bold" mb={6} textAlign="center">
        Confidence Interval Analysis
      </Text>
      
      {/* Primary category buttons */}
      <Stack direction="row" gap={4} mb={4} justifyContent="center">
        <Button
          variant={primaryCategory === 'mean' ? "solid" : "outline"}
          colorScheme="blue"
          size="lg"
          onClick={() => setPrimaryCategory('mean')}
        >
          Mean Difference
        </Button>
        <Button
          variant={primaryCategory === 'proportion' ? "solid" : "outline"}
          colorScheme="blue"
          size="lg"
          onClick={() => setPrimaryCategory('proportion')}
        >
          Proportion
        </Button>
      </Stack>
      
      <Divider mb={4} />
      
      {/* Secondary category buttons - show different options based on primary category */}
      {primaryCategory === 'mean' && (
        <Stack direction="row" gap={2} mb={6} flexWrap="wrap" justifyContent="center">
          <Button
            variant={meanSubType === 'oneSample' ? "solid" : "outline"}
            colorScheme="green"
            onClick={() => setMeanSubType('oneSample')}
          >
            One Sample Mean
          </Button>
          <Button
            variant={meanSubType === 'twoSample' ? "solid" : "outline"}
            colorScheme="green"
            onClick={() => setMeanSubType('twoSample')}
          >
            Two Sample Mean Difference
          </Button>
          <Button
            variant={meanSubType === 'paired' ? "solid" : "outline"}
            colorScheme="green"
            onClick={() => setMeanSubType('paired')}
          >
            Paired Sample Mean Difference
          </Button>
        </Stack>
      )}
      
      {primaryCategory === 'proportion' && (
        <Stack direction="row" gap={2} mb={6} flexWrap="wrap" justifyContent="center">
          <Button
            variant={proportionSubType === 'oneProportion' ? "solid" : "outline"}
            colorScheme="green"
            onClick={() => setProportionSubType('oneProportion')}
          >
            One Proportion
          </Button>
          <Button
            variant={proportionSubType === 'twoProportion' ? "solid" : "outline"}
            colorScheme="green"
            onClick={() => setProportionSubType('twoProportion')}
          >
            Two Proportion Difference
          </Button>
        </Stack>
      )}
      
      {/* Render the selected confidence interval component */}
      <Box p={4}>
        {renderIntervalComponent()}
      </Box>
    </Box>
  );
}

export default ConfidenceIntervalsContainer;