/**
 * Copyright (c) 2020 The Nuinalp and APO Softworks Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 **/import { CustomException } from '@acai/utils';
import { DateTime } from 'luxon';

// src/classes/InvalidRuleException.ts
var InvalidRuleException = class extends CustomException {
  constructor(message, data) {
    super("invalidValidationRule", message, data);
    this.shouldReport = true;
  }
  report() {
    console.log(this.message);
  }
};

// src/rules/validations/array/index.ts
var rule = {
  onValidate: ({ value }) => Array.isArray(value),
  onError: ({ key }) => `${key} is not an array`
};
var array_default = rule;

// src/rules/validations/confirmed/index.ts
var rule2 = {
  onValidate: ({ value, key, fields }) => fields[`${key}_confirmation`] && fields[`${key}_confirmation`] === value,
  onError: ({ value, key, fields }) => {
    if (!fields[`${key}_confirmation`]) {
      return `${key} is not confirmed`;
    }
    if (fields[`${key}_confirmation`] !== value) {
      return `${key} confirmation does not match`;
    }
    return void 0;
  }
};
var confirmed_default = rule2;

// src/rules/validations/email/index.ts
var rule3 = {
  onValidate: ({ value }) => !!(typeof value === "string" && value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)),
  onError: ({ key }) => `${key} is not an email`
};
var email_default = rule3;

// src/rules/validations/uuid/index.ts
var rule4 = {
  onValidate: ({ value }) => !!(typeof value === "string" && value.match(/\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/)),
  onError: ({ key }) => `${key} is not a valid uuid`
};
var uuid_default = rule4;

// src/rules/validations/object/index.ts
var rule5 = {
  onValidate: ({ value }) => typeof value === "object",
  onError: ({ key }) => `${key} is not an object`
};
var object_default = rule5;

// src/rules/validations/required/index.ts
var rule6 = {
  onValidate: ({ value }) => !!value,
  onError: ({ key }) => `${key} is required`
};
var required_default = rule6;

// src/rules/validations/string/index.ts
var rule7 = {
  onValidate: ({ value }) => typeof value === "string",
  onError: ({ key }) => `${key} is not a string`
};
var string_default = rule7;

// src/rules/validations/number/index.ts
var rule8 = {
  onValidate: ({ value, args }) => {
    if (args && args.includes("force"))
      return !isNaN(value);
    return typeof value === "number";
  },
  onMask: ({ value }) => parseFloat(value),
  onError: ({ key }) => `${key} is not a number`
};
var number_default = rule8;

// src/rules/validations/in/index.ts
var types = {
  array: (value, args) => Array.isArray(value) && args.find((a) => value.find((v) => v === a)),
  string: (value, args) => typeof value === "string" && args.find((a) => a === value),
  object: (value, args) => typeof value === "object" && args.find((a) => value && Object.keys(value).find((v) => v === a)),
  number: (value, args) => typeof value === "number" && args.find((a) => a === `${value}`)
};
var rule9 = {
  onValidate: ({ value, args, rules, key }) => {
    if (!args || args.length === 0) {
      throw new InvalidRuleException(`Rule 'in' for field ${key} has invalid number of arguments`, { value, args, rules, key });
    }
    if (rules.includes("array"))
      return types.array(value, args);
    else if (rules.includes("string"))
      return types.string(value, args);
    else if (rules.includes("object"))
      return types.object(value, args);
    else if (rules.includes("number"))
      return types.number(value, args);
    return false;
  },
  onError: ({ rules, value, key, args }) => {
    if (rules.includes("array")) {
      if (!Array.isArray(value))
        return `${key} value is not an array`;
      return `${key} does not include one of the values: ${(args || []).join(", ")}`;
    }
    if (rules.includes("string")) {
      if (typeof value !== "string")
        return `${key} value is not a string`;
      return `${key} does not include one of the values: ${(args || []).join(", ")}`;
    }
    if (rules.includes("object")) {
      if (typeof value !== "object")
        return `${key} value is not a object`;
      return `${key} does not include one of the values: ${(args || []).join(", ")}`;
    }
    if (rules.includes("number")) {
      if (typeof value !== "number")
        return `${key} value is not a number`;
      return `${key} does not include one of the values: ${(args || []).join(", ")}`;
    }
    return void 0;
  }
};
var in_default = rule9;

// src/rules/validations/notIn/index.ts
var types2 = {
  array: (value, args) => Array.isArray(value) && args.filter((a) => value.find((v) => v.match(a))).length === 0,
  string: (value, args) => typeof value === "string" && args.filter((a) => value.match(a)).length === 0,
  object: (value, args) => typeof value === "object" && value && args.filter((a) => Object.keys(value).find((v) => v.match(a))).length === 0,
  number: (value, args) => typeof value === "number" && args.filter((a) => `${value}`.match(a)).length === 0
};
var rule10 = {
  onValidate: ({ value, args, rules, key }) => {
    if (!args || args.length === 0) {
      throw new InvalidRuleException(`Rule 'notIn' for field ${key} has invalid number of arguments`, { value, args, rules, key });
    }
    if (rules.includes("array"))
      return types2.array(value, args);
    else if (rules.includes("string"))
      return types2.string(value, args);
    else if (rules.includes("object"))
      return types2.object(value, args);
    else if (rules.includes("number"))
      return types2.number(value, args);
    return false;
  },
  onError: ({ rules, value, key, args }) => {
    if (rules.includes("array")) {
      if (!Array.isArray(value))
        return `${key} value is not an array`;
      return `${key} should not include values: ${(args || []).filter((a) => value.find((v) => v.match(a))).join(", ")}`;
    }
    if (rules.includes("string")) {
      if (typeof value !== "string")
        return `${key} value is not a string`;
      return `${key} should not include values: ${(args || []).filter((a) => value.match(a)).join(", ")}`;
    }
    if (rules.includes("object")) {
      if (typeof value !== "object")
        return `${key} value is not a object`;
      return `${key} should not include values: ${(args || []).filter((a) => Object.keys(value).find((v) => v.match(a))).join(", ")}`;
    }
    if (rules.includes("number")) {
      if (typeof value !== "number")
        return `${key} value is not a number`;
      return `${key} should not include values: ${(args || []).filter((a) => `${value}`.match(a)).join(", ")}`;
    }
    return void 0;
  }
};
var notIn_default = rule10;

// src/rules/validations/integer/index.ts
var rule11 = {
  onValidate: ({ value, args }) => {
    if (args && args.includes("force") && !isNaN(value) || typeof value === "number") {
      return parseFloat(value) === parseInt(value);
    }
    return false;
  },
  onMask: ({ value }) => parseFloat(value),
  onError: ({ key }) => `${key} is not an integer`
};
var integer_default = rule11;

// src/rules/validations/truthy/index.ts
var rule12 = {
  onValidate: ({ value }) => !!value,
  onError: ({ key }) => `${key} is not truthy`
};
var truthy_default = rule12;

// src/rules/validations/min/index.ts
var types3 = {
  array: (value, args) => Array.isArray(value) && value.length >= parseInt(args[0]),
  object: (value, args) => typeof value === "object" && value && Object.keys(value).length >= parseInt(args[0]),
  string: (value, args) => typeof value === "string" && value.length >= parseInt(args[0]),
  number: (value, args) => typeof value === "number" && value >= parseInt(args[0])
};
var rule13 = {
  onValidate: ({ value, args, rules, key }) => {
    if (!args || args.length !== 1) {
      throw new InvalidRuleException(`Rule 'min' for field ${key} has invalid number of arguments`, { value, args, rules, key });
    }
    if (rules.includes("array"))
      return types3.array(value, args);
    else if (rules.includes("string"))
      return types3.string(value, args);
    else if (rules.includes("object"))
      return types3.object(value, args);
    else if (rules.includes("number"))
      return types3.number(value, args);
    return false;
  },
  onError: ({ rules, value, key, args }) => {
    if (rules.includes("array")) {
      if (!Array.isArray(value))
        return `${key} value is not an array`;
      return `${key} has less elements than the allowed: ${(args || [])[0]}`;
    }
    if (rules.includes("string")) {
      if (typeof value !== "string")
        return `${key} value is not a string`;
      return `${key} has less characters than the allowed: ${(args || [])[0]}`;
    }
    if (rules.includes("object")) {
      if (typeof value !== "object")
        return `${key} value is not a object`;
      return `${key} has less keys than the allowed: ${(args || [])[0]}`;
    }
    if (rules.includes("number")) {
      if (typeof value !== "number")
        return `${key} value is not a number`;
      return `${key} is less than the allowed: ${(args || [])[0]}`;
    }
    return void 0;
  }
};
var min_default = rule13;

// src/rules/validations/max/index.ts
var types4 = {
  array: (value, args) => Array.isArray(value) && value.length <= parseInt(args[0]),
  object: (value, args) => typeof value === "object" && value && Object.keys(value).length <= parseInt(args[0]),
  string: (value, args) => typeof value === "string" && value.length <= parseInt(args[0]),
  number: (value, args) => typeof value === "number" && value <= parseInt(args[0])
};
var rule14 = {
  onValidate: ({ value, args, rules, key }) => {
    if (!args || args.length !== 1) {
      throw new InvalidRuleException(`Rule 'max' for field ${key} has invalid number of arguments`, { value, args, rules, key });
    }
    if (rules.includes("array"))
      return types4.array(value, args);
    else if (rules.includes("string"))
      return types4.string(value, args);
    else if (rules.includes("object"))
      return types4.object(value, args);
    else if (rules.includes("number"))
      return types4.number(value, args);
    return false;
  },
  onError: ({ rules, value, key, args }) => {
    if (rules.includes("array")) {
      if (!Array.isArray(value))
        return `${key} value is not an array`;
      return `${key} has more elements than the allowed: ${(args || [])[0]}`;
    }
    if (rules.includes("string")) {
      if (typeof value !== "string")
        return `${key} value is not a string`;
      return `${key} has more characters than the allowed: ${(args || [])[0]}`;
    }
    if (rules.includes("object")) {
      if (typeof value !== "object")
        return `${key} value is not a object`;
      return `${key} has more keys than the allowed: ${(args || [])[0]}`;
    }
    if (rules.includes("number")) {
      if (typeof value !== "number")
        return `${key} value is not a number`;
      return `${key} is more than the allowed: ${(args || [])[0]}`;
    }
    return void 0;
  }
};
var max_default = rule14;

// src/rules/validations/regex/index.ts
var rule15 = {
  onValidate: ({ value, args, rules, key }) => {
    if (typeof value !== "string")
      return false;
    if (!args || args.length !== 1) {
      throw new InvalidRuleException(`Rule 'regex' for field ${key} has invalid number of arguments`, { value, args, rules, key });
    }
    try {
      "".match(new RegExp(args[0]));
    } catch (e) {
      throw new InvalidRuleException(`Rule 'regex' for field ${key} has a invalid regex pattern (${args[0]})`, { value, args, rules, key });
    }
    return !!value.match(new RegExp(args[0]));
  },
  onError: ({ key }) => `${key} does not passes the regex`
};
var regex_default = rule15;
var rule16 = {
  onValidate: ({ value, args }) => {
    if (args && args[0])
      return DateTime.fromFormat(value, args[0]).isValid;
    return DateTime.fromISO(value).isValid;
  },
  onError: ({ key }) => `${key} is not a valid date`
};
var date_default = rule16;

// src/rules/index.ts
var ruleList = {
  "confirmed": confirmed_default,
  "required": required_default,
  "truthy": truthy_default,
  "email": email_default,
  "uuid": uuid_default,
  "regex": regex_default,
  "date": date_default,
  "in": in_default,
  "notIn": notIn_default,
  "min": min_default,
  "max": max_default,
  "object": object_default,
  "string": string_default,
  "array": array_default,
  "number": number_default,
  "float": number_default,
  "integer": integer_default,
  "int": integer_default
};
function setRule(name, rule17) {
  ruleList[name] = rule17;
}
function setRules(rules) {
  Object.keys(rules).forEach((name) => {
    ruleList[name] = rules[name];
  });
}
function clearRules() {
  ruleList = {};
}
var rules_default = () => ruleList;

// src/modules/validator/index.ts
var Validator = class {
  constructor(fields = {}) {
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
  validate(overwriteSchemaOrThrow = void 0) {
    const schema = typeof overwriteSchemaOrThrow === "object" ? overwriteSchemaOrThrow : this.getSchema();
    Object.keys(schema).forEach((fieldName) => {
      let passes = true;
      let fieldValue = this._fields[fieldName];
      const rulesApplied = Array.isArray(schema[fieldName]) ? schema[fieldName] : schema[fieldName].split(";");
      const isRequired = rulesApplied.find((i) => i.split(":")[0] === "required");
      const rulesNames = rulesApplied.map((i) => i.split(":")[0]);
      if (!(fieldValue === void 0 && !isRequired)) {
        for (let i = 0; i < rulesApplied.length; i++) {
          const [name, ...preargs] = rulesApplied[i].split(":");
          const args = (preargs.join(":") || "").split(",");
          const rule17 = this.rules[name];
          if (!rule17) {
            throw new InvalidRuleException(`Rule ${name} on validator ${this.constructor.name} doesn't exist`);
          }
          if (rule17.onValidate && !rule17.onValidate({ value: fieldValue, key: fieldName, fields: this._fields, args, rules: rulesNames })) {
            passes = false;
            const error = rule17.onError && rule17.onError({ value: fieldValue, key: fieldName, fields: this._fields, args, rules: rulesNames }) || `${name} failed validation`;
            if (!this._errors[fieldName])
              this._errors[fieldName] = [];
            if (Array.isArray(error))
              error.forEach((i2) => this._errors[fieldName].push(i2));
            else
              this._errors[fieldName].push(error);
          } else {
            fieldValue = rule17.onMask ? rule17.onMask({ value: fieldValue, key: fieldName, fields: this._fields, args, rules: rulesNames }) : fieldValue;
          }
        }
        if (!this._errors[fieldName]) {
          this._validated[fieldName] = fieldValue;
        }
      }
      if (passes && !this._validated[fieldName])
        this._validated[fieldName] = fieldValue;
    });
    if (overwriteSchemaOrThrow !== false && this.throwable && Object.keys(this._errors).length > 0) {
      const error = new Error("Validation error");
      error.type = "validation";
      error.data = this.printErrors();
      error.shouldReport = false;
      throw error;
    }
  }
  getSchema() {
    throw new Error("Schema not implemented");
  }
  printErrors() {
    if (Object.keys(this._errors).length === 0)
      return void 0;
    return {
      errors: this._errors
    };
  }
  get rules() {
    return rules_default();
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
};

// src/index.ts
var src_default = Validator;

export { clearRules, src_default as default, rules_default as rules, setRule, setRules };
//# sourceMappingURL=index.es.js.map
