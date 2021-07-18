import ContextInterface from "../interfaces/context";
export declare const get: () => ContextInterface;
export declare const set: (ctx: ContextInterface) => void;
export declare const add: (ctx: Partial<ContextInterface>) => void;
