import storageTypes from "../interfaces/types";
export default class ConfigClass {
    protected data: Record<string, any>;
    protected _env: Record<string, string>;
    get config(): Record<string, any>;
    getConfig<T extends storageTypes = string>(key: string, defaultValue?: T): T;
    setConfig(key: string, value: storageTypes): void;
    get env(): Record<string, string>;
    getEnv(key: string, defaultValue?: string): string;
    fetchEnv(preference?: string | undefined, injectIntoConfig?: boolean, suppresLog?: boolean): Promise<void>;
}
