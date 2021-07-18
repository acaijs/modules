"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isEquals(x, y) {
    // if both x and y are null or undefined and exactly the same
    if (x === y)
        return true;
    // if they are not strictly equal, they both need to be Objects
    if (!(x instanceof Object) || !(y instanceof Object))
        return false;
    // they must have the exact same prototype chain, the closest we can do is
    // test there constructor.
    if (x.constructor !== y.constructor)
        return false;
    for (const p in x) {
        // other properties were tested using x.constructor === y.constructor
        if (!x.hasOwnProperty(p))
            continue;
        // allows to compare x[ p ] and y[ p ] when set to undefined
        if (!y.hasOwnProperty(p))
            return false;
        // if they have the same strict value or identity then they are equal
        if (x[p] === y[p])
            continue;
        // Numbers, Strings, Functions, Booleans must be strictly equal
        if (typeof (x[p]) !== "object")
            return false;
        // Objects and Arrays must be tested recursively
        if (!isEquals(x[p], y[p]))
            return false;
    }
    // allows x[ p ] to be set to undefined
    for (const p in y) {
        if (y.hasOwnProperty(p) && !x.hasOwnProperty(p))
            return false;
    }
    return true;
}
exports.default = isEquals;
//# sourceMappingURL=isEquals.js.map