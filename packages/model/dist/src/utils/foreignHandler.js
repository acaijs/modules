"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function foreignHandler(foreign) {
    if (foreign.type === "belongsTo") {
        return {
            get: async () => {
                const key = this.$values[foreign.foreignKey || "id"];
                if (key) {
                    return foreign.model().find(key);
                }
            },
            set: (value) => {
                if (value && value.$values)
                    this.$values[foreign.foreignKey] = value.$values[foreign.primaryKey || "id"];
                else
                    this.$values[foreign.foreignKey] = value;
            },
            value: () => {
                this.$values[foreign.foreignKey];
            }
        };
    }
    if (foreign.type === "hasMany") {
        return {
            create: async (fields) => {
                const model = foreign.model();
                const instance = new model(fields);
                instance.$values[foreign.foreignKey] = this.$values[foreign.primaryKey || "id"];
                await instance.save();
                return instance;
            },
            get: () => {
                return foreign.model().query().where(foreign.foreignKey, this.$values[foreign.primaryKey || "id"]).get();
            },
            find: (id) => {
                return foreign.model().query().where(foreign.foreignKey, this.$values[foreign.primaryKey || "id"]).where(foreign.model().$primary || "id", id).first();
            },
            query: () => {
                return foreign.model().query().where(foreign.foreignKey, this.$values[foreign.primaryKey || "id"]);
            },
        };
    }
    if (foreign.type === "hasOne") {
        return {
            findOrCreate: async (fields) => {
                const saved = await foreign.model().query().where(foreign.foreignKey, this.$values[foreign.primaryKey || "id"]).first();
                if (saved)
                    return saved;
                const model = foreign.model();
                const instance = new model(fields);
                instance.$values[foreign.foreignKey] = this.$values[foreign.primaryKey || "id"];
                await instance.save();
                return instance;
            },
            get: () => {
                return foreign.model().query().where(foreign.foreignKey, this.$values[foreign.primaryKey || "id"]).first();
            },
            delete: async () => {
                await foreign.model().query().where(foreign.foreignKey, this.$values[foreign.primaryKey || "id"]).delete();
            },
            query: () => {
                return foreign.model().query().where(foreign.foreignKey, this.$values[foreign.primaryKey || "id"]);
            },
        };
    }
}
exports.default = foreignHandler;
//# sourceMappingURL=foreignHandler.js.map