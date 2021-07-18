import ContextInterface from "../interfaces/context";
import GroupAuxiliaryInterface from "../interfaces/groupAuxiliary";
declare type GroupsInterface = {
    ctx: ContextInterface;
    cb: (aux: GroupAuxiliaryInterface) => void;
};
export declare const get: () => GroupsInterface[];
export declare const append: (ctx: Partial<ContextInterface>) => void;
export declare const add: (test: GroupsInterface) => void;
export declare const clear: () => void;
export {};
