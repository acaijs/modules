<div align="center"><img src="https://github.com/AcaiJS/ref_documentation/blob/production/public/img/logo.svg" width="128"></div>

# Açai Router Module

![https://gitlab.com/acaijs/router.git](https://img.shields.io/badge/a%C3%A7a%C3%ADjs-module-%238033BC?style=for-the-badge) ![https://www.npmjs.com/package/@acai/router](https://img.shields.io/npm/v/@acai/router?color=%2392CB0D&style=for-the-badge) ![https://www.npmjs.com/package/@acai/router](https://img.shields.io/npm/dm/@acai/router?color=%238033BC&style=for-the-badge) ![https://www.npmjs.com/package/@acai/router](https://img.shields.io/npm/l/@acai/router.svg?style=for-the-badge)

This repository contains the router module added by the Açai Framework. This is responsible for creating the routes list and doing a match with a url path, passing the information back to you.

## Usage

```typescript
import { route, router } from "@acai/router";

// list routes available
route.post("/register", "controllers/auth@register");
route.post("/login", "controllers/auth@login");

route.group("/user", () => {
  route.get("/", "controllers/user@show");
  route.patch("/", "controllers/user@update");
});

// Use the router to match it
const selectedRouteInfo = router("url/path/here", "GET", route.build());
```

### Grouping

You can group routes, that will make the callbacks inside of them, use their context. Groups can be nested.

```typescript
import { route } from "@acai/router";

route.group("/users", () => {
  route.get("/", "controllers/user@index"); // this route will be /users -> controllers/user@index

  route.group("/auth", () => {
    route.get("/", "controllers/user@show"); // this route will be /users/auth -> controllers/user@show
    route.patch("/", "controllers/user@update");
  });
});
```

### HTTP Methods

You can use methods to bind HTTP methods to routes.

```typescript
import { route } from "@acai/router";

// list routes available
route("/", "any/route"); // equivalent of route.any
route.get("/", "get/route");
route.post("/", "post/route");
route.put("/", "put/route");
route.patch("/", "patch/route");
route.delete("/", "delete/route");
route.any("/", "any/route"); // doesn't care about http method

// if you wish to use multiple http methods for the same route, you can use many
route.many(["PUT", "PATCH"], "/", "put/and/patch/routes");

// you can define a route variable using
route("/{variableName}", "any/route/with/variable");
// and an optional variable with
route("/{variableName?}", "any/route/with/optional/variable");

// you can also pass an callback to the file parameter
route("/", () => {});
```

### Options

Sometimes you wish to pass additional information to a route, such as a middleware, or anything else. You can bind extra information to the context with options. Objects and arrays will automaticly be joined, if you want to avoid this behaviour, prefix the option key with `!`. Options will also prevent value duplication in arrays

```typescript
import { route } from "@acai/router";

// list routes available
route.options({ middleware: ["auth", "admin"] }, () => {
  // routes inside of here will inherit the parents options

  // prefixing an option with ! will overwrite it
  route.options({ "!middleware": ["auth"] }, () => {
    // middleware value: ["auth"]
  });
});
```

### Macro/Use

Macro is a bundle of reusable code logic you can use to create routes with a common pattern. By default it provides a resource macro. You can also overwrite an already defined macro by just defining a new one with the same name.

```typescript
import { route } from "@acai/router";

// define macro that can be used
route.macro("related", (name: string, controller: string) => {
  route.group(name, () => {
    route.get("/", `${controller}@index`);
    route.put("/", `${controller}@set`);
    route.post("/", `${controller}@add`);

    route.group("/{id}", () => {
      route.get("/", `${controller}@show`);
      route.patch("/", `${controller}@edit`);
      route.delete("/", `${controller}@delete`);
    });
  });
});

// Use macro
route.use("related", "posts", "controllers/post.controller");
route.use("related", "comments", "controllers/comment.controller");
```

#### Resource macro

| url              | method       | controller   |
| ---------------- | ------------ | ------------ |
| `"/<name>"`      | GET          | `"@index"`   |
| `"/<name>"`      | POST         | `"@store"`   |
| `"/<name>/{id}"` | GET          | `"@show"`    |
| `"/<name>/{id}"` | PATCH \| PUT | `"@update"`  |
| `"/<name>/{id}"` | DELETE       | `"@destroy"` |

## Support

Do you have a question? Please open an issue on our [main repo](https://gitlab.com/acaijs/router/issues).

## License

[BSD Clause 3](https://opensource.org/licenses/BSD-3-Clause)

Copyright (c) 2021 The Nuinalp Authors. All rights reserved.  
Use of this source code is governed by a BSD-style license that can be found in the LICENSE file.
