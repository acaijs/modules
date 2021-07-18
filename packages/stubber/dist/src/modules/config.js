"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Packages
const fs = require("fs");
const path = require("path");
class ConfigClass {
    constructor() {
        // -------------------------------------------------
        // Properties
        // -------------------------------------------------
        this.data = {};
        this._env = {};
    }
    // -------------------------------------------------
    // Config methods
    // -------------------------------------------------
    get config() {
        return this.data;
    }
    getConfig(key, defaultValue) {
        return (this.data[key] || defaultValue);
    }
    setConfig(key, value) {
        this.data[key] = value;
    }
    // -------------------------------------------------
    // Env methods
    // -------------------------------------------------
    get env() {
        return this._env;
    }
    getEnv(key, defaultValue) {
        return this._env[key] || defaultValue;
    }
    async fetchEnv(preference = undefined, injectIntoConfig = false, suppresLog = false) {
        // get data
        let file = path.join(process.cwd(), `.env${preference ? `.${preference}` : ''}`);
        // fetch env from deno
        this._env = process.env;
        // check preference, if not, fallback
        if (preference) {
            if (!await fs.existsSync(file)) {
                if (!suppresLog)
                    console.log(`.env${preference ? `.${preference}` : ''} not found, falling back into .env`);
                file = path.join(process.cwd(), `.env`);
            }
        }
        // check file exists
        if (await fs.existsSync(file)) {
            // fetch into env
            const text = await fs.readFileSync(file, "utf-8");
            text.split("\n").forEach(i => {
                const [key, value] = i.split("=");
                this._env[key] = value;
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
exports.default = ConfigClass;
//# sourceMappingURL=config.js.map