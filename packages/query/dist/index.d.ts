import AbstractQuery from "./abstractions/builder";
import ModelContent from "./interfaces/ModelContent";
export declare function addQuery(name: string, type: string, config?: Record<string, ModelContent>): Promise<typeof AbstractQuery>;
export declare function setDefault(name: string, config?: Record<string, ModelContent>): Promise<typeof AbstractQuery>;
export { default as AbstractQuery } from "./abstractions/builder";
export { default as SqlQuery } from "./classes/queryStrategies/sql";
declare const _default: (key?: string | undefined) => typeof AbstractQuery;
export default _default;
