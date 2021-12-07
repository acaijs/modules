<div align="center"><img src="https://github.com/AcaiJS/ref_documentation/blob/production/public/img/logo.svg" width="128"></div>

[![GitHub](https://img.shields.io/github/license/AcaiFramework/model)](https://github.com/AcaiFramework/model) [![Build Status](https://travis-ci.org/AcaiFramework/model.svg?branch=production)](https://travis-ci.org/AcaiFramework/model) [![Support](https://img.shields.io/badge/Patreon-Support-orange.svg?logo=Patreon)](https://www.patreon.com/rafaelcorrea)

# Açaí's Framework model

Models are a easy way to group your data with methods to format it, save and other crud operations.

## Usage

### Declare model

```typescript
import Model from "@acai/model";

@Model.Table("user", "connection2")
export class User extends Model {
  @Model.Field()
  public id: string;

  @Model.Field()
  public name: string;

  @Model.Field()
  public email: string;

  @Model.Field()
  public avatar?: string;
}
```

### CRUD operations

```typescript
// get
const user = await User.find("id");
const user2 = await User.query().where("name", "John").first();

// create/update
const user = new User();
await user.save();

// delete
const user = await User.find("id");
await user.delete();
```

## Extending types

### Types parts

- onCreate
  When setting a field value into the model
- onSave
  From model to database
- onRetrieve
  From database to model
- onSerialize
  From model to JS object
