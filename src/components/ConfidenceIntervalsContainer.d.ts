import { BasicStats } from '../types';
interface ConfidenceIntervalsContainerProps {
    dataset?: number[];
    dataset2?: number[];
    pairedData?: {
        before: number[];
        after: number[];
    };
    isGeneratedDataset?: boolean;
    distributionInfo?: {
        type: string;
        name: string;
        parameters: Record<string, number>;
    };
    basicStats?: BasicStats | null;
}
declare function ConfidenceIntervalsContainer({ dataset, dataset2, pairedData, isGeneratedDataset, distributionInfo, basicStats }: ConfidenceIntervalsContainerProps): import("react/jsx-runtime").JSX.Element;
export default ConfidenceIntervalsContainer;
