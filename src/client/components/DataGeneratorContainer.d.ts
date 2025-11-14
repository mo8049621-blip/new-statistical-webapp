interface DatasetWithInfo {
    data: number[];
    distributionInfo?: {
        type: string;
        name: string;
        parameters: Record<string, number>;
    };
}
interface DataGeneratorContainerProps {
    onDataGenerated: (dataWithInfo: DatasetWithInfo, datasetIndex: 1 | 2) => void;
    onPairedDataGenerated: (data1: number[], data2: number[]) => void;
    onDirectDataChange?: (data: number[], sourceInfo?: {
        type: string;
        name: string;
    }) => void;
}
declare function DataGeneratorContainer({ onDataGenerated, onPairedDataGenerated, onDirectDataChange }: DataGeneratorContainerProps): import("react/jsx-runtime").JSX.Element;
export default DataGeneratorContainer;
