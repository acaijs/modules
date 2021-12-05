/**
 * Copyright (c) 2020 The Nuinalp and APO Softworks Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 **/import { existsSync, lstatSync, readdirSync, readFileSync, mkdirSync, copyFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { glob } from 'glob';

// src/modules/Stubber.ts

// src/utils/parseArgs.ts
function parseArgs(args2) {
  const variables = {};
  const [stub, name] = args2;
  args2.splice(1).forEach((item) => {
    const [name2, value] = item.split("=");
    variables[name2] = value || "";
  });
  return {
    stubName: stub,
    stubArgs: { ...variables, name }
  };
}
function getStubs(stubFilesPath) {
  const stubpath = join(process.cwd(), stubFilesPath);
  if (!existsSync(stubpath)) {
    throw new Error("Stubs directory does not exist");
  }
  if (!lstatSync(stubpath).isDirectory()) {
    throw new Error("Stubs directory is not a directory");
  }
  const stubsAvailable = readdirSync(stubpath, { withFileTypes: true }).filter((i) => i.isDirectory());
  for (let i = 0; i < stubsAvailable.length; i++) {
    const item = stubsAvailable[i];
    const configFilePath = join(stubpath, item.name, "stub.config.json");
    if (!existsSync(configFilePath)) {
      throw new Error(`Stub ${item.name} does not have a config file`);
    }
    try {
      JSON.parse(readFileSync(configFilePath, { encoding: "utf-8" }));
    } catch (e) {
      throw new Error(`Stub ${item.name} config is not a valid JSON`);
    }
  }
  return stubsAvailable;
}

// src/modules/Stubber.ts
var Stubber = class {
  constructor(args2, stubFilesPath = "", overwriteTargetPath) {
    const stubpath = join(process.cwd(), stubFilesPath);
    if (!existsSync(stubpath)) {
      throw "Stubs directory does not exist";
    }
    if (!lstatSync(stubpath).isDirectory()) {
      throw "Stubs directory is not a directory";
    }
    const stubsAvailable = readdirSync(stubpath, { withFileTypes: true }).filter((i) => i.isDirectory());
    this.callArgs = parseArgs(args2);
    const stubs = getStubs(stubFilesPath);
    for (let i = 0; i < stubs.length; i++) {
      const item = stubsAvailable[i];
      const configFilePath = join(stubpath, item.name, "stub.config.json");
      const config = JSON.parse(readFileSync(configFilePath, { encoding: "utf-8" }));
      if (config.name === this.callArgs.stubName) {
        this.stubConfig = config;
        this.stubOriginPath = join(stubpath, item.name).replace(/(\\|\/|\\\\|\/\/)/g, "/");
        this.stubFileContent = glob.sync(join(this.stubOriginPath, "**/*"), { nodir: true });
        break;
      }
    }
    if (!this.stubConfig) {
      throw `Search for the stub ${this.callArgs.stubName} did not return any results`;
    }
    if (overwriteTargetPath)
      this.stubConfig.targetPath = overwriteTargetPath;
  }
  copy() {
    const targetPath = this.stubConfig.targetPath;
    if (!targetPath) {
      throw `Stub ${this.stubConfig.name} does not have a target path, stubber doesn't know where to put it`;
    }
    this.stubFileContent.forEach((item) => {
      const shouldBeRenamed = !!(this.stubConfig.renameToNameFiles && this.stubConfig.renameToNameFiles.find((i) => i === item.replace(/(\\|\/)/g, "/").replace(this.stubOriginPath, "").split("/").splice(1).join("/")));
      const relativepath = item.replace(/(\\|\/)/g, "/").replace(this.stubOriginPath, "").replace(shouldBeRenamed ? /\/\w+\./ : "", shouldBeRenamed ? `/${this.callArgs.stubArgs.name}.` : "");
      const targetfinalpath = join(process.cwd(), targetPath, relativepath).replace(/(\\|\/)/g, "/");
      if (relativepath === "/stub.config.json")
        return;
      {
        const pathfile = targetfinalpath.substring(0, targetfinalpath.lastIndexOf("/"));
        if (!existsSync(pathfile)) {
          mkdirSync(pathfile, { recursive: true });
        }
      }
      copyFileSync(item, targetfinalpath);
    });
  }
  inject(extraVariables) {
    const allVariables = { ...this.stubConfig.variables, ...this.callArgs.stubArgs, ...extraVariables || {} };
    this.stubFileContent.forEach((item) => {
      const shouldBeRenamed = !!(this.stubConfig.renameToNameFiles && this.stubConfig.renameToNameFiles.find((i) => i === item.replace(/(\\|\/)/g, "/").replace(this.stubOriginPath, "").split("/").splice(1).join("/")));
      const relativepath = item.replace(/(\\|\/)/g, "/").replace(this.stubOriginPath, "").replace(shouldBeRenamed ? /\/\w+\./ : "", shouldBeRenamed ? `/${this.callArgs.stubArgs.name}.` : "");
      const targetfinalpath = join(process.cwd(), this.stubConfig.targetPath, relativepath).replace(/(\\|\/)/g, "/");
      if (relativepath === "/stub.config.json")
        return;
      let content = readFileSync(targetfinalpath, { encoding: "utf-8" });
      const variables = content.match(/{{\s*\S+\s*}}/g) || [];
      variables.forEach((variable) => {
        const varname = variable.replace(/({{|}})/g, "").trim();
        const varvalue = allVariables[varname];
        if (!varvalue) {
          console.log(`[33mwarning[0m - variable ${varname} not found, passing an empty string`);
        }
        content = content.replace(new RegExp(`${variable}`), varvalue || "");
      });
      writeFileSync(targetfinalpath, content, { encoding: "utf-8" });
    });
  }
};
function listStubs(stubpath) {
  const stubs = getStubs(stubpath);
  stubs.forEach((item) => {
    const configFilePath = join(process.cwd(), stubpath, item.name, "stub.config.json");
    const config = JSON.parse(readFileSync(configFilePath, { encoding: "utf-8" }));
    console.log(`
stub: ${config.name}`);
    if (config.description)
      console.log("description:", config.description.length > 70 ? `${config.description.substring(0, 70)}...` : config.description);
  });
}

// src/index.ts
var [action, ...args] = process.argv.splice(2);
if (!action) {
  console.log("");
  console.log("[47m[30m Welcome to the stubber [0m\n");
  console.log("Stubber is part of the [4m[35mA\xE7a\xED framework[37m and is used to easily create commonly used files, such as controllers, middlewares or components. You can checkout the help or commands action to see how to use it. You can chekout a more detailed documentation at: https://github.com/AcaiFramework/stubber");
  console.log("");
} else if (action === "commands") {
  console.log("\n[47m[30m Stubber commands [0m\n\n");
  console.log("[47m[30m help [0m - A short description of how to instantiate and use the stubber. Accepts an second argument of the stub name, and return it's description\n");
  console.log("[47m[30m commands [0m - displays this text of list of commands\n");
  console.log("[47m[30m spawn [0m - receives a required argument of the name of the stub to use\n");
  console.log("[47m[30m list [0m - list all available stubs to spawn\n");
} else if (action === "help") {
  console.log("\n[47m[30m Stubber help [0m\n\n");
  console.log("Creating your stubs\n");
  console.log("By any way this is a complete guide, just a quickstart, you can read more in https://github.com/AcaiFramework/stubber");
  console.log("To create your stubs, the first thing you will need is a directory to them. Stubber defaults to `/stubs`, but you can overwrite it using `--stubDir=/path/to/dir`, each folder inside of it will be considered a different stub, and all of them require a file called `stub.config.json`, where it's name and identifier can be found.");
  console.log("You need two keys: name and targetPath, that's where the stub will be place when called. Behaviour that you can overwrite using `--target=/new/path`, every other file inside of the stub, will be copied to the target path, meaning you can write variables inside of them.");
  console.log("To declare those variables, you will enclose them within double brackets, like this: `{{ variableName }}`, there are many types of variables and you can read about them in our documentation. The variable name defaults to the name you give your stub.");
  console.log("\nUsing them\n");
  console.log("You can call this package within your terminal, we recommend saving it in your package.json, so you can alias it to a smaller form. Let's say for example you have a stub called Component and wants to use it, just call: `yarn stub spawn Component MyComponent` and there you have it.");
  console.log("");
} else if (action === "list") {
  console.log("\n[47m[30m List of available stubs [0m");
  console.log("You can read more with command help {stubName}");
  listStubs((args.find((i) => i.match("--stubDir=")) || "--stubDir=/stubs").replace("--stubDir=", ""));
  console.log("");
} else if (action === "spawn") {
  if (args.length < 2) {
    throw "Not enough arguments to spawn the required stub";
  }
  console.log(`
Spawning stub ${args[0]}`);
  const stubber = new Stubber(args, (args.find((i) => i.match("--stubDir=")) || "--stubDir=/stubs").replace("--stubDir=", ""));
  stubber.copy();
  stubber.inject();
  console.log("");
} else {
  throw "Command not found, see list of commands to see all available options";
}
//# sourceMappingURL=index.es.js.map
