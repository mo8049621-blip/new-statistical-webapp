interface PairedDataGeneratorProps {
    onDataGenerated: (data: {
        before: number[];
        after: number[];
        params: any;
    }) => void;
}
declare function PairedDataGenerator({ onDataGenerated }: PairedDataGeneratorProps): import("react/jsx-runtime").JSX.Element;
export default PairedDataGenerator;
