import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, ReferenceDot } from 'recharts';
import { Box, Text, Button, Collapse, Divider } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

interface PowerFunctionChartProps {
  powerData: { mu: number; power: number }[];
  title?: string;
  xLabel?: string;
  yLabel?: string;
  mu0?: number;
  alpha?: number;
  beta?: number;
  effectSize?: number;
}

const PowerFunctionChart: React.FC<PowerFunctionChartProps> = ({
  powerData,
  title = 'Curve of the Power Function K(μ)',
  xLabel = 'True Mean (μ)',
  yLabel = 'Power K(μ)',
  mu0 = 0,
  alpha = 0.05,
  beta = 0.2,
  effectSize = 0.5
}) => {
  const [isInterpretationVisible, setIsInterpretationVisible] = useState(false);
  // Filter valid data points to avoid NaN issues
  const validDataPoints = powerData.filter(point => 
    !isNaN(point.mu) && !isNaN(point.power)
  );
  
  // Find the point where mu is closest to mu0 for alpha
  const alphaPoint = validDataPoints.length > 0 ? validDataPoints.reduce((prev, curr) => 
    Math.abs(curr.mu - mu0) < Math.abs(prev.mu - mu0) ? curr : prev
  ) : { mu: mu0, power: alpha };
  
  // Find the point where mu is closest to mu0 + effectSize for beta
  const betaPoint = validDataPoints.length > 0 ? validDataPoints.reduce((prev, curr) => 
    Math.abs(curr.mu - (mu0 + effectSize)) < Math.abs(prev.mu - (mu0 + effectSize)) ? curr : prev
  ) : { mu: mu0 + effectSize, power: 1 - beta };

  return (
    <Box textAlign="center" p={4} bg="white" borderRadius="md" shadow="md">
      <Text fontSize="xl" fontWeight="bold" mb={4} color="navy.800">{title}</Text>
      <Box height="400px" width="100%">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={powerData}
            margin={{ top: 20, right: 60, left: 40, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="mu"
              label={{ value: xLabel, position: 'insideBottom', offset: -10, fontSize: 14, fontWeight: 'bold' }}
              domain={['auto', 'auto']}
              tickFormatter={(value) => value.toFixed(1)}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              domain={[0, 1]}
              label={{ value: yLabel, angle: -90, position: 'insideLeft', fontSize: 14, fontWeight: 'bold' }}
              tickFormatter={(value) => value.toFixed(2)}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => [Number(value).toFixed(4), 'Power']}
              labelFormatter={(value) => `μ = ${parseFloat(value as string).toFixed(4)}`}
              contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }}
            />
            <Legend verticalAlign="top" height={36} />
            
            {/* Power Function Line */}
            <Line
              type="monotone"
              dataKey="power"
              name="Power Function K(μ)"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 0 }}
              activeDot={{ r: 6, fill: '#3b82f6' }}
            />
            
            {/* Reference line for alpha (type I error) */}
            <ReferenceLine x={mu0} stroke="red" strokeDasharray="3 3" strokeWidth={1.5} />
            <ReferenceLine y={alpha} stroke="red" strokeDasharray="3 3" strokeWidth={1.5} />
            {!isNaN(alphaPoint.mu) && !isNaN(alphaPoint.power) && (
              <ReferenceDot x={alphaPoint.mu} y={alphaPoint.power} r={5} fill="red" label="α" />
            )}
            
            {/* Reference line for beta (type II error) */}
            <ReferenceLine x={mu0 + effectSize} stroke="green" strokeDasharray="3 3" strokeWidth={1.5} />
            <ReferenceLine y={1 - beta} stroke="green" strokeDasharray="3 3" strokeWidth={1.5} />
            {!isNaN(betaPoint.mu) && !isNaN(1 - beta) && (
              <ReferenceDot x={betaPoint.mu} y={1 - beta} r={5} fill="green" label="β" />
            )}
          </LineChart>
        </ResponsiveContainer>
      </Box>
      
      {/* Mathematical expression */}
      <Text fontSize="lg" fontWeight="medium" mt={6} color="gray.700">
        Power function K(μ) = 1 - Φ((c - μ) / (σ/√n))
      </Text>
      
      {/* Chart Interpretation Toggle */}
      <Box mt={6}>
        <Button 
          onClick={() => setIsInterpretationVisible(!isInterpretationVisible)}
          leftIcon={isInterpretationVisible ? <ChevronUpIcon /> : <ChevronDownIcon />}
          variant="outline"
          colorScheme="blue"
          size="sm"
        >
          {isInterpretationVisible ? 'Hide Chart Interpretation' : 'Show Chart Interpretation'}
        </Button>
        
        <Collapse in={isInterpretationVisible} animateOpacity>
          <Box mt={4} p={4} bg="gray.50" borderRadius="md" borderWidth="1px" borderColor="gray.200">
            <Text fontSize="md" fontWeight="semibold" mb={2} color="gray.800">
              Chart Components Interpretation
            </Text>
            <Divider mb={3} />
            <Box overflowX="auto">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '8px', textAlign: 'left', borderBottom: '2px solid #ddd', fontWeight: 'bold' }}>Element</th>
                    <th style={{ padding: '8px', textAlign: 'left', borderBottom: '2px solid #ddd', fontWeight: 'bold' }}>Color/Style</th>
                    <th style={{ padding: '8px', textAlign: 'left', borderBottom: '2px solid #ddd', fontWeight: 'bold' }}>Interpretation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Blue Curve</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Solid Line</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}><strong>Power Function Curve:</strong> Shows the test power for different true means μ.</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Red Dashed Line 1</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Vertical Dashed Line</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}><strong>Null Hypothesis Mean μ₀:</strong> The reference mean from the null hypothesis.</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Red Dashed Line 2</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Horizontal Dashed Line</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}><strong>Significance Level α:</strong> Probability of Type I error (false rejection of null hypothesis).</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Red Solid Dot</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Dot labeled α</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}><strong>α Point:</strong> Power at the null hypothesis mean μ₀, equals α for two-tailed test.</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Green Dashed Line 1</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Vertical Dashed Line</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}><strong>Alternative Hypothesis Mean:</strong> Mean corresponding to the specified effect size (μ₀ + effectSize).</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Green Dashed Line 2</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Horizontal Dashed Line</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}><strong>1 - β:</strong> Desired power, where β is the Type II error probability.</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Green Solid Dot</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Dot labeled β</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}><strong>Power Point:</strong> Actual test power at the alternative hypothesis mean, assesses test sensitivity.</td>
                  </tr>
                </tbody>
              </table>
            </Box>
            
            <Divider my={3} />
            
            <Text fontSize="md" fontWeight="semibold" mb={2} color="gray.800">
              Chart Interpretation
            </Text>
            <ul style={{ paddingLeft: '20px' }}>
              <li style={{ marginBottom: '8px', color: 'gray.700' }}>
                <strong>Blue Curve Shape:</strong> As true mean μ moves away from μ₀, power approaches 1, indicating higher chance of correctly rejecting null hypothesis.
              </li>
              <li style={{ marginBottom: '8px', color: 'gray.700' }}>
                <strong>α Point:</strong> Red dot shows power when null hypothesis is true, equals Type I error rate.
              </li>
              <li style={{ marginBottom: '8px', color: 'gray.700' }}>
                <strong>Power Point:</strong> Green dot shows power at specified effect size, should ideally be ≥ 0.8.
              </li>
              <li style={{ marginBottom: '8px', color: 'gray.700' }}>
                <strong>Parameter Relationships:</strong>
                <ul style={{ paddingLeft: '20px', marginTop: '4px' }}>
                  <li>Increasing sample size (n): Curve becomes steeper, power increases</li>
                  <li>Increasing effect size: Curve shifts right, less sample size needed for same power</li>
                  <li>Decreasing α: Red dashed line moves down, curve shifts right, larger effect needed for same power</li>
                </ul>
              </li>
            </ul>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};

export default PowerFunctionChart;