// Interfaces
import { Model } from "../..";
import modelActions from "./modelActions";

type ModelArgsSignature = {value: unknown, row: Record<string, unknown>, args?: any, model: typeof Model, key: string};
type ModelTypeSignature = (data: ModelArgsSignature) => unknown;
type ModelTypeInterface = Partial<Record<modelActions, ModelTypeSignature> & {type: {type: string, length?: number, }}>;

export default ModelTypeInterface;
