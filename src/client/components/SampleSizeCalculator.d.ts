import React from 'react';
import { BasicStats } from '../types';
interface SampleSizeCalculatorProps {
    dataset?: number[];
    basicStats?: BasicStats | null;
}
declare const SampleSizeCalculator: React.FC<SampleSizeCalculatorProps>;
export default SampleSizeCalculator;
