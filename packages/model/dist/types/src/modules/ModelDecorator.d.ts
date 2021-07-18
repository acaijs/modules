import Model from "./Model";
declare const ModelDecorator: (table: string, primary?: string) => ClassDecorator;
export default ModelDecorator;
export declare const getModels: () => (typeof Model)[];
