<div align="center"><img src="https://github.com/AcaiJS/ref_documentation/blob/production/public/img/logo.svg" width="128"></div>

# Açai Validator Module

![https://gitlab.com/acaijs/validator.git](https://img.shields.io/badge/a%C3%A7a%C3%ADjs-module-%238033BC?style=for-the-badge) ![https://www.npmjs.com/package/@acai/validator](https://img.shields.io/npm/v/@acai/validator?color=%2392CB0D&style=for-the-badge) ![https://www.npmjs.com/package/@acai/validator](https://img.shields.io/npm/dm/@acai/validator?color=%238033BC&style=for-the-badge) ![https://www.npmjs.com/package/@acai/validator](https://img.shields.io/npm/l/@acai/validator.svg?style=for-the-badge)

A customizable validator for the Açaí framework. You can easily add your own rules and extend the capabilities of our validator.

## Usage

```typescript
import { addRule } from "@acai/validator";

// first thing we need is to extend the base Validator class
class RegisterValidator extends Validator {
  protected getSchema() {
    return {
      email: ["required", "email"],
      password: ["required", "confirmed"],
    };
  }
}

// now we get the fields to be validated
const fields = {
  email: "not an email",
  password: "not confirmed password",
};

const validation = new RegisterValidator(fields);
const errors = validation.errors;

// this will be filled if the validation failed
if (errors) {
  console.warn(errors);
}
```

## Custom rules

```typescript
import { addRule } from "@acai/validator";

addRule("password", {
	/** Validation to check if value should pass */
	onValidate	? (data: {value: unknown, key: string, fields: Record<string, unknown>, args?: string[], rules: string[]}) => {
		return /* your validation here */
	}
	/** Message to be returned in case of validation error */
	onError		? (data: {value: unknown, key: string, fields: Record<string, unknown>, args?: string[], rules: string[]}) => {
		return `${key} is not a valid password`;
	}
	/** Alters values to other rules */
	onMask		? (data: {value: unknown, key: string, fields: Record<string, unknown>, args?: string[], rules: string[]}) => {
		return /* new masked value here */;
	}
});

```

## Rules

### Type validation rules

| name         | args                                                       | description                                                                                               |
| ------------ | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| array        | content type, such as: `string`, `number`, etc...          | Check if field is an array                                                                                |
| object       | content type, such as: `string`, `number`, etc...          | Check if field is an object                                                                               |
| boolean      | no arguments                                               | Check if field is an boolean                                                                              |
| string       | no arguments                                               | Check if field is an string                                                                               |
| number/float | `force` to allow strings that can be convertable to number | Check if value is a valid number and if `force` is passed, maskes field into an actual number if is not   |
| integer      | `force` to allow strings that can be convertable to number | Check if value is a valid integer and if `force` is passed, maskes field into an actual integer if is not |

### Composite validation rules

Those are rules that adapt to other rules present in the same field

| name     | args                         | description                                                                                                                                                                                      |
| -------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| includes | list of keywords to look     | Check if the field includes the keywords present, if it's an object, will look for the keys, if it's an array, will look for the values. If it's a string or a number, will look for the pattern |
| min      | minimal value to be required | If the field is an object or array, will look the quantity of keys. If it's a string, will look for character quantity. And if it's a number, is bigger than the passed argument                 |
| max      | max value to be required     | If the field is an object or array, will look the quantity of keys. If it's a string, will look for character quantity. And if it's a number, is smaller than the passed argument                |

### General validation rules

| name      | args                     | description                                                                           |
| --------- | ------------------------ | ------------------------------------------------------------------------------------- |
| required  | no arguments             | Field cannot be undefined                                                             |
| confirmed | reference field          | Looks for a field with the suffix `_confirmation` that has the same value             |
| uuid      | no arguments             | Field must be a valid uuid4                                                           |
| truthy    | no arguments             | Field must be a javascript true comparison (`1`, `"any string value`, `true`, etc...) |
| email     | no arguments             | Field must be a valid email                                                           |
| regex     | regex pattern            | Field must match the provided regex pattern                                           |
| date      | optional format for date | String that contains a valid date format                                              |
