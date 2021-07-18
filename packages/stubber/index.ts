/**
* Copyright (c) 2020 The Nuinalp and APO Softworks Authors. All rights reserved.
* Use of this source code is governed by a BSD-style license that can be
* found in the LICENSE file.
*/

import Stubber 		from "./src/modules/Stubber";
import listStubs 	from "./src/utils/listStubs";

const [action, ...args] = process.argv.splice(2);

if (!action) {
	console.log("");
	console.log("\x1b[47m\x1b[30m Welcome to the stubber \x1b[0m\n");
	console.log("Stubber is part of the \x1b[4m\x1b[35mAçaí framework\x1b[37m and is used to easily create commonly used files, such as controllers, middlewares or components. You can checkout the help or commands action to see how to use it. You can chekout a more detailed documentation at: https://github.com/AcaiFramework/stubber");
	console.log("");
}
else if (action === "commands") {
	console.log("\n\x1b[47m\x1b[30m Stubber commands \x1b[0m\n\n");
	console.log("\x1b[47m\x1b[30m help \x1b[0m - A short description of how to instantiate and use the stubber. Accepts an second argument of the stub name, and return it's description\n");
	console.log("\x1b[47m\x1b[30m commands \x1b[0m - displays this text of list of commands\n");
	console.log("\x1b[47m\x1b[30m spawn \x1b[0m - receives a required argument of the name of the stub to use\n");
	console.log("\x1b[47m\x1b[30m list \x1b[0m - list all available stubs to spawn\n");
}
else if (action === "help") {
	console.log("\n\x1b[47m\x1b[30m Stubber help \x1b[0m\n\n");

	console.log("Creating your stubs\n");
	console.log("By any way this is a complete guide, just a quickstart, you can read more in https://github.com/AcaiFramework/stubber");
	console.log("To create your stubs, the first thing you will need is a directory to them. Stubber defaults to `/stubs`, but you can overwrite it using `--stubDir=/path/to/dir`, each folder inside of it will be considered a different stub, and all of them require a file called `stub.config.json`, where it's name and identifier can be found.");
	console.log("You need two keys: name and targetPath, that's where the stub will be place when called. Behaviour that you can overwrite using `--target=/new/path`, every other file inside of the stub, will be copied to the target path, meaning you can write variables inside of them.");
	console.log("To declare those variables, you will enclose them within double brackets, like this: `{{ variableName }}`, there are many types of variables and you can read about them in our documentation. The variable name defaults to the name you give your stub.");
	
	console.log("\nUsing them\n");
	console.log("You can call this package within your terminal, we recommend saving it in your package.json, so you can alias it to a smaller form. Let's say for example you have a stub called Component and wants to use it, just call: `yarn stub spawn Component MyComponent` and there you have it.");
	console.log("");
}
else if (action === "list") {
	console.log("\n\x1b[47m\x1b[30m List of available stubs \x1b[0m");
	console.log("You can read more with command help {stubName}");

	listStubs((args.find(i => i.match("--stubDir=")) || "--stubDir=/stubs").replace("--stubDir=", ""));

	console.log("");
}
else if (action === "spawn") {
	if (args.length < 2) {
		throw "Not enough arguments to spawn the required stub";
	}

	console.log(`\nSpawning stub ${args[0]}`);

	const stubber = new Stubber(args, (args.find(i => i.match("--stubDir=")) || "--stubDir=/stubs").replace("--stubDir=", ""));
	stubber.copy();
	stubber.inject();

	console.log("");
}
else {
	throw "Command not found, see list of commands to see all available options";
}