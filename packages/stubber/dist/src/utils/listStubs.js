"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Packages
const fs = require("fs");
const path = require("path");
// Utils
const getStubs_1 = require("./getStubs");
function listStubs(stubpath) {
    const stubs = getStubs_1.default(stubpath);
    stubs.forEach((item) => {
        const configFilePath = path.join(process.cwd(), stubpath, item.name, "stub.config.json");
        // load config file
        let config = JSON.parse(fs.readFileSync(configFilePath, { encoding: "utf-8" }));
        console.log(`\nstub: ${config.name}`);
        if (config.description)
            console.log("description:", config.description.length > 70 ? `${config.description.substring(0, 70)}...` : config.description);
    });
}
exports.default = listStubs;
//# sourceMappingURL=listStubs.js.map