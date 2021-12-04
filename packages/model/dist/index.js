/**
 * Copyright (c) 2020 The Nuinalp and APO Softworks Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 **/'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var query = require('@acai/query');
var utils = require('@acai/utils');
var luxon = require('luxon');
var config = require('@acai/config');
var bcrypt = require('bcrypt');
var uuid = require('uuid');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var query__default = /*#__PURE__*/_interopDefaultLegacy(query);
var config__default = /*#__PURE__*/_interopDefaultLegacy(config);

// src/modules/Model.ts

// src/types/string/index.ts
var toString = ({ value, args }) => {
  const format = value === void 0 || value === null ? "" : `${value}`;
  if (args) {
    if (args.max && args.max < format.length)
      return format.substring(0, args.max);
  }
  return format;
};
var stringType = {
  onCreate: toString,
  onUpdate: toString,
  onSave: toString,
  onRetrieve: toString
};
var string_default = stringType;

// src/types/int/index.ts
var toInt = ({ value, args }) => {
  if (args?.nullable && (value === null || value === void 0))
    return null;
  const format = parseInt(value);
  if (args) {
    if (args.max && args.max < format)
      return args.max;
    if (args.min && args.min > format)
      return args.min;
  }
  return format;
};
var intType = {
  type: {
    type: "int"
  },
  onCreate: toInt,
  onUpdate: toInt,
  onSave: toInt,
  onRetrieve: toInt
};
var int_default = intType;
var toDate = ({ value }) => {
  if (luxon.DateTime.isDateTime(value))
    return value;
  if (typeof value === "string")
    return luxon.DateTime.fromISO(value);
  if (typeof value === "number")
    return luxon.DateTime.fromMillis(value);
  if (value instanceof Date)
    return luxon.DateTime.fromJSDate(value);
  return value;
};
var toSerializeDate = ({ value, args }) => {
  const _value = luxon.DateTime.isDateTime(value) ? value : luxon.DateTime.fromJSDate(value);
  if (args) {
    if (args.format) {
      return _value.toFormat(args.format);
    }
  }
  return _value.toISODate();
};
var dateType = {
  type: {
    type: "date"
  },
  onCreate: toDate,
  onRetrieve: toDate,
  onSave: toSerializeDate,
  onSerialize: toSerializeDate
};
var date_default = dateType;

// src/types/boolean/index.ts
var toBoolean = ({ value }) => {
  return !!value;
};
var toDatabaseBoolean = ({ value }) => {
  return value ? 1 : 0;
};
var booleanType = {
  type: {
    type: "int"
  },
  onSave: toDatabaseBoolean,
  onCreate: toBoolean,
  onRetrieve: toBoolean,
  onSerialize: toBoolean
};
var boolean_default = booleanType;

// src/types/float/index.ts
var toFloat = ({ value, args }) => {
  const format = parseFloat(value);
  if (args) {
    if (args.max && args.max < format)
      return args.max;
    if (args.min && args.min > format)
      return args.min;
  }
  return format;
};
var floatType = {
  type: {
    type: "float",
    length: 53
  },
  onCreate: toFloat,
  onUpdate: toFloat,
  onSave: toFloat,
  onRetrieve: toFloat
};
var float_default = floatType;
var Hasher = class {
  constructor(value, saltOrRounds) {
    if (value)
      this.value = value;
    this.saltOrRounds = `$2b$10$${saltOrRounds}`;
  }
  hash(value) {
    this.value = bcrypt.hashSync(value, this.saltOrRounds || 10);
  }
  toString() {
    return this.value;
  }
  compare(valueToCompare) {
    return bcrypt.compareSync(valueToCompare, this.value);
  }
  hashCode(str) {
    let hash = 0, i, chr;
    if (str.length === 0)
      return hash;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }
    return hash;
  }
};

// src/types/hash/index.ts
var hashType = {
  onCreate: ({ value }) => {
    if (typeof value === "string") {
      const salt = config__default['default'] ? config__default['default'].getConfig("APP_KEY", void 0) : void 0;
      const hash = new Hasher(void 0, salt || "10");
      hash.hash(value);
      return hash;
    }
    return value;
  },
  onSave: ({ value }) => {
    if (!value)
      return value;
    if (value.toString)
      return value.toString();
    return `${value}`;
  },
  onRetrieve: ({ value }) => {
    return new Hasher(value);
  },
  onSerialize: ({ value }) => {
    if (value && value.toString)
      return value.toString();
    return `${value}`;
  }
};
var hash_default = hashType;

// src/types/sid/index.ts
var toSid = ({ value, args, key, model }) => {
  if (model.$primary !== key)
    return value;
  if (value !== void 0 && value !== null && args.nullable !== true)
    return `${value}`;
  else
    return Math.random().toString(36).substring(2, 2 + (args?.length || 11));
};
var sidType = {
  onCreate: toSid,
  onUpdate: toSid,
  onSave: toSid,
  onRetrieve: toSid
};
var sid_default = sidType;
var toUuid = ({ value, key, args, model }) => {
  if (model.$primary !== key)
    return value;
  if (value !== void 0 && value !== null && args.nullable !== true)
    return `${value}`;
  else
    return uuid.v4();
};
var uuidType = {
  type: {
    type: "string",
    length: 36
  },
  onCreate: toUuid,
  onUpdate: toUuid,
  onSave: toUuid,
  onRetrieve: toUuid
};
var uuid_default = uuidType;

// src/types/bigInt/index.ts
var toInt2 = ({ value, args }) => {
  const format = parseInt(value);
  if (args) {
    if (args.max && args.max < format)
      return args.max;
    if (args.min && args.min > format)
      return args.min;
  }
  return format;
};
var bigIntType = {
  type: {
    type: "bigint"
  },
  onCreate: toInt2,
  onUpdate: toInt2,
  onSave: toInt2,
  onRetrieve: toInt2
};
var bigInt_default = bigIntType;
var toDate2 = ({ value }) => {
  if (luxon.DateTime.isDateTime(value))
    return value;
  if (typeof value === "string")
    return luxon.DateTime.fromISO(value);
  if (typeof value === "number")
    return luxon.DateTime.fromMillis(value);
  if (value instanceof Date)
    return luxon.DateTime.fromJSDate(value);
  return value;
};
var toSerializeDate2 = ({ value, args }) => {
  const _value = luxon.DateTime.isDateTime(value) ? value : luxon.DateTime.fromJSDate(value);
  if (args) {
    if (args.format) {
      return _value.toFormat(args.format);
    }
  }
  return _value.toSQL();
};
var datetimeType = {
  type: {
    type: "datetime"
  },
  onCreate: toDate2,
  onRetrieve: toDate2,
  onSave: toSerializeDate2,
  onSerialize: toSerializeDate2
};
var datetime_default = datetimeType;

// src/types/id/index.ts
var toInt3 = ({ value }) => {
  const format = parseInt(value);
  return format;
};
var idType = {
  type: {
    type: "int",
    length: 21
  },
  onCreate: toInt3,
  onUpdate: toInt3,
  onSave: toInt3,
  onRetrieve: toInt3
};
var id_default = idType;

// src/types/json/index.ts
var toJson = ({ value }) => {
  if (typeof value === "string")
    return JSON.parse(value);
  if (value === void 0)
    return {};
  return value;
};
var jsonType = {
  type: {
    type: "json"
  },
  onSerialize: toJson,
  onCreate: toJson,
  onUpdate: toJson,
  onSave: ({ value }) => value ? JSON.stringify(value) : value,
  onRetrieve: toJson
};
var json_default = jsonType;

// src/types/smallInt/index.ts
var toInt4 = ({ value, args }) => {
  const format = parseInt(value);
  if (args) {
    if (args.max && args.max < format)
      return args.max;
    if (args.min && args.min > format)
      return args.min;
  }
  return format;
};
var smallIntType = {
  type: {
    type: "smallint"
  },
  onCreate: toInt4,
  onUpdate: toInt4,
  onSave: toInt4,
  onRetrieve: toInt4
};
var smallInt_default = smallIntType;

// src/types/text/index.ts
var toString2 = ({ value, args }) => {
  const format = value === void 0 || value === null ? "" : `${value}`;
  if (args) {
    if (args.max && args.max < format.length)
      return format.substring(0, args.max);
  }
  return format;
};
var textType = {
  type: {
    type: "text"
  },
  onCreate: toString2,
  onUpdate: toString2,
  onSave: toString2,
  onRetrieve: toString2
};
var text_default = textType;
var toDate3 = ({ value }) => {
  if (luxon.DateTime.isDateTime(value))
    return value;
  if (typeof value === "string")
    return luxon.DateTime.fromISO(value);
  if (typeof value === "number")
    return luxon.DateTime.fromMillis(value);
  if (value instanceof Date)
    return luxon.DateTime.fromJSDate(value);
  return value;
};
var toSerializeDate3 = ({ value, args }) => {
  const format = luxon.DateTime.isDateTime(value) ? value : luxon.DateTime.fromJSDate(value);
  if (args) {
    if (args.format) {
      return format.toFormat(args.format);
    }
  }
  return format.toISOTime();
};
var timeType = {
  type: {
    type: "time"
  },
  onCreate: toDate3,
  onRetrieve: toDate3,
  onSave: toSerializeDate3,
  onSerialize: toSerializeDate3
};
var time_default = timeType;
var toDate4 = ({ value }) => {
  if (luxon.DateTime.isDateTime(value))
    return value;
  if (typeof value === "string")
    return luxon.DateTime.fromSeconds(parseInt(value));
  if (typeof value === "number")
    return luxon.DateTime.fromMillis(value);
  if (value instanceof Date)
    return luxon.DateTime.fromJSDate(value);
  return value;
};
var toSerializeDate4 = ({ value }) => {
  if (value) {
    const format = luxon.DateTime.isDateTime(value) ? value : luxon.DateTime.fromJSDate(value);
    return format.toFormat("yyyy-LL-dd HH:mm:ss");
  }
  return value;
};
var timestampType = {
  type: {
    type: "timestamp"
  },
  onCreate: toDate4,
  onRetrieve: toDate4,
  onSave: toSerializeDate4,
  onSerialize: toSerializeDate4
};
var timestamp_default = timestampType;

// src/types/index.ts
var typesList = {
  bigint: bigInt_default,
  boolean: boolean_default,
  date: date_default,
  datetime: datetime_default,
  float: float_default,
  hash: hash_default,
  id: id_default,
  int: int_default,
  json: json_default,
  sid: sid_default,
  smallint: smallInt_default,
  string: string_default,
  text: text_default,
  time: time_default,
  timestamp: timestamp_default,
  uuid: uuid_default,
  enum: timestamp_default
};
var clear = () => typesList = {};
var add = (name, modelType) => typesList[name] = modelType;
var get = (name) => typesList[name];
var all = () => typesList;
var types_default = {
  clear,
  add,
  get,
  all
};

// src/utils/foreignHandler.ts
function foreignHandler(foreign) {
  if (foreign.type === "belongsTo") {
    return {
      get: async () => {
        const key = this.$values[foreign.foreignKey || "id"];
        if (key) {
          return foreign.model().find(key);
        }
        return void 0;
      },
      set: (value) => {
        if (value && value.$values)
          this.$values[foreign.foreignKey] = value.$values[foreign.primaryKey || "id"];
        else
          this.$values[foreign.foreignKey] = value;
      },
      value: () => {
        return this.$values[foreign.foreignKey];
      }
    };
  }
  if (foreign.type === "hasMany") {
    return {
      create: async (fields) => {
        const model = foreign.model();
        const instance = new model();
        instance.$values[foreign.foreignKey] = this.$values[foreign.primaryKey || "id"];
        if (fields)
          instance.fill(fields);
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
      }
    };
  }
  if (foreign.type === "hasOne") {
    return {
      findOrCreate: async (fields) => {
        const saved = await foreign.model().query().where(foreign.foreignKey, this.$values[foreign.primaryKey || "id"]).first();
        if (saved)
          return saved;
        const model = foreign.model();
        const instance = new model();
        instance.$values[foreign.foreignKey] = this.$values[foreign.primaryKey || "id"];
        if (fields)
          instance.fill(fields);
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
      }
    };
  }
  return void 0;
}

// src/modules/Model.ts
var Model = class {
  constructor(fields = void 0, databaseSaved = false) {
    this.$values = {};
    this.$databaseInitialized = false;
    const modelClass = this.constructor.prototype;
    const $allFields = modelClass.$fields;
    this.$databaseInitialized = databaseSaved;
    if ($allFields) {
      for (let i = 0; i < $allFields.length; i++) {
        const field = $allFields[i];
        const foreign = (modelClass.$relations || []).find((i2) => i2.name === field.name);
        const handler = foreign ? foreignHandler : void 0;
        Object.defineProperty(this, field.name, {
          enumerable: true,
          configurable: true,
          set: (value) => {
            if (!foreign) {
              const dynamictype = get(field.type);
              const callback = databaseSaved ? dynamictype.onRetrieve : dynamictype.onCreate;
              this.$values[field.name] = callback ? callback({ key: field.name, value, row: this.$values, args: field.args, model: this.constructor }) : value;
            } else if (foreign.type === "belongsTo") {
              this.$values[foreign.foreignKey] = value;
            }
          },
          get: () => {
            if (handler) {
              return handler.bind(this)(foreign);
            } else {
              return this.$values[field.name];
            }
          }
        });
      }
    }
    if (fields)
      this.fill(fields);
  }
  toObject() {
    const serializedValues = {};
    this.constructor.prototype.$fields.forEach((field) => {
      const value = this.$values[field.name];
      const onSet = get(field.type).onSerialize;
      const foreign = (this.constructor.prototype.$relations || []).find((i) => i.name === field.name);
      if (foreign) {
        if (foreign.type === "belongsTo") {
          serializedValues[foreign.foreignKey] = this.$values[foreign.foreignKey];
        }
      } else {
        serializedValues[field.name] = onSet ? onSet({ key: field.name, value, row: this.$values, args: field.args, model: this.constructor }) : value;
      }
    });
    return serializedValues;
  }
  toJson() {
    return JSON.stringify(this.toObject());
  }
  static query() {
    return query__default['default']().table(this.$table).parseResult((result) => {
      if (Array.isArray(result)) {
        return result.map((r) => {
          return new this({ ...r }, true);
        });
      }
      return new this({ ...result }, true);
    });
  }
  query() {
    return query__default['default']().table(this.constructor.$table).parseResult((result) => {
      if (Array.isArray(result)) {
        return result.map((r) => {
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
      throw new utils.CustomException("modelNotFound", `Model ${this.name} with ${this.$primary} ${id} not found`, {
        model: this.name,
        primaryKey: this.$primary,
        id
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
    return Promise.all(rows.map((i) => this.insert(i)));
  }
  static async updateMany(models2) {
    const normalized = Array.isArray(models2) ? models2 : Object.entries(models2);
    Promise.all(normalized.map((entry) => void this.query().where(this.$primary, entry[0]).update(entry[1])));
  }
  static addMigration() {
    const fields = {};
    this.prototype.$fields.forEach((field) => {
      const typeObj = { ...get(field.type).type || { type: "string" }, ...field.args };
      fields[field.name] = {
        ...typeObj,
        primary: this.$primary === field.name
      };
      const { $relations } = this.prototype;
      if ($relations) {
        $relations.forEach((foreign) => {
          if (foreign.name === field.name) {
            delete fields[field.name];
            if (foreign.type === "belongsTo") {
              const primary = foreign.primaryKey || foreign.model().$primary;
              const primaryType = foreign.model().prototype.$fields.find((i) => i.name === primary);
              const typeObj2 = { ...get(primaryType.type).type || { type: "string" }, ...field.args };
              fields[foreign.foreignKey] = {
                ...typeObj2,
                foreign: {
                  table: foreign.model().$table,
                  column: primary,
                  onDelete: "CASCADE"
                }
              };
            }
          }
        });
      }
    });
    query__default['default']().addMigration(this.$table, fields);
  }
  async save() {
    const { $table, $primary } = this.constructor;
    const { $fields } = this.constructor.prototype;
    const fields = {};
    for (let i = 0; i < $fields.length; i++) {
      const field = $fields[i];
      const value = this.$values[field.name];
      const onSet = get(field.type).onSave;
      const foreign = (this.constructor.prototype.$relations || []).find((i2) => i2.name === field.name);
      if (foreign) {
        if (foreign.type === "belongsTo") {
          fields[foreign.foreignKey] = this.$values[foreign.foreignKey];
        }
      } else {
        fields[field.name] = onSet ? onSet({ key: field.name, value, row: this.$values, args: field.args, model: this.constructor }) : value;
      }
    }
    let id;
    if (this.$databaseInitialized) {
      await query__default['default']().table($table).where($primary, fields[$primary]).update(fields);
      id = fields[$primary];
    } else {
      id = await query__default['default']().table($table).insert(fields) || fields[$primary];
      this.$databaseInitialized = true;
    }
    const updatedFields = await query__default['default']().table($table).where($primary, id).first();
    if (updatedFields)
      this.fill(updatedFields);
  }
  async delete() {
    const { $table, $primary } = this.constructor;
    if (this.$databaseInitialized) {
      await query__default['default']().table($table).where($primary, this.$values[$primary]).delete();
    }
    this.$databaseInitialized = false;
  }
  fill(fields) {
    const $allFields = this.constructor.prototype.$fields || [];
    const { $relations } = this.constructor.prototype;
    for (let i = 0; i < $allFields.length; i++) {
      const field = $allFields[i];
      const foreign = ($relations || []).find((i2) => i2.name === field.name);
      if (foreign && foreign.type === "belongsTo") {
        if (fields[foreign.foreignKey] || fields[field.name]) {
          this[field.name].set(fields[foreign.foreignKey] || fields[field.name]);
        }
      } else {
        this[field.name] = (fields || {})[field.name];
      }
    }
  }
};
Model.$primary = "id";
Model.$fields = [];
Model.$relations = [];

// src/modules/ModelDecorator.ts
var models = [];
var ModelDecorator = (table, primary = "id") => {
  return (target) => {
    const model = target;
    model.$table = table;
    model.$primary = primary;
    models.push(model);
  };
};
var ModelDecorator_default = ModelDecorator;
var getModels = () => models;

// src/modules/FieldDecorator.ts
var Field = (type = "string", args) => {
  return (target, key) => {
    const model = target.constructor.prototype;
    if (!model.$fields)
      model.$fields = [];
    const extraargs = {};
    if (type.match(/^\w+\?/))
      extraargs.nullable = true;
    if (type.match(/^\w+\*/))
      extraargs.primary = true;
    if (type.match(/^\w+!/))
      extraargs.unique = true;
    if (type.match(/^\w+=/))
      extraargs.default = type.split("=")[1];
    model.$fields.push({
      name: key,
      type: type.match(/^\w+/)[0],
      args: { ...Array.isArray(args) ? { length: args } : args, ...extraargs }
    });
  };
};
var FieldDecorator_default = Field;

// src/modules/HasOneDecorator.ts
var HasOne = (modelcb, foreignKey, primaryKey) => {
  return (target, key) => {
    const thismodel = target.constructor.prototype;
    if (!thismodel.$fields)
      thismodel.$fields = [];
    if (!thismodel.$relations)
      thismodel.$relations = [];
    thismodel.$fields.push({ name: key, type: "string", args: {} });
    thismodel.$relations.push({
      model: modelcb,
      type: "hasOne",
      name: key,
      primaryKey: primaryKey || "id",
      foreignKey
    });
  };
};
var HasOneDecorator_default = HasOne;

// src/modules/HasManyDecorator.ts
var HasOne2 = (modelcb, foreignKey, primaryKey) => {
  return (target, key) => {
    const thismodel = target.constructor.prototype;
    if (!thismodel.$fields)
      thismodel.$fields = [];
    if (!thismodel.$relations)
      thismodel.$relations = [];
    thismodel.$fields.push({ name: key, type: "string", args: {} });
    thismodel.$relations.push({
      model: modelcb,
      type: "hasMany",
      name: key,
      primaryKey: primaryKey || "id",
      foreignKey
    });
  };
};
var HasManyDecorator_default = HasOne2;

// src/modules/BelongsToDecorator.ts
var BelongsTo = (modelcb, foreignKey, primaryKey) => {
  return (target, key) => {
    const thismodel = target.constructor.prototype;
    if (!thismodel.$fields)
      thismodel.$fields = [];
    if (!thismodel.$relations)
      thismodel.$relations = [];
    const extraargs = {};
    if (foreignKey.match(/^\w+\?/))
      extraargs.nullable = true;
    if (foreignKey.match(/^\w+!/))
      extraargs.unique = true;
    thismodel.$fields.push({ name: key, type: "string", args: extraargs });
    thismodel.$relations.push({
      model: modelcb,
      type: "belongsTo",
      name: key,
      foreignKey: foreignKey.match(/^\w+/)[0],
      primaryKey: primaryKey || "id"
    });
  };
};
var BelongsToDecorator_default = BelongsTo;

// src/index.ts
var Field2 = FieldDecorator_default;
Field2.hasOne = HasOneDecorator_default;
Field2.hasMany = HasManyDecorator_default;
Field2.belongsTo = BelongsToDecorator_default;

exports.Field = Field2;
exports.Hasher = Hasher;
exports.Model = Model;
exports.Table = ModelDecorator_default;
exports.getModels = getModels;
exports.typeManager = types_default;
//# sourceMappingURL=index.js.map
