"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Packages
const fs = require("fs");
const path = require("path");
function getStubs(stubFilesPath) {
    const stubpath = path.join(process.cwd(), stubFilesPath);
    // find stubs directory
    if (!fs.existsSync(stubpath)) {
        throw new Error("Stubs directory does not exist");
    }
    // check if is an actual directory
    if (!fs.lstatSync(stubpath).isDirectory()) {
        throw new Error("Stubs directory is not a directory");
    }
    // read its content
    const stubsAvailable = fs.readdirSync(stubpath, { withFileTypes: true }).filter(i => i.isDirectory());
    for (let i = 0; i < stubsAvailable.length; i++) {
        const item = stubsAvailable[i];
        const configFilePath = path.join(stubpath, item.name, "stub.config.json");
        // check config file
        if (!fs.existsSync(configFilePath)) {
            throw new Error(`Stub ${item.name} does not have a config file`);
        }
        // load config file
        try {
            JSON.parse(fs.readFileSync(configFilePath, { encoding: "utf-8" }));
        }
        catch (e) {
            throw new Error(`Stub ${item.name} config is not a valid JSON`);
        }
    }
    return stubsAvailable;
}
exports.default = getStubs;
//# sourceMappingURL=getStubs.js.map