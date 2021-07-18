export { default as Model } from "./src/modules/Model";
export { default as Table } from "./src/modules/ModelDecorator";
export { default as typeManager } from "./src/types";
export { getModels } from "./src/modules/ModelDecorator";
export { default as Hasher } from "./src/utils/Hasher";
export { default as Relation } from "./src/interfaces/relation";
import FieldDecoratorInterface from "./src/interfaces/fieldDecorator";
export declare const Field: FieldDecoratorInterface;
