import React, { useState, useEffect } from 'react';
import { Box, Text, Input, FormControl, FormLabel, Select, Button, Card, Table, TableContainer, Divider } from '@chakra-ui/react';
import { calculateConfidenceInterval } from '../utils/statistics';
import { TailType, DistributionInfo, BasicStats } from '../types';

interface OneSampleMeanCIProps {
  dataset?: number[];
  isGeneratedDataset?: boolean;
  distributionInfo?: DistributionInfo | undefined;
  basicStats?: BasicStats | null;
  tailType?: TailType;
  onTailTypeChange?: (tailType: TailType) => void;
}

function OneSampleMeanCI({ 
  dataset = [], 
  isGeneratedDataset = false, 
  distributionInfo,
  basicStats,
  tailType: externalTailType,
  onTailTypeChange: externalOnTailTypeChange
}: OneSampleMeanCIProps) {
  // Use external tailType if provided, otherwise use default
  const tailType = externalTailType || 'two-tailed';
  
  // Handle tail type change
  const handleTailTypeChange = (newTailType: TailType) => {
    if (externalOnTailTypeChange) {
      externalOnTailTypeChange(newTailType);
    }
  };
  
  // State for user input
  const [sampleMean, setSampleMean] = useState<string>(basicStats?.mean ? basicStats.mean.toString() : '');
  const [sampleSize, setSampleSize] = useState<string>(basicStats?.count ? basicStats.count.toString() : '');
  const [sampleStd, setSampleStd] = useState<string>(basicStats?.std ? basicStats.std.toString() : '');
  const [populationStd, setPopulationStd] = useState<string>('');
  const [confidenceLevel, setConfidenceLevel] = useState<string>('0.95');
  const [isPopulationStdKnown, setIsPopulationStdKnown] = useState<boolean>(false);
  const [isNormal, setIsNormal] = useState<boolean>(true);
  
  // State for results
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string>('');
  
  // Update fields if dataset changes
  React.useEffect(() => {
    if (dataset.length > 0 && basicStats) {
      setSampleMean(basicStats.mean.toString());
      setSampleSize(basicStats.count.toString());
      setSampleStd(basicStats.std.toString());
    }
  }, [dataset, basicStats]);
  
  // Calculate confidence interval
  const handleCalculate = () => {
    try {
      setError('');
      
      // Validate inputs
      const mean = parseFloat(sampleMean);
      const size = parseInt(sampleSize, 10);
      const std = isPopulationStdKnown ? parseFloat(populationStd) : parseFloat(sampleStd);
      const level = parseFloat(confidenceLevel);
      
      if (isNaN(mean) || isNaN(size) || isNaN(std) || isNaN(level)) {
        throw new Error('请输入有效的数值');
      }
      
      if (size <= 0) {
        throw new Error('样本量必须大于0');
      }
      
      if (std <= 0) {
        throw new Error('标准差必须大于0');
      }
      
      if (level <= 0 || level >= 1) {
        throw new Error('置信水平必须在0和1之间');
      }
      
      // Calculate confidence interval
      // 创建数据数组用于计算
      const data = Array.from({ length: size }, () => mean);
      const result = calculateConfidenceInterval(data, level, {
        isNormal,
        knownVariance: isPopulationStdKnown,
        tailType
      });
      
      setResults(result);
    } catch (err: any) {
      setError(err.message);
      setResults(null);
    }
  };
  
  return (
    <Card p={4} shadow="sm">
        <Text fontSize="xl" fontWeight="bold" mb={4}>单样本均值置信区间</Text>
        
        <Box gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4} display="grid" mb={4}>
          {/* Tail type selection */}
          <FormControl mb={4}>
            <FormLabel htmlFor="tailType">置信区间类型</FormLabel>
            <Select
              id="tailType"
              value={tailType}
              onChange={(e) => handleTailTypeChange(e.target.value as TailType)}
              placeholder="选择置信区间类型"
            >
              <option value="two-tailed">双侧 (Two-tailed)</option>
              <option value="left-tailed">左侧 (Lower bound)</option>
              <option value="right-tailed">右侧 (Upper bound)</option>
            </Select>
          </FormControl>
          
          {/* Distribution assumption */}
          <FormControl mb={4}>
            <FormLabel htmlFor="isNormal">数据分布</FormLabel>
            <Select
              id="isNormal"
              value={isNormal ? 'normal' : 'non-normal'}
              onChange={(e) => setIsNormal(e.target.value === 'normal')}
              placeholder="选择数据分布"
            >
              <option value="normal">正态分布</option>
              <option value="non-normal">非正态分布</option>
            </Select>
          </FormControl>
        </Box>
        
        <Box gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4} display="grid" mb={4}>
          {/* Sample mean */}
          <FormControl mb={4}>
            <FormLabel htmlFor="sampleMean">样本均值</FormLabel>
            <Input
              id="sampleMean"
              type="number"
              value={sampleMean}
              onChange={(e) => setSampleMean(e.target.value)}
              placeholder="输入样本均值"
              step="any"
            />
          </FormControl>
          
          {/* Sample size */}
          <FormControl mb={4}>
            <FormLabel htmlFor="sampleSize">样本量</FormLabel>
            <Input
              id="sampleSize"
              type="number"
              value={sampleSize}
              onChange={(e) => setSampleSize(e.target.value)}
              placeholder="输入样本量"
              min="1"
              step="1"
            />
          </FormControl>
        </Box>
        
        <Box gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4} display="grid" mb={4}>
          {/* Standard deviation input based on whether population std is known */}
          {!isPopulationStdKnown ? (
            <FormControl mb={4}>
              <FormLabel htmlFor="sampleStd">样本标准差</FormLabel>
              <Input
                id="sampleStd"
                type="number"
                value={sampleStd}
                onChange={(e) => setSampleStd(e.target.value)}
                placeholder="输入样本标准差"
                step="any"
                min="0"
              />
            </FormControl>
          ) : (
            <FormControl mb={4}>
              <FormLabel htmlFor="populationStd">总体标准差</FormLabel>
              <Input
                id="populationStd"
                type="number"
                value={populationStd}
                onChange={(e) => setPopulationStd(e.target.value)}
                placeholder="输入总体标准差"
                step="any"
                min="0"
              />
            </FormControl>
          )}
          
          {/* Confidence level */}
          <FormControl mb={4}>
            <FormLabel htmlFor="confidenceLevel">置信水平</FormLabel>
            <Select
              id="confidenceLevel"
              value={confidenceLevel}
              onChange={(e) => setConfidenceLevel(e.target.value)}
              placeholder="选择置信水平"
            >
              <option value="0.90">90%</option>
              <option value="0.95">95%</option>
              <option value="0.99">99%</option>
              <option value="0.999">99.9%</option>
            </Select>
          </FormControl>
        </Box>
        
        {/* Population standard deviation toggle */}
        <Box mb={4} display="flex" alignItems="center">
          <Button 
            variant={isPopulationStdKnown ? "solid" : "outline"} 
            colorScheme="blue" 
            mr={2}
            size="sm"
            onClick={() => setIsPopulationStdKnown(!isPopulationStdKnown)}
          >
            {isPopulationStdKnown ? '使用样本标准差' : '使用总体标准差'}
          </Button>
          <Text fontSize="sm" color="gray.600">
            {isPopulationStdKnown ? '当前: 使用总体标准差' : '当前: 使用样本标准差'}
          </Text>
        </Box>
        
        {/* Calculate button */}
        <Button 
          colorScheme="blue" 
          onClick={handleCalculate} 
          mb={4} 
          w="100%"
          size="lg"
        >
          计算置信区间
        </Button>
        
        {/* Error message */}
        {error && (
          <Box mb={4} p={3} bg="red.50" borderLeft="4px" borderColor="red.400" color="red.700">
            {error}
          </Box>
        )}
        
        {/* Results */}
        {results && (
          <Card p={4} mt={4} bg="blue.50">
            <Text fontWeight="bold" mb={2}>计算结果</Text>
            <Box borderWidth="1px" borderRadius="md" overflow="hidden">
            <Box bg="blue.100" p={2} display="flex">
              <Box flex={1} fontWeight="bold">统计量</Box>
              <Box flex={1} fontWeight="bold">值</Box>
            </Box>
            <Box p={2}>
              <Box display="flex" borderBottom="1px solid" borderColor="gray.200" pb={2} mb={2}>
                <Box flex={1}>样本均值</Box>
                <Box flex={1}>{results.sampleMean.toFixed(4)}</Box>
              </Box>
              <Box display="flex" borderBottom="1px solid" borderColor="gray.200" pb={2} mb={2}>
                <Box flex={1}>样本量</Box>
                    <Box flex={1}>{results.sampleSize}</Box>
                    </Box>
                  <Box display="flex" borderBottom="1px solid" borderColor="gray.200" pb={2} mb={2}>
                    <Box flex={1}>标准差</Box>
                    <Box flex={1}>{(isPopulationStdKnown ? results.populationStd : results.sampleStd)?.toFixed(4)}</Box>
                  </Box>
                  <Box display="flex" borderBottom="1px solid" borderColor="gray.200" pb={2} mb={2}>
                    <Box flex={1}>置信水平</Box>
                    <Box flex={1}>{(results.confidenceLevel * 100).toFixed(1)}%</Box>
                  </Box>
                  <Box display="flex" borderBottom="1px solid" borderColor="gray.200" pb={2} mb={2}>
                    <Box flex={1}>方法</Box>
                    <Box flex={1}>{results.method}</Box>
                  </Box>
                  <Box display="flex" borderBottom="1px solid" borderColor="gray.200" pb={2} mb={2}>
                    <Box flex={1}>临界值</Box>
                    <Box flex={1}>{results.criticalValue.toFixed(4)}</Box>
                  </Box>
                  {tailType === 'two-tailed' && (
                    <>
                      <Box display="flex" borderBottom="1px solid" borderColor="gray.200" pb={2} mb={2}>
                        <Box flex={1}>置信区间下限</Box>
                        <Box flex={1}>{results.lowerBound.toFixed(4)}</Box>
                      </Box>
                      <Box display="flex" borderBottom="1px solid" borderColor="gray.200" pb={2} mb={2}>
                        <Box flex={1}>置信区间上限</Box>
                        <Box flex={1}>{results.upperBound.toFixed(4)}</Box>
                      </Box>
                      <Box display="flex" pb={2}>
                        <Box flex={1}>边际误差</Box>
                        <Box flex={1}>{results.marginOfError.toFixed(4)}</Box>
                      </Box>
                    </>
                  )}
                  {tailType === 'left-tailed' && (
                    <>
                      <Box display="flex" borderBottom="1px solid" borderColor="gray.200" pb={2} mb={2}>
                        <Box flex={1}>置信区间下限</Box>
                        <Box flex={1}>{results.lowerBound.toFixed(4)}</Box>
                      </Box>
                      <Box display="flex" pb={2}>
                        <Box flex={1}>置信区间上限</Box>
                        <Box flex={1}>{results.upperBound.toFixed(4)}</Box>
                      </Box>
                    </>
                  )}
                  {tailType === 'right-tailed' && (
                    <>
                      <Box display="flex" borderBottom="1px solid" borderColor="gray.200" pb={2} mb={2}>
                        <Box flex={1}>置信区间下限</Box>
                        <Box flex={1}>{results.lowerBound.toFixed(4)}</Box>
                      </Box>
                      <Box display="flex" pb={2}>
                        <Box flex={1}>置信区间上限</Box>
                        <Box flex={1}>{results.upperBound.toFixed(4)}</Box>
                      </Box>
                    </>
                  )}
                  </Box>
                </Box>
          </Card>
        )}
    </Card>
  );
}

export default OneSampleMeanCI;