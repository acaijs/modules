"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Packages
const fs = require("fs");
const path = require("path");
const glob_1 = require("glob");
// Utils
const parseArgs_1 = require("../utils/parseArgs");
const getStubs_1 = require("../utils/getStubs");
class Stubber {
    // -------------------------------------------------
    // Constructor
    // -------------------------------------------------
    constructor(args, stubFilesPath = "", overwriteTargetPath) {
        const stubpath = path.join(process.cwd(), stubFilesPath);
        // find stubs directory
        if (!fs.existsSync(stubpath)) {
            throw "Stubs directory does not exist";
        }
        // check if is an actual directory
        if (!fs.lstatSync(stubpath).isDirectory()) {
            throw "Stubs directory is not a directory";
        }
        // read its content
        const stubsAvailable = fs.readdirSync(stubpath, { withFileTypes: true }).filter(i => i.isDirectory());
        // parse arguments
        this.callArgs = parseArgs_1.default(args);
        const stubs = getStubs_1.default(stubFilesPath);
        for (let i = 0; i < stubs.length; i++) {
            const item = stubsAvailable[i];
            const configFilePath = path.join(stubpath, item.name, "stub.config.json");
            // load config file
            let config = JSON.parse(fs.readFileSync(configFilePath, { encoding: "utf-8" }));
            if (config.name === this.callArgs.stubName) {
                this.stubConfig = config;
                this.stubOriginPath = path.join(stubpath, item.name).replace(/(\\|\/|\\\\|\/\/)/g, "/");
                // load all files inside of the stub directory
                this.stubFileContent = glob_1.glob.sync(path.join(this.stubOriginPath, "**/*"), { nodir: true });
                // stub found, break find
                break;
            }
        }
        // stub not found
        if (!this.stubConfig) {
            throw `Search for the stub ${this.callArgs.stubName} did not return any results`;
        }
        // update target path
        if (overwriteTargetPath)
            this.stubConfig.targetPath = overwriteTargetPath;
    }
    // -------------------------------------------------
    // Copy stub
    // -------------------------------------------------
    copy() {
        const targetPath = this.stubConfig.targetPath;
        if (!targetPath) {
            throw `Stub ${this.stubConfig.name} does not have a target path, stubber doesn't know where to put it`;
        }
        // copy all files
        this.stubFileContent.forEach(item => {
            const shouldBeRenamed = !!(this.stubConfig.renameToNameFiles && this.stubConfig.renameToNameFiles.find(i => i === item.replace(/(\\|\/)/g, "/").replace(this.stubOriginPath, "").split("/").splice(1).join("/")));
            const relativepath = item.replace(/(\\|\/)/g, "/").replace(this.stubOriginPath, "").replace(shouldBeRenamed ? /\/\w+\./ : "", shouldBeRenamed ? `/${this.callArgs.stubArgs.name}.` : "");
            const targetfinalpath = path.join(process.cwd(), targetPath, relativepath).replace(/(\\|\/)/g, "/");
            // skip config, we don't want to copy that
            if (relativepath === "/stub.config.json")
                return;
            // make sure the directory exists
            {
                const pathfile = targetfinalpath.substring(0, targetfinalpath.lastIndexOf("/"));
                if (!fs.existsSync(pathfile)) {
                    fs.mkdirSync(pathfile, { recursive: true });
                }
            }
            // copy it
            fs.copyFileSync(item, targetfinalpath);
        });
    }
    // -------------------------------------------------
    // Variable injection
    // -------------------------------------------------
    inject(extraVariables) {
        const allVariables = Object.assign(Object.assign(Object.assign({}, this.stubConfig.variables), this.callArgs.stubArgs), (extraVariables || {}));
        // loop all files
        this.stubFileContent.forEach(item => {
            const shouldBeRenamed = !!(this.stubConfig.renameToNameFiles && this.stubConfig.renameToNameFiles.find(i => i === item.replace(/(\\|\/)/g, "/").replace(this.stubOriginPath, "").split("/").splice(1).join("/")));
            const relativepath = item.replace(/(\\|\/)/g, "/").replace(this.stubOriginPath, "").replace(shouldBeRenamed ? /\/\w+\./ : "", shouldBeRenamed ? `/${this.callArgs.stubArgs.name}.` : "");
            const targetfinalpath = path.join(process.cwd(), this.stubConfig.targetPath, relativepath).replace(/(\\|\/)/g, "/");
            // skip config, we don't want to copy that
            if (relativepath === "/stub.config.json")
                return;
            // get file content
            let content = fs.readFileSync(targetfinalpath, { encoding: "utf-8" });
            // parse all variables
            const variables = (content.match(/{{\s*\S+\s*}}/g) || []);
            // exchange all variables
            variables.forEach(variable => {
                const varname = variable.replace(/({{|}})/g, "").trim();
                const varvalue = allVariables[varname];
                if (!varvalue) {
                    console.log(`\x1b[33mwarning\x1b[0m - variable ${varname} not found, passing an empty string`);
                }
                content = content.replace(new RegExp(`${variable}`), varvalue || "");
            });
            // save back the updated content
            fs.writeFileSync(targetfinalpath, content, { encoding: "utf-8" });
        });
    }
}
exports.default = Stubber;
//# sourceMappingURL=Stubber.js.map