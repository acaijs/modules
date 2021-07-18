import Model from "./Model";
declare const HasOne: (modelcb: () => typeof Model, foreignKey: string, primaryKey?: string) => PropertyDecorator;
export default HasOne;
