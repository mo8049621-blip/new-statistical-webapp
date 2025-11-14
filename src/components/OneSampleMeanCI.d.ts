import { BasicStats } from '../types';
interface OneSampleMeanCIProps {
    dataset?: number[];
    isGeneratedDataset?: boolean;
    distributionInfo?: {
        type: string;
        name: string;
        parameters: Record<string, number>;
    };
    basicStats?: BasicStats | null;
}
declare function OneSampleMeanCI({ dataset, isGeneratedDataset, distributionInfo, basicStats }: OneSampleMeanCIProps): import("react/jsx-runtime").JSX.Element;
export default OneSampleMeanCI;
