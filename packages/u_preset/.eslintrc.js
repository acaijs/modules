module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 12,
		sourceType: "module",
	},
	plugins: [
		"@typescript-eslint",
	],
	ignorePatterns: [ "stubs/**/*", "**/*.html", "**/logs/*", "*.lock", "LICENSE", "**/*.md", "**/*.map", "**/*.txt", "dist/**/*", "**/*.log" ],
	rules: {
		// Eslint
		"no-empty"					: 0,
		"semi"                      : ["error", "never"],
		"quotes"					: ["error", "double"],
		"no-mixed-spaces-and-tabs"	: "error",
		"no-tabs"					: 0,
		"no-prototype-builtins"     : 0,
		"no-trailing-spaces"		: "error",
		"comma-dangle"				: ["error", "always-multiline"],
		"indent"					: [
			"error",
			"tab", {
				SwitchCase: 1,
			},
		],

		// Typescript eslint
		"@typescript-eslint/no-var-requires"				: 0,
		"@typescript-eslint/explicit-module-boundary-types"	: 0,
		"@typescript-eslint/no-misused-new"					: 0,
		"@typescript-eslint/no-empty-function"				: 0,
		"@typescript-eslint/member-delimiter-style"			: ["error"],
		"@typescript-eslint/no-explicit-any"				: 0,
		"@typescript-eslint/no-non-null-assertion"			: 0,
		"@typescript-eslint/no-unused-vars"					: [
			"error",
			{
				varsIgnorePattern: "^_",
				argsIgnorePattern: "^_",
				args: "all",
			},
		],
	},
}
