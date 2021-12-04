/**
 * Copyright (c) 2020 The Nuinalp and APO Softworks Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 **/'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var utils = require('@acai/utils');
var http = require('http');
var router = require('@acai/router');
var path = require('path');
var fs = require('fs');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () {
            return e[k];
          }
        });
      }
    });
  }
  n['default'] = e;
  return Object.freeze(n);
}

// src/utils/deepMerge.ts
var isObject = (item) => item && typeof item === "object" && !Array.isArray(item);
function deepMerge(obj1, obj2) {
  const output = Object.assign({}, obj1);
  if (isObject(obj1) && isObject(obj2)) {
    Object.keys(obj2).forEach((key) => {
      if (isObject(obj2[key])) {
        if (!(key in obj1))
          Object.assign(output, { [key]: obj2[key] });
        else
          output[key] = deepMerge(obj1[key], obj2[key]);
      } else {
        Object.assign(output, { [key]: obj2[key] });
      }
    });
  }
  return output;
}
var AdapterNotFound = class extends utils.CustomException {
  constructor(adapterName) {
    super("server.adapter", `Adapter ${adapterName} was not found when initializing server`);
    this.critical = true;
    this.shouldReport = true;
    this.shouldSerialize = true;
    this.adapter = adapterName;
  }
};
var PortOccupied = class extends utils.CustomException {
  constructor(portOccupied) {
    super("server.port", `Port ${portOccupied} is already being used`);
    this.critical = true;
    this.shouldReport = true;
    this.shouldSerialize = true;
    this.port = portOccupied;
  }
};
var RouteNotFound = class extends utils.CustomException {
  constructor(route2, method) {
    super("adapter.route", `Route ${method}:"${route2}" not found`);
    this.status = 403;
    this.critical = false;
    this.shouldReport = false;
    this.shouldSerialize = false;
    this.route = route2;
    this.method = method;
  }
};

// src/adapters/http/utils/respond.ts
function respond(res, { body, headers, status } = {}) {
  if (status)
    res.statusCode = status;
  if (headers) {
    Object.keys(headers).forEach((k) => {
      if (k !== "content-length")
        res.setHeader(k, headers[k]);
    });
  }
  if (body)
    res.write(typeof body === "string" ? body : JSON.stringify(body) || "");
  res.end();
}

// src/utils/censor.ts
function simpleStringify(object) {
  if (object && typeof object === "object") {
    object = copyWithoutCircularReferences([object], object);
  }
  return JSON.stringify(object);
  function copyWithoutCircularReferences(references, object2) {
    const cleanObject = {};
    Object.keys(object2).forEach(function(key) {
      const value = object2[key];
      if (value && Array.isArray(value)) {
        cleanObject[key] = value;
      } else if (value && typeof value === "object") {
        if (references.indexOf(value) < 0) {
          references.push(value);
          cleanObject[key] = copyWithoutCircularReferences(references, value);
          references.pop();
        } else {
          cleanObject[key] = "###_Circular_###";
        }
      } else if (typeof value !== "function") {
        cleanObject[key] = value;
      }
    });
    return cleanObject;
  }
}

// src/adapters/http/utils/response.ts
async function smartResponse(payload, request, viewPrefix) {
  const headers = {};
  let body = "";
  let status = 200;
  Object.keys(request.headers).forEach((k) => {
    if (k !== "content-length")
      headers[k] = request.headers[k];
  });
  Object.keys(payload[1]?.headers || {}).forEach((k) => {
    if (k !== "content-length")
      headers[k] = payload[1].headers[k];
  });
  if (typeof payload[0] === "function" && payload[0].utility === "response") {
    const data = payload[0]();
    status = data.status || 200;
    body = data.body || "";
    if (data.headers) {
      Object.keys(data.headers).forEach((key) => {
        headers[key] = data.headers[key];
      });
    }
    if (data.view) {
      body = fs.readFileSync(path.join(`${process.cwd()}`, viewPrefix || "", data.view), {
        encoding: "utf-8"
      });
    }
  } else {
    body = payload[0];
  }
  if (typeof body === "object") {
    headers["Accept"] = "application/json";
    headers["Content-Type"] = "application/json";
    if (body.toObject && typeof body.toObject === "function") {
      body = body.toObject();
    }
  } else if (!headers["Content-Type"]) {
    headers["Accept"] = "text/plain";
    headers["Content-Type"] = "text/plain";
  }
  return {
    body: typeof body === "object" ? simpleStringify(body) : body,
    headers,
    status
  };
}

// src/adapters/http/index.ts
var HttpAdapter = class {
  constructor() {
    this.onRequest = async (makeRequest, requestSafeThread) => {
      this.conn.on("request", async (req, res) => {
        const response2 = await requestSafeThread(async () => {
          const url = req.url || "";
          const match = this.getMatch(url || "", req);
          if (!match)
            throw new RouteNotFound(url.split("?")[0], req.method || "");
          const request = { ...match, ...this.getParsedRequest(req) };
          const file = req.method === "OPTIONS" ? () => "" : match.controller;
          return await makeRequest(request, file, match.middlewares);
        });
        const parsedResponse = await smartResponse(response2, req);
        respond(res, parsedResponse);
      });
    };
  }
  async boot(config) {
    const hostname = config.hostname || "localhost";
    const port = config.port || 3e3;
    this.conn = http.createServer();
    this.conn.listen(port, hostname);
    this.conn.on("error", (err) => {
      if (err.code === "EADDRINUSE")
        throw new PortOccupied(port || 3e3);
    });
    await new Promise((r) => void this.conn.on("listening", () => r(true)));
    if (process.env.testing !== "true")
      console.log(`Server running on ${hostname}:${port}`);
    return true;
  }
  async shutdown() {
    if (this.conn.listening) {
      await new Promise((r) => this.conn.close(r));
    }
  }
  getParsedRequest(req) {
    const [path3] = (req.url || "").split("?");
    const headers = Object.keys(req.headers).reduce((prev, curr) => ({ ...prev, [curr.toLowerCase()]: req.headers[curr] }), {});
    const request = { raw: () => req, headers, method: req.method, status: req.statusCode, url: path3, body: {} };
    return request;
  }
  getMatch(path3, req) {
    const match = router.router(path3, req.method, router.route.build(false));
    if (!match)
      return;
    const { file, options, variables, query } = match;
    return match ? {
      controller: file,
      middlewares: options.middleware || [],
      params: variables,
      query
    } : void 0;
  }
  getPath(prepath) {
    const [path3] = prepath.split("?");
    return path3;
  }
};
var ControllerNotFoundException = class extends utils.CustomException {
  constructor(controller, route2, method) {
    super("adapter.route.controller", `Method ${method} of the controller ${controller} in the route ${route2} was not found`, { controller, route: route2, method });
    this.critical = false;
    this.shouldReport = true;
    this.shouldSerialize = false;
    if (method)
      this._message = `Method ${method} of the controller ${controller} in the route ${route2} was not found`;
    else
      this._message = `Controller ${controller} for route ${route2} not found`;
    this.controller = controller;
    this.route = route2;
    this.method = method;
  }
  render() {
    return this.message;
  }
};

// src/utils/findController.ts
var exists = (path3) => fs.promises.access(path3).then(() => true).catch(() => false);
async function findFile(filepath) {
  const [name, ...dirpath] = filepath.split(/(\/|\\)/).reverse();
  const dir = path.join(...dirpath.reverse());
  if (!await exists(dir))
    return;
  const files = await fs.promises.readdir(dir, { withFileTypes: true });
  for (let i = 0; i < files.length; i++) {
    if (files[i].isFile() && files[i].name.match(new RegExp(`^${name}`)))
      return path.join(dir, files[i].name);
  }
  return void 0;
}
async function findController(controllerPath, route2) {
  if (typeof controllerPath !== "string") {
    return controllerPath;
  }
  const [controller, method] = controllerPath.split("@");
  const pathString = await findFile(path.join(process.cwd(), controller)) || controller;
  const sanitizedControllerPath = pathString.split(/(\\|\/)/).reverse()[0].split("@")[0];
  if (!pathString || !exists(pathString)) {
    throw new ControllerNotFoundException(sanitizedControllerPath, route2);
  }
  const file = (await Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require(pathString)); })).default;
  if (typeof file === "object" && !method) {
    throw new utils.CustomException("controller", `Controller (${controller}) is a object but a method was not passed`);
  }
  if (typeof file === "object" && method && !file[method]) {
    throw new utils.CustomException("controller", `Controller (${controller}) did not provide a property for the method ${method}`);
  } else if (typeof file === "function" && Object.getOwnPropertyNames(file.prototype).length > 1 && !method) {
    throw new utils.CustomException("controller", `Controller (${controller}) is a class but you are trying to access it as a function`);
  } else if (typeof file === "function" && Object.getOwnPropertyNames(file.prototype).length > 1 && method && !file.prototype[method]) {
    console.log(Object.getOwnPropertyNames(file.prototype), file);
    throw new utils.CustomException("controller", `Controller (${controller}) did not provide a property for the method ${method} or it was an arrow function (sadly we do not support them)`);
  } else if (typeof file === "function" && method && Object.getOwnPropertyNames(file.prototype).length === 1) {
    throw new utils.CustomException("controller", `Controller (${controller}) is a callback but you are trying to access it as a class`);
  }
  return async (request) => {
    if (file.prototype?.constructor && typeof file.prototype?.constructor === "function") {
      if (Object.getOwnPropertyNames(file.prototype).length > 1) {
        const instance = new file(request);
        return instance[method].bind(instance)(request);
      }
      return file(request);
    }
    if (method)
      return file[method].bind(file)(request);
    return file;
  };
}
function usePreserve(value, originalRequest, flowRequest, globalRequest) {
  switch (value) {
    default:
    case "all":
      return flowRequest;
    case "global":
      return globalRequest;
    case "none":
      return originalRequest;
  }
}
async function safeHandle(callback, handler, request, globalRequest) {
  try {
    const response2 = await callback();
    return response2;
  } catch (e) {
    const error = e;
    const useRequest = usePreserve(error.preserve, request, error.request, globalRequest);
    delete error.request;
    const response2 = await handler.onException(e, useRequest);
    if (response2 === void 0) {
      if (error.shouldReport !== false && process.env.testing !== "true") {
        if (error.report)
          error.report({ error, server: handler.adapter, request: useRequest });
        else
          utils.exceptionLog(error.message, error.stack?.split("\n"), error.data);
      }
    }
    if (error.critical) {
      await handler.shutdown();
      process.exit(1);
    }
    if (response2 !== void 0)
      return response2;
    if (error.render)
      return [error.render({ error, server: handler.adapter, request: useRequest }), useRequest, error];
    return [error.message || "", useRequest, error];
  }
}
var MiddlewareNotFound = class extends utils.CustomException {
  constructor(middleware, route2) {
    super("server.middleware", `Middleware ${middleware} was not found for route ${route2}`);
    this.critical = false;
    this.shouldReport = true;
    this.shouldSerialize = false;
    this.middleware = middleware;
    this.route = route2;
  }
};

// src/classes/MiddlewareHandler.ts
var MiddlewareHandler = class {
  constructor(md) {
    this.middlewares = [];
    if (md)
      this.add(md);
  }
  add(md) {
    if (md.length > 0) {
      if (Array.isArray(md[0]))
        this.middlewares = [...this.middlewares, ...md];
      else
        this.middlewares = [...this.middlewares, md];
    }
    return this;
  }
  clear() {
    this.middlewares = [];
  }
  async pipe(request) {
    if (this.middlewares.length === 0)
      return [request, request];
    const lastrequest = request;
    const stack = [];
    for (let i = 0; i < this.middlewares.length; i++) {
      const curr = this.middlewares[i];
      stack.push(async (r) => {
        try {
          const response2 = await this.buildCallback(curr[0])((await r)[0], async (r2) => await (stack[i + 1] || ((r3) => r3))([await r2]), curr[1] || []);
          return response2;
        } catch (e) {
          e.request = r[0];
          throw e;
        }
      });
    }
    if (stack.length)
      return stack[0]([lastrequest]);
    return lastrequest;
  }
  buildCallback(middleware) {
    if (middleware.onApply) {
      return middleware.onApply.bind(middleware);
    }
    return middleware;
  }
};

// src/classes/AdapterHandler.ts
var AdapterHandler = class {
  constructor(adapter) {
    this.adapter = adapter;
  }
  async boot() {
    for (let i = 0; i < this.adapter.providers.length; i++) {
      const provider = this.adapter.providers[i];
      await safeHandle(() => provider.boot && provider.boot(this.adapter), this);
    }
    await safeHandle(() => this.adapter.adapter.boot(this.adapter.config), this);
    await safeHandle(() => this.adapter.adapter.onRequest(this.onRequest.bind(this), async (cb) => await safeHandle(() => cb(), this)), this);
  }
  async shutdown() {
    for (let i = 0; i < this.adapter.providers.length; i++) {
      const provider = this.adapter.providers[i];
      if (provider.shutdown)
        await provider.shutdown(this.adapter);
    }
    this.adapter.adapter.shutdown();
  }
  async onException(error, request) {
    for (let i = 0; i < this.adapter.providers.length; i++) {
      const provider = this.adapter.providers[i];
      const response2 = provider.onError && await provider.onError({ error, server: this.adapter, request });
      if (response2)
        return [response2, request];
    }
    return void 0;
  }
  async onRequest(request, precontroller, middlewareNames = []) {
    const controller = await safeHandle(async () => {
      return typeof precontroller === "string" ? await findController(`${this.adapter.config.filePrefix || ""}/${precontroller}`, request.route) : precontroller;
    }, this, request);
    const globalsresponse = await safeHandle(async () => {
      const globals = this.adapter.globals.map((item) => [item, void 0]);
      const composition = new MiddlewareHandler(globals);
      return composition.pipe(request);
    }, this, request, request);
    if (!Array.isArray(globalsresponse))
      return [globalsresponse];
    if (globalsresponse.length === 3)
      return globalsresponse;
    const middlewaresresponse = await safeHandle(async () => {
      middlewareNames.map((name) => name.split(":")[0]).forEach((name) => {
        if (!this.adapter.middlewares[name])
          throw new MiddlewareNotFound(name, `${precontroller}`);
      });
      const middlewares = middlewareNames.map((name) => name.split(":")).map(([name, ...data]) => [this.adapter.middlewares[name], (data || "").join(":").split(",")]);
      const composition = new MiddlewareHandler(middlewares);
      return composition.pipe(globalsresponse[0]);
    }, this, request, globalsresponse);
    if (!Array.isArray(middlewaresresponse))
      return [middlewaresresponse];
    if (middlewaresresponse.length === 3)
      return middlewaresresponse;
    return [await controller(middlewaresresponse[0]), middlewaresresponse[0]];
  }
};

// src/utils/instanciable.ts
function instanciable(income) {
  if (!income)
    return {};
  if (income.constructor && income.prototype?.constructor === income)
    return new income();
  return income;
}

// src/modules/server.ts
var Server = class {
  constructor(config) {
    this.adapters = {};
    this._config = config || {};
    this.addAdapter("http", HttpAdapter);
  }
  setConfig(adapterOrConfig, configOrNone) {
    const adapters = configOrNone && (typeof adapterOrConfig === "string" ? [adapterOrConfig] : adapterOrConfig);
    const config = configOrNone || adapterOrConfig;
    if (adapters) {
      adapters.forEach((adapter) => {
        if (!this.adapters[adapter])
          throw new AdapterNotFound(adapter);
      });
      adapters.forEach((adapter) => this.adapters[adapter].config = deepMerge(this.adapters[adapter].config, config));
      return;
    }
    this._config = deepMerge(this._config, config);
    Object.keys(this.adapters).forEach((adapter) => this.adapters[adapter].config = deepMerge(this.adapters[adapter].config, config));
  }
  getConfig(adapter) {
    if (adapter)
      return this.adapters[adapter]?.config;
    return this._config;
  }
  deleteConfig(adapterOrKey, keyOrNone) {
    const adapters = keyOrNone && (typeof adapterOrKey === "string" ? [adapterOrKey] : adapterOrKey);
    const key = keyOrNone || adapterOrKey;
    if (adapters) {
      adapters.forEach((adapter) => {
        if (!this.adapters[adapter])
          throw new AdapterNotFound(adapter);
      });
      adapters.forEach((adapter) => void delete this.adapters[adapter].config[key]);
      return;
    }
  }
  addProvider(adapterOrProvider, providerOrNone) {
    const adapters = providerOrNone && (typeof adapterOrProvider === "string" ? [adapterOrProvider] : adapterOrProvider);
    const provider = providerOrNone || adapterOrProvider;
    if (adapters) {
      adapters.forEach((adapter) => {
        if (!this.adapters[adapter])
          throw new AdapterNotFound(adapter);
      });
      adapters.forEach((adapter) => this.adapters[adapter].providers.push(instanciable(provider)));
      return;
    }
    Object.values(this.adapters).forEach((adapter) => adapter.providers.push(instanciable(provider)));
  }
  addProviders(adapterOrProviders, providersOrNone) {
    const adapters = providersOrNone && (typeof adapterOrProviders === "string" ? [adapterOrProviders] : adapterOrProviders);
    const providers = providersOrNone ? providersOrNone : adapterOrProviders;
    if (adapters) {
      adapters.forEach((adapter) => {
        if (!this.adapters[adapter])
          throw new AdapterNotFound(adapter);
      });
      providers.forEach((provider) => this.addProvider(adapters, provider));
      return;
    }
    providers.forEach((provider) => this.addProvider(provider));
  }
  clearProviders(_adapters) {
    const adapters = typeof _adapters === "string" ? [_adapters] : _adapters;
    if (adapters) {
      adapters.forEach((adapter) => {
        if (!this.adapters[adapter])
          throw new AdapterNotFound(adapter);
      });
      adapters.forEach((adapter) => this.adapters[adapter].providers = []);
      return;
    }
    Object.values(this.adapters).forEach((adapter) => adapter.providers = []);
  }
  addMiddleware(idOrAdapter, middlewareOrId, cb) {
    const adapters = cb && (typeof idOrAdapter === "string" ? [idOrAdapter] : idOrAdapter);
    const id = cb ? middlewareOrId : idOrAdapter;
    const middleware = cb ? cb : middlewareOrId;
    if (adapters) {
      adapters.forEach((adapter) => {
        if (!this.adapters[adapter])
          throw new AdapterNotFound(adapter);
      });
      adapters.forEach((adapter) => this.adapters[adapter].middlewares[id] = middleware);
      return;
    }
    Object.values(this.adapters).forEach((adapter) => adapter.middlewares[id] = middleware);
  }
  addMiddlewares(middlewaresOrAdapter, middlewares) {
    const adapters = middlewares ? typeof middlewaresOrAdapter === "string" ? [middlewaresOrAdapter] : middlewaresOrAdapter : void 0;
    const middlewareGroup = middlewares ? middlewares : middlewaresOrAdapter;
    if (adapters) {
      adapters.forEach((adapter) => {
        if (!this.adapters[adapter])
          throw new AdapterNotFound(adapter);
      });
      Object.keys(middlewareGroup).forEach((middleware) => this.addMiddleware(adapters, middleware, middlewareGroup[middleware]));
      return;
    }
    Object.keys(middlewareGroup).forEach((middlewareKey) => this.addMiddleware(middlewareKey, middlewaresOrAdapter[middlewareKey]));
  }
  clearMiddlewares(adapterOrMiddlewares, middlewares) {
    const adapters = middlewares && (typeof adapterOrMiddlewares === "string" ? [adapterOrMiddlewares] : adapterOrMiddlewares);
    const middlewaresToRemove = middlewares ? typeof middlewares === "string" ? [middlewares] : middlewares : typeof adapterOrMiddlewares === "string" ? [adapterOrMiddlewares] : adapterOrMiddlewares;
    if (adapters) {
      adapters.forEach((adapter) => {
        if (!this.adapters[adapter])
          throw new AdapterNotFound(adapter);
      });
      adapters.forEach((id) => middlewaresToRemove.forEach((middleware) => delete this.adapters[id].middlewares[middleware]));
      return;
    }
    if (middlewaresToRemove) {
      Object.values(this.adapters).forEach((adapter) => middlewaresToRemove.forEach((middleware) => {
        delete adapter.middlewares[middleware];
      }));
      return;
    }
    Object.values(this.adapters).forEach((adapter) => adapter.middlewares = {});
  }
  addGlobal(adapterOrCallback, cb) {
    const adapters = cb && (typeof adapterOrCallback === "string" ? [adapterOrCallback] : adapterOrCallback);
    const callback = cb || adapterOrCallback;
    if (adapters) {
      adapters.forEach((adapter) => {
        if (!this.adapters[adapter])
          throw new AdapterNotFound(adapter);
      });
      adapters.forEach((adapter) => this.adapters[adapter].globals.push(callback));
      return;
    }
    Object.values(this.adapters).forEach((adapter) => adapter.globals.push(callback));
  }
  addGlobals(adapterOrGlobals, globalsOrNone) {
    const adapters = globalsOrNone && (typeof adapterOrGlobals === "string" ? [adapterOrGlobals] : adapterOrGlobals);
    const globals = globalsOrNone || adapterOrGlobals;
    if (adapters) {
      adapters.forEach((adapter) => {
        if (!this.adapters[adapter])
          throw new AdapterNotFound(adapter);
      });
      globals.forEach((global) => this.addGlobal(adapters, global));
      return;
    }
    adapterOrGlobals.forEach((global) => this.addGlobal(global));
  }
  clearGlobals(_adapters) {
    const adapters = typeof _adapters === "string" ? [_adapters] : _adapters;
    if (adapters) {
      adapters.forEach((adapter) => this.adapters[adapter].globals = []);
      return;
    }
    Object.values(this.adapters).forEach((adapter) => adapter.globals = []);
  }
  addAdapter(name, adapter, config) {
    this.adapters[name] = {
      name,
      adapter: instanciable(adapter),
      middlewares: {},
      providers: [],
      globals: [],
      config: config ? deepMerge(this._config, config) : this._config,
      running: false,
      handler: void 0
    };
  }
  injectAdapter(name) {
    const adapters = typeof name === "string" ? [name] : name;
    adapters.forEach;
  }
  getAdapter(name) {
    return this.adapters[name];
  }
  removeAdapter(name) {
    delete this.adapters[name];
  }
  async run(adaptersToRun) {
    const adapters = (typeof adaptersToRun === "string" ? [adaptersToRun] : adaptersToRun) || Object.keys(this.adapters);
    await Promise.all(adapters.map((name) => (async () => {
      if (!this.adapters[name])
        return console.log(`Adapter ${name} was not found, skipping.`);
      const handler = this.adapters[name].handler = new AdapterHandler(this.adapters[name]);
      this.adapters[name].handler = handler;
      this.adapters[name].running = true;
      await handler.boot();
    })()));
  }
  async stop(adaptersToStop) {
    const adapters = (typeof adaptersToStop === "string" ? [adaptersToStop] : adaptersToStop) || Object.keys(this.adapters);
    await Promise.all(adapters.map((name) => (async () => {
      if (this.adapters[name]) {
        await this.adapters[name].handler?.shutdown();
        this.adapters[name].handler = void 0;
        this.adapters[name].running = false;
      }
    })()));
  }
  async isRunning(adaptersToCheck) {
    const adapters = (typeof adaptersToCheck === "string" ? [adaptersToCheck] : adaptersToCheck) || Object.keys(this.adapters);
    return adapters.filter((adapter) => this.adapters[adapter].running).length;
  }
};
var src_default = Server;

Object.defineProperty(exports, 'response', {
  enumerable: true,
  get: function () {
    return utils.response;
  }
});
exports.HttpAdapter = HttpAdapter;
exports['default'] = src_default;
//# sourceMappingURL=index.js.map
