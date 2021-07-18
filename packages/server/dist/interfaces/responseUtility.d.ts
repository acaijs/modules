export default interface ResponseUtilityOptions {
    view: string;
    status: number;
    data: unknown;
    json: Record<string, unknown>;
    headers: Record<string, string>;
}
