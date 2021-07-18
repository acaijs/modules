// Packages
import * as fs from "fs";
import * as path from "path";

// Interfaces
import storageTypes from "../interfaces/types";

export default class ConfigClass {
	// -------------------------------------------------
	// Properties
	// -------------------------------------------------
	
	protected data	: Record<string, any> = {};
	protected _env	: Record<string, string | undefined> = {};

	// -------------------------------------------------
	// Config methods
	// -------------------------------------------------

	/**
	 * Raw config object, you can set properties and they will be kept
	 */
	public get config () {
		return this.data;
	}

	/**
	 * ## getConfig
	 * Retrieves information from the config value
	 * 
	 * @param {string} key nested key that can be used to retrieve data
	 * @param {any?} defaultValue default value in case the key doesn't match
	 * @returns {any}
	 */
	public getConfig <T extends storageTypes = string> (key: string, defaultValue?: T): T {
		return (this.data[key] || defaultValue) as unknown as T;
	}

	/**
	 * ## setConfig
	 * Sets information from the config value
	 * 
	 * @param {string} key nested key that can be used to retrieve data
	 * @param {any} value value to be placed
	 * @returns {any}
	 */
	public setConfig (key: string, value: storageTypes) {
		this.data[key] = value;
	}

	// -------------------------------------------------
	// Env methods
	// -------------------------------------------------

	public get env () {
		return this._env;
	}

	public getEnv (key: string, defaultValue?: string) {
		return this._env[key] || defaultValue;
	}

	/**
	 * ## fetchEnv
	 * 
	 * Method responsible for finding an env file inside of of your project
	 * 
	 * @param {string?} preference Env preference, such as production, testing, etc  
	 * @param {boolean?} injectIntoConfig Should the env variables be injected into the config as well 
	 * @param {boolean?} suppresLog Suppress any errors when trying to fetch the env file
	 */
	public async fetchEnv (preference: string | undefined = undefined, injectIntoConfig = false, suppresLog = false) {
		// get data
		let file = path.join(process.cwd(), `.env${ preference ? `.${preference}`:"" }`);

		// fetch env from deno
		this._env = process.env;

		// check preference, if not, fallback
		if (preference) {
			if (!await fs.existsSync(file)) {
				if (!suppresLog) console.log(`.env${preference ? `.${preference}`:""} not found, falling back into .env`);
				file = path.join(process.cwd(), ".env");
			}
		}

		// check file exists
		if (await fs.existsSync(file)) {
			// fetch into env
			const text = await fs.readFileSync(file, "utf-8");
			text.split("\n").forEach(i => {
				const [key, value] 	= i.split("=");
				this._env[key] 		= value;
			});

			// inject env variables into the config
			if (injectIntoConfig) {
				Object.keys(this._env).forEach(key => {
					this.config[key] = this._env[key];
				});
			}
		}
		else if (!suppresLog) {
			console.warn("ENV file not found");
		}
	}
}