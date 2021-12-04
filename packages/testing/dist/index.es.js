/**
 * Copyright (c) 2020 The Nuinalp and APO Softworks Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 **/import { glob } from 'glob';
import { join } from 'path';

// src/utils/group.ts
var groups = [];
var get = () => groups;
var append = (ctx) => {
  const lastctx = groups[groups.length - 1].ctx;
  groups[groups.length - 1].ctx = {
    ...groups[groups.length - 1].ctx,
    ...ctx,
    group: [...lastctx.group, ...ctx.group || []],
    tags: [...lastctx.tags, ...ctx.tags || []],
    beforeAll: [...lastctx.beforeAll, ...ctx.beforeAll || []],
    beforeEach: [...lastctx.beforeEach, ...ctx.beforeEach || []],
    afterAll: [...lastctx.afterAll, ...ctx.afterAll || []],
    afterEach: [...lastctx.afterEach, ...ctx.afterEach || []]
  };
};
var add = (test3) => {
  groups.push(test3);
};
var clear = () => {
  groups = [];
};

// src/utils/general.ts
var getStackTrace = (index = 4, prestack) => {
  let stack = prestack?.stack;
  if (!stack) {
    try {
      throw new Error("");
    } catch (error) {
      stack = error.stack || "";
    }
  }
  return stack.split("\n").slice(index).join("\n");
};
var isArrayEquals = (arr1, arr2) => {
  if (arr1.length !== arr2.length)
    return false;
  return arr1.filter((item, index) => item !== arr2[index]).length === 0;
};
var repeatString = (text, times) => {
  let response = "";
  for (let i = 0; i < times; i++) {
    response += text;
  }
  return response;
};

// src/utils/deepCompare.ts
function deepCompare(x, y) {
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
    if (!deepCompare(x[p], y[p]))
      return false;
  }
  for (const p in y)
    if (y.hasOwnProperty(p) && !x.hasOwnProperty(p))
      return false;
  return true;
}

// src/utils/assertions.ts
var buildResponse = (type, success, message, data = []) => {
  return {
    type,
    fail: !success,
    message: success ? void 0 : message,
    stack: success ? void 0 : getStackTrace(),
    data
  };
};
var buildTestAssertion = (test3) => {
  return (valueToAssert) => {
    const assertions = function() {
      this.toBe = (valueToTest) => {
        const passes = deepCompare(valueToAssert, valueToTest);
        test3.assertions.push(buildResponse("toBe", passes, `${valueToAssert} is not equal to ${valueToTest}`, [["expected", valueToTest], ["received", valueToAssert]]));
        return this;
      };
      this.toNotBe = (valueToTest) => {
        const passes = valueToAssert !== valueToTest;
        test3.assertions.push(buildResponse("toNotBe", passes, `"${valueToAssert}" shouldn't be equal to ${valueToTest}`));
        return this;
      };
      this.toBeTypeOf = (valueToTest) => {
        const passes = valueToTest === typeof valueToAssert;
        test3.assertions.push(buildResponse("toBeTypeOf", passes, `"${valueToAssert}" is not of the type ${valueToTest}`));
        return this;
      };
      this.toBeDefined = () => {
        const passes = valueToAssert !== void 0;
        test3.assertions.push(buildResponse("toBeDefined", passes, `"${valueToAssert}" is not defined`));
        return this;
      };
      this.toBeUndefined = () => {
        const passes = valueToAssert === void 0;
        test3.assertions.push(buildResponse("toBeUndefined", passes, `"${valueToAssert}" is defined`));
        return this;
      };
      this.toBeNull = () => {
        const passes = valueToAssert === null;
        test3.assertions.push(buildResponse("toBeNull", passes, `"${valueToAssert}" is not null`));
        return this;
      };
      this.toNotBeNull = () => {
        const passes = valueToAssert !== null;
        test3.assertions.push(buildResponse("toNotBeNull", passes, `"${valueToAssert}" is null`));
        return this;
      };
      this.toThrow = (error) => {
        const obj = {};
        obj.async = async function() {
          let fails = true;
          let errorThrown;
          try {
            await valueToAssert();
          } catch (e) {
            errorThrown = e;
            if (error)
              fails = deepCompare(e, error) ? false : `"${valueToAssert}" didn't match the exception ${error}`;
            else
              fails = false;
          }
          const response = buildResponse("toThrow", !fails, fails || `"${valueToAssert}" dind't throw an exception`, error ? [["expected", error], ["received", errorThrown]] : void 0);
          Object.keys(response).forEach((key) => obj[key] = response[key]);
        };
        test3.assertions.push(obj);
        return this;
      };
      this.cache = (title) => {
        test3.messages.push([valueToAssert, title]);
        return this;
      };
      this.toContain = (contain) => {
        let remains = [];
        if (Array.isArray(valueToAssert)) {
          const compare = Array.isArray(contain) ? contain : [contain];
          remains = compare.filter((i) => valueToAssert.find((x) => x !== i));
        } else if (typeof valueToAssert === "object") {
          const keys = Object.keys(valueToAssert || {});
          const compare = Array.isArray(contain) ? contain : [contain];
          remains = compare.filter((i) => keys.find((x) => x !== i));
        } else if (typeof valueToAssert === "string") {
          const compare = Array.isArray(contain) ? contain : [contain];
          remains = compare.filter((i) => !valueToAssert.match(i));
        }
        test3.assertions.push(buildResponse("toContain", remains.length === 0, `"${valueToAssert}" dind't contain values: ${remains.join(", ")}`));
        return this;
      };
      return this;
    };
    return assertions.bind({})();
  };
};
var assertions_default = buildTestAssertion;

// src/utils/test.ts
var tests = [];
var only = false;
var except = false;
var get2 = (tag2, filter = false) => {
  return tests.filter((test3) => {
    if (filter) {
      if (only)
        return test3.only;
      if (except)
        return !test3.except;
      if (tag2.length)
        return tag2.find((tag3) => test3.tags.find((subtag) => subtag === tag3));
    }
    return true;
  }).sort((test1, test22) => {
    if (isArrayEquals(test1.group, test22.group))
      return 0;
    if (test1.group.length > test22.group.length)
      return test1.group.filter((item, index) => item === test22.group[index]).length - 1;
    return test22.group.filter((item, index) => item === test1.group[index]).length + 1;
  });
};
var append2 = (test3) => {
  tests[tests.length - 1] = {
    ...tests[tests.length - 1],
    ...test3,
    tags: [...tests[tests.length - 1].tags || [], ...test3.tags || []],
    messages: [...tests[tests.length - 1].messages || [], ...test3.messages || []]
  };
};
var add2 = (pretest) => {
  if (pretest.only)
    only = true;
  if (pretest.except)
    except = true;
  const test3 = {
    only: false,
    except: false,
    fail: false,
    assertions: [],
    messages: [],
    ...pretest
  };
  const rawcallback = test3.callback;
  test3.callback = async () => {
    try {
      await rawcallback(assertions_default(test3));
    } catch (e) {
      test3.fail = true;
      test3.assertions.push({
        type: "test",
        fail: true,
        message: "Exception thrown",
        name: e.message,
        stack: getStackTrace(1, e),
        data: []
      });
    }
  };
  tests.push(test3);
};

// src/utils/context.ts
var context = {
  group: [],
  tags: [],
  beforeAll: [],
  beforeEach: [],
  afterAll: [],
  afterEach: []
};
var get3 = () => context;
var set = (ctx) => {
  context = ctx;
};
var add3 = (ctx) => {
  context = {
    group: [...context.group, ...ctx.group || []],
    tags: [...context.tags, ...ctx.tags || []],
    beforeAll: [...context.beforeAll, ...ctx.beforeAll || []],
    beforeEach: [...context.beforeEach, ...ctx.beforeEach || []],
    afterAll: [...context.afterAll, ...ctx.afterAll || []],
    afterEach: [...context.afterEach, ...ctx.afterEach || []]
  };
};

// src/utils/curr.ts
var currTest;
var getCurr = () => currTest;
var setCurr = (curr) => currTest = curr;

// src/modules/cache.ts
function cache(arg1, arg2) {
  if (!getCurr())
    throw new Error("Trying to use cache outside of a test context");
  getCurr().messages = [...getCurr().messages || [], [arg2 ? arg2 : arg1, arg2 ? arg1 : void 0]];
}

// src/modules/run.ts
async function run(settings) {
  process.env.testing = "true";
  for (let groups2 = get(); groups2.length > 0; groups2 = get()) {
    clear();
    await Promise.all(groups2.map((group2) => {
      set(group2.ctx);
      return group2.cb({});
    }));
  }
  const tests2 = get2(settings?.tags || [], !settings?.forceAll);
  const contextFails = [];
  const defaultLog = console.log;
  console.log = cache;
  const states = ["\u2500", "\\", "|", "/"];
  let testsrun = 0;
  let laststep = 0;
  const waitProcess = setInterval(() => {
    if (settings?.spinner !== false) {
      console.clear();
      defaultLog(`
 ${states[laststep]} (${testsrun}/${tests2.length}) Running tests`);
      if (laststep + 2 > states.length)
        laststep = 0;
      else
        laststep++;
    }
  }, 250);
  let lastcontext = [];
  let lasttest = {};
  const processStart = process.hrtime();
  for (let i = 0; i < tests2.length; i++) {
    const test3 = tests2[i];
    setCurr(test3);
    if (!isArrayEquals(lastcontext, test3.group)) {
      try {
        await Promise.all(test3.beforeAll.map((i2) => i2()));
      } catch (e) {
        let ctx = contextFails.find((i2) => isArrayEquals(i2.group, test3.group));
        if (!ctx) {
          contextFails.push({
            group: test3.group,
            fails: []
          });
          ctx = contextFails[contextFails.length - 1];
        }
        ctx.fails.push({
          title: e.message,
          type: "beforeAll",
          message: "An error has occured while running beforeAll callback",
          stack: getStackTrace(1, e),
          data: []
        });
      }
    }
    try {
      await Promise.all(test3.beforeEach.map((i2) => i2()));
    } catch (e) {
      test3.assertions.push({
        type: "beforeEach",
        message: "An error has occured while running beforeEach callback",
        stack: getStackTrace(1, e),
        fail: true,
        data: []
      });
      let ctx = contextFails.find((i2) => isArrayEquals(i2.group, test3.group));
      if (!ctx) {
        contextFails.push({
          group: test3.group,
          fails: []
        });
        ctx = contextFails[contextFails.length - 1];
      }
      ctx.fails.push({
        title: e.message,
        type: "beforeEach",
        message: "An error has occured while running beforeEach callback",
        stack: getStackTrace(1, e),
        data: []
      });
    }
    lastcontext = test3.group;
    lasttest = test3;
    testsrun++;
    try {
      await new Promise((resolve, reject) => (async () => {
        const timer = setTimeout(() => {
          reject("");
        }, test3.timeout || settings?.timeout || 2e3);
        await test3.callback();
        clearTimeout(timer);
        resolve(true);
      })());
      await Promise.all(test3.assertions.filter((t) => t.async).map((t) => t.async));
    } catch (e) {
      test3.assertions.push({
        type: "timeout",
        message: "Timeout",
        name: "Your test has thrown an timeout after it has been unnresponsive for 2 seconds, you can change this time by changing the run settings timeout or changing the test timeout",
        stack: "",
        fail: true,
        data: []
      });
    }
    try {
      await Promise.all(test3.afterEach.map((i2) => i2()));
    } catch (e) {
      test3.assertions.push({
        type: "afterEach",
        message: "An error has occured while running afterEach callback",
        stack: getStackTrace(1, e),
        fail: true,
        data: []
      });
      let ctx = contextFails.find((i2) => isArrayEquals(i2.group, test3.group));
      if (!ctx) {
        contextFails.push({
          group: test3.group,
          fails: []
        });
        ctx = contextFails[contextFails.length - 1];
      }
      ctx.fails.push({
        title: e.message,
        type: "afterEach",
        message: "An error has occured while running afterEach callback",
        stack: getStackTrace(1, e),
        data: []
      });
    }
  }
  console.log = defaultLog;
  if (lasttest) {
    try {
      if (lasttest.afterAll)
        await Promise.all(lasttest.afterAll.map((i) => i()));
    } catch (e) {
      let ctx = contextFails.find((i) => isArrayEquals(i.group, lasttest.group));
      if (!ctx) {
        contextFails.push({
          group: lasttest.group,
          fails: []
        });
        ctx = contextFails[contextFails.length - 1];
      }
      ctx.fails.push({
        title: e.message,
        type: "afterAll",
        message: "An error has occured while running afterAll callback",
        stack: getStackTrace(1, e),
        data: []
      });
    }
  }
  const processEnd = process.hrtime(processStart);
  process.env.testing = "false";
  clearInterval(waitProcess);
  if (settings?.spinner !== false) {
    console.clear();
  }
  process.env.testing = "false";
  return [tests2, contextFails, processEnd];
}

// src/modules/test.ts
function test(title, callback) {
  const context2 = get3();
  add2({
    ...context2,
    id: `${context2.group.join("/")}/${title}`,
    title,
    callback
  });
  const extra = {
    tag: (tag2) => {
      append2({
        tags: Array.isArray(tag2) ? tag2 : [tag2]
      });
      return extra;
    },
    timeout: (time) => {
      append2({
        timeout: time
      });
      return extra;
    }
  };
  return extra;
}
var findMethod = async (regex) => {
  await new Promise((r) => {
    glob(regex || "./**/*.{test,tests}.{ts,js}", {
      cwd: process.cwd(),
      nodir: true,
      ignore: ["./node_modules/**/*"]
    }, (_e, matches) => {
      Promise.all(matches.map(async (file) => import(join(process.cwd(), file)))).then(r);
    });
  });
};
var find_default = findMethod;

// src/modules/group.ts
function group(title, callback) {
  const context2 = { ...get3() };
  context2.group = [...context2.group, title];
  add({ ctx: context2, cb: async () => callback({
    beforeAll: (cb) => add3({ beforeAll: [cb] }),
    beforeEach: (cb) => add3({ beforeEach: [cb] }),
    afterAll: (cb) => add3({ afterAll: [cb] }),
    afterEach: (cb) => add3({ afterEach: [cb] })
  }) });
  const extra = {
    tag: (tag2) => {
      append({
        tags: Array.isArray(tag2) ? tag2 : [tag2]
      });
      return extra;
    }
  };
  return extra;
}

// src/modules/only.ts
function only2(title, callback) {
  const context2 = get3();
  add2({
    ...context2,
    id: `${context2.group.join("/")}/${title}`,
    title,
    only: true,
    callback
  });
  const extra = {
    tag: (tag2) => {
      append2({
        tags: Array.isArray(tag2) ? tag2 : [tag2]
      });
      return extra;
    },
    timeout: (time) => {
      append2({
        timeout: time
      });
      return extra;
    }
  };
  return extra;
}

// src/modules/except.ts
function except2(title, callback) {
  const context2 = get3();
  add2({
    ...context2,
    id: `${context2.group.join("/")}/${title}`,
    title,
    except: true,
    callback
  });
  const extra = {
    tag: (tag2) => {
      append2({
        tags: Array.isArray(tag2) ? tag2 : [tag2]
      });
      return extra;
    },
    timeout: (time) => {
      append2({
        timeout: time
      });
      return extra;
    }
  };
  return extra;
}

// src/modules/tag.ts
function tag(tag2, callback) {
  const context2 = get3();
  add({
    ctx: {
      ...context2,
      tags: Array.isArray(tag2) ? tag2 : [tag2]
    },
    cb: callback
  });
  callback();
}

// src/modules/print.ts
async function run2(tests2, contextErrors = [], elapsedTime = [0, 0]) {
  console.clear();
  console.log();
  console.log("===============================");
  console.log(" Tests ran");
  console.log("===============================");
  console.log();
  if (tests2.length === 0) {
    console.log("no test to run");
  } else {
    let lastgroup = [];
    tests2.forEach((test3) => {
      if (!isArrayEquals(test3.group, lastgroup)) {
        console.log();
        test3.group.forEach((item, index) => {
          if (lastgroup[index] !== item) {
            const fails = (contextErrors.find((i) => isArrayEquals(i.group, test3.group))?.fails || []).map((i) => `[31m${i.type}[37m`).join(",");
            console.log(`${repeatString("    ", index)} ${item}${fails ? ` (${fails})` : ""}`);
          }
        });
        lastgroup = test3.group;
      }
      const fail = !!test3.assertions.find((a) => a.fail);
      const assertions = fail ? test3.assertions.map((i) => `${i.fail ? "[31m" : "[32m"}${i.type}[37m`).join(", ") : `[32m${test3.assertions.length} assertions[37m`;
      console.log(`${repeatString("    ", lastgroup.length - 1)} ${lastgroup.length !== 0 ? " " : ""}${fail ? "[31mx" : "[32m\u221A[37m"}[37m - ${test3.title} (${assertions ? assertions : "no assertions made"})`);
    });
  }
  const [total, success] = [tests2.length, tests2.filter((test3) => !test3.assertions.find((a) => a.fail)).length];
  if (total !== success) {
    console.log();
    console.log("===============================");
    console.log(" Tests failed");
    console.log("===============================");
    console.log();
    tests2.forEach((test3) => {
      test3.assertions.forEach((assertion) => {
        if (assertion.fail) {
          console.log(` [31mx[37m - ${test3.group.join(" [36m>[37m ")}${test3.group.length > 0 ? "[36m >[37m " : ""}${test3.title}`);
          console.log("[31m");
          console.log(`[31m${assertion.message}
`);
          if (assertion.name)
            console.log(`    ${assertion.name}`);
          console.log(`${assertion.stack}`);
          console.log("[37m");
          assertion.data.forEach((data, index) => console.log(`- ${data[1] !== void 0 ? data[0] : index} `, data[1] !== void 0 ? data[1] : data[0]));
          if (assertion.data.length > 0)
            console.log();
        }
      });
    });
  }
  if (contextErrors.length) {
    console.log();
    contextErrors.forEach((group2) => {
      group2.fails.forEach((fail) => {
        console.log(` [31mx[37m - ${group2.group?.join(" [36m>[37m ")}`);
        console.log("[31m");
        console.log(fail.message);
        fail.data.forEach((data) => console.log(data));
        console.log();
        console.log(fail.title);
        console.log(` ${fail.stack}`);
        console.log("[37m");
      });
    });
  }
  if (tests2.find((i) => i.messages.length > 0)) {
    console.log();
    console.log("===============================");
    console.log(" Tests messages");
    console.log("===============================");
    console.log();
    tests2.forEach((test3) => {
      if (test3.messages.length > 0) {
        test3.messages.forEach((message) => {
          console.log(`\u2022 ${test3.group.join(" [36m>[37m ")} ${test3.group.length > 0 ? "[36m>[37m " : ""}${test3.title}`);
          if (message[1])
            console.log(`message: ${message[1]}`);
          console.log(message[0]);
          console.log();
        });
      }
    });
  }
  const totalMs = Math.ceil((elapsedTime[0] * 1e9 + elapsedTime[1]) / 1e6);
  const minutes = Math.floor(totalMs / 6e4);
  const seconds = Math.floor(totalMs / 1e3) - minutes * 60;
  const milisec = totalMs % 1e3;
  console.log();
  console.log("===============================");
  console.log(" Tests results");
  console.log("===============================");
  console.log();
  console.log(` Total tests		: ${total}`);
  console.log(` Successful tests	: ${success}`);
  console.log(` Total time elapsed	: ${minutes ? `${minutes}m ` : ""}${seconds ? `${seconds}s ` : ""}${milisec}ms`);
  console.log();
  if (total !== success)
    process.exit(1);
}

// src/modules/runAndPrint.ts
async function runAndPrint(settings) {
  const result = await run(settings);
  if (settings?.spinner !== false) {
    await run2(...result);
  }
}

// src/index.ts
var test2 = test;
test2.run = run;
test2.find = find_default;
test2.group = group;
test2.cache = cache;
test2.only = only2;
test2.except = except2;
test2.tag = tag;
test2.print = run2;
test2.runAndPrint = runAndPrint;
var src_default = test2;

export { src_default as default };
//# sourceMappingURL=index.es.js.map
