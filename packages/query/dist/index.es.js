/**
 * Copyright (c) 2020 The Nuinalp and APO Softworks Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 **/import { createConnection } from 'mysql2';
import { CustomException } from '@acai/utils';

// src/abstractions/builder/parts/properties.ts
var Properties = class {
  constructor() {
    this.tableName = "";
    this.queryBuild = { type: "or", logic: [] };
    this.fieldsList = [];
    this.rawQueryObject = () => {
      return this.queryBuild;
    };
    this.buildQueryPart = (arg1, arg2, arg3) => {
      if (typeof arg1 === "string") {
        if (arg3) {
          return [[arg1, arg2, arg3]];
        } else {
          return [[arg1, "=", arg2]];
        }
      }
      return arg1.reduce((prev, item) => {
        const items = this.buildQueryPart(...item);
        items.forEach((v) => prev.push(v));
        return prev;
      }, []);
    };
  }
  getAdapter() {
    return this.constructor.adapter;
  }
  push(type, subqueries) {
    if (this.queryBuild.logic.length !== 0 && this.queryBuild.type !== type) {
      for (let i = 0; i < subqueries.length; i++) {
        this.queryBuild.logic[this.queryBuild.logic.length - 1].logic.push(subqueries[i]);
      }
    } else {
      this.queryBuild.logic.push({
        type: "and",
        logic: subqueries
      });
    }
  }
};

// src/abstractions/builder/parts/static.ts
var StaticClass = class extends Properties {
  static async toggleAdapter(adapter, settings) {
    this.adapter = new adapter();
    if (settings)
      this.settings = settings;
    return await this.adapter.build(this.settings);
  }
  static async toggleSettings(settings) {
    this.settings = settings;
    return await this.adapter.build(this.settings);
  }
  static async isConnected() {
    return await this.adapter.isConnected();
  }
  static async hasErrors() {
    return await this.adapter.hasErrors();
  }
  static async close() {
    await this.adapter.close();
  }
  static table(table) {
    const query = new this();
    query.table(table);
    return query;
  }
};

// src/abstractions/builder/parts/data.ts
var DataClass = class extends StaticClass {
  constructor() {
    super(...arguments);
    this.raw = async (query, params = []) => {
      return await this.getAdapter().raw(query, params);
    };
    this.count = async (column) => {
      return await this.getAdapter().count(this.tableName, column || "*", this.queryBuild.logic.length > 0 ? this.queryBuild : void 0);
    };
    this.avg = async (column) => {
      return await this.getAdapter().avg(this.tableName, column, this.queryBuild.logic.length > 0 ? this.queryBuild : void 0);
    };
    this.sum = async (column) => {
      return await this.getAdapter().sum(this.tableName, column, this.queryBuild.logic.length > 0 ? this.queryBuild : void 0);
    };
  }
};

// src/abstractions/builder/parts/join.ts
var JoinClass = class extends DataClass {
  joinType(type, table, firstColumn, secondColumnOrOperator, secondColumn) {
    this.joinList = {
      type,
      table,
      firstColumn,
      secondColumn: secondColumn || secondColumnOrOperator,
      operator: secondColumn ? secondColumnOrOperator : "="
    };
    return this;
  }
  join(table, firstColumn, secondColumnOrOperator, secondColumn) {
    this.joinType("outer", table, firstColumn, secondColumnOrOperator, secondColumn);
    return this;
  }
  leftJoin(table, firstColumn, secondColumnOrOperator, secondColumn) {
    this.joinType("left", table, firstColumn, secondColumnOrOperator, secondColumn);
    return this;
  }
  rightJoin(table, firstColumn, secondColumnOrOperator, secondColumn) {
    this.joinType("right", table, firstColumn, secondColumnOrOperator, secondColumn);
    return this;
  }
  innerJoin(table, firstColumn, secondColumnOrOperator, secondColumn) {
    this.joinType("inner", table, firstColumn, secondColumnOrOperator, secondColumn);
    return this;
  }
};

// src/abstractions/builder/parts/query.ts
var QueryClass = class extends JoinClass {
  constructor() {
    super(...arguments);
    this.table = (table) => {
      this.tableName = table;
      return this;
    };
    this.where = (arg1, arg2, arg3) => {
      const subqueries = this.buildQueryPart(arg1, arg2, arg3);
      this.push("and", subqueries);
      return this;
    };
    this.orWhere = (arg1, arg2, arg3) => {
      const subqueries = this.buildQueryPart(arg1, arg2, arg3);
      this.push("or", subqueries);
      return this;
    };
    this.whereNull = (field) => {
      this.push("and", [[field, "IS NULL"]]);
      return this;
    };
    this.whereNotNull = (field) => {
      this.push("and", [[field, "IS NOT NULL"]]);
      return this;
    };
    this.orWhereNull = (field) => {
      this.push("or", [[field, "IS NULL"]]);
      return this;
    };
    this.orWhereNotNull = (field) => {
      this.push("or", [[field, "IS NOT NULL"]]);
      return this;
    };
    this.whereIn = (field, values) => {
      this.push("and", [[field, "IN", values]]);
      return this;
    };
    this.whereNotIn = (field, values) => {
      this.push("and", [[field, "NOT IN", values]]);
      return this;
    };
    this.orWhereIn = (field, values) => {
      this.push("or", [[field, "IN", values]]);
      return this;
    };
    this.orWhereNotIn = (field, values) => {
      this.push("or", [[field, "NOT IN", values]]);
      return this;
    };
    this.orderBy = (by, order) => {
      this.orderByQuery = { order, by };
      return this;
    };
    this.limit = (quantity, offset) => {
      this.limitQuantity = quantity;
      if (offset)
        this.offsetQuantity = offset;
      return this;
    };
    this.groupBy = (column) => {
      this.groupByColumn = column;
      return this;
    };
    this.fields = (fields) => {
      this.fieldsList = fields;
      return this;
    };
    this.parseResult = (cb) => {
      this.parseResultCache = cb;
      return this;
    };
    this.first = async () => {
      const result = (await this.limit(1).get())[0];
      return result;
    };
    this.last = async (fields = "*") => {
      const result = await this.getAdapter().querySelect(this.tableName, fields, this.queryBuild.logic.length > 0 ? this.queryBuild : void 0, 1, 0, {
        order: "DESC",
        by: this.orderByQuery?.by || "id"
      }, this.joinList)[0];
      return this.parseResultCache ? this.parseResultCache(result) : result;
    };
    this.get = async (fields) => {
      const result = await this.getAdapter().querySelect(this.tableName, fields || this.fieldsList, this.queryBuild.logic.length > 0 ? this.queryBuild : void 0, this.limitQuantity, this.offsetQuantity, this.orderByQuery, this.joinList);
      return this.parseResultCache ? this.parseResultCache(result) : result;
    };
    this.paginate = async (page, perPage = 25) => {
      const total = await this.count();
      const npp = parseInt(perPage);
      const np = parseInt(page);
      const entries = await this.getAdapter().querySelect(this.tableName, this.fieldsList, this.queryBuild.logic.length > 0 ? this.queryBuild : void 0, npp, ((np || 1) - 1) * npp, this.orderByQuery, this.joinList);
      return {
        data: this.parseResultCache ? this.parseResultCache(entries) : entries.map((i) => ({ ...i })),
        page: np || 1,
        perPage: npp,
        totalItems: total,
        totalPages: Math.ceil(total / npp)
      };
    };
    this.insert = async (fields) => {
      return await this.getAdapter().queryAdd(this.tableName, fields);
    };
    this.insertMany = async (rows) => {
      return Promise.all(rows.map((row) => this.insert(row)));
    };
    this.update = async (fields) => {
      return await this.getAdapter().queryUpdate(this.tableName, fields, this.queryBuild);
    };
    this.updateMany = async (rows) => {
      return Promise.all(rows.map((row) => this.update(row)));
    };
    this.delete = async () => {
      return await this.getAdapter().queryDelete(this.tableName, this.queryBuild);
    };
  }
};

// src/abstractions/builder/parts/table.ts
var TableClass = class extends QueryClass {
  constructor() {
    super(...arguments);
    this.getColumns = async () => {
      const result = await this.getAdapter().getColumns(this.tableName);
      return result;
    };
  }
  async createTable(columns) {
    return await this.getAdapter().createTable(this.tableName, columns);
  }
  async alterTable(columns) {
    return await this.getAdapter().alterTable(this.tableName, columns);
  }
  async dropTable() {
    return await this.getAdapter().dropTable(this.tableName);
  }
  async existsTable() {
    return await this.getAdapter().existsTable(this.tableName);
  }
};

// src/abstractions/builder/parts/transaction.ts
var TransactionClass = class extends TableClass {
  static async transact(callback) {
    await this.startTransaction();
    try {
      await callback({
        savePoint: this.savepointTransaction,
        release: this.releaseTransaction
      });
    } catch (e) {
      await this.rollbackTransaction();
      throw e;
    }
    await this.commitTransaction();
  }
  static async startTransaction() {
    await this.adapter.startTransaction();
  }
  static async savepointTransaction(name) {
    await this.adapter.savepointTransaction(name);
  }
  static async releaseTransaction(name) {
    await this.adapter.releaseTransaction(name);
  }
  static async rollbackTransaction() {
    await this.adapter.rollbackTransaction();
  }
  static async commitTransaction() {
    await this.adapter.commitTransaction();
  }
  async transact(callback) {
    await this.startTransaction();
    try {
      await callback({
        savePoint: this.savepointTransaction,
        release: this.releaseTransaction
      });
    } catch (e) {
      await this.rollbackTransaction();
      throw e;
    }
    await this.commitTransaction();
  }
  async startTransaction() {
    await this.getAdapter().startTransaction();
  }
  async savepointTransaction(name) {
    await this.getAdapter().savepointTransaction(name);
  }
  async releaseTransaction(name) {
    await this.getAdapter().releaseTransaction(name);
  }
  async rollbackTransaction() {
    await this.getAdapter().rollbackTransaction();
  }
  async commitTransaction() {
    await this.getAdapter().commitTransaction();
  }
};

// src/abstractions/builder/parts/migration.ts
var MigrationClass = class extends TransactionClass {
  static addMigration(table, columns) {
    this.adapter.addMigration(table, columns);
  }
  static async runMigrations() {
    await this.adapter.runMigrations();
  }
};

// src/abstractions/builder/index.ts
var builder_default = MigrationClass;

// src/classes/queryStrategies/sql/helpers/typeMaps.ts
var typeMaps = {
  string: "VARCHAR",
  text: "TEXT",
  int: "INT",
  float: "FLOAT",
  boolean: "TINYINT",
  date: "DATE",
  datetime: "DATETIME",
  timestamp: "TIMESTAMP",
  json: "JSON",
  enum: "ENUM"
};
var typeMaps_default = typeMaps;

// src/classes/queryStrategies/sql/helpers/tableDeserialize.ts
function tableDeserialize(tableString) {
  const columns = {};
  tableString.split("\n").splice(1).slice(0, -1).map((i) => i.replace(/,$/g, "")).forEach((line) => {
    const parts = line.split(" ").filter((i) => i !== "");
    if (parts[0].match(/^`.+`$/)) {
      const [type, length] = parts[1].split("(");
      const defaultValue = parts.find((i) => i === "DEFAULT") ? parts[parts.indexOf("DEFAULT") + 1].replace(/(`|')/g, "") : void 0;
      columns[parts[0].replace(/`/g, "")] = {
        type: Object.keys(typeMaps_default).find((key) => typeMaps_default[key] === type.toUpperCase()),
        length: length ? parseInt(length.replace(/(\(|\))/g, "")) : void 0,
        autoIncrement: !!parts.find((i) => i === "AUTO_INCREMENT"),
        nullable: !parts.find((item, index) => item === "NOT" && parts[index + 1] && parts[index + 1] === "NULL"),
        default: !defaultValue || defaultValue && defaultValue.match(/\D+/) ? defaultValue : parseFloat(defaultValue)
      };
    } else if (parts[0] === "CONSTRAINT") {
      const tableNameIndex = parts.indexOf("REFERENCES") + 1;
      columns[parts[4].replace(/(\(|\)|`|,)/g, "")].foreign = {
        name: parts[1].replace(/`/g, ""),
        table: parts[tableNameIndex].replace(/`/g, ""),
        column: parts[tableNameIndex + 1].replace(/(\(|\)|`|,)/g, ""),
        onUpdate: parts[parts.indexOf("UPDATE") - 1] === "ON" ? parts[parts.indexOf("UPDATE") + 1] : void 0,
        onDelete: parts[parts.indexOf("DELETE") - 1] === "ON" ? parts[parts.indexOf("DELETE") + 1] : void 0
      };
    } else if (parts[0] === "PRIMARY") {
      columns[parts[2].replace(/(\(|\)|`|,)/g, "")].primary = true;
    } else if (parts[0] === "UNIQUE") {
      columns[parts[3].replace(/(\(|\)|`|,)/g, "")].unique = true;
    }
  });
  return columns;
}

// src/classes/queryStrategies/sql/helpers/columnSerialize.ts
function columnSerialize(key, data) {
  const length = data.length !== void 0 ? data.length : ["string", "int"].indexOf(data.type) + 1 > 0 ? 255 : void 0;
  const column = [];
  const constraint = [];
  column.push(key);
  column.push(`${typeMaps_default[data.type].toLowerCase()}${length ? `(${typeof length === "number" ? length : length.map((i) => `"${i}"`).join(",")})` : ""}`);
  column.push(data.nullable ? "NULL" : "NOT NULL");
  if (data.unique)
    column.push("UNIQUE");
  if (data.autoIncrement)
    column.push("AUTO_INCREMENT");
  if (data.default)
    column.push(`DEFAULT ${typeof data.default === "string" ? `'${data.default}'` : data.default}`);
  if (data.foreign) {
    constraint.push(`FOREIGN KEY (${key})`);
    constraint.push(`REFERENCES ${data.foreign.table}`);
    constraint.push(`(${data.foreign.column || "id"})`);
    if (data.foreign.onUpdate)
      constraint.push(`ON UPDATE ${data.foreign.onUpdate}`);
    if (data.foreign.onDelete)
      constraint.push(`ON DELETE ${data.foreign.onDelete}`);
  }
  return [column.join(" "), constraint.join(" ") || void 0];
}

// src/classes/queryStrategies/sql/helpers/joinClauseBuilder.ts
var types = {
  "inner": "INNER",
  "left": "LEFT",
  "right": "RIGHT",
  "outer": "FULL OUTER"
};
function joinClauseBuilder(joinClause) {
  const type = types[joinClause.type];
  return `${type} JOIN ${joinClause.table} ON ${joinClause.firstColumn}${joinClause.operator}${joinClause.secondColumn}`;
}
var QueryException = class extends CustomException {
  constructor(message, state, query) {
    super("query", message, { state, query });
    this.shouldReport = true;
    this.shouldSerialize = true;
    this.status = 500;
    this.critical = false;
    this.query = query;
    this.state = state;
  }
};

// src/classes/queryStrategies/sql/helpers/queryResolver.ts
async function queryResolver(client, queryString, params = []) {
  let result;
  try {
    result = await new Promise((resolve, reject) => {
      client.query(queryString, params, (error, results) => {
        if (error)
          reject(error);
        resolve(results);
      });
    });
  } catch (e) {
    if (e.sqlMessage || e.sqlState) {
      throw new QueryException(e.sqlMessage, e.sqlState, queryString);
    }
  }
  return result;
}

// src/classes/queryStrategies/sql/helpers/resolveQueryPart.ts
function valueType(value) {
  if (value === null || value === void 0)
    return "";
  if (Array.isArray(value))
    return " (?)";
  return " ?";
}
function resolveQueryPart(queryBuild) {
  const values = [];
  const parts = queryBuild.logic.map((item) => {
    const subparts = item.logic.map((subitem) => {
      if (subitem.type) {
        return `(${resolveQueryPart(subitem)})`;
      }
      const arrayitem = subitem;
      if (arrayitem[2] !== null && arrayitem[2] !== void 0)
        values.push(arrayitem[2]);
      return `${arrayitem[0]} ${arrayitem[1]}${valueType(arrayitem[2])}`;
    });
    return subparts.join(` ${item.type === "and" ? "AND" : "OR"} `);
  });
  return [parts.join(` ${queryBuild.type === "and" ? "AND" : "OR"} `), values];
}

// src/utils/isEquals.ts
function isEquals(x, y) {
  if (x === y)
    return true;
  if (!(x instanceof Object) || !(y instanceof Object))
    return false;
  if (x.constructor !== y.constructor)
    return false;
  for (const p in x) {
    if (!x.hasOwnProperty(p))
      continue;
    if (!y.hasOwnProperty(p))
      return false;
    if (x[p] === y[p])
      continue;
    if (typeof x[p] !== "object")
      return false;
    if (!isEquals(x[p], y[p]))
      return false;
  }
  for (const p in y) {
    if (y.hasOwnProperty(p) && !x.hasOwnProperty(p))
      return false;
  }
  return true;
}

// src/classes/queryStrategies/sql/helpers/smartUpdate.ts
function calculateColumns(oldColumns, updatedColumns) {
  const responseColumns = [];
  Object.keys(updatedColumns).forEach((key, index) => {
    if (!oldColumns[key]) {
      const response = [];
      const column = updatedColumns[key];
      response.push("ADD");
      response.push(columnSerialize(key, column)[0]);
      response.push(index === 0 ? "FIRST" : `AFTER ${Object.keys(updatedColumns)[index - 1]}`);
      responseColumns.push(response.join(" "));
    }
  });
  Object.keys(oldColumns).forEach((key) => {
    if (!updatedColumns[key]) {
      const response = [];
      response.push("DROP COLUMN");
      response.push(key);
      responseColumns.push(response.join(" "));
    }
  });
  Object.keys(updatedColumns).forEach((key) => {
    if (oldColumns[key]) {
      const { foreign: _1, primary: _3, ...oldData } = oldColumns[key];
      const { foreign: _2, primary: _4, ...newData } = updatedColumns[key];
      const fpos = Object.keys(oldColumns).indexOf(key);
      const spos = Object.keys(updatedColumns).indexOf(key);
      const pos = spos === 0 ? "FIRST" : `AFTER ${Object.keys(updatedColumns)[spos - 1]}`;
      if (!isEquals(oldData, newData) || fpos !== spos) {
        const response = [];
        const column = updatedColumns[key];
        if (oldData.unique)
          response.push(`DROP INDEX ${key},`);
        response.push("MODIFY COLUMN");
        response.push(columnSerialize(key, column)[0]);
        if (fpos !== spos && spos + 1 !== Object.keys(updatedColumns).length)
          response.push(pos);
        responseColumns.push(response.join(" "));
      }
    }
  });
  const oldkey = Object.keys(oldColumns).find((i) => oldColumns[i].primary);
  const newkey = Object.keys(updatedColumns).find((i) => updatedColumns[i].primary);
  if (oldkey && newkey && oldkey !== newkey)
    responseColumns.push(`DROP PRIMARY KEY, ADD PRIMARY KEY (${newkey})`);
  else if (oldkey && !newkey)
    responseColumns.push("DROP PRIMARY KEY");
  else if (!oldkey && newkey)
    responseColumns.push(`ADD PRIMARY KEY (${newkey})`);
  return responseColumns;
}
function calculateConstraints(oldColumns, updatedColumns) {
  const queryPart = [];
  Object.keys(updatedColumns).forEach((key) => {
    if (updatedColumns[key] && updatedColumns[key].foreign && (!oldColumns[key] || !oldColumns[key].foreign)) {
      const column = updatedColumns[key];
      const foreign = column.foreign;
      const response = [];
      response.push("ADD");
      if (foreign.name)
        response.push(`CONSTRAINT ${foreign.name}`);
      response.push(`FOREIGN KEY (${key})`);
      response.push(`REFERENCES ${foreign.table}`);
      response.push(`(${foreign.column || "id"})`);
      if (foreign.onUpdate)
        response.push(`ON UPDATE ${foreign.onUpdate}`);
      if (foreign.onDelete)
        response.push(`ON DELETE ${foreign.onDelete}`);
      queryPart.push(response.join(" "));
    }
  });
  Object.keys(oldColumns).forEach((key) => {
    if ((!updatedColumns[key] || !updatedColumns[key].foreign) && oldColumns[key] && oldColumns[key].foreign) {
      queryPart.push(`DROP FOREIGN KEY ${oldColumns[key].foreign?.name}`);
    }
  });
  Object.keys(updatedColumns).forEach((key) => {
    if (updatedColumns[key] && updatedColumns[key].foreign && oldColumns[key] && oldColumns[key].foreign && !isEquals(updatedColumns[key].foreign, oldColumns[key].foreign)) {
      const column = updatedColumns[key];
      const foreign = column.foreign;
      const response = [];
      response.push(`DROP FOREIGN KEY ${oldColumns[key].foreign?.name},`);
      response.push("ADD");
      if (foreign.name)
        response.push(`CONSTRAINT ${foreign.name}`);
      response.push(`FOREIGN KEY (${key})`);
      response.push(`REFERENCES ${foreign.table}`);
      response.push(`(${foreign.column || "id"})`);
      if (foreign.onUpdate)
        response.push(`ON UPDATE ${foreign.onUpdate}`);
      if (foreign.onDelete)
        response.push(`ON DELETE ${foreign.onDelete}`);
      queryPart.push(response.join(" "));
    }
  });
  return queryPart;
}
function smartUpdate(tableName, oldColumns, updatedColumns) {
  const columns = calculateColumns(oldColumns, updatedColumns);
  const constraints = calculateConstraints(oldColumns, updatedColumns);
  const columnQuery = columns.length > 0 ? `ALTER TABLE ${tableName} ${columns.filter((i) => !!i.trim()).join(", ")}` : "";
  const constraintQuery = constraints.length === 0 ? "" : `ALTER TABLE ${tableName} ${constraints.join(", ")}`;
  return [columnQuery.trim().replace(/ +(?= )/g, ""), constraintQuery.trim().replace(/ +(?= )/g, "")];
}

// src/classes/queryStrategies/sql/strategy.ts
var SqlStrategy = class {
  constructor() {
    this.migrations = {};
    this.client = {};
    this.connected = false;
  }
  async close() {
    if (this.client && this.client.end)
      await this.client.end();
  }
  async build(settings) {
    await this.close();
    this.client = await createConnection(settings);
    return new Promise((r) => {
      this.client.connect((err) => {
        this.errors = err;
        this.connected = !err;
        return r(err || false);
      });
    });
  }
  isConnected() {
    return this.connected;
  }
  hasErrors() {
    return this.errors || false;
  }
  async raw(query, params = []) {
    return await queryResolver(this.client, query, params);
  }
  async sum(table, column, condition) {
    const stringcondition = condition && resolveQueryPart(condition);
    return await queryResolver(this.client, `SELECT SUM(${column}) FROM ${table}${stringcondition ? ` WHERE ${stringcondition[0]}` : ""}`, stringcondition && stringcondition[1]);
  }
  async avg(table, column, condition) {
    const stringcondition = condition && resolveQueryPart(condition);
    return await queryResolver(this.client, `SELECT AVG(${column}) FROM ${table}${stringcondition ? ` WHERE ${stringcondition[0]}` : ""}`, stringcondition && stringcondition[1]);
  }
  async count(table, column, condition) {
    const stringcondition = condition && resolveQueryPart(condition);
    return Object.values((await queryResolver(this.client, `SELECT COUNT(${column}) FROM ${table}${stringcondition ? ` WHERE ${stringcondition[0]}` : ""}`, stringcondition && stringcondition[1]))[0])[0];
  }
  async existsTable(table) {
    const query = await queryResolver(this.client, "SHOW TABLES");
    return !!query.find((i) => Object.values(i)[0] === table);
  }
  async getColumns(table) {
    const query = await queryResolver(this.client, `SHOW CREATE TABLE ${table}`);
    if (query.length === 0)
      return {};
    return tableDeserialize(query[0]["Create Table"]);
  }
  async createTable(table, fields) {
    const key = Object.keys(fields).find((k) => fields[k].primary);
    const columns = [];
    const foreign = [];
    Object.keys(fields).map((key2) => {
      const column = columnSerialize(key2, fields[key2]);
      columns.push(column[0]);
      if (column[1])
        foreign.push(column[1]);
    });
    await queryResolver(this.client, `CREATE TABLE ${table} (${columns.join(", ")}${key ? `,PRIMARY KEY (${key})` : ""}${foreign.length > 0 ? `, ${foreign.join(", ")}` : ""})`);
    return true;
  }
  async alterTable(table, fields) {
    const key = Object.keys(fields).find((k) => fields[k].primary);
    const columns = [];
    const foreign = [];
    Object.keys(fields).map((key2) => {
      const column = columnSerialize(key2, fields[key2]);
      const type = fields[key2].action === "ALTER" ? "MODIFY COLUMN" : fields[key2].action === "DELETE" ? "DROP COLUMN" : "ADD";
      if (type === "DROP COLUMN")
        columns.push(`${type} ${key2}`);
      else
        columns.push(`${type} ${column[0]}${fields[key2].before ? ` BEFORE ${fields[key2].before}` : ""}${fields[key2].after ? ` AFTER ${fields[key2].after}` : ""}`);
      if (column[1])
        foreign.push(column[1]);
    });
    await queryResolver(this.client, `ALTER TABLE ${table} (${columns.join(", ")}${key ? `,PRIMARY KEY (${key})` : ""}${foreign.length > 0 ? `, ${foreign.join(", ")}` : ""})`);
    return true;
  }
  async dropTable(table) {
    await queryResolver(this.client, `DROP TABLE IF EXISTS ${table}`);
    return true;
  }
  addMigration(table, columns) {
    this.migrations[table] = columns;
  }
  async runMigrations() {
    const columns = [];
    const constraints = [];
    await Promise.all(Object.keys(this.migrations).map((tableName) => {
      const c = async () => {
        const updatedtable = this.migrations[tableName];
        if (await this.existsTable(tableName)) {
          const oldtable = await this.getColumns(tableName);
          const [_columns, _constraints] = smartUpdate(tableName, oldtable, updatedtable);
          if (_columns)
            columns.push(_columns);
          if (_constraints)
            constraints.push(_constraints);
        } else {
          const key = Object.keys(updatedtable).find((k) => updatedtable[k].primary);
          const _columns = [];
          const foreign = [];
          Object.keys(updatedtable).map((key2) => {
            const column = columnSerialize(key2, updatedtable[key2]);
            _columns.push(column[0]);
            if (column[1])
              foreign.push(column[1]);
          });
          columns.push(`CREATE TABLE ${tableName} (${_columns.join(", ")}${key ? `,PRIMARY KEY (${key})` : ""})`);
          constraints.push(`ALTER TABLE ${tableName} ${foreign.map((i) => `ADD ${i}`).join(", ")}`);
        }
      };
      return c();
    }));
    await queryResolver(this.client, "SET FOREIGN_KEY_CHECKS=0;");
    await Promise.all(columns.map((i) => queryResolver(this.client, i)));
    await Promise.all(constraints.map((c) => queryResolver(this.client, c)));
    await queryResolver(this.client, "SET FOREIGN_KEY_CHECKS=1;");
    this.migrations = {};
  }
  async startTransaction() {
    await queryResolver(this.client, "START TRANSACTION");
  }
  async savepointTransaction(name) {
    await queryResolver(this.client, `SAVEPOINT ${name}`);
  }
  async releaseTransaction(name) {
    await queryResolver(this.client, `RELEASE SAVEPOINT ${name}`);
  }
  async rollbackTransaction() {
    await queryResolver(this.client, "ROLLBACK");
  }
  async commitTransaction() {
    await queryResolver(this.client, "COMMIT");
  }
  async querySelect(table, fields, condition, limit, offset, orderBy, joinClause, groupBy) {
    const stringcondition = condition && resolveQueryPart(condition);
    return await queryResolver(this.client, `SELECT ${fields && fields.length > 0 ? fields.join(", ") : "*"} FROM ${table}${stringcondition && stringcondition[0] ? ` WHERE ${stringcondition[0]}` : ""}${groupBy ? ` GROUP BY ${groupBy}` : ""}${orderBy ? ` ORDER BY ${orderBy.by} ${orderBy.order || "ASC"}` : ""}${limit ? ` LIMIT ${limit}` : ""}${offset ? ` OFFSET ${offset}` : ""}${joinClause ? joinClauseBuilder(joinClause) : ""}`, stringcondition && stringcondition[1]);
  }
  async queryAdd(table, fields) {
    const response = await queryResolver(this.client, `INSERT INTO ${table}(${Object.keys(fields).join(", ")}) VALUES (${Object.values(fields).map(() => "?").join(", ")})`, Object.values(fields));
    return response.insertId;
  }
  async queryUpdate(table, fields, condition) {
    const values = Object.keys(fields).map((key) => `${key} = ?`);
    const stringcondition = condition && resolveQueryPart(condition);
    const query = await queryResolver(this.client, `UPDATE ${table} SET ${values}${stringcondition && stringcondition[0] ? ` WHERE ${stringcondition[0]}` : ""}`, [...Object.values(fields), ...stringcondition && stringcondition[1] || []]);
    return query.affectedRows;
  }
  async queryDelete(table, condition) {
    const stringcondition = condition && resolveQueryPart(condition);
    const query = await queryResolver(this.client, `DELETE FROM ${table}${stringcondition && stringcondition[0] ? ` WHERE ${stringcondition[0]}` : ""}`, stringcondition && stringcondition[1]);
    return query;
  }
};
var strategy_default = SqlStrategy;

// src/classes/queryStrategies/sql/index.ts
var SqlQuery = class extends builder_default {
};
SqlQuery.adapter = new strategy_default();

// src/utils/dictionary.ts
var queries = {};
async function addQuery(name, type, config) {
  switch (type) {
    case "sql":
    case "mysql":
    case "mysqli":
      queries[name] = SqlQuery;
      break;
  }
  if (config) {
    await queries[name].toggleSettings(config);
  }
  return queries[name];
}
async function setDefault(name, config) {
  return await addQuery("default", name, config);
}
var dictionary_default = (key) => queries[key || "default"];

// src/index.ts
var src_default = dictionary_default;

export { builder_default as AbstractQuery, SqlQuery, addQuery, src_default as default, setDefault };
//# sourceMappingURL=index.es.js.map
