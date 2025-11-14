import React from 'react';
import { Box, Text, Card, CardBody } from '@chakra-ui/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generatePowerFunctionData, calculateZTestPower, calculateTTestPower } from '../utils/statistics';

interface PowerFunctionChartProps {
  mu0: number;
  sigma: number;
  n: number;
  alpha: number;
  testType: 'two' | 'left' | 'right';
  varianceType: 'known' | 'unknown';
}

const PowerFunctionChart: React.FC<PowerFunctionChartProps> = ({
  mu0,
  sigma,
  n,
  alpha,
  testType,
  varianceType,
}) => {
  // 生成功效函数数据
  const powerData = generatePowerFunctionData(mu0, sigma, n, alpha, testType, varianceType);
  
  // 添加调试信息，验证数据是否有效
  React.useEffect(() => {
    console.log('Power Function Data:', powerData.slice(0, 5)); // 只打印前5个数据点
    console.log('Data length:', powerData.length);
    // 检查是否有NaN值
    const hasNaN = powerData.some(point => isNaN(point.mu) || isNaN(point.power));
    console.log('Has NaN values:', hasNaN);
    // 检查power值的范围
    const minPower = Math.min(...powerData.map(p => p.power));
    const maxPower = Math.max(...powerData.map(p => p.power));
    console.log('Power range:', { min: minPower, max: maxPower });
  }, [powerData]);

  // 计算在原假设下的功效（应该等于alpha）
  const alphaValue = varianceType === 'known' 
    ? calculateZTestPower(mu0, mu0, sigma, n, alpha, testType)
    : calculateTTestPower(mu0, mu0, sigma, n, alpha, testType);

  // 格式化功效值显示
  const formatPowerValue = (value: number): string => {
    return value.toFixed(4);
  };

  // 格式化均值显示
  const formatMuValue = (value: number): string => {
    return value.toFixed(2);
  };

  return (
    <Card mb={6}>
      <CardBody>
        <Text fontSize="xl" fontWeight="bold" mb={4}>Power Function Visualization</Text>
        <Box h={400}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={powerData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="mu" 
                label={{ value: 'Mean (μ)', position: 'insideBottomRight', offset: -10 }}
                tickFormatter={formatMuValue}
              />
              <YAxis 
                domain={[0, 1]} 
                label={{ value: 'Power', angle: -90, position: 'insideLeft' }}
                tickFormatter={formatPowerValue}
                ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0]} // 明确设置刻度值，确保显示80%功效位置
              />
              <Tooltip 
                formatter={(value: number) => formatPowerValue(value)}
                labelFormatter={(label: number) => `μ = ${formatMuValue(label)}`}
                labelStyle={{ color: '#333' }}
                contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }}
              />
              <Line 
                type="monotone" 
                dataKey="power" 
                stroke="#3182ce" 
                strokeWidth={3} // 增加线宽使其更明显
                dot={{ stroke: '#3182ce', strokeWidth: 2, r: 4, fill: '#fff' }} // 增大点的半径以提高可见性
                activeDot={{ r: 6, stroke: '#2c5aa0', strokeWidth: 2, fill: '#3182ce' }} // 鼠标悬停时显示更大的点
                name="Power"
              />
              {/* 绘制alpha水平线 */}
              <Line 
                type="monotone" 
                data={[{ mu: powerData[0].mu, power: alpha }, { mu: powerData[powerData.length - 1].mu, power: alpha }]} 
                stroke="#e53e3e" 
                strokeDasharray="5 5"
                strokeWidth={1}
                dot={false}
                name="Alpha"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
        <Text fontSize="sm" color="gray.500" mt={2}>
          This chart shows the relationship between the true mean (μ) and the power of the test. 
          The red dashed line represents the significance level α = {alpha}.
        </Text>
        
        {/* 添加关键数据点表格，用于调试和直接查看功效值 */}
        <Box mt={4}>
          <Text fontSize="md" fontWeight="medium" mb={2}>Key Power Values:</Text>
          <Box 
            display="grid" 
            gridTemplateColumns="repeat(2, 1fr)" 
            gap={2} 
            p={3} 
            border="1px" 
            borderColor="gray.200" 
            borderRadius="md" 
            bg="white"
          >
            <Text fontWeight="bold" color="gray.700">μ Value</Text>
            <Text fontWeight="bold" color="gray.700">Power</Text>
            {/* 显示原假设点和几个关键偏离点的功效值 */}
            {powerData
              .filter(point => Math.abs(point.mu - mu0) < 0.01 || 
                             Math.abs(point.mu - (mu0 + 1)) < 0.01 ||
                             Math.abs(point.mu - (mu0 - 1)) < 0.01 ||
                             Math.abs(point.mu - (mu0 + 2)) < 0.01 ||
                             Math.abs(point.mu - (mu0 - 2)) < 0.01)
              .map((point, index) => (
                <React.Fragment key={index}>
                  <Text>{formatMuValue(point.mu)}</Text>
                  <Text color={point.power > 0.7 && point.power < 0.9 ? "green.600" : "gray.700"}>
                    {formatPowerValue(point.power)}
                  </Text>
                </React.Fragment>
              ))
            }
          </Box>
        </Box>
      </CardBody>
    </Card>
  );
};

export default PowerFunctionChart;