"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
function findFile(filepath) {
    const [name, ...dirpath] = filepath.split(/(\/|\\)/).reverse();
    const dir = path.join(...dirpath.reverse());
    if (!fs.existsSync(dir))
        return;
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (let i = 0; i < files.length; i++) {
        if (files[i].isFile() && files[i].name.match(new RegExp(`^${name}`)))
            return path.join(dir, files[i].name);
    }
}
exports.default = findFile;
//# sourceMappingURL=file.js.map