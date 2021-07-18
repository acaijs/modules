import storageTypes from "../interfaces/types";
export default class ConfigClass {
    protected data: Record<string, any>;
    protected _env: Record<string, string>;
    /**
     * Raw config object, you can set properties and they will be kept
     */
    get config(): Record<string, any>;
    /**
     * ## getConfig
     * Retrieves information from the config value
     *
     * @param {string} key nested key that can be used to retrieve data
     * @param {any?} defaultValue default value in case the key doesn't match
     * @returns {any}
     */
    getConfig<T extends storageTypes = string>(key: string, defaultValue?: T): T;
    /**
     * ## setConfig
     * Sets information from the config value
     *
     * @param {string} key nested key that can be used to retrieve data
     * @param {any} value value to be placed
     * @returns {any}
     */
    setConfig(key: string, value: storageTypes): void;
    get env(): Record<string, string>;
    getEnv(key: string, defaultValue?: string): string;
    /**
     * ## fetchEnv
     *
     * Method responsible for finding an env file inside of of your project
     *
     * @param {string?} preference Env preference, such as production, testing, etc
     * @param {boolean?} injectIntoConfig Should the env variables be injected into the config as well
     * @param {boolean?} suppresLog Suppress any errors when trying to fetch the env file
     */
    fetchEnv(preference?: string | undefined, injectIntoConfig?: boolean, suppresLog?: boolean): Promise<void>;
}
