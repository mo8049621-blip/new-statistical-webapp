import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Grid,
  Select,
  FormControl,
  FormLabel,
  Input,
  Button,
  Card,
  CardBody,
  Alert,
  AlertIcon,
  Stack,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  NumberInput,
  NumberInputField,
  Switch,
  Badge,
  HStack,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tooltip,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  executeGoFTest,
  calculateMLE,
  calculateMean,
  calculateStd,
  calculateVariance,
  generateHistogramData,
} from '../utils/statistics';
import {
  GoodnessOfFitTestProps,
  GoFTestType,
  DistributionTypeForGoF,
  GoFTestResult,
  TestDistributionOption,
  TestMethodOption,
} from '../types';

const GoodnessOfFitTest: React.FC<GoodnessOfFitTestProps> = ({
  dataset,
  isGeneratedDataset = false,
  distributionInfo = null,
  basicStats = null,
  onTestComplete,
}) => {
  // Test parameters state
  const [testType, setTestType] = useState<GoFTestType>('kolmogorov-smirnov');
  const [distributionType, setDistributionType] = useState<DistributionTypeForGoF>('normal');
  const [significanceLevel, setSignificanceLevel] = useState<string>('0.05');
  const [useCustomParameters, setUseCustomParameters] = useState<boolean>(false);
  const [customParams, setCustomParams] = useState<Record<string, number>>({});
  const [numBins, setNumBins] = useState<number>(10);
  const [autoEstimateParams, setAutoEstimateParams] = useState<boolean>(true);

  // Results state
  const [testResult, setTestResult] = useState<GoFTestResult | null>(null);
  const [estimatedParams, setEstimatedParams] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [histogramData, setHistogramData] = useState<any[]>([]);

  // Auto-test results state
  const [autoTestResults, setAutoTestResults] = useState<Array<{
    distributionType: string;
    distributionName: string;
    testType: string;
    testName: string;
    statistic: number;
    pValue: number;
    isReject: boolean;
    confidenceLevel: number;
    criticalValue?: number;
    degreesOfFreedom?: number;
    rank: number;
    isActualDistribution?: boolean;
  }>>([]);
  const [autoTestRunning, setAutoTestRunning] = useState<boolean>(false);
  const [recommendedDistribution, setRecommendedDistribution] = useState<any>(null);
  const [actualDistributionAccuracy, setActualDistributionAccuracy] = useState<{
    isRecommended: boolean;
    rank: number;
    pValue: number;
  } | null>(null);

  // Test configuration options
  const distributionOptions: TestDistributionOption[] = [
    {
      type: 'normal',
      name: 'Normal Distribution',
      description: 'Bell-shaped symmetric distribution',
      supportedTests: ['kolmogorov-smirnov', 'chi-square', 'anderson-darling', 'shapiro-wilk', 'jarque-bera'],
      requiresParameterEstimation: true,
      parameterNames: ['mean', 'std'],
      formula: 'f(x) = (1/σ√(2π)) * exp(-½((x-μ)/σ)²)',
    },
    {
      type: 'uniform',
      name: 'Uniform Distribution',
      description: 'Constant probability over an interval',
      supportedTests: ['kolmogorov-smirnov', 'chi-square'],
      requiresParameterEstimation: true,
      parameterNames: ['a', 'b'],
      formula: 'f(x) = 1/(b-a), for a ≤ x ≤ b',
    },
    {
      type: 'exponential',
      name: 'Exponential Distribution',
      description: 'Memoryless distribution for waiting times',
      supportedTests: ['kolmogorov-smirnov', 'chi-square'],
      requiresParameterEstimation: true,
      parameterNames: ['lambda'],
      formula: 'f(x) = λe^(-λx), for x ≥ 0',
    },
    {
      type: 'poisson',
      name: 'Poisson Distribution',
      description: 'Discrete distribution for counting events',
      supportedTests: ['kolmogorov-smirnov', 'chi-square'],
      requiresParameterEstimation: true,
      parameterNames: ['lambda'],
      formula: 'P(X=k) = (λ^k * e^(-λ))/k!',
    },
  ];

  const testMethodOptions: TestMethodOption[] = [
    {
      type: 'kolmogorov-smirnov',
      name: 'Kolmogorov-Smirnov Test',
      description: 'Non-parametric test comparing empirical and theoretical CDFs',
      applicableDistributions: ['normal', 'uniform', 'exponential', 'poisson'],
      assumptions: [
        'Continuous distribution',
        'Independent observations',
        'No estimated parameters from data (for exact test)',
      ],
      strengths: [
        'Distribution-free (when parameters are known)',
        'Sensitive to differences in distribution shape',
        'Works with small sample sizes',
      ],
      limitations: [
        'Less powerful for discrete distributions',
        'Requires known parameters for exact p-values',
        'Sensitive to parameter estimation',
      ],
    },
    {
      type: 'chi-square',
      name: 'Chi-Square Goodness-of-Fit Test',
      description: 'Test based on comparing observed vs expected frequencies',
      applicableDistributions: ['normal', 'uniform', 'exponential', 'poisson'],
      assumptions: [
        'Independent observations',
        'Expected frequency ≥ 5 in each bin',
        'Categorical or binned continuous data',
      ],
      strengths: [
        'Works with any distribution',
        'Can handle discrete and continuous data',
        'Well-established theory',
      ],
      limitations: [
        'Requires binning for continuous data',
        'Sensitive to bin selection',
        'Less powerful than KS test for some distributions',
      ],
    },
    {
      type: 'anderson-darling',
      name: 'Anderson-Darling Test',
      description: 'Modified KS test with more weight on tails',
      applicableDistributions: ['normal'],
      assumptions: [
        'Normal distribution',
        'Continuous distribution',
        'Independent observations',
      ],
      strengths: [
        'More powerful than KS for normal distribution',
        'Better sensitivity in tail regions',
        'Accounts for parameter estimation',
      ],
      limitations: [
        'Primarily for normal distribution',
        'More complex calculation',
        'Less intuitive interpretation',
      ],
    },
    {
      type: 'jarque-bera',
      name: 'Jarque-Bera Test',
      description: 'Test based on skewness and kurtosis',
      applicableDistributions: ['normal'],
      assumptions: [
        'Independent observations',
        'Sufficient sample size (n > 20)',
        'Symmetric distribution',
      ],
      strengths: [
        'Simple calculation',
        'Based on intuitive measures',
        'Good for large samples',
      ],
      limitations: [
        'Only tests for normality',
        'Less powerful for small samples',
        'Sensitive to outliers',
      ],
    },
  ];

  useEffect(() => {
    if (dataset && dataset.length > 0) {
      createHistogramData();
      estimateParameters();
    }
  }, [dataset, distributionType]);

  const createHistogramData = () => {
    try {
      const histogramData = generateHistogramData(dataset);
      setHistogramData(histogramData);
    } catch (err) {
      console.error('Error creating histogram data:', err);
    }
  };

  const estimateParameters = () => {
    if (!autoEstimateParams) return;

    try {
      let params: Record<string, number> = {};

      switch (distributionType) {
        case 'normal': {
          const mean = basicStats?.mean || calculateMean(dataset);
          const std = basicStats?.std || calculateStd(dataset);
          params = { mean, std };
          break;
        }
        case 'uniform': {
          const min = Math.min(...dataset);
          const max = Math.max(...dataset);
          params = { a: min, b: max };
          break;
        }
        case 'exponential': {
          const mean = calculateMean(dataset);
          params = { lambda: 1 / mean };
          break;
        }
        case 'poisson': {
          const mean = calculateMean(dataset);
          params = { lambda: mean };
          break;
        }
        default:
          break;
      }

      setEstimatedParams(params);
    } catch (err) {
      console.error('Error estimating parameters:', err);
    }
  };

  const handleCustomParamChange = (paramName: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setCustomParams(prev => ({
      ...prev,
      [paramName]: numValue,
    }));
  };

  const performTest = () => {
    try {
      setError(null);

      // Validate inputs
      if (!dataset || dataset.length === 0) {
        throw new Error('Dataset is required');
      }

      const alpha = parseFloat(significanceLevel);
      if (isNaN(alpha) || alpha <= 0 || alpha >= 1) {
        throw new Error('Significance level must be between 0 and 1');
      }

      if (dataset.length < 5) {
        throw new Error('Sample size must be at least 5');
      }

      // Get parameters to use
      const paramsToUse = useCustomParameters ? customParams : estimatedParams;

      // Execute the test
      const result = executeGoFTest(
        dataset,
        testType,
        distributionType,
        alpha,
        paramsToUse,
        { numBins }
      );

      setTestResult(result);

      if (onTestComplete) {
        onTestComplete(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Test execution failed');
      setTestResult(null);
    }
  };

  const getCurrentDistribution = () => {
    return distributionOptions.find(d => d.type === distributionType);
  };

  const getCurrentTestMethod = () => {
    return testMethodOptions.find(t => t.type === testType);
  };

  const isTestApplicable = () => {
    const distribution = getCurrentDistribution();
    return distribution ? distribution.supportedTests.includes(testType) : false;
  };

  const getInterpretation = (result: GoFTestResult) => {
    if (result.isReject) {
      return {
        conclusion: 'Reject the null hypothesis',
        interpretation: 'The data does NOT follow the specified distribution',
        color: 'red',
      };
    } else {
      return {
        conclusion: 'Fail to reject the null hypothesis',
        interpretation: 'The data is consistent with the specified distribution',
        color: 'green',
      };
    }
  };

  // 自动测试功能
  const performAutoTest = async () => {
    try {
      setError(null);
      setAutoTestRunning(true);
      setAutoTestResults([]);

      // 验证输入
      if (!dataset || dataset.length === 0) {
        throw new Error('数据集是必需的');
      }

      const alpha = parseFloat(significanceLevel);
      if (isNaN(alpha) || alpha <= 0 || alpha >= 1) {
        throw new Error('显著性水平必须在0和1之间');
      }

      if (dataset.length < 5) {
        throw new Error('样本大小必须至少为5');
      }

      const testResults: any[] = [];
      const alphaValue = parseFloat(significanceLevel);

      // 遍历所有分布类型和测试方法组合
      for (const distribution of distributionOptions) {
        for (const testMethod of testMethodOptions.filter(method => 
          distribution.supportedTests.includes(method.type)
        )) {
          try {
            // 计算参数估计
            let paramsToUse: Record<string, number> = {};

            switch (distribution.type) {
              case 'normal': {
                const mean = basicStats?.mean || calculateMean(dataset);
                const std = basicStats?.std || calculateStd(dataset);
                // 确保标准差不为0
                const safeStd = std > 0 ? std : Math.sqrt(calculateVariance(dataset));
                paramsToUse = { mean, std: safeStd };
                break;
              }
              case 'uniform': {
                // 使用更稳健的参数估计方法
                const sortedData = [...dataset].sort((a, b) => a - b);
                const n = sortedData.length;
                // 使用更稳健的极值估计，避免异常值影响
                const q1 = sortedData[Math.floor(n * 0.25)];
                const q3 = sortedData[Math.floor(n * 0.75)];
                const iqr = q3 - q1;
                
                // 使用四分位距来估计分布范围
                const min = Math.max(sortedData[0], q1 - 3 * iqr);
                const max = Math.min(sortedData[n-1], q3 + 3 * iqr);
                
                paramsToUse = { a: min, b: max };
                break;
              }
              case 'exponential': {
                const mean = calculateMean(dataset);
                // 确保均值有效
                if (mean <= 0) {
                  console.warn('Invalid mean for exponential distribution, using fallback');
                  paramsToUse = { lambda: 1 };
                } else {
                  paramsToUse = { lambda: 1 / mean };
                }
                break;
              }
              case 'poisson': {
                const mean = calculateMean(dataset);
                // 确保参数有效（泊松分布要求λ > 0）
                if (mean <= 0) {
                  console.warn('Invalid mean for Poisson distribution, using fallback');
                  paramsToUse = { lambda: 1 };
                } else {
                  paramsToUse = { lambda: mean };
                }
                break;
              }
            }

            // 执行测试
            const result = executeGoFTest(
              dataset,
              testMethod.type as GoFTestType,
              distribution.type as DistributionTypeForGoF,
              alphaValue,
              paramsToUse,
              { numBins }
            );

            // 添加到结果列表
            testResults.push({
              distributionType: distribution.type,
              distributionName: distribution.name,
              testType: testMethod.type,
              testName: testMethod.name,
              statistic: result.statistic,
              pValue: result.pValue,
              isReject: result.isReject,
              confidenceLevel: 1 - alphaValue,
              criticalValue: result.criticalValue,
              degreesOfFreedom: result.degreesOfFreedom,
              isActualDistribution: distributionInfo && distributionInfo.type === distribution.type,
            });

          } catch (testError) {
            console.warn(`测试失败 - ${distribution.name} + ${testMethod.name}:`, testError);
            // 添加失败的结果
            testResults.push({
              distributionType: distribution.type,
              distributionName: distribution.name,
              testType: testMethod.type,
              testName: testMethod.name,
              statistic: NaN,
              pValue: NaN,
              isReject: true,
              confidenceLevel: 1 - alphaValue,
              criticalValue: undefined,
              degreesOfFreedom: undefined,
            });
          }
        }
      }

      // 按p-value排序并应用综合评分算法
      const sortedResults = testResults
        .filter(result => !isNaN(result.pValue))
        .map(result => {
          // 计算综合评分，p-value权重70%，显著性权重30%
          const pValueScore = result.pValue;
          // 给不同测试方法适当的权重
          const methodWeightMap = {
            'kolmogorov-smirnov': 1.0,
            'chi-square': 0.9,
            'anderson-darling': 1.1,
            'jarque-bera': 0.8
          } as const;
          
          const methodWeight = methodWeightMap[result.testType as keyof typeof methodWeightMap] || 1.0;
          
          const significanceBonus = result.pValue > 0.1 ? 0.05 : 0; // 对高p-value给予小幅奖励
          const combinedScore = (pValueScore + significanceBonus) * methodWeight;
          
          return {
            ...result,
            combinedScore
          };
        })
        .sort((a, b) => b.combinedScore - a.combinedScore)
        .map((result, index) => ({ ...result, rank: index + 1 }));

      setAutoTestResults(sortedResults);

      // 设置推荐结果（p-value最高的）
      if (sortedResults.length > 0) {
        const recommended = sortedResults[0];
        setRecommendedDistribution(recommended);

        // 计算实际分布的准确性
        if (distributionInfo && distributionInfo.type) {
          const actualDistributionResult = sortedResults.find(
            result => result.distributionType === distributionInfo.type
          );
          
          if (actualDistributionResult) {
            setActualDistributionAccuracy({
              isRecommended: recommended.distributionType === distributionInfo.type,
              rank: actualDistributionResult.rank,
              pValue: actualDistributionResult.pValue,
            });
          } else {
            setActualDistributionAccuracy(null);
          }
        } else {
          setActualDistributionAccuracy(null);
        }
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : '自动测试执行失败');
    } finally {
      setAutoTestRunning(false);
    }
  };

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" mb={4}>Goodness-of-Fit Testing</Text>
      
      <Tabs variant="soft-rounded" colorScheme="blue" mb={6}>
        <TabList>
          <Tab>Test Configuration</Tab>
          <Tab>Auto Test</Tab>
          <Tab>Results & Visualization</Tab>
          <Tab>Help & Documentation</Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel>
            <VStack spacing={6} align="stretch">
              {/* Test Configuration */}
              <Card>
                <CardBody>
                  <Text fontSize="lg" fontWeight="bold" mb={4}>Test Configuration</Text>
                  
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                    {/* Distribution Type */}
                    <FormControl>
                      <FormLabel>Distribution to Test</FormLabel>
                      <Select 
                        value={distributionType} 
                        onChange={(e) => {
                          setDistributionType(e.target.value as DistributionTypeForGoF);
                          setTestType('kolmogorov-smirnov'); // Reset to default test
                        }}
                      >
                        {distributionOptions.map(dist => (
                          <option key={dist.type} value={dist.type}>
                            {dist.name}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Test Method */}
                    <FormControl>
                      <FormLabel>Test Method</FormLabel>
                      <Select 
                        value={testType} 
                        onChange={(e) => setTestType(e.target.value as GoFTestType)}
                      >
                        {testMethodOptions
                          .filter(method => 
                            getCurrentDistribution()?.supportedTests.includes(method.type)
                          )
                          .map(method => (
                            <option key={method.type} value={method.type}>
                              {method.name}
                            </option>
                          ))
                        }
                      </Select>
                    </FormControl>

                    {/* Significance Level */}
                    <FormControl>
                      <FormLabel>Significance Level (α)</FormLabel>
                      <Select 
                        value={significanceLevel} 
                        onChange={(e) => setSignificanceLevel(e.target.value)}
                      >
                        <option value="0.01">0.01 (99% confidence)</option>
                        <option value="0.05">0.05 (95% confidence)</option>
                        <option value="0.10">0.10 (90% confidence)</option>
                      </Select>
                    </FormControl>

                    {/* Chi-square specific: Number of bins */}
                    {testType === 'chi-square' && (
                      <FormControl>
                        <FormLabel>Number of Bins</FormLabel>
                        <NumberInput
                          min={5}
                          max={50}
                          value={numBins}
                          onChange={(value) => setNumBins(parseInt(value) || 10)}
                        >
                          <NumberInputField />
                        </NumberInput>
                      </FormControl>
                    )}
                  </Grid>

                  {/* Auto-estimate parameters toggle */}
                  <FormControl mt={4}>
                    <FormLabel>Parameter Estimation</FormLabel>
                    <HStack>
                      <Switch
                        isChecked={autoEstimateParams}
                        onChange={(e) => setAutoEstimateParams(e.target.checked)}
                      />
                      <Text>Automatically estimate parameters from data</Text>
                    </HStack>
                  </FormControl>
                </CardBody>
              </Card>

              {/* Parameters Section */}
              <Card>
                <CardBody>
                  <Text fontSize="lg" fontWeight="bold" mb={4}>
                    Distribution Parameters
                  </Text>
                  
                  {getCurrentDistribution()?.requiresParameterEstimation && (
                    <VStack spacing={4} align="stretch">
                      {!autoEstimateParams && (
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={2}>
                            Enter custom parameters for the {getCurrentDistribution()?.name}
                          </Text>
                          
                          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                            {getCurrentDistribution()?.parameterNames.map(paramName => (
                              <FormControl key={paramName}>
                                <FormLabel textTransform="capitalize">
                                  {paramName === 'std' ? 'Standard Deviation' : paramName}
                                </FormLabel>
                                <Input
                                  type="number"
                                  step="any"
                                  value={customParams[paramName] || ''}
                                  onChange={(e) => handleCustomParamChange(paramName, e.target.value)}
                                  placeholder={`Enter ${paramName}`}
                                />
                              </FormControl>
                            ))}
                          </Grid>
                        </Box>
                      )}

                      {autoEstimateParams && estimatedParams && Object.keys(estimatedParams).length > 0 && (
                        <Box p={3} bgColor="blue.50" borderRadius={4}>
                          <Text fontSize="sm" fontWeight="bold" mb={2}>
                            Estimated Parameters (from data):
                          </Text>
                          <Stack spacing={1}>
                            {Object.entries(estimatedParams).map(([param, value]) => (
                              <Text key={param} fontSize="sm">
                                {param === 'std' ? 'Standard Deviation' : param}: {value.toFixed(4)}
                              </Text>
                            ))}
                          </Stack>
                        </Box>
                      )}
                    </VStack>
                  )}
                </CardBody>
              </Card>

              {/* Execute Test Button */}
              <Button 
                onClick={performTest} 
                colorScheme="blue" 
                size="lg"
                isDisabled={!isTestApplicable()}
              >
                Perform Goodness-of-Fit Test
              </Button>
            </VStack>
          </TabPanel>

          {/* Auto Test Tab */}
          <TabPanel>
            <VStack spacing={6} align="stretch">
              {/* Auto Test Controls */}
              <Card>
                <CardBody>
                  <Text fontSize="lg" fontWeight="bold" mb={4}>自动拟合优度检验</Text>
                  <Text fontSize="sm" color="gray.600" mb={4}>
                    自动测试所有支持的分布类型和检验方法，基于p-value为您推荐最佳拟合的分布类型。
                  </Text>
                  
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                    {/* Significance Level */}
                    <FormControl>
                      <FormLabel>显著性水平 (α)</FormLabel>
                      <Select 
                        value={significanceLevel} 
                        onChange={(e) => setSignificanceLevel(e.target.value)}
                      >
                        <option value="0.01">0.01 (99% confidence)</option>
                        <option value="0.05">0.05 (95% confidence)</option>
                        <option value="0.10">0.10 (90% confidence)</option>
                      </Select>
                    </FormControl>

                    {/* Chi-square specific: Number of bins */}
                    <FormControl>
                      <FormLabel>卡方检验的分组数量</FormLabel>
                      <NumberInput
                        min={5}
                        max={50}
                        value={numBins}
                        onChange={(value) => setNumBins(parseInt(value) || 10)}
                      >
                        <NumberInputField />
                      </NumberInput>
                    </FormControl>
                  </Grid>

                  {/* Execute Auto Test Button */}
                  <Button 
                    onClick={performAutoTest} 
                    colorScheme="green" 
                    size="lg"
                    mt={4}
                    isLoading={autoTestRunning}
                    loadingText="正在进行自动测试..."
                  >
                    开始自动测试
                  </Button>
                </CardBody>
              </Card>

              {/* Recommended Distribution */}
              {recommendedDistribution && (
                <Card>
                  <CardBody>
                    <Text fontSize="lg" fontWeight="bold" mb={4}>推荐结果</Text>
                    <Box p={4} bgColor="green.50" borderRadius={4} border="1px" borderColor="green.200">
                      <Text fontWeight="bold" color="green.700" mb={2}>
                        🏆 最佳拟合分布
                      </Text>
                      <Text fontSize="lg" fontWeight="semibold" mb={2}>
                        {recommendedDistribution.distributionName}
                      </Text>
                      <Text fontSize="sm" color="green.600" mb={3}>
                        推荐理由：p-value = {recommendedDistribution.pValue.toFixed(4)} (最高)
                      </Text>
                      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                        <Box>
                          <Text fontSize="sm" fontWeight="bold">推荐使用的检验方法:</Text>
                          <Text fontSize="sm">{recommendedDistribution.testName}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" fontWeight="bold">置信水平:</Text>
                          <Text fontSize="sm">{(recommendedDistribution.confidenceLevel * 100).toFixed(1)}%</Text>
                        </Box>
                      </Grid>
                    </Box>

                    {/* Actual Distribution Comparison */}
                    {distributionInfo && actualDistributionAccuracy && (
                      <Box mt={4} p={4} bgColor="blue.50" borderRadius={4} border="1px" borderColor="blue.200">
                        <Text fontWeight="bold" color="blue.700" mb={2}>
                          📊 实际分布验证
                        </Text>
                        <Text fontSize="sm" fontWeight="semibold" mb={2}>
                          实际生成的数据分布：{distributionInfo.name}
                        </Text>
                        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                          <Box>
                            <Text fontSize="sm" fontWeight="bold">准确性评估:</Text>
                            <Text fontSize="sm" color={actualDistributionAccuracy.isRecommended ? "green.600" : "orange.600"}>
                              {actualDistributionAccuracy.isRecommended ? "✅ 算法正确推荐" : "⚠️ 算法推荐有误"}
                            </Text>
                          </Box>
                          <Box>
                            <Text fontSize="sm" fontWeight="bold">实际分布排名:</Text>
                            <Text fontSize="sm">
                              第 {actualDistributionAccuracy.rank} 名
                            </Text>
                          </Box>
                          <Box>
                            <Text fontSize="sm" fontWeight="bold">实际分布p-value:</Text>
                            <Text fontSize="sm">
                              {actualDistributionAccuracy.pValue.toFixed(4)}
                            </Text>
                          </Box>
                        </Grid>
                        {actualDistributionAccuracy.isRecommended ? (
                          <Alert status="success" mt={3} size="sm">
                            <AlertIcon />
                            <Text fontSize="sm">
                              🎉 很好！算法成功识别出正确的数据分布类型。
                            </Text>
                          </Alert>
                        ) : (
                          <Alert status="warning" mt={3} size="sm">
                            <AlertIcon />
                            <Text fontSize="sm">
                              ⚠️ 算法推荐了不同的分布类型。这可能是由于样本量不足、分布参数估计误差或其他统计因素造成的。
                            </Text>
                          </Alert>
                        )}
                      </Box>
                    )}

                    {!distributionInfo && (
                      <Alert status="info" mt={4} size="sm">
                        <AlertIcon />
                        <Text fontSize="sm">
                          💡 这是手动输入或上传的数据，算法基于统计测试结果推荐最拟合的分布类型。
                        </Text>
                      </Alert>
                    )}
                  </CardBody>
                </Card>
              )}

              {/* Auto Test Results Table */}
              {autoTestResults.length > 0 && (
                <Card>
                  <CardBody>
                    <Text fontSize="lg" fontWeight="bold" mb={4}>详细测试结果</Text>
                    <Box overflowX="auto">
                      <Table variant="simple" size="sm">
                        <Thead>
                          <Tr>
                            <Th>排名</Th>
                            <Th>分布类型</Th>
                            <Th>检验方法</Th>
                            <Th>检验统计量</Th>
                            <Th>p-value</Th>
                            <Th>结果</Th>
                            <Th>置信水平</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {autoTestResults.map((result, index) => (
                            <Tr key={`${result.distributionType}-${result.testType}`} 
                                bgColor={index === 0 ? "green.50" : result.isActualDistribution ? "blue.50" : "transparent"}
                                borderLeft={index === 0 ? "4px solid" : result.isActualDistribution ? "2px solid" : "none"}
                                borderLeftColor={index === 0 ? "green.400" : result.isActualDistribution ? "blue.400" : "transparent"}
                            >
                              <Td>
                                <HStack>
                                  {index === 0 && <Text>🥇</Text>}
                                  {result.isActualDistribution && <Text>📊</Text>}
                                  <Text>{result.rank}</Text>
                                </HStack>
                              </Td>
                              <Td>
                                <Text fontWeight={index === 0 || result.isActualDistribution ? "bold" : "normal"}>
                                  {result.distributionName}
                                  {result.isActualDistribution && (
                                    <Badge ml={2} colorScheme="blue" size="sm">
                                      实际分布
                                    </Badge>
                                  )}
                                </Text>
                              </Td>
                              <Td>{result.testName}</Td>
                              <Td>{isNaN(result.statistic) ? 'N/A' : result.statistic.toFixed(4)}</Td>
                              <Td>
                                <Text fontWeight={index === 0 ? "bold" : "normal"}
                                      color={index === 0 ? "green.600" : "inherit"}>
                                  {isNaN(result.pValue) ? 'N/A' : result.pValue.toFixed(4)}
                                </Text>
                              </Td>
                              <Td>
                                <Badge colorScheme={result.isReject ? 'red' : 'green'}>
                                  {result.isReject ? '拒绝原假设' : '接受原假设'}
                                </Badge>
                              </Td>
                              <Td>{(result.confidenceLevel * 100).toFixed(1)}%</Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                    
                    <Alert status="info" mt={4}>
                      <AlertIcon />
                      <Text fontSize="sm">
                        <strong>说明：</strong>p-value越大表示数据越符合该分布。排名第一的结果是最推荐的分布类型。
                      </Text>
                    </Alert>
                  </CardBody>
                </Card>
              )}
            </VStack>
          </TabPanel>

          {/* Results Tab */}
          <TabPanel>
            <VStack spacing={6} align="stretch">
              {/* Test Results */}
              {testResult && (
                <Card>
                  <CardBody>
                    <Text fontSize="lg" fontWeight="bold" mb={4}>Test Results</Text>
                    
                    {(() => {
                      const interpretation = getInterpretation(testResult);
                      
                      return (
                        <VStack spacing={4} align="stretch">
                          {/* Conclusion */}
                          <Box p={3} bgColor={`${interpretation.color}.50`} borderRadius={4}>
                            <Text fontWeight="bold" color={`${interpretation.color}.700`}>
                              Conclusion: {interpretation.conclusion}
                            </Text>
                            <Text fontSize="sm" color={`${interpretation.color}.600`}>
                              {interpretation.interpretation}
                            </Text>
                          </Box>

                          {/* Test Details */}
                          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                            <Box>
                              <Text fontWeight="bold">Test Information:</Text>
                              <Stack spacing={1}>
                                <Text fontSize="sm">Test: {testMethodOptions.find(t => t.type === testResult.testType)?.name}</Text>
                                <Text fontSize="sm">Distribution: {testResult.distributionType}</Text>
                                <Text fontSize="sm">Sample Size: {testResult.sampleSize}</Text>
                                <Text fontSize="sm">Significance Level: {testResult.significanceLevel}</Text>
                                {testResult.degreesOfFreedom && (
                                  <Text fontSize="sm">Degrees of Freedom: {testResult.degreesOfFreedom}</Text>
                                )}
                              </Stack>
                            </Box>

                            <Box>
                              <Text fontWeight="bold">Test Statistics:</Text>
                              <Stack spacing={1}>
                                <Text fontSize="sm">
                                  Test Statistic: {testResult.statistic.toFixed(4)}
                                </Text>
                                <Text fontSize="sm">
                                  P-value: {testResult.pValue.toFixed(4)}
                                </Text>
                                {testResult.criticalValue && (
                                  <Text fontSize="sm">
                                    Critical Value: {testResult.criticalValue.toFixed(4)}
                                  </Text>
                                )}
                                <Badge colorScheme={testResult.isReject ? 'red' : 'green'}>
                                  {testResult.isReject ? 'Reject H₀' : 'Fail to Reject H₀'}
                                </Badge>
                              </Stack>
                            </Box>
                          </Grid>
                        </VStack>
                      );
                    })()}
                  </CardBody>
                </Card>
              )}

              {/* Visualization */}
              {histogramData.length > 0 && (
                <Card>
                  <CardBody>
                    <Text fontSize="lg" fontWeight="bold" mb={4}>Data Distribution</Text>
                    <Box height="300px">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={histogramData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="name" 
                            tick={{ fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                          />
                          <YAxis />
                          <RechartsTooltip />
                          <Bar dataKey="value" fill="#3182ce" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardBody>
                </Card>
              )}
            </VStack>
          </TabPanel>

          {/* Help Tab */}
          <TabPanel>
            <VStack spacing={6} align="stretch">
              {/* Test Method Information */}
              <Card>
                <CardBody>
                  <Text fontSize="lg" fontWeight="bold" mb={4}>
                    {getCurrentTestMethod()?.name}
                  </Text>
                  
                  <Text mb={4}>{getCurrentTestMethod()?.description}</Text>

                  <Accordion allowMultiple>
                    <AccordionItem>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          <Text fontWeight="bold">Assumptions</Text>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel>
                        <VStack align="start" spacing={1}>
                          {getCurrentTestMethod()?.assumptions.map((assumption, index) => (
                            <Text key={index} fontSize="sm">• {assumption}</Text>
                          ))}
                        </VStack>
                      </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          <Text fontWeight="bold">Strengths</Text>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel>
                        <VStack align="start" spacing={1}>
                          {getCurrentTestMethod()?.strengths.map((strength, index) => (
                            <Text key={index} fontSize="sm">• {strength}</Text>
                          ))}
                        </VStack>
                      </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          <Text fontWeight="bold">Limitations</Text>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel>
                        <VStack align="start" spacing={1}>
                          {getCurrentTestMethod()?.limitations.map((limitation, index) => (
                            <Text key={index} fontSize="sm">• {limitation}</Text>
                          ))}
                        </VStack>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </CardBody>
              </Card>

              {/* Distribution Information */}
              <Card>
                <CardBody>
                  <Text fontSize="lg" fontWeight="bold" mb={4}>
                    {getCurrentDistribution()?.name}
                  </Text>
                  
                  <Text mb={4}>{getCurrentDistribution()?.description}</Text>
                  
                  {getCurrentDistribution()?.formula && (
                    <Box p={3} bgColor="gray.50" borderRadius={4} mb={4}>
                      <Text fontWeight="bold" fontSize="sm">Probability Density Function:</Text>
                      <Text fontFamily="monospace" fontSize="sm">
                        {getCurrentDistribution()?.formula}
                      </Text>
                    </Box>
                  )}

                  <Text fontWeight="bold" mb={2}>Parameters:</Text>
                  <Stack spacing={1}>
                    {getCurrentDistribution()?.parameterNames.map((param, index) => (
                      <Text key={index} fontSize="sm">
                        • {param === 'std' ? 'Standard Deviation (σ)' : param}
                      </Text>
                    ))}
                  </Stack>
                </CardBody>
              </Card>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Error Message */}
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          <Text>{error}</Text>
        </Alert>
      )}

      {/* Compatibility Warning */}
      {!isTestApplicable() && (
        <Alert status="warning" mb={4}>
          <AlertIcon />
          <Text>
            The selected test method ({getCurrentTestMethod()?.name}) is not applicable to the 
            {getCurrentDistribution()?.name}. Please select a compatible test method.
          </Text>
        </Alert>
      )}
    </Box>
  );
};

export default GoodnessOfFitTest;