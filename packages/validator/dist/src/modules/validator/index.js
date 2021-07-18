"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Exceptions
const InvalidRuleException_1 = require("../../classes/InvalidRuleException");
// Rules
const index_1 = require("../../rules/index");
class Validator {
    // -------------------------------------------------
    // Main methods
    // -------------------------------------------------
    constructor(fields = {}) {
        // -------------------------------------------------
        // Properties
        // -------------------------------------------------
        // overwritable
        this.throwable = true;
        this._validated = {};
        this._errors = {};
        this._fields = fields;
    }
    static validate(fields, overwriteSchemaOrThrow) {
        const validator = new this(fields);
        validator.validate(overwriteSchemaOrThrow);
        return validator;
    }
    validate(overwriteSchemaOrThrow = undefined) {
        const schema = typeof overwriteSchemaOrThrow === "object" ? overwriteSchemaOrThrow : this.getSchema();
        Object.keys(schema).forEach(fieldName => {
            let passes = true;
            let fieldValue = this._fields[fieldName];
            const rulesApplied = Array.isArray(schema[fieldName]) ? schema[fieldName] : schema[fieldName].split(";");
            const isRequired = rulesApplied.find(i => i.split(":")[0] === "required");
            const rulesNames = rulesApplied.map(i => i.split(":")[0]);
            if (!(fieldValue === undefined && !isRequired)) {
                for (let i = 0; i < rulesApplied.length; i++) {
                    const [name, ...preargs] = rulesApplied[i].split(":");
                    const args = (preargs.join(":") || "").split(",");
                    const rule = this.rules[name];
                    if (!rule) {
                        throw new InvalidRuleException_1.default(`Rule ${name} on validator ${this.constructor.name} doesn't exist`);
                    }
                    // validation failed
                    if (rule.onValidate && !rule.onValidate({ value: fieldValue, key: fieldName, fields: this._fields, args, rules: rulesNames })) {
                        passes = false;
                        const error = rule.onError && rule.onError({ value: fieldValue, key: fieldName, fields: this._fields, args, rules: rulesNames }) || `${name} failed validation`;
                        // instance it
                        if (!this._errors[fieldName])
                            this._errors[fieldName] = [];
                        // push
                        if (Array.isArray(error))
                            error.forEach(i => this._errors[fieldName].push(i));
                        else
                            this._errors[fieldName].push(error);
                    }
                    // validation successful
                    else {
                        fieldValue = rule.onMask ? rule.onMask({ value: fieldValue, key: fieldName, fields: this._fields, args, rules: rulesNames }) : fieldValue;
                    }
                }
                // validation successful
                if (!this._errors[fieldName]) {
                    this._validated[fieldName] = fieldValue;
                }
            }
            if (passes && !this._validated[fieldName])
                this._validated[fieldName] = fieldValue;
        });
        // check if should throw
        if (overwriteSchemaOrThrow !== false && this.throwable && Object.keys(this._errors).length > 0) {
            const error = new Error("Validation error");
            error.type = "validation";
            error.data = this.printErrors();
            error.shouldReport = false;
            throw error;
        }
    }
    // -------------------------------------------------
    // Overwritable methods
    // -------------------------------------------------
    getSchema() {
        throw new Error(`Schema not implemented`);
    }
    printErrors() {
        if (Object.keys(this._errors).length === 0)
            return undefined;
        return {
            errors: this._errors,
        };
    }
    // -------------------------------------------------
    // Get methods
    // -------------------------------------------------
    get rules() {
        return index_1.default();
    }
    get validated() {
        return this._validated;
    }
    get errors() {
        return this.printErrors();
    }
    get fields() {
        return this._fields;
    }
}
exports.default = Validator;
//# sourceMappingURL=index.js.map