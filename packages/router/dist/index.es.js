/**
 * Copyright (c) 2020 The Nuinalp and APO Softworks Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 **/// src/utils/context.ts
var context = { options: {} };
var routes = [];
var cbs = [];
var macros = {};
var getContext = () => context;
var setContext = ({ options, ...newContext }, lastoptions) => {
  const newoptions = { ...lastoptions };
  if (options) {
    Object.keys(options).forEach((key) => {
      if (!key.match(/^!/)) {
        if (Array.isArray(options[key]) && Array.isArray(lastoptions[key])) {
          const arr = options[key];
          newoptions[key] = [...lastoptions[key].filter((i) => !arr.find((x) => x === i)), ...arr];
        } else if (typeof options[key] === "object" && typeof lastoptions[key] === "object") {
          newoptions[key] = { ...lastoptions[key], ...options[key] };
        } else {
          newoptions[key] = options[key];
        }
      } else {
        newoptions[key.replace(/^!/, "")] = options[key];
      }
    });
  }
  context = { ...newContext, options: { ...newoptions } };
};
var clearContext = () => {
  context = { options: {} };
};
var getRoutes = () => routes;
var addRoute = (view, path, method, options) => {
  const { prefix, ..._context } = getContext();
  const completepath = `/${(prefix === void 0 ? "/" : prefix) + path}`.replace(/\/$/, "").replace(/^(\\+|\/+)/gm, "/");
  const clearview = typeof view === "string" ? view.replace(/(\\+|\/+)/gm, "/").replace(/(\\|\/)$/gm, "").replace(/^(\\|\/)/gm, "") : view;
  routes.push({
    file: clearview,
    path: completepath,
    method,
    options: {
      ..._context.options,
      ...options
    }
  });
  const index = routes.length - 1;
  return {
    options: (newoptions) => {
      routes[index].options = {
        ...routes[index].options,
        ...newoptions
      };
    }
  };
};
var clearRoutes = () => {
  routes = [];
};
var getCallbacks = () => cbs;
var addCallback = (newCallback) => {
  cbs.push(newCallback);
};
var clearCallbacks = () => {
  cbs = [];
};
var getMacro = (name) => {
  if (!macros[name]) {
    throw new Error(`Macro '${name}' not found`);
  }
  return macros[name];
};
var setMacro = (name, callback) => {
  macros[name] = callback;
};

// src/modules/route.ts
var routeAnyMethod = (path, filePath, options = {}) => {
  return addRoute(filePath, path, "ANY", options);
};
var routeGetMethod = (path, filePath, options = {}) => {
  return addRoute(filePath, path, "GET", options);
};
var routePostMethod = (path, filePath, options = {}) => {
  return addRoute(filePath, path, "POST", options);
};
var routePatchMethod = (path, filePath, options = {}) => {
  return addRoute(filePath, path, "PATCH", options);
};
var routePutMethod = (path, filePath, options = {}) => {
  return addRoute(filePath, path, "PUT", options);
};
var routeDeleteMethod = (path, filePath, options = {}) => {
  return addRoute(filePath, path, "DELETE", options);
};
var routeMacro = (name, callback) => {
  setMacro(name, callback);
};
var routeUseMacro = async (name, ...args) => {
  const callback = getMacro(name);
  await callback(...args);
};
var routeOptions = (options, callback) => {
  const c = { ...getContext(), options: { ...options } };
  const lastoptions = { ...getContext().options };
  addCallback(() => {
    setContext(c, lastoptions);
    callback();
  });
};
var routeMany = (method, path, filePath, options = {}) => {
  if (method.includes("GET"))
    routeGetMethod(path, filePath, options);
  if (method.includes("PUT"))
    routePutMethod(path, filePath, options);
  if (method.includes("POST"))
    routePostMethod(path, filePath, options);
  if (method.includes("PATCH"))
    routePatchMethod(path, filePath, options);
  if (method.includes("DELETE"))
    routeDeleteMethod(path, filePath, options);
};
var routeGroup = (prefix, callback, options) => {
  const cprefix = (getContext().prefix === void 0 ? "" : getContext().prefix) + (prefix || "");
  const c = { ...getContext(), ...options, prefix: cprefix };
  const lastoptions = { ...getContext().options };
  addCallback(() => {
    setContext(c, lastoptions);
    callback();
  });
};
var routeBuild = (clearCache = true) => {
  let cbs2 = getCallbacks();
  while (cbs2.length > 0) {
    clearCallbacks();
    for (let i = 0; i < cbs2.length; i += 1) {
      cbs2[i]();
    }
    cbs2 = getCallbacks();
  }
  const routes2 = getRoutes();
  if (clearCache)
    clearRoutes();
  const filteredroutes = [];
  routes2.reverse().forEach((i) => {
    if (!filteredroutes.find((x) => x.path === i.path && x.method === i.method))
      filteredroutes.push(i);
  });
  return filteredroutes.reverse();
};
var clearMethod = () => {
  clearRoutes();
  clearContext();
};
routeMacro("resource", (name, file) => {
  routeGetMethod(`${name}`, `${file}@index`);
  routePostMethod(`${name}`, `${file}@store`);
  routeGroup("/{id}", () => {
    routeGetMethod("/", `${file}@show`);
    routePatchMethod("/", `${file}@update`);
    routePutMethod("/", `${file}@update`);
    routeDeleteMethod("/", `${file}@destroy`);
  });
});
var route = routeAnyMethod;
route.any = routeAnyMethod;
route.get = routeGetMethod;
route.post = routePostMethod;
route.put = routePutMethod;
route.patch = routePatchMethod;
route.delete = routeDeleteMethod;
route.options = routeOptions;
route.group = routeGroup;
route.many = routeMany;
route.build = routeBuild;
route.clear = clearMethod;
route.macro = routeMacro;
route.use = routeUseMacro;
var route_default = route;

// src/utils/buildQueryParams.ts
function stringToType(str) {
  if (str === "true")
    return true;
  if (str === "false")
    return false;
  if (`${parseFloat(str)}` === str)
    return parseFloat(str);
  return str;
}
function buildQueryParams(prepath = "") {
  const [path, ...preargs] = prepath.split("?");
  const args = {};
  new URLSearchParams(preargs.join("?")).forEach((val, key) => args[key] = stringToType(val) || true);
  return [path, args];
}

// src/modules/router.ts
var routerModule = (path, method, routes2, config = {}) => {
  const sanitizedpath = path.replace(/(\\|\/)^/, "");
  const [clearpath, queryParams] = buildQueryParams(sanitizedpath);
  const variablematch = new RegExp(`${config.variableEnclose || "{"}\\s*\\S+\\??\\s*${config.variableEnclose || "}"}`);
  const optionalVariableMatch = new RegExp(`\\?{1}\\s*${config.variableEnclose || "}"}`);
  let variables = {};
  const route2 = routes2.find((route3) => {
    variables = {};
    const splitpath = route3.path.split("/").filter((i) => i !== "");
    const possibleMatch = clearpath.split("/").filter((i) => i !== "");
    if (method !== route3.method && !(method === "OPTIONS" && config.allowOptionsMatch !== false) && route3.method !== "ANY")
      return false;
    if (possibleMatch.length > splitpath.length && splitpath[splitpath.length - 1] !== "*") {
      return false;
    }
    const matches = splitpath.filter((part, index) => {
      const isVar = variablematch.test(part);
      const isOptionalVar = optionalVariableMatch.test(part);
      const varName = part.replace(new RegExp(`${config.variableEnclose || "{"}\\s*`), "").replace(new RegExp(`\\??\\s*${config.variableEnclose || "}"}`), "");
      if (isVar) {
        if (possibleMatch[index]) {
          variables[varName] = possibleMatch[index];
        }
        if (isOptionalVar) {
          return false;
        } else {
          return !possibleMatch[index];
        }
      } else {
        return part !== possibleMatch[index];
      }
    }).length;
    if (!matches && splitpath[splitpath.length - 1] === "*" && possibleMatch.length > splitpath.length) {
      variables["*"] = possibleMatch.splice(0, splitpath.length);
    }
    return !matches;
  });
  if (route2)
    return { ...route2, options: route2.options, variables, query: queryParams };
  return void 0;
};
var router_default = routerModule;

export { route_default as route, router_default as router };
//# sourceMappingURL=index.es.js.map
