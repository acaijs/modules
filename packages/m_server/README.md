<div align="center"><img src="https://github.com/AcaiJS/ref_documentation/blob/production/public/img/logo.svg" width="128"></div>

# Açai Server Module

![https://gitlab.com/acaijs/server.git](https://img.shields.io/badge/a%C3%A7a%C3%ADjs-module-%238033BC?style=for-the-badge) ![https://www.npmjs.com/package/@acai/server](https://img.shields.io/npm/v/@acai/server?color=%2392CB0D&style=for-the-badge) ![https://www.npmjs.com/package/@acai/server](https://img.shields.io/npm/dm/@acai/server?color=%238033BC&style=for-the-badge) ![https://www.npmjs.com/package/@acai/server](https://img.shields.io/npm/l/@acai/server.svg?style=for-the-badge)

The server is responsible for actually handling incoming requests, and delivering them back to the user. It has support for middlewares and providers.

## Usage

```typescript
import server from "@acai/server";

// we are going to use Açai's router to control our routes, but you can easily overwrite this, will be shown next
const route = server.getRoute();

route.options({ middleware: ["test"] }, () => {
  route.get("/", "file/test@index");
});

const instance = new server();

// Middlewares are optional
instance.addMiddleware("test", (data, next) => next(data));

instance.run();
```

### Overwriting router

If you do not wish to use our router, you can easily overwrite it:

```typescript
const instance = new server();

instance.setOnRequest((url: string, method: string) => {
  return {
    route: match.path,
    // file to load from the route match
    controller: ".",
    // method to call inside of the file (optional)
    method: "index",
    // extra options, such as middleware, etc
    options: match.options,
    // variables match from the dynamic route
    params: match.variables,
    // query params
    query: query,
    // request body
    fields: content.fields,
    // request files (in case of formdata)
    files: content.files,
  };
});
```

You can use this for example, if you wish to point all routes to a single frontend, in case of a SPA.

### Providers

Providers are the main way to boot things in your application, helping you setup your application in an organized manner.

```typescript
const instance = new server();

class Provider {
  public boot() {
    /* do something */
  }
}

// aliased middleware
instance.addProvider(Provider);

instance.run();
```

### Middlewares

Middleware is a pipeline that runs before the request actually reaches your code, making changes to the request content, or even bailing it out. You can use them for authentication, validation or anything alike.

```typescript
const instance = new server();

// aliased middleware
instance.addMiddleware("test", (data, next) => next(data));

// grouped aliased middlewares
instance.addMiddlewares({
  test: (data, next) => next(data),
  auth: (data, next) => "404",
});

// global middleware
instance.addGlobalMiddleware([(data, next) => next(data)]);

instance.run();
```

- global middlewares will run in every request of your application
- aliased middleware are middlewares that you can call through your routes, for privileged requests, and such.

### Responses

We provide you with a response utility method that can help you import files, return request status codes, etc. Remember that the server smart guesses from the response you are giving, turning json into actual json and etc.

```typescript
import { response } from "@acai/server";

// return this to the server to load a file from the project root
response().view("./views/index.html");
// change the response status code
response().status(201).data({});
```
