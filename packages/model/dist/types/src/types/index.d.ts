import ModelTypeInterface from "../interfaces/modelType";
export declare const clear: () => {};
export declare const add: (name: string, modelType: ModelTypeInterface) => Partial<Record<import("../interfaces/modelActions").default, (data: {
    value: unknown;
    row: Record<string, unknown>;
    args?: any;
    model: typeof import("../..").Model;
    key: string;
}) => unknown> & {
    type: {
        type: string;
        length?: number;
    };
}>;
export declare const get: (name: string) => Partial<Record<import("../interfaces/modelActions").default, (data: {
    value: unknown;
    row: Record<string, unknown>;
    args?: any;
    model: typeof import("../..").Model;
    key: string;
}) => unknown> & {
    type: {
        type: string;
        length?: number;
    };
}>;
export declare const all: () => Record<string, Partial<Record<import("../interfaces/modelActions").default, (data: {
    value: unknown;
    row: Record<string, unknown>;
    args?: any;
    model: typeof import("../..").Model;
    key: string;
}) => unknown> & {
    type: {
        type: string;
        length?: number;
    };
}>>;
declare const _default: {
    clear: () => {};
    add: (name: string, modelType: Partial<Record<import("../interfaces/modelActions").default, (data: {
        value: unknown;
        row: Record<string, unknown>;
        args?: any;
        model: typeof import("../..").Model;
        key: string;
    }) => unknown> & {
        type: {
            type: string;
            length?: number;
        };
    }>) => Partial<Record<import("../interfaces/modelActions").default, (data: {
        value: unknown;
        row: Record<string, unknown>;
        args?: any;
        model: typeof import("../..").Model;
        key: string;
    }) => unknown> & {
        type: {
            type: string;
            length?: number;
        };
    }>;
    get: (name: string) => Partial<Record<import("../interfaces/modelActions").default, (data: {
        value: unknown;
        row: Record<string, unknown>;
        args?: any;
        model: typeof import("../..").Model;
        key: string;
    }) => unknown> & {
        type: {
            type: string;
            length?: number;
        };
    }>;
    all: () => Record<string, Partial<Record<import("../interfaces/modelActions").default, (data: {
        value: unknown;
        row: Record<string, unknown>;
        args?: any;
        model: typeof import("../..").Model;
        key: string;
    }) => unknown> & {
        type: {
            type: string;
            length?: number;
        };
    }>>;
};
export default _default;
