module.exports = {
	extends: "../preset/.eslintrc.js",
	rules: {
		/**
		 * We specifically disable any checks here because we really know
		 * what we are doing. And we want leave space to people format
		 * code the way they please. Letting they overwrite this behaviour
		 * in their application.
		 */
		"@typescript-eslint/no-explicit-any": 0,
	},
}