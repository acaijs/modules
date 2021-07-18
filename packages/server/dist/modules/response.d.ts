import ResponseUtilityOptions from "../interfaces/responseUtility";
export default function response(options?: Partial<ResponseUtilityOptions>): {
    (): Partial<ResponseUtilityOptions>;
    headers(append: Record<string, string>): any;
    view(name: string): any;
    status(status: number): any;
    data(data: unknown): any;
    json(json: Record<string, unknown>): any;
};
