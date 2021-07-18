declare const stringType: Partial<Record<import("../../interfaces/modelActions").default, (data: {
    value: unknown;
    row: Record<string, unknown>;
    args?: any;
    model: typeof import("../../..").Model;
    key: string;
}) => unknown> & {
    type: {
        type: string;
        length?: number;
    };
}>;
export default stringType;
