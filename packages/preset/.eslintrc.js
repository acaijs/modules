module.exports = {
	env: {
		es2021: true,
		node: true
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended"
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 12,
		sourceType: "module"
	},
	plugins: [
		"@typescript-eslint"
	],
	ignorePatterns: [ "stubs/**/*", "**/*.html", "**/logs/*", "*.lock", "LICENSE", "**/*.md", "**/*.map", "**/*.txt", "dist/**/*", "**/*.log" ],
	rules: {
		// Eslint
		"quotes"					: ["error", "double"],
		"no-mixed-spaces-and-tabs"	: "error",
		"no-tabs"					: 0,
		"no-prototype-builtins"		: 0,
		"indent"					: ["error", "tab", {
			SwitchCase: 1,
		}],

		// Typescript eslint
		"@typescript-eslint/explicit-module-boundary-types": 0,
		"@typescript-eslint/no-misused-new": 0,
	}
};
