import Model from "./Model";
declare const BelongsTo: (modelcb: () => typeof Model, foreignKey: string, primaryKey?: string) => PropertyDecorator;
export default BelongsTo;
