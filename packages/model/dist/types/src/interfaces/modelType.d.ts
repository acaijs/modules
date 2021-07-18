import { Model } from "../..";
import modelActions from "./modelActions";
declare type ModelArgsSignature = {
    value: unknown;
    row: Record<string, unknown>;
    args?: any;
    model: typeof Model;
    key: string;
};
declare type ModelTypeSignature = (data: ModelArgsSignature) => unknown;
declare type ModelTypeInterface = Partial<Record<modelActions, ModelTypeSignature> & {
    type: {
        type: string;
        length?: number;
    };
}>;
export default ModelTypeInterface;
