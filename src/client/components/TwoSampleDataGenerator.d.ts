interface TwoSampleDataGeneratorProps {
    onDataGenerated: (data: {
        sample1: number[];
        sample2: number[];
        params1: any;
        params2: any;
    }) => void;
}
declare function TwoSampleDataGenerator({ onDataGenerated }: TwoSampleDataGeneratorProps): import("react/jsx-runtime").JSX.Element;
export default TwoSampleDataGenerator;
