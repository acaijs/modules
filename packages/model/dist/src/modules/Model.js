"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = __importDefault(require("@acai/query"));
const utils_1 = require("@acai/utils");
const dynamicTypes = __importStar(require("../types/index"));
const foreignHandler_1 = __importDefault(require("../utils/foreignHandler"));
class Model {
    constructor(fields = {}, databaseSaved = false) {
        this.$values = {};
        this.$databaseInitialized = false;
        const modelClass = this.constructor.prototype;
        const $allFields = modelClass.$fields;
        this.$databaseInitialized = databaseSaved;
        for (let i = 0; i < $allFields.length; i++) {
            const field = $allFields[i];
            const foreign = (modelClass.$relations || []).find((i) => i.name === field.name);
            const handler = foreign ? foreignHandler_1.default.bind(this)(foreign) : undefined;
            Object.defineProperty(this, field.name, {
                set: (value) => {
                    if (!foreign) {
                        const dynamictype = dynamicTypes.get(field.type);
                        const callback = databaseSaved ? dynamictype.onRetrieve : dynamictype.onCreate;
                        this.$values[field.name] = callback ? callback({ key: field.name, value, row: this.$values, args: field.args, model: this.constructor }) : value;
                    }
                    else if (foreign.type === "belongsTo") {
                        this.$values[foreign.foreignKey] = value;
                    }
                },
                get: () => {
                    if (handler) {
                        return handler;
                    }
                    else {
                        return this.$values[field.name];
                    }
                }
            });
        }
        this.fill(fields);
    }
    toObject() {
        const serializedValues = {};
        this.constructor.prototype.$fields.forEach(field => {
            const value = this.$values[field.name];
            const onSet = dynamicTypes.get(field.type).onSerialize;
            const foreign = (this.constructor.prototype.$relations || []).find(i => i.name === field.name);
            if (foreign) {
                if (foreign.type === "belongsTo") {
                    serializedValues[foreign.foreignKey] = this.$values[foreign.foreignKey];
                }
            }
            else {
                serializedValues[field.name] = onSet ? onSet({ key: field.name, value, row: this.$values, args: field.args, model: this.constructor }) : value;
            }
        });
        return serializedValues;
    }
    toJson() {
        return JSON.stringify(this.toObject());
    }
    static query() {
        return query_1.default().table(this.$table).parseResult((result) => {
            if (Array.isArray(result)) {
                return result.map(r => {
                    return new this({ ...r }, true);
                });
            }
            return new this({ ...result }, true);
        });
    }
    query() {
        return query_1.default().table(this.constructor.$table).parseResult((result) => {
            if (Array.isArray(result)) {
                return result.map(r => {
                    return new this.prototype.constructor({ ...r }, true);
                });
            }
            return new this({ ...result }, true);
        });
    }
    static async paginate(page = 1, perPage = 25) {
        return this.query().paginate(page, perPage);
    }
    static async find(id) {
        return (await this.query().orderBy(this.$primary).where(this.$primary, id).limit(1).get())[0];
    }
    static async findOrFail(id) {
        const response = (await this.query().orderBy(this.$primary).where(this.$primary, id).limit(1).get())[0];
        if (!response) {
            throw new utils_1.CustomException("modelNotFound", `Model ${this.name} with ${this.$primary} ${id} not found`, {
                model: this.name,
                primaryKey: this.$primary,
                id: id,
            });
        }
        return response;
    }
    static async first() {
        return this.query().first();
    }
    static async last() {
        return this.query().last();
    }
    static async insert(fields) {
        const instance = new this();
        instance.fill(fields);
        await instance.save();
        return instance;
    }
    static async insertMany(rows) {
        return Promise.all(rows.map(row => this.insert(row)));
    }
    static addMigration() {
        const fields = {};
        this.prototype.$fields.forEach(field => {
            const typeObj = { ...(dynamicTypes.get(field.type).type || { type: "string" }), ...field.args };
            fields[field.name] = {
                ...typeObj,
                primary: this.$primary === field.name,
            };
            const { $relations } = this.prototype;
            if ($relations) {
                $relations.forEach(foreign => {
                    if (foreign.name === field.name) {
                        delete fields[field.name];
                        if (foreign.type === "belongsTo") {
                            const primary = foreign.primaryKey || foreign.model().$primary;
                            const primaryType = foreign.model().prototype.$fields.find(i => i.name === primary);
                            const typeObj = { ...(dynamicTypes.get(primaryType.type).type || { type: "string" }), ...field.args };
                            fields[foreign.foreignKey] = {
                                ...typeObj,
                                foreign: {
                                    table: foreign.model().$table,
                                    column: primary,
                                    onDelete: "CASCADE",
                                }
                            };
                        }
                    }
                });
            }
        });
        query_1.default().addMigration(this.$table, fields);
    }
    async save() {
        const { $table, $primary } = this.constructor;
        const { $fields } = this.constructor.prototype;
        const fields = {};
        for (let i = 0; i < $fields.length; i++) {
            const field = $fields[i];
            const value = this.$values[field.name];
            const onSet = dynamicTypes.get(field.type).onSave;
            const foreign = (this.constructor.prototype.$relations || []).find(i => i.name === field.name);
            if (foreign) {
                if (foreign.type === "belongsTo") {
                    fields[foreign.foreignKey] = this.$values[foreign.foreignKey];
                }
            }
            else {
                fields[field.name] = onSet ? onSet({ key: field.name, value, row: this.$values, args: field.args, model: this.constructor }) : value;
            }
        }
        let id;
        if (this.$databaseInitialized) {
            await query_1.default().table($table).where($primary, fields[$primary]).update(fields);
            id = fields[$primary];
        }
        else {
            id = await query_1.default().table($table).insert(fields) || fields[$primary];
            this.$databaseInitialized = true;
        }
        this.fill(await query_1.default().table($table).where($primary, id).first());
    }
    async delete() {
        const { $table, $primary } = this.constructor;
        if (this.$databaseInitialized) {
            await query_1.default().table($table).where($primary, this.$values[$primary]).delete();
        }
        this.$databaseInitialized = false;
    }
    fill(fields) {
        const $allFields = this.constructor.prototype.$fields;
        const { $relations } = this.constructor.prototype;
        for (let i = 0; i < $allFields.length; i++) {
            const field = $allFields[i];
            const foreign = ($relations || []).find(i => i.name === field.name);
            if (foreign && foreign.type === "belongsTo") {
                if (fields[foreign.foreignKey] || fields[field.name]) {
                    this[field.name].set(fields[foreign.foreignKey] || fields[field.name]);
                }
            }
            else {
                this[field.name] = (fields || {})[field.name];
            }
        }
    }
}
exports.default = Model;
Model.$primary = "id";
Model.$fields = [];
Model.$relations = [];
//# sourceMappingURL=Model.js.map